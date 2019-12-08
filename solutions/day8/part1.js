const Image = require('./image');

const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, '/day8input.txt'), 'utf8');

const data = input
    .split('')
    .map((val) => parseInt(val))
    .filter((val) => !isNaN(val));

const width = 25;
const height = 6;

const image = new Image();
image.loadData(width, height, data);

let numberOfZeros;
let numberOfOnesAndTwos;

image.layers.forEach((layer) => {
    let layerNumberOfZeros = layer.data.reduce((current, val) => current + (val === 0), 0);
    if (numberOfZeros === undefined || layerNumberOfZeros < numberOfZeros) {
        let layerNumberOfOnes = layer.data.reduce((current, val) => current + (val === 1), 0);
        let layerNumberOfTwos = layer.data.reduce((current, val) => current + (val === 2), 0);
        numberOfOnesAndTwos = layerNumberOfOnes * layerNumberOfTwos;
        numberOfZeros = layerNumberOfZeros;
    }
});

console.log(numberOfOnesAndTwos);