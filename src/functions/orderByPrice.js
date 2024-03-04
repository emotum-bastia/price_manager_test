import React from "react";
import quicksort from "./quicksort";


function orderByPriceList(fileContent) {

    return quicksort(fileContent, "price");
}

export default orderByPriceList;