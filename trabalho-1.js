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

    dado.forEach((item, index) => {
        if (item == chave && index % 2 == 0) {
            dado.splice(index, 1, '');
            dado.splice(index + 1, 1, '');
        }
        if (item == chave && index % 2 != 0) {
            dado.splice(index, 1, '');
        }
    });

    return grafo.delete(chave);
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
    let novaLista = lista;

    if (lista.includes('')) {
        novaLista = lista.slice(1);
    }

    novaLista.forEach((chave) => {
        const vertices = grafo.get(chave);
        if (vertices == undefined) {
            novaLista.forEach((item) => {
                if (item != chave) {
                    addValores(chave, item, grafoComplemento);
                }
            });
        } else {
            novaLista.forEach((item) => {
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

    let novaLista = listaDeVertices;

    if (listaDeVertices.includes('')) {
        novaLista = listaDeVertices.slice(1);
    }

    inicializaGrafoMatriz(novaLista);

    const matrizVetor = new Array(novaLista.length);

    const matriz = constroiMatriz(novaLista, matrizVetor);

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

const tratamentoErro = () => {
    console.log('\nVocê não selecionou nenhum arquivo. Por favor, escolha a opção 1 para carregar um arquivo antes de continuar.\n');
    return mostraMenu();
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
        if (!dadoPuro) return tratamentoErro();
        console.log('dado', dado)

        imprimeGrafo();

        console.log(`\n`);

        mostraMenu();
    },

    3: () => {
        if (!dadoPuro) return tratamentoErro();

        //O(1)
        const chave = readlineSync.question('Digite o vértice que deseja adicionar: ');

        addValores(chave, null, grafo);

        console.log(`O vértice \'${chave}\' foi adicionado!`);

        dado.push(chave);
        dado.push('');

        listaDeVertices = listaVertices(dado);

        console.log(`\n`);

        mostraMenu();
    },

    4: () => {
        if (!dadoPuro) return tratamentoErro();

        //O(1)
        const chave = readlineSync.question('Digite o vértice que deseja remover: ');

        removeVertice(chave);

        grafo.clear();

        geraGrafo(dado);

        console.log(`O vértice \'${chave}\' foi removido!`);

        console.log(`\n`);

        mostraMenu();
    },

    5: () => {
        if (!dadoPuro) return tratamentoErro();

        //O(1)
        const verticeUm = readlineSync.question('Digite o primeiro vértice para formar a aresta: ');

        //O(1)
        const verticeDois = readlineSync.question('Digite o segundo vértice para formar a aresta: ');

        addValores(verticeUm, verticeDois, grafo);

        console.log(`A aresta (${verticeUm},${verticeDois}) foi adicionada!`);

        console.log(`\n`);

        mostraMenu();
    },

    6: () => {
        if (!dadoPuro) return tratamentoErro();

        //O(1)
        const verticeUm = readlineSync.question('Digite o primeiro vértice da aresta que deseja remover: ');

        //O(1)
        const verticeDois = readlineSync.question('Digite o segundo vértice da aresta que deseja remover: ');

        removeAresta(verticeUm, verticeDois);

        console.log(`A aresta (${verticeUm},${verticeDois}) foi removida!`);

        console.log(`\n`);

        mostraMenu();
    },

    7: () => {
        if (!dadoPuro) return tratamentoErro();

        //O(1)
        const verticeUm = readlineSync.question('Digite o primeiro vértice da aresta que deseja consultar: ');

        //O(1)
        const verticeDois = readlineSync.question('Digite o segundo vértice da aresta que deseja consultar: ');

        encontraAresta(verticeUm, verticeDois);

        console.log(`\n`);

        mostraMenu();
    },

    8: () => {
        if (!dadoPuro) return tratamentoErro();

        //O(1)
        const chave = readlineSync.question('Digite o vértice que deseja consultar a incidência: ');

        verticesIncidente(chave);

        console.log(`\n`);

        mostraMenu();
    },

    9: () => {
        if (!dadoPuro) return tratamentoErro();

        //O(1)
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
        if (!dadoPuro) return tratamentoErro();

        geraGrafoTransposto(dado);

        console.log(grafoTransposto);

        console.log(`\n`);

        mostraMenu();
    },

    12: () => {
        if (!dadoPuro) return tratamentoErro();

        matrizAdjacencia();

        console.log(`\n`);

        mostraMenu();
    },

    0: () => {
        console.log("Programa finalizado");
        return true;
    }
},
    {
        limitMessage: 'Desculpe, o número digitado não corresponde a nenhuma das opções acima.'
    }
);