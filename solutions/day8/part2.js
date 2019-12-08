const Image = require('./image');

const readFileToArray = require('../../utils/read-file').readFileToArray;
const data = readFileToArray('day8input.txt', '');

const width = 25;
const height = 6;

const image = new Image();
const mergedLayer = image.loadData(width, height, data);
mergedLayer.render();
