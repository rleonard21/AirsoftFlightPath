function arrayToCSV(twoDiArray, filename) {
    //  Modified from: http://stackoverflow.com/questions/17836273/
    //  export-javascript-data-to-csv-file-without-server-interaction
    let csvRows = [];
    for (let i = 0; i < twoDiArray.length; ++i) {
        for (let j = 0; j < twoDiArray[i].length; ++j) {
            twoDiArray[i][j] = '\"' + twoDiArray[i][j] + '\"';  // Handle elements that contain commas
        }
        csvRows.push(twoDiArray[i].join(','));
    }

    let csvString = csvRows.join('\r\n');
    let a         = document.createElement('a');
    a.href        = 'data:attachment/csv,' + csvString;
    a.target      = '_blank';
    a.download    = filename;

    document.body.appendChild(a);
    a.click();
    // Optional: Remove <a> from <body> after done
}