// BELLMON-FORD

const formataGrafo = require("./formataGrafo");

const bellmanFord = (vertices, grafo, source) => {
  let distancia = {};
  let predecessor = {};

  vertices.map((v) => {
    distancia[v] = Infinity;
    predecessor[v] = null;
  });

  distancia[source] = 0;

  //! ajusta grafo para formato {u: 'a', v: 'b', w: 9}
  const grafoObj = formataGrafo(vertices, grafo);


  //! para cada vértice verifica a soma da distância de u com o peso(w) com a distância de v 
  for (let i = 1; i < vertices.length; i++) {
    for (let { u, v, w } of grafoObj) {
      if (distancia[u] + w < distancia[v]) {
        distancia[v] = distancia[u] + w;
        predecessor[v] = u;
      }
    }
  }

  for (let { u, v, w } of grafoObj) {
    if (distancia[u] + w < distancia[v]) {
      console.log('OPA! O grafo contém um ciclo de peso negativo!')
      throw new Error("O grafo contém um ciclo de peso negativo!");
    }
  }

  return { distance: distancia, predecessor };
}

module.exports = bellmanFord;