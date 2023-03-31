const formataGrafo = require("./formataGrafo");

class disjointSetUnion {
    constructor() {
        this.parents = [];
    }

    findSet = (x) => {
        if (typeof this.parents[x] != "undefined") {

            if (this.parents[x] < 0) {
                return x; //! x é pai
            } else {
                return this.findSet(this.parents[x]); //!! recursão até achar o pai de x
            }

        } else {
            this.parents[x] = -1; //!! inicialize este vértice como pai (-1)
            return x; //!! retorna o index do pai
        }
    }

    union = (x, y) => {
        var xpar = this.findSet(x);
        var ypar = this.findSet(y);

        if (xpar != ypar) {
            //!! o pai de x também é o pai de y. 
            //!! se y já era pai de mais de um vértice, então todos esses vértices estão conectados com o pai de x 
            this.parents[xpar] += this.parents[ypar];
            this.parents[ypar] = xpar;
            return false;
        } else {
            return true; //!! cria um ciclo
        }
    }

    print = () => {
        console.log(this.parents);
    }
}

const kruskal = (vertices, grafo, pesos) => {
    let mst = []; //! MST – Minimum Spanning Trees

    let arestas = [];


    const grafoObj = formataGrafo(vertices, grafo)

    //! ajusta arestas para ficar no formato [[x, y], [u, v]]
    arestas = grafoObj.map((item) => [item.u, item.v]);

    //! ordena os arestas em ordem crescente conforme o peso
    arestas.sort((a, b) => {
        return pesos[arestas.indexOf(a)] - pesos[arestas.indexOf(b)];
    });

    //! ordena os pesos em ordem crescente
    pesos.sort((a, b) => { return a - b });

    //! 2. Pick the smallest edge.

    var custoMinimoTotal = 0;

    var dsu = new disjointSetUnion();

    for (let i = 0; i < pesos.length; i++) {
        if (dsu.findSet(arestas[i][0]) != dsu.findSet(arestas[i][1])) {

            //! Inclui aresta, quando não há ciclo formado.
            dsu.union(arestas[i][0], arestas[i][1]);

            custoMinimoTotal += pesos[i];

            mst.push(`${arestas[i][0]} -> ${arestas[i][1]}`);
        }
    }
    console.log("custo minimo total = ", custoMinimoTotal);
    console.log("\nMST = ", mst);
}

module.exports = kruskal;