import React from "react";
import {quicksort, quicksortNumber} from "./quicksort";


function orderByConsommationList(fileContent) {

    return quicksortNumber(fileContent, "consommation");
}

export default orderByConsommationList;