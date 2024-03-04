import React from "react";
import quicksort from "./quicksort";


function orderByConsommationList(fileContent) {

    return quicksort(fileContent, "consommation");
}

export default orderByConsommationList;