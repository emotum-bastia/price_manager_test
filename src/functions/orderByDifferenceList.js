import React from "react";

import quicksort from "./quicksort";


function orderByDifferenceList(fileContent) {

    return quicksort(fileContent, "difference");
}

export default orderByDifferenceList;