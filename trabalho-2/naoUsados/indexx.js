const fs = require('fs');

const bellmanFord = require('./bellmanFord');

const readlineSync = require('readline-sync');

let dado;
let dadoPuro;
let tipoGrafo;
let dadoSemPesos;
let listaDeVertices;

let pesosSemSinal = [];
let pesos = [];

const grafo = new Map();
const grafoMatriz = new Map();
const pai = new Map();
const grafoPesos = new Map();


const PriorityQueue = require('./priorityQueue.js');

var fila = new PriorityQueue();

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
    //estruturaGrafo.get(chave).push(valor);
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

const isolaPesos = () => {
  dado.forEach((item, index) => {
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
  const grafoPesosAjustado = new Map(grafoPesos);
  listaDeVertices.forEach((item) => {
    let listaValor = verticesAdjacentes(item, grafoPesos);
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

const getVerticesValores = (vertices) => {
  let verticesValores = [];
  vertices.forEach((item) => {
    verticesValores.push(item.valor);
  });
  return verticesValores;
};

const floydWarshall = (lista, estruturaGrafo) => {
  const proxVertices = Array(lista.length).fill(null).map(() => {
    return Array(lista.length).fill(null);
  });

  const distancias = Array(lista.length).fill(null).map(() => {
    return Array(lista.length).fill(null);
  });

  lista.forEach((inicioVertice, indiceInicial) => {
    lista.forEach((finalVertice, indiceFinal) => {
      if (inicioVertice == finalVertice) {
        distancias[indiceInicial][indiceFinal] = 0;
      } else {
        const vertices = estruturaGrafo.get(inicioVertice);
        let verticesValores = getVerticesValores(vertices);
        const achouAresta = verticesValores.indexOf(finalVertice);
        if (achouAresta != -1) {
          distancias[indiceInicial][indiceFinal] = vertices[achouAresta].peso;
          proxVertices[indiceInicial][indiceFinal] = inicioVertice
        } else {
          distancias[indiceInicial][indiceFinal] = Infinity;
        }
      }
    });
  });

  lista.forEach((meioVertice, indiceMeio) => {
    lista.forEach((inicioVertice, indiceInicial) => {
      lista.forEach((finalVertice, indiceFinal) => {
        const distanciaMeio = distancias[indiceInicial][indiceMeio] + distancias[indiceMeio][indiceFinal];
        if (distancias[indiceInicial][indiceFinal] > distanciaMeio) {
          distancias[indiceInicial][indiceMeio] = distanciaMeio;
          proxVertices[indiceInicial][indiceMeio] = meioVertice;
        }
      });
    });
  });

  console.log("distancias", distancias);
  console.log("proxVertices", proxVertices);
};

const dijkstra = (s, estruturaGrafo) => {
  var lista = listaVertices(dadoSemPesos);

  lista.forEach((element) => {
    pai.set(element, null);
  });

  fila.enqueue([s, 0]);

  lista.forEach((element, index) => {
    if (index != 0) fila.enqueue([element.toString(), Infinity]);
  });

  let adjacentes;
  let u;
  let indiceFila;
  let pesoUV;
  let aresta;

  while (fila.size() != 0) {
    u = fila.front();
    fila.dequeue();
    adjacentes = verticesAdjacentes(u[0], estruturaGrafo);
    if (adjacentes != undefined) {
      adjacentes.forEach((element, index) => {
        indiceFila = fila.find(element.valor);
        pesoUV = element.peso;
        itemFila = fila.get(indiceFila);
        if (indiceFila != -1 && pesoUV + u[1] < itemFila[1]) {
          pai.set(element.valor, u[0]);
          fila.delete(indiceFila);
          fila.enqueue([element.valor, (pesoUV + u[1])]);
        }
      });
    }
  }
};

const prim = (s, estruturaGrafo) => {
  var lista = listaVertices(dadoSemPesos);

  lista.forEach((element) => {
    pai.set(element, null);
  });

  fila.enqueue([s, 0]);

  lista.forEach((element, index) => {
    if (index != 0) fila.enqueue([element.toString(), Infinity]);
  });

  let adjacentes;
  let u;
  let indiceFila;
  let pesoUV;
  let aresta;

  while (fila.size() != 0) {
    u = fila.front();
    fila.dequeue();
    adjacentes = verticesAdjacentes(u[0], estruturaGrafo);
    if (adjacentes != undefined) {
      adjacentes.forEach((element, index) => {
        indiceFila = fila.find(element.valor);
        pesoUV = element.peso;
        itemFila = fila.get(indiceFila);
        if (indiceFila != -1 && pesoUV < itemFila[1]) {
          pai.set(element.valor, u[0]);
          fila.delete(indiceFila);
          fila.enqueue([element.valor, pesoUV]);
        }
      });
    }
  }
};

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

const arquivo = readlineSync.question('Digite o caminho do arquivo: ');
//const arquivo = "./u.txt"

dadoPuro = lerArquivo(arquivo);

if (dadoPuro) {
  // O(1)
  tipoGrafo = dadoPuro.split("\n").slice(0, 1).toString();

  // O(1)
  dado = formataDadoPuro();

  isolaPesos();

  removePesos()

  listaDeVertices = listaVertices(dadoSemPesos);

  geraGrafo(dado);

  geraGrafoPesos(dadoSemPesos, pesos);
}

const grafoPesosAjustado = ajustaGrafo();

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
        
          isolaPesos();
        
          removePesos()
        
          listaDeVertices = listaVertices(dadoSemPesos);
        
          geraGrafo(dado);
        
          geraGrafoPesos(dadoSemPesos, pesos);
        }
        
        const grafoPesosAjustado = ajustaGrafo();

        console.log(`\n`);

        mostraMenu();
    },

    2: () => {
        if (!dadoPuro) return tratamentoErro();

        console.log(grafoPesosAjustado);

        console.log(`\n`);

        mostraMenu();
    },

    3: () => {
        if (!dadoPuro) return tratamentoErro();

        // O(1)
        const vertice = readlineSync.question('Digite o vértice inicial do algoritmo: ');

        prim(vertice, grafoPesosAjustado);

        console.log("Resultado do algortimo de Prim: ");
        console.log(pai);

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

        const vertice = readlineSync.question('Digite o vértice inicial do algoritmo: ');

        dijkstra(vertice, grafoPesosAjustado);

        console.log("Resultado do algortimo de Dijkstra: ")
        console.log(pai);

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