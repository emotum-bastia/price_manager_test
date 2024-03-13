import React from "react";
import {quicksort} from "./quicksort";


function orderByDateList(fileContent) {

    return quicksort(fileContent, "timestamp");
}

export default orderByDateList;