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
const mergedLayer = image.loadData(width, height, data);
mergedLayer.render();