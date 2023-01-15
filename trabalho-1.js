// DISCENTES
// INGRID LOHMANN RA: 117698
// VICTOR HUGO FRANCISCON RA: 120177


/* *** IMPORTANTE *** */
//! O trabalho tem dependência da biblioteca readline-sync, por esse motivo
//! é necessário instalar a biblioteca citada, para isso, clone o repositório
//! através do link https://github.com/didzao/grafos-uem#readme e execute o comando yarn install
//! no terminal na pasta do repositório clonado e em seguida execute o comando node trabalho-1.js para executar o código. 

const fs = require('fs');

var readlineSync = require('readline-sync');

let dado;
let dadoPuro;
let tipoGrafo;
let listaDeVertices;

const grafo = new Map(); //O(1)
const grafoTransposto = new Map(); //O(1)
const grafoComplemento = new Map(); //O(1)
const grafoMatriz = new Map(); //O(1)

//O(1)
const lerArquivo = (arquivo) => {
    let conteudo = '';
    if (!fs.existsSync(arquivo)) {
        console.log(`O arquivo não foi encontrado.\n
    Verifique se o nome e/ou caminho foi digitado corretamente.`);
    } else {
        conteudo = fs.readFileSync(arquivo, 'utf-8');
        console.log(`\nO arquivo ${arquivo} foi lido com sucesso!`);
        return conteudo;
    }
};


// O(1)
const addValores = (chave, valor, estruturaGrafo) => {
    if (valor == null) {
        estruturaGrafo.set(chave, []);
    } else if (estruturaGrafo.get(chave) == null) {
        estruturaGrafo.set(chave, [valor]);
    } else {
        estruturaGrafo.get(chave).push(valor);
    }
    return
}


// O(N)
const geraGrafo = (dadoGrafo) => {
    dadoGrafo.forEach((item, i) => {
        if (i % 2 == 0) {
            return addValores(item, dadoGrafo[i + 1], grafo);
        }
    });
}

// O(1)
const removeAresta = (chave, valor) => {
    const chaveGrafo = grafo.get(chave);
    const indexValor = chaveGrafo.indexOf(valor);
    return chaveGrafo.splice(indexValor, 1);
}

// O(N²)
const ajustaMatriz = (matriz) => {
    matriz.forEach((_, i) => {
        matriz.forEach((_, j) => {
            if (matriz[i][j] == 1) {
                matriz[j][i] = 1;
            }
        });
    });

    console.log(matriz);
}


// O(N)
const constroiMatriz = (lista, matriz) => {
    lista.forEach((chave, i) => {
        const vertices = Array.from(grafoMatriz.get(chave));
        matriz[i] = vertices;
    });

    return matriz;
}

// 0(1)
const removeVertice = (chave) => {
    return grafo.delete(chave)
}

// 0(1)
const imprimeGrafo = () => {
    console.log("\nTipo de grafo: " + tipoGrafo);
    console.log(grafo);
}

// O(1)
const encontraAresta = (primeiroVertice, segundoVertice) => {
    const aresta = grafo.get(primeiroVertice);

    const encontrado = aresta.indexOf(segundoVertice)

    if (encontrado == -1) {
        return console.log(`A aresta entre os vertices \'${primeiroVertice}\' e \'${segundoVertice}\' não existe`);
    }

    return console.log(`A aresta entre os vertices \'${primeiroVertice}\' e \'${segundoVertice} \'existe`);
}

// O(1)
const verticesAdjacentes = (chave) => {
    const existemAdjacentes = grafo.has(chave)

    if (existemAdjacentes == false) {
        return console.log(`O vertice \'${chave}\' não possui vertices adjacentes.`);
    }

    const vertices = grafo.get(chave)

    return console.log(`Os vertices adjacentes de \'${chave}\' são ${vertices}.`)

}

// O(N)
const geraGrafoTransposto = (dadoGrafo) => {
    dadoGrafo.forEach((item, i) => {
        if (i % 2 != 0) {
            return addValores(item, dadoGrafo[i - 1], grafoTransposto);
        }
    });
}

// O(1)
const verticesIncidente = (chave) => {
    const existemIncidentes = grafo.has(chave)

    if (existemIncidentes == false) {
        return console.log(`O vertice \'${chave}\' não possui vertices incidentes.`);
    }

    const vertices = grafo.get(chave);

    return console.log(`Os vertices incidentes de \'${chave}\' são ${vertices}.`);
}

// O(N)
const listaVertices = (dadoGrafo) => {
    const lista = [];
    dadoGrafo.forEach((item) => {
        if (!lista.includes(item)) {
            return lista.push(item);
        }
    });
    return lista.sort();
}

// O(N³)
const geraGrafoComplemento = (lista) => {
    lista.forEach((chave) => {
        const vertices = grafo.get(chave);
        if (vertices == undefined) {
            lista.forEach((item) => {
                if (item != chave) {
                    addValores(chave, item, grafoComplemento);
                }
            });
        } else {
            lista.forEach((item) => {
                if (!vertices.includes(item) && item != chave) {
                    addValores(chave, item, grafoComplemento);
                }
            });
        }
    });
}

// O(N²)
const inicializaGrafoMatriz = (lista) => {
    lista.forEach((chave) => {
        const vertices = grafo.get(chave);
        if (vertices == undefined) {
            lista.forEach(() => {
                addValores(chave, 0, grafoMatriz);
            });
        } else {
            lista.forEach((item) => {
                if (vertices.includes(item)) {
                    addValores(chave, 1, grafoMatriz);
                }
                else {
                    addValores(chave, 0, grafoMatriz);
                }
            });
        }
    });
}

// O(1)
const matrizAdjacencia = () => {

    inicializaGrafoMatriz(listaDeVertices);

    const matrizVetor = new Array(listaDeVertices.length);

    const matriz = constroiMatriz(listaDeVertices, matrizVetor);

    console.log("Matriz de Adjacência: ");
    if (tipoGrafo === 'undirected') return ajustaMatriz(matrizVetor);

    return console.log(matriz);
}

const opcoesMenu =
    `Selecione uma das opções abaixo:
  1 - Abrir arquivo 
  2 - Imprimir grafo 
  3 - Adicionar vértice 
  4 - Remover vértice 
  5 - Adicionar aresta 
  6 - Remover aresta 
  7 - Encontrar aresta
  8 - Vértices incidentes 
  9 - Vértices adjacentes 
  10 - Grafo complemento 
  11 - Grafo transposto
  12 - Matriz adjacência
  0 - Sair`;

// O(1)
const mostraMenu = () => {
    console.log(opcoesMenu);
}

mostraMenu();


readlineSync.promptCLLoop({
    1: () => {
        //O(1)
        const arquivo = readlineSync.question('Digite o caminho do arquivo: ');
        //O(1)
        dadoPuro = lerArquivo(arquivo);

        if (dadoPuro) {
            //O(1)
            tipoGrafo = dadoPuro.split("\n").slice(0, 1).toString();

            //O(1)
            dado = Array.from(dadoPuro.split("\n").slice(1).join().replace(/[\s,]+/g, ''));

            listaDeVertices = listaVertices(dado);

            geraGrafo(dado);
        }

        console.log(`\n`);

        mostraMenu();
    },

    2: () => {
        imprimeGrafo();

        console.log(`\n`);

        mostraMenu();
    },

    3: () => {
        const chave = readlineSync.question('Digite o vértice que deseja adicionar: ');
        addValores(chave, null, grafo);
        console.log(`A chave \'${chave}\' foi adicionada!`);

        console.log(`\n`);

        mostraMenu();
    },

    4: () => {
        const chave = readlineSync.question('Digite o vértice que deseja remover: ');
        removeVertice(chave);
        console.log(`A chave \'${chave}\' foi removida!`);

        console.log(`\n`);

        mostraMenu();
    },

    5: () => {
        const verticeUm = readlineSync.question('Digite o primeiro vértice para formar a aresta: ');
        const verticeDois = readlineSync.question('Digite o segundo vértice para formar a aresta: ');
        addValores(verticeUm, verticeDois, grafo);
        console.log(`A aresta (${verticeUm},${verticeDois}) foi adicionada!`);

        console.log(`\n`);

        mostraMenu();
    },

    6: () => {
        const verticeUm = readlineSync.question('Digite o primeiro vértice da aresta que deseja remover: ');
        const verticeDois = readlineSync.question('Digite o segundo vértice da aresta que deseja remover: ');
        removeAresta(verticeUm, verticeDois);
        console.log(`A aresta (${verticeUm},${verticeDois}) foi removida!`);

        console.log(`\n`);

        mostraMenu();
    },

    7: () => {
        const verticeUm = readlineSync.question('Digite o primeiro vértice da aresta que deseja consultar: ');
        const verticeDois = readlineSync.question('Digite o segundo vértice da aresta que deseja consultar: ');
        encontraAresta(verticeUm, verticeDois);

        console.log(`\n`);

        mostraMenu();
    },

    8: () => {
        const chave = readlineSync.question('Digite o vértice que deseja consultar a incidência: ');
        verticesIncidente(chave);

        console.log(`\n`);

        mostraMenu();
    },

    9: () => {
        const chave = readlineSync.question('Digite o vértice que deseja consultar a adjacência: ');
        verticesAdjacentes(chave);

        console.log(`\n`);

        mostraMenu();
    },

    10: () => {
        geraGrafoComplemento(listaDeVertices);
        console.log(grafoComplemento);

        console.log(`\n`);

        mostraMenu();
    },

    11: () => {
        geraGrafoTransposto(dado);
        console.log(grafoTransposto);

        console.log(`\n`);

        mostraMenu();
    },

    12: () => {
        matrizAdjacencia();

        console.log(`\n`);

        mostraMenu();
    },

    0: () => {
        console.log("Programa finalizado")
        return true;
    }
});