// BELLMON-FORD

const bellmanFord = (vertices, grafo, source) => {
    let distancia = {};
    let predecessor = {};

    vertices.map((v) => {
        distancia[v] = Infinity;
        predecessor[v] = null;
    });

    distancia[source] = 0;
    console.log('s', source)
    const formataGrafo = () => {
        let objGrafo = [];
        vertices.forEach((item) => {

            const valores = grafo.get(item);
            valores.forEach((element) => {
                objGrafo.push({ u: item, v: element.valor, w: element.peso })
            })
        });

        return objGrafo;
    }

    const grafoObj = formataGrafo();

    for (let i = 1; i < vertices.length; i++) {
        for (let { u, v, w } of grafoObj) {
            console.log(u, distancia[u])
            if (distancia[u] + w < distancia[v]) {
                distancia[v] = distancia[u] + w;
                predecessor[v] = u;
            }
        }
    }

    for (let { u, v, w } of grafo) {
        if (distancia[u] + w < distancia[v]) {
            throw "O grafo contém um ciclo de peso negativo!";
        }
    }

    return { distance: distancia, predecessor };
}

module.exports = bellmanFord;

// const bell = bellmanFord(graph.vertices, graph.edges, "A");
// console.log("----***----")
// console.log(bell);