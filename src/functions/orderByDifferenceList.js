import React from "react";

import quicksort from "./quicksort";


function orderByDifferenceList(fileContent, tarif) {
    var bufferList = fileContent;

    if (!tarif) tarif = 0.75
    bufferList.forEach(function (element) {
        var computePrice = Number(element.consommation) * tarif;
        var difference = Number(element.price) - computePrice;
        element.difference = difference.toFixed(2) == -0 ? 0 : difference.toFixed(2);
        console.log("difference:" + tarif + "---" + computePrice);
    });
    return quicksort(bufferList, "difference");
}

export default orderByDifferenceList;