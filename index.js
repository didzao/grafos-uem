// DISCENTES
// INGRID LOHMANN RA: 117698
// VICTOR HUGO FRANCISCON RA: 120177

/* *** IMPORTANTE *** */
//! O trabalho tem dependência da biblioteca readline-sync, por esse motivo
//! é necessário instalar a biblioteca citada, para isso, clone o repositório
//! através do link https://github.com/didzao/grafos-uem#readme e execute o comando yarn install
//! no terminal na pasta do repositório clonado e em seguida execute o comando node trabalho-1.js para executar o código. 

const fs = require('fs');

const readlineSync = require('readline-sync');

let dado;
let dadoPuro;
let tipoGrafo;
let dadoSemPesos;
let listaDeVertices;

let pesosArestas = [];

const grafo = new Map(); // O(1)
const grafoTransposto = new Map(); // O(1)
const grafoComplemento = new Map(); // O(1)
const grafoMatriz = new Map(); // O(1)
const grafoPesos = new Map();

// O(1)
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
}

// O(1)
const addValoresComPesos = (chave, valor, peso, estruturaGrafo) => {
    if (valor == null) {
        estruturaGrafo.set(chave, []);
    } else if (estruturaGrafo.get(chave) == null) {
        estruturaGrafo.set(chave, [{ valor, peso }]);
    } else {
        //estruturaGrafo.get(chave).push(valor);
        estruturaGrafo.get(chave).push({ valor, peso });
    }
}


// O(N)
const geraGrafo = (dadoGrafo) => {
    dadoGrafo.forEach((item, i) => {
        if (i % 2 == 0) {
            return addValores(item, dadoGrafo[i + 1], grafo);
        }
    });
}

const geraGrafoPesos = (dadoGrafo, peso) => {
    dadoGrafo.forEach((item, i) => {
        if (i % 2 == 0) {
            return addValoresComPesos(item, dadoGrafo[i + 1], peso[i / 2], grafoPesos);
        }
    });
}

// O(1)
const removeAresta = (chave, valor) => {
    const chaveGrafo = grafo.get(chave);

    if (chaveGrafo !== undefined) {
        const indexValor = chaveGrafo.indexOf(valor);
        chaveGrafo.splice(indexValor, 1);
        return console.log(`A aresta (${chave},${valor}) foi removida!`);
    }

    return console.log(`A aresta (${chave},${valor}) não foi encontrada!`);
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


// O(N)
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

// O(N)
const removeValorVazio = () => {
    listaDeVertices.forEach((item) => {
        const valores = grafo.get(item);
        if (valores !== undefined) {
            if (valores.includes('')) {
                const indexVazio = valores.indexOf('');
                valores.splice(indexVazio, 1);
            }
        }
    });
}

// O(N)
const imprimeGrafo = () => {
    removeValorVazio();
    console.log("\nTipo de grafo: " + tipoGrafo);
    console.log(grafo);
    console.log('grafoPesos', grafoPesos);
}

// O(1)
const encontraArestaDirecional = (primeiroVertice, segundoVertice) => {
    const aresta = grafo.get(primeiroVertice);

    if (aresta !== undefined) {

        const encontrado = aresta.indexOf(segundoVertice);

        if (encontrado == -1) {
            return console.log(`A aresta entre os vertices \'${primeiroVertice}\' e \'${segundoVertice}\' não existe.`);
        }

        return console.log(`A aresta entre os vertices \'${primeiroVertice}\' e \'${segundoVertice}\' não existe.`);
    }

    if (!listaDeVertices.includes(primeiroVertice)) {
        return console.log(`\nO vértice ${primeiroVertice} não existe!`);
    }

    return console.log(`A aresta entre os vertices \'${primeiroVertice}\' e \'${segundoVertice}\'existe.`);
}

// O(1)
const encontraArestaNaoDirecional = (primeiroVertice, segundoVertice) => {
    let aresta = grafo.get(primeiroVertice);
    let encontrado;

    if (aresta !== undefined) {
        encontrado = aresta.indexOf(segundoVertice);
    }

    aresta = grafo.get(segundoVertice);

    if (aresta !== undefined && encontrado == -1) {
        encontrado = aresta.indexOf(primeiroVertice);
    }

    if (encontrado == -1) {
        return console.log(`A aresta entre os vertices \'${primeiroVertice}\' e \'${segundoVertice}\' não existe.`);
    } else {
        return console.log(`A aresta entre os vertices \'${primeiroVertice}\' e \'${segundoVertice}\'existe.`);
    }
}

// O(1)
const verticesAdjacentesDirecional = (chave) => {
    const existemAdjacentes = grafo.has(chave);

    if (existemAdjacentes == false) {
        return console.log(`O vertice \'${chave}\' não possui vertices adjacentes.`);
    }

    const vertices = grafo.get(chave);

    return console.log(`Os vertices adjacentes de \'${chave}\' são ${vertices}.`);
}


// O(N)
const verticesAdjacentesNaoDirecional = (chave) => {
    let listaIncidentes = [];

    listaDeVertices.forEach((item) => {
        const listaValor = grafo.get(item);
        if (listaValor !== undefined) {
            if (listaValor.includes(chave)) {
                listaIncidentes.push(item);
            }
        }
    });

    if (listaIncidentes.length) {
        return console.log(`Os vertices incidentes de \'${chave}\' são ${listaIncidentes}.`);
    }

    const vertices = grafo.get(chave);

    return console.log(`Os vertices adjacentes de \'${chave}\' são ${vertices}.`);
}

// O(N)
const geraGrafoTransposto = (dadoGrafo) => {
    grafoTransposto.clear();

    dadoGrafo.forEach((item, i) => {
        if (i % 2 != 0 && dadoGrafo[i - 1] != '') {
            return addValores(item, dadoGrafo[i - 1], grafoTransposto);
        }
    });
    grafoTransposto.delete('');
}

// O(1)
const verticesIncidenteDirecional = (chave) => {
    const existemIncidentes = grafo.has(chave);

    if (existemIncidentes == false) {
        return console.log(`O vertice \'${chave}\' não possui vertices incidentes.`);
    }

    const vertices = grafo.get(chave);

    return console.log(`Os vertices incidentes de \'${chave}\' são ${vertices}.`);
}

// O(N)
const verticesIncidenteNaoDirecional = (chave) => {
    let listaIncidentes = [];

    listaDeVertices.forEach((item) => {
        const listaValor = grafo.get(item);
        if (listaValor !== undefined) {
            if (listaValor.includes(chave)) {
                listaIncidentes.push(item);
            }
        }
    });

    if (listaIncidentes.length) {
        return console.log(`Os vertices incidentes de \'${chave}\' são ${listaIncidentes}.`);
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

// O(N²)
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
  [1] Abrir arquivo 
  [2] Imprimir grafo 
  [3] Adicionar vértice 
  [4] Remover vértice 
  [5] Adicionar aresta 
  [6] Remover aresta 
  [7] Encontrar aresta
  [8] Vértices incidentes 
  [9] Vértices adjacentes 
  [10] Grafo complemento 
  [11] Grafo transposto
  [12] Matriz adjacência
  [0] Sair`;

// O(1)
const mostraMenu = () => {
    console.log(opcoesMenu);
}

// O(1)
const tratamentoErro = () => {
    console.log('\nVocê não selecionou nenhum arquivo. Por favor, escolha a opção 1 para carregar um arquivo antes de continuar.\n');
    return mostraMenu();
}

const formataDadoPuro = () => Array.from(dadoPuro.split("\n").slice(1).join().replace(/[\s,]+/g, ''));

const isolaPesos = () => {
    dado.forEach((item, _) => {
        const peso = item.match(/\d+/g);
        if (peso) {
            pesosArestas.push(Number(peso));
        }
    });
}

const removePesos = () => {
    dadoSemPesos = formataDadoPuro();
    console.log(dadoSemPesos)
    dadoSemPesos.forEach((itemDado, index) => {
        pesosArestas.forEach((itemNumber, i) => {
            if (itemDado == itemNumber) {
                dadoSemPesos.splice(index, 1, '');

                const indexVazio = dadoSemPesos.indexOf('');

                dadoSemPesos.splice(indexVazio, 1);
            }
        });
    });
}

mostraMenu();

// O(N)
readlineSync.promptCLLoop({
    1: () => {
        grafo.clear();

        // O(1)
        const arquivo = readlineSync.question('Digite o caminho do arquivo: ');

        // O(1)
        dadoPuro = lerArquivo(arquivo);

        if (dadoPuro) {
            // O(1)
            tipoGrafo = dadoPuro.split("\n").slice(0, 1).toString();

            // O(1)
            dado = formataDadoPuro();

            isolaPesos();

            removePesos()

            listaDeVertices = listaVertices(dado);

            geraGrafo(dado);

            geraGrafoPesos(dadoSemPesos, pesosArestas);
        }

        console.log(`\n`);

        mostraMenu();
    },

    2: () => {
        if (!dadoPuro) return tratamentoErro();

        imprimeGrafo();

        console.log(`\n`);

        mostraMenu();
    },

    3: () => {
        if (!dadoPuro) return tratamentoErro();

        // O(1)
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

        // O(1)
        const chave = readlineSync.question('Digite o vértice que deseja remover: ');

        removeVertice(chave);

        grafo.clear();

        geraGrafo(dado);

        console.log(`O vértice \'${chave}\' foi removido!`);

        removeVertice('');

        console.log(`\n`);

        mostraMenu();
    },

    5: () => {
        if (!dadoPuro) return tratamentoErro();

        // O(1)
        const verticeUm = readlineSync.question('Digite o primeiro vértice para formar a aresta: ');

        // O(1)
        const verticeDois = readlineSync.question('Digite o segundo vértice para formar a aresta: ');

        addValores(verticeUm, verticeDois, grafo);

        dado.push(verticeUm);
        dado.push(verticeDois);

        console.log(`A aresta (${verticeUm},${verticeDois}) foi adicionada!`);

        console.log(`\n`);

        mostraMenu();
    },

    6: () => {
        if (!dadoPuro) return tratamentoErro();

        // O(1)
        const verticeUm = readlineSync.question('Digite o primeiro vértice da aresta que deseja remover: ');

        // O(1)
        const verticeDois = readlineSync.question('Digite o segundo vértice da aresta que deseja remover: ');

        removeAresta(verticeUm, verticeDois);

        console.log(`\n`);

        mostraMenu();
    },

    7: () => {
        if (!dadoPuro) return tratamentoErro();

        // O(1)
        const verticeUm = readlineSync.question('Digite o primeiro vértice da aresta que deseja consultar: ');

        // O(1)
        const verticeDois = readlineSync.question('Digite o segundo vértice da aresta que deseja consultar: ');

        if (tipoGrafo === 'directed') return encontraArestaDirecional(verticeUm, verticeDois);

        if (tipoGrafo === 'undirected') return encontraArestaNaoDirecional(verticeUm, verticeDois);

        console.log(`\n`);

        mostraMenu();
    },

    8: () => {
        if (!dadoPuro) return tratamentoErro();

        // O(1)
        const chave = readlineSync.question('Digite o vértice que deseja consultar a incidência: ');

        if (tipoGrafo === 'directed') return verticesIncidenteDirecional(chave);

        if (tipoGrafo === 'undirected') return verticesIncidenteNaoDirecional(chave);

        console.log(`\n`);

        mostraMenu();
    },

    9: () => {
        if (!dadoPuro) return tratamentoErro();

        // O(1)
        const chave = readlineSync.question('Digite o vértice que deseja consultar a adjacência: ');

        if (tipoGrafo === 'directed') return verticesAdjacentesDirecional(chave);

        if (tipoGrafo === 'undirected') return verticesAdjacentesNaoDirecional(chave);

        console.log(`\n`);

        mostraMenu();
    },

    10: () => {
        if (!dadoPuro) return tratamentoErro();

        listaDeVertices = listaVertices(dado);

        geraGrafoComplemento(listaDeVertices);

        console.log(grafoComplemento);

        console.log(`\n`);

        mostraMenu();
    },

    11: () => {
        if (!dadoPuro) return tratamentoErro();

        if (tipoGrafo === 'undirected') return imprimeGrafo();

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