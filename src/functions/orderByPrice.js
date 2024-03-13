import React from "react";
import { quicksortNumber } from "./quicksort";


function orderByPriceList(fileContent)
{
    return quicksortNumber(fileContent, "price");
}

export default orderByPriceList;