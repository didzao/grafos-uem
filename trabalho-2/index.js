const fs = require('fs');

const bellmanFord = require('./bellmanFord');

const kruskal = require('./kruskal.js');

const prim = require('./prim.js');

const dijkstra = require('./dijkstra.js');

const floydWarshall = require('./floydWarshall.js');

const regex = /[A-Za-z]/g;

const readlineSync = require('readline-sync');

let dado;
let dadoPuro;
let tipoGrafo;
let dadoComPesos;
let dadoSemPesos;
let listaDeVertices;
let grafoPesosAjustado;
let pesos = [];
let pesosSemSinal = [];

const grafo = new Map();
const grafoMatriz = new Map();
const pai = new Map();
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

const isolaPesosLetras = (data) => {
  data.forEach((item, index = 1) => {

    const peso = item.match(/\d+/g);
    const minusSign = item.includes('-');

    if (minusSign) {
      pesos.push(Number(data[index + 1] * -1));
    }

    if (peso) {
      if (!pesos.includes(Number(peso * -1))) {
        pesos.push(Number(peso));
      }
      pesosSemSinal.push(Number(peso));
    }
  });
}

const isolaPesosNumero = (data) => {
  for (let index = 2; index < data.length; index += 3) {
    pesos.push(Number(data[index]));
    pesosSemSinal.push(Number(data[index]));
  }
}

const removePesos = () => {
  dadoSemPesos = formataDadoPuro();

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

const verticesAdjacentes = (chave, estruturaGrafo) => {
  var adjacentes = estruturaGrafo.get(chave);

  if (adjacentes != undefined) {
    return adjacentes;
  }
  else {
    return;
  }
}

const ajustaGrafo = () => {
  const grafoAjustado = new Map(grafoPesos);
  listaDeVertices.forEach((item) => {
    let listaValor = verticesAdjacentes(item, grafoPesos);
    if (listaValor != undefined) {
      listaValor.forEach((element) => {
        const verticeAtual = grafoAjustado.get(element.valor);
        if (verticeAtual != undefined) {
          if (!verticeAtual.some(e => e.valor === item)) {
            verticeAtual.push({ valor: item, peso: element.peso });
          }
        }
        else {
          grafoAjustado.set(element.valor, [{ valor: item, peso: element.peso }]);
        }
      });
    }
  });
  return grafoAjustado;
}

const opcoesMenu =
  `Selecione uma das opções abaixo:
  [1] Abrir arquivo 
  [2] Imprimir grafo 
  [3] Prim 
  [4] Kruskal
  [5] Dijkstra 
  [6] Bellman-Ford
  [7] Floyd-Warshall
  [0] Sair`;

const mostraMenu = () => {
  console.log(opcoesMenu);
}

mostraMenu();

readlineSync.promptCLLoop({
  1: () => {
    grafo.clear();

    const arquivo = readlineSync.question('Digite o caminho do arquivo: ');
    //const arquivo = "./u.txt"

    dadoPuro = lerArquivo(arquivo);

    if (dadoPuro) {
      // O(1)
      tipoGrafo = dadoPuro.split("\n").slice(0, 1).toString();

      // O(1)
      dado = formataDadoPuro();

      dadoComPesos = formataDadoPuro();

      if (regex.test(dadoComPesos)) {
        isolaPesosLetras(dadoComPesos)
      } else {
        isolaPesosNumero(dadoComPesos)
      }

      removePesos()

      listaDeVertices = listaVertices(dadoSemPesos);

      geraGrafo(dado);

      geraGrafoPesos(dadoSemPesos, pesos);

      grafoPesosAjustado = ajustaGrafo();
    }

    grafoPesosAjustado = ajustaGrafo();

    console.log(`\n`);

    mostraMenu();
  },

  2: () => {
    if (!dadoPuro) return tratamentoErro();

    console.log(`\n`);

    console.log(grafoPesosAjustado);

    console.log(`\n`);

    mostraMenu();
  },

  3: () => {
    if (!dadoPuro) return tratamentoErro();

    // O(1)
    const vertice = readlineSync.question('Digite o vértice inicial do algoritmo: ');

    console.log(`\n`);

    prim(vertice, grafoPesosAjustado, listaDeVertices, pai, verticesAdjacentes);

    console.log("Resultado do algortimo de Prim: ");
    console.log(pai);

    console.log(`\n`);

    mostraMenu();
  },

  4: () => {
    if (!dadoPuro) return tratamentoErro();

    // O(1)
    console.log("\nResultado do algortimo de Kruskal: ");

    kruskal(listaDeVertices, grafoPesos, pesos);

    console.log(`\n`);

    mostraMenu();
  },

  5: () => {
    if (!dadoPuro) return tratamentoErro();

    const vertice = readlineSync.question('Digite o vértice inicial do algoritmo: ');

    console.log(`\n`);

    dijkstra(vertice, grafoPesosAjustado, listaDeVertices, pai, verticesAdjacentes);

    console.log("Resultado do algortimo de Dijkstra: ")
    console.log(pai);

    console.log(`\n`);

    mostraMenu();
  },

  6: () => {
    if (!dadoPuro) return tratamentoErro();

    const vertice = readlineSync.question('Digite o vértice inicial do algoritmo: ');

    console.log(`\n`);

    const bellFord = bellmanFord(listaDeVertices, grafoPesos, vertice);

    // O(1)
    console.log("\nResultado do algortimo de BellmanFord: ");

    console.log(bellFord)

    console.log(`\n`);

    mostraMenu();
  },

  7: () => {
    if (!dadoPuro) return tratamentoErro();

    console.log("Resultado do algoritmo de Floyd-Warshall");

    floydWarshall(listaDeVertices, grafoPesosAjustado);

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