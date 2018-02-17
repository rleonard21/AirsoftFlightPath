function round(n, p) {
    var factor = Math.pow(10, p);
    return Math.round(n * factor) / factor;
}

function randInt(min, max) {
    // returns a random number between the min and max
    return Math.floor(Math.random() * (max - min) ) + min;
}