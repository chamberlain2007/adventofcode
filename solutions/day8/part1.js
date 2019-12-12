const Image = require('./image');

const {readFileToArray} = require('../../utils/read-file');
const data = readFileToArray('day8input.txt', '');

const width = 25;
const height = 6;

const image = new Image();
image.loadData(width, height, data);

let numberOfZeros;
let numberOfOnesAndTwos;

const countNumber = (data, number) => {
    return data.reduce((current, val) => current + (val === number), 0);
};

image.layers.forEach((layer) => {
    const layerNumberOfZeros = countNumber(layer.data, 0);

    if (numberOfZeros === undefined || layerNumberOfZeros < numberOfZeros) {
        const layerNumberOfOnes = countNumber(layer.data, 1);
        const layerNumberOfTwos = countNumber(layer.data, 2);
        numberOfOnesAndTwos = layerNumberOfOnes * layerNumberOfTwos;
        numberOfZeros = layerNumberOfZeros;
    }
});

console.log(numberOfOnesAndTwos);
