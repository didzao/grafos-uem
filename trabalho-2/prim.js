const PriorityQueue = require('./priorityQueue.js');

const prim = (s, estruturaGrafo, vertices, pai, verticesAdjacentes) => {
  let fila = new PriorityQueue();
  
  let lista = vertices;

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

  while (fila.size() != 0) {
    u = fila.front();
    
    fila.dequeue();
   
    adjacentes = verticesAdjacentes(u[0], estruturaGrafo);
    if (adjacentes != undefined) {
     
      adjacentes.forEach((element) => {
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

module.exports = prim;