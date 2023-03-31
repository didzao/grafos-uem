const fs = require('fs');

const bellmanFord = require('./bellmanFord');

const readlineSync = require('readline-sync');

let dado;
let dadoPuro;
let dadoComPesos;
let dadoSemPesos;
let listaDeVertices;

let pesosSemSinal = [];

let pesos = [];

const grafo = new Map();
const grafoPesos = new Map();

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

const addValoresComPesos = (chave, valor, peso, estruturaGrafo) => {
    if (valor == null) {
        estruturaGrafo.set(chave, []);
    } else if (estruturaGrafo.get(chave) == null) {
        estruturaGrafo.set(chave, [{ valor, peso }]);
    } else {
        estruturaGrafo.get(chave).push({ valor, peso });
    }
}

const geraGrafoPesos = (dadoGrafo, peso) => {
    dadoGrafo.forEach((item, i) => {
        if (i % 2 == 0) {
            return addValoresComPesos(item, dadoGrafo[i + 1], peso[i / 2], grafoPesos);
        }
    });
}

const formataDadoPuro = () => Array.from(dadoPuro.split("\n").slice(1).join().replace(/[\s,]+/g, ''));

const isolaPesos = (dado) => {
    dado.forEach((item, index) => {
        console.log('type', typeof item)
        const peso = item.match(/\d+/g);
        const minusSign = item.includes('-');

        if (minusSign) {
            pesos.push(Number(dado[index + 1] * -1));
        }

        if (peso) {
            if (!pesos.includes(Number(peso * -1))) {
                pesos.push(Number(peso));
            }
            pesosSemSinal.push(Number(peso));
        }
    });
}

const removePesos = (dado) => {
    dadoSemPesos = dado;

    pesosSemSinal.forEach((itemNumber) => {

        dadoSemPesos.forEach((itemDado, index) => {
            if (itemNumber == itemDado) {

                dadoSemPesos.splice(index, 1, '');

                const indexVazio = dadoSemPesos.indexOf('');

                dadoSemPesos.splice(indexVazio, 1);
            }

            if (itemDado == '-') {
                dadoSemPesos.splice(index, 1, ''); // remove o sinal de "-"

                const indexVazio = dadoSemPesos.indexOf('');

                dadoSemPesos.splice(indexVazio, 1);
            }
        });
    });
}

// const removePesos = (dado) => {
//     dadoSemPesos = dado;
//     const regex = /\d+/g;
//     //console.log(dadoSemPesos)

//     dadoSemPesos.forEach((itemDado, index) => {
//         //console.log(regex.test(itemDado))

//         if (itemDado == '-') {
//             //console.log({ itemDado, index })
//             dadoSemPesos.splice(index, 1, ''); // remove o sinal de "-"
//            // console.log('ooo', dadoSemPesos)
//             const indexVazio = dadoSemPesos.indexOf('');

//             console.log({ itemDado, index, indexVazio })

//             dadoSemPesos.splice(indexVazio, 1);
//         }

//         if (regex.test(itemDado)) {
//             //console.log({ itemDado, index }, dadoSemPesos[index - 1], index - 1)
//             dadoComPesos.splice(index, 1, '');


//             const indexVazio = dadoSemPesos.indexOf('');

//             dadoSemPesos.splice(indexVazio, 1);

//             //console.log('>>>', { itemDado, index }, dadoSemPesos[index - 1], index - 1)
//         }
//     });
//     console.log(dadoSemPesos)
//     //console.log(dadoSemPesos)
//     //console.log('llll', regex.test(dadoSemPesos))
//     // dadoSemPesos.forEach((itemDado, index) => {
//     //     console.log({ itemDado })
//     //     if (itemDado.match(/\d+/g)) {
//     //         console.log(index)
//     //         dadoSemPesos.splice(index, 1, '');

//     //         const indexVazio = dadoSemPesos.indexOf('');

//     //         dadoSemPesos.splice(indexVazio, 1);
//     //     }

//     //     if (itemDado == '-') {
//     //         dadoSemPesos.splice(index, 1, ''); // remove o sinal de "-"

//     //         const indexVazio = dadoSemPesos.indexOf('');

//     //         dadoSemPesos.splice(indexVazio, 1);
//     //     }
//     // });
// }

const listaVertices = (dadoGrafo) => {
    const lista = [];
    dadoGrafo.forEach((item) => {
        if (!lista.includes(item)) {
            return lista.push(item);
        }
    });
    return lista.sort();
}

const geraGrafo = (dadoGrafo) => {
    dadoGrafo.forEach((item, i) => {
        if (i % 2 == 0) {
            return addValores(item, dadoGrafo[i + 1], grafo);
        }
    });
}

const addValores = (chave, valor, estruturaGrafo) => {
    if (valor == null) {
        estruturaGrafo.set(chave, []);
    } else if (estruturaGrafo.get(chave) == null) {
        estruturaGrafo.set(chave, [valor]);
    } else {
        estruturaGrafo.get(chave).push(valor);
    }
}

const verticesAdjacentes = (chave) => {
    let adjacentes = grafoPesos.get(chave);

    if (adjacentes != undefined) {
        return adjacentes;
    }
    else {
        return;
    }
}

const ajustaGrafo = () => {
    const grafoPesosAjustado = new Map(grafoPesos);
    listaDeVertices.forEach((item) => {
        let listaValor = verticesAdjacentes(item);
        if (listaValor != undefined) {
            listaValor.forEach((element) => {
                const verticeAtual = grafoPesosAjustado.get(element.valor);
                if (verticeAtual != undefined) {
                    if (!verticeAtual.some(e => e.valor === item)) {
                        verticeAtual.push({ valor: item, peso: element.peso });
                    }
                }
                else {
                    grafoPesosAjustado.set(element.valor, [{ valor: item, peso: element.peso }]);
                }
            });
        }
    });
    //console.log("GRAFO", grafoPesosAjustado);
    return grafoPesosAjustado;
}



//const arquivo = readlineSync.question('Digite o caminho do arquivo: ');
const arquivo = "./n.txt"

// O(1)
dadoPuro = lerArquivo(arquivo);

if (dadoPuro) {
    // O(1)
    //tipoGrafo = dadoPuro.split("\n").slice(0, 1).toString();

    // O(1)
    dado = formataDadoPuro();

    dadoComPesos = formataDadoPuro()

    isolaPesos(dadoComPesos);


    removePesos(dadoComPesos)

    listaDeVertices = listaVertices(dadoSemPesos);

    geraGrafo(dado);

    geraGrafoPesos(dadoSemPesos, pesos);
}

/*
console.log(dado);
console.log(grafoPesos);
prim("a");
fila.print();
console.log(pai);*/
const grafoPesosAjustado = ajustaGrafo();


const graph = {
    vertices: ["A", "B", "C", "D", "E"],
    edges: [
        { u: "A", v: "B", w: 4 },
        { u: "A", v: "C", w: 2 },
        { u: "B", v: "C", w: 3 },
        { u: "B", v: "D", w: 2 },
        { u: "B", v: "E", w: 3 },
        { u: "C", v: "B", w: 1 },
        { u: "C", v: "D", w: 4 },
        { u: "C", v: "E", w: 5 },
        { u: "E", v: "D", w: -5 }
    ],
};

// const bell = bellmanFord(listaDeVertices, grafoPesosAjustado, "a");
// console.log("----***----")
// console.log(bell);



console.log('pesosArestas', pesosSemSinal)
console.log('pesoComSinal', dadoSemPesos)

