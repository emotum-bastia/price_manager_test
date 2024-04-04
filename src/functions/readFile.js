const CHARGING_STATION_ID = 1;
const DATE = 15;
const CONSUMPTION = 17;
const PRICE = 20;


function readFile(fileContent, tarif) {
    if (fileContent.length < 1 || !fileContent) return null;
    var buffer = fileContent.split('\n');
    buffer.shift();
    if (buffer.lenght < 1) return null;
    var final = [];
    buffer.forEach(function (element) {
        if (!element) return;
        var splited = element.split(',');
        if (!splited[CHARGING_STATION_ID] || !splited[DATE] || !splited[CONSUMPTION] || !splited[PRICE] || !splited) return;

        var consommation = Number(splited[CONSUMPTION]).toFixed(2);
        var price = Number(splited[PRICE]).toFixed(2);
        var computePrice = consommation * tarif;
        var difference = price - computePrice;
        var site = splited[CHARGING_STATION_ID].replace("\"","").replace("\"","");
        var date = splited[DATE].replace("\"","").replace("\"","");
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