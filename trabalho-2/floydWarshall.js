const floydWarshall = (lista, estruturaGrafo) => {

  const getVerticesValores = (vertices) => {
    let verticesValores = [];
    vertices.forEach((item) => {
      verticesValores.push(item.valor);
    });
    return verticesValores;
  };
  
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

  console.log("Distâncias\n", distancias);
  console.log("próximo vértices\n", proxVertices);
};

module.exports = floydWarshall;