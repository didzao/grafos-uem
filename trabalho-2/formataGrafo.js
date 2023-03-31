const formataGrafo = (vertices, grafo) => {
    let objGrafo = [];
    vertices.forEach((item) => {

        const valores = grafo.get(item);
        if (valores) {
            valores.forEach((element) => {
                objGrafo.push({ u: item, v: element.valor, w: element.peso })
            });
        }
    });

    return objGrafo;
}

module.exports = formataGrafo;