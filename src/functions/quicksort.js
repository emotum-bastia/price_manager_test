import React from "react";

function isSort(list, range) {
    var last = list[0][range];

    console.log("list:" + JSON.stringify(list));
    console.log("range:" + range);
    if (list.length < 1) return true;
    for (var i = 1; i < list.length; i++) {
        console.log("i:" + i + "first:" + last + " second:" + list[i][range] + "=" + JSON.stringify(last > list[i][range]));
        if (last > list[i][range]) return false;
        last = list[i][range];
    }
    return true;
}

function quicksort(fileContent, range)
{
    var items = fileContent;

    function swap(items, leftIndex, rightIndex){
        var temp = items[leftIndex];
        items[leftIndex] = items[rightIndex];
        items[rightIndex] = temp;
    }

    function partition(items, left, right) {
        var pivot = items[Math.floor((right + left) / 2)][range], //middle element
            i = left, //left pointer
            j = right; //right pointer
        while (i <= j) {
            while (items[i][range] < pivot) {
                i++;
            }
            while (items[j][range] > pivot) {
                j--;
            }
            if (i <= j) {
                swap(items, i, j); //sawpping two elements
                i++;
                j--;
            }
        }
        return i;
    }

    function quickSort(items, left, right) {
        var index;
        if (items.length > 1) {
            index = partition(items, left, right); //index returned from partition
            if (left < index - 1) { //more elements on the left side of the pivot
                quickSort(items, left, index - 1);
            }
            if (index < right) { //more elements on the right side of the pivot
                quickSort(items, index, right);
            }
        }
        return items;
    }
    // first call to quick sort
    var sortedArray = quickSort(items, 0, items.length - 1);
    while (!isSort(sortedArray, range))
        sortedArray = quickSort(sortedArray, 0, sortedArray.length - 1);
    sortedArray.forEach(function (element) {console.log("result->>>>" + JSON.stringify(element.price))});
    return sortedArray;

}



function quicksortNumber(fileContent, range)
{
    var items = fileContent;

    fileContent.forEach(function (element) {
        element[range] = Number(element[range]);
    });
    
    function swap(items, leftIndex, rightIndex){
        var temp = items[leftIndex];
        items[leftIndex] = items[rightIndex];
        items[rightIndex] = temp;
    }
    
    function partition(items, left, right) {
        var pivot = Number(items[Math.floor((right + left) / 2)][range]), //middle element
        i = left, //left pointer
        j = right; //right pointer
        while (i <= j) {
            while (Number(items[i][range]) < pivot) {
                i++;
            }
            while (Number(items[j][range]) > pivot) {
                j--;
            }
            if (i <= j) {
                swap(items, i, j); //sawpping two elements
                i++;
                j--;
            }
        }
        return i;
    }
    
    function quickSortNumber(items, left, right) {
        var index;
        if (items.length > 1) {
            index = partition(items, left, right); //index returned from partition
            if (left < index - 1) { //more elements on the left side of the pivot
                quickSortNumber(items, left, index - 1);
            }
            if (index < right) { //more elements on the right side of the pivot
                quickSortNumber(items, index, right);
            }
        }
        return items;
    }
    // first call to quick sort
    var sortedArray = quickSortNumber(items, 0, items.length - 1);
    while (!isSort(sortedArray, range))
        sortedArray = quickSortNumber(sortedArray, 0, sortedArray.length - 1);
    sortedArray.forEach(function (element) {console.log("result->>>>" + JSON.stringify(element.price))});
    return sortedArray;
}

export {quicksort, quicksortNumber};