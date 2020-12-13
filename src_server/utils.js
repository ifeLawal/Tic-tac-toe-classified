// Only work for exact matches

module.exports = {
    removeFromArrayByVal: function removeFromArray(arr, value) {
        let valIndex = arr.indexOf(value);
        if(valIndex !== -1) {
            arr = arr.slice(0, valIndex).concat(arr.slice(valIndex+1, arr.length));
        }
        return arr;
    },
    removeFromArrayByIndex: function removeFromArray(arr, index) {
        arr = arr.slice(0, index).concat(arr.slice(index+1, arr.length));
        return arr;
    },
};