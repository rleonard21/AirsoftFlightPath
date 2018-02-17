function round(n, p) {
    var factor = Math.pow(10, p);
    return Math.round(n * factor) / factor;
}

function randInt(min, max) {
    // returns a random number between the min and max
    return Math.floor(Math.random() * (max - min) ) + min;
}

function extractColumn(arr, column) {
    // https://gist.github.com/eddieajau/5f3e289967de60cf7bf9

    function reduction(previousValue, currentValue) {
        previousValue.push(currentValue[column]);
        return previousValue;
    }

    return arr.reduce(reduction, []);
}