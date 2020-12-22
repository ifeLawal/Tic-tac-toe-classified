// Only work for exact matches

module.exports = {
  removeFromArrayByVal: function removeFromArray(arr, value) {
    let valIndex = arr.indexOf(value);
    if (valIndex !== -1) {
      arr = arr.slice(0, valIndex).concat(arr.slice(valIndex + 1, arr.length));
    }
    return arr;
  },
  removeFromArrayByIndex: function removeFromArray(arr, index) {
    arr = arr.slice(0, index).concat(arr.slice(index + 1, arr.length));
    return arr;
  },
  // random shuffle array code from stackoverflow
  // used to shuffle board order
  /**
   * Randomly shuffle an array
   * https://stackoverflow.com/a/2450976/1293256
   * @param  {Array} array The array to shuffle
   * @return {String}      The first item in the shuffled array
   */
  shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  },
};
