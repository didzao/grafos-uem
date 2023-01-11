const fs = require('fs');

const arquivo = prompt('Digite o caminho do arquivo: ')

const lerArquivo = () => {
    let conteudo = '';
    if (!fs.existsSync(arquivo)) {
        console.log(`O arquivo não foi encontrado.\n
    Verifique se o nome e/ou caminho foi digitado corretamente.`);
    } else {
        conteudo = fs.readFileSync(arquivo, 'utf-8');
        return conteudo;
    }
};

const dadoPuro = lerArquivo();

const tipoGrafo = dadoPuro.split("\n").slice(0, 1).toString();

const dado = Array.from(dadoPuro.split("\n").slice(1).join().replace(/[\s,]+/g, ''));


const grafo = new Map();
const grafoTransposto = new Map();
const grafoComplemento = new Map();
const grafoMatrix = new Map();

const addValores = (chave, valor, estruturaGrafo) => {
    if (estruturaGrafo.get(chave) == null) {
        estruturaGrafo.set(chave, [valor]);
    }
    else {
        estruturaGrafo.get(chave).push(valor);
    }
    return
}

const geraGrafo = (path) => {
    path.forEach((item, i) => {
        if (i % 2 == 0) {
            return addValores(item, path[i + 1], grafo);
        }
    });
}

geraGrafo(dado)

console.log(grafo)

const removerValor = (chave, valor) => {
    const chaveGrafo = grafo.get(chave);
    const indexValor = chaveGrafo.indexOf(valor);
    return chaveGrafo.splice(indexValor, 1);
}

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

const constroiMatriz = (lista, matriz) => {
    lista.forEach((chave, i) => {
        const vertices = Array.from(grafoMatrix.get(chave));
        matriz[i] = vertices;
    });

    return matriz;
}

const removerVertice = (chave) => {
    return grafo.delete(chave)
}


const imprimirGrafo = () => {
    console.log("Tipo de grafo: " + tipoGrafo);
    console.log(grafo);
}

const encontrarAresta = (primeiroVertice, segundoVertice) => {
    const aresta = grafo.get(primeiroVertice);

    const encontrado = aresta.indexOf(segundoVertice)

    if (encontrado == -1) {
        return console.log(`A aresta entre os vertices \'${primeiroVertice}\' e \'${segundoVertice}\' não existe`);
    }

    return console.log(`A aresta entre os vertices \'${primeiroVertice}\' e \'${segundoVertice} \'existe`);
}


const verticesAdjacentes = (chave) => {
    const existemAdjacentes = grafo.has(chave)

    if (existemAdjacentes == false) {
        return console.log(`O vertice \'${chave}\' não possui vertices adjacentes.`);
    }

    const vertices = grafo.get(chave)

    return console.log(`Os vertices adjacentes de \'${chave}\' são ${vertices}.`)

}

const geraGrafoTransposto = (dadoGrafo) => {
    dadoGrafo.forEach((item, i) => {
        if (i % 2 != 0) {
            return addValores(item, dadoGrafo[i - 1], grafoTransposto);
        }
    });
}

const verticesIncidente = (chave) => {
    const existemIncidentes = grafo.has(chave)

    if (existemIncidentes == false) {
        return console.log(`O vertice \'${chave}\' não possui vertices incidentes.`);
    }

    const vertices = grafo.get(chave);

    return console.log(`Os vertices incidentes de \'${chave}\' são ${vertices}.`);
}


const listaVertices = (dadoGrafo) => {
    const lista = [];
    dadoGrafo.forEach((item) => {
        if (!lista.includes(item)) {
            return lista.push(item);
        }
    });
    return lista.sort();
}

const listaDeVertices = listaVertices(dado); // pode ser global


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

geraGrafoComplemento(listaDeVertices);

const inicializaGrafoMatriz = (lista) => {
    lista.forEach((chave) => {
        const vertices = grafo.get(chave);
        if (vertices == undefined) {
            lista.forEach(() => {
                addValores(chave, 0, grafoMatrix);
            });
        } else {
            lista.forEach((item) => {
                if (vertices.includes(item)) {
                    addValores(chave, 1, grafoMatrix);
                }
                else {
                    addValores(chave, 0, grafoMatrix);
                }
            });
        }
    });
}

const matrizAdjacencia = () => {
    const listaDeVertices = listaVertices(dado); // possível global

    inicializaGrafoMatriz(listaDeVertices);

    const matrizVetor = new Array(listaDeVertices.length);

    const matriz = constroiMatriz(listaDeVertices, matrizVetor);

    console.log("Matriz de Adjacência: ");
    if (tipoGrafo === 'undirected') return ajustaMatriz(matrizVetor);

    return console.log(matriz);
}

matrizAdjacencia();