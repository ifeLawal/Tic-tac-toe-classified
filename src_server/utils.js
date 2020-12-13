// Only work for exact matches

module.exports = {
    removeFromArray: function removeFromArray(arr, value) {
        let valIndex = arr.indexOf(value);
        if(valIndex !== -1) {
            arr = arr.slice(0, valIndex).concat(arr.slice(valIndex+1, arr.length));
        }
        return arr;
    }
};