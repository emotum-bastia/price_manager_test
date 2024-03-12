import React from "react";

function orderBySiteList(fileContent) {
    var bufferSiteList = [];
    var bufferListOrdered  = [];

    fileContent.forEach(element => {
        if (bufferSiteList.findIndex((cursor) => cursor == element.site) < 0)
            bufferSiteList.push(element.site);
    });
    bufferSiteList.sort();
    bufferSiteList.forEach(element => {
        fileContent.forEach(session => {
            if (session.site == element)
                bufferListOrdered.push(session);
        });
    });
    return bufferListOrdered;
}

export default orderBySiteList;