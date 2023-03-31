// DISCENTES
// INGRID LOHMANN RA: 117698
// VICTOR HUGO FRANCISCON RA: 120177

/* *** IMPORTANTE *** */
//! O trabalho tem dependência da biblioteca readline-sync, por esse motivo
//! é necessário instalar a biblioteca citada, para isso, clone o repositório
//! através do link https://github.com/didzao/grafos-uem#readme e execute o comando yarn install
//! no terminal na pasta do repositório clonado e em seguida execute o comando node index.js (localizado na pasta trabalho-2) para executar o código. 

const fs = require('fs');

const bellmanFord = require('./bellmanFord');

const kruskal = require('./kruskal.js');

const prim = require('./prim.js');

const dijkstra = require('./dijkstra.js');

const floydWarshall = require('./floydWarshall.js');

const regexLetras = /[A-Za-z]/g;
const regexNumeros = /-?\d+/g;

const readlineSync = require('readline-sync');

let dado;
let dadoPuro;
let dadoPuroComTipo;
let tipoGrafo;
let dadoComPesos;
let dadoSemPesos;
let listaDeVertices;
let grafoPesosAjustado;
let pesos = [];
let pesosSemSinal = [];

const grafo = new Map();
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

const formataDadoPuro = () => Array.from(dadoPuroComTipo.split("\n").slice(1).join().replace(/[\s,]+/g, ''));

const isolaPesosLetras = (data) => {
  data.forEach((element) => {
    if (element.match(regexNumeros)) return pesos.push(element)
  })
  //pesos = (data.match(regexNumeros));
}

const isolaPesosNumero = (data) => {
  const novoDado = data.match(regexNumeros);

  for (let index = 2; index < novoDado.length; index += 3) {
    pesos.push(Number(novoDado[index]));
    novoDado.splice(index, 1, 'a');
  }

  novoDado.forEach(() => {
    const indexVazio = novoDado.indexOf('a');
    novoDado.splice(indexVazio, 1);
  });

  dadoSemPesos = novoDado;
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

        } else {
          grafoAjustado.set(element.valor, [{ valor: item, peso: element.peso }]);
        }
      });
    }
  });
  return grafoAjustado;
}

const removePesosLetras = (dado) => {
  const novoDado = dado.map((item) => {
    return item.replace(regexNumeros, '');
  })

  return Array.from(novoDado.toString().replace(/[\s,]+/g, ''));
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

    dadoPuroComTipo = lerArquivo(arquivo);

    if (dadoPuroComTipo) {
      // O(1)
      tipoGrafo = dadoPuroComTipo.split("\n").slice(0, 1).toString();

      // O(1)
      dado = formataDadoPuro();

      dadoComPesos = formataDadoPuro();

      dadoPuro = dadoPuroComTipo.replace(tipoGrafo, '').toString().split('\n').slice(1);


      if (regexLetras.test(dadoComPesos)) {
        isolaPesosLetras(dadoPuroComTipo)
        dadoSemPesos = removePesosLetras(dadoPuro);
      } else {
        isolaPesosNumero(dadoPuroComTipo);
      }

      listaDeVertices = listaVertices(dadoSemPesos);

      geraGrafoPesos(dadoSemPesos, pesos);

      grafoPesosAjustado = ajustaGrafo();
    }

    grafoPesosAjustado = ajustaGrafo();

    console.log(`\n`);

    mostraMenu();
  },

  2: () => {
    if (!dadoPuroComTipo) return tratamentoErro();

    console.log(`\n`);

    console.log(grafoPesosAjustado);

    console.log(`\n`);

    mostraMenu();

    grafoPesosAjustado.clear();
  },

  3: () => {
    if (!dadoPuroComTipo) return tratamentoErro();

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
    if (!dadoPuroComTipo) return tratamentoErro();

    // O(1)
    console.log("\nResultado do algortimo de Kruskal: ");

    kruskal(listaDeVertices, grafoPesos, pesos);

    console.log(`\n`);

    mostraMenu();
  },

  5: () => {
    if (!dadoPuroComTipo) return tratamentoErro();

    const vertice = readlineSync.question('Digite o vértice inicial do algoritmo: ');

    console.log(`\n`);

    dijkstra(vertice, grafoPesosAjustado, listaDeVertices, pai, verticesAdjacentes);

    console.log("Resultado do algortimo de Dijkstra: ")
    console.log(pai);

    console.log(`\n`);

    mostraMenu();
  },

  6: () => {
    if (!dadoPuroComTipo) return tratamentoErro();

    const vertice = readlineSync.question('Digite o vértice inicial do algoritmo: ');

    console.log(`\n`);

    const bellFord = bellmanFord(listaDeVertices, grafoPesos, vertice);

    // O(1)
    if (bellFord) {
      console.log("\nResultado do algortimo de BellmanFord: ");
      console.log(bellFord)
    }


    console.log(`\n`);

    mostraMenu();
  },

  7: () => {
    if (!dadoPuroComTipo) return tratamentoErro();

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