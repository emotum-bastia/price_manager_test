function readFile(fileContent, tarif) {
    if (fileContent.length < 1 || !fileContent) return null;
    var buffer = fileContent.split('\n');
    buffer.shift();
    if (buffer.lenght < 1) return null;
    var final = [];
    buffer.forEach(function (element) {
        if (!element) return;
        var splited = element.split(',');
        if (!splited[1] || !splited[12] || !splited[19] || !splited) return;

        var consommation = Number(splited[16]).toFixed(2);
        var price = Number(splited[19]).toFixed(2);
        var computePrice = consommation * tarif;
        var difference = price - computePrice;
        var site = splited[1].replace("\"","").replace("\"","");
        var date = splited[12].replace("\"","").replace("\"","");
        var timestamp = Date.parse(date);
        final.push({
            site: site,
            date: date,
            timestamp: timestamp,
            consommation: consommation,
            price: price,
            computePrice: computePrice,
            difference: difference
        });
    });
    if (final.lenght < 1) return null;
    return final;
}

export default readFile;