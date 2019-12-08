const assert = require('assert');
const Image = require('../solutions/day8/image');

describe('Day 8', () => {
    it('Should parse basic image correctly', () => {
        let image = new Image();
        image.loadData(3, 2, [1,2,3,4,5,6,7,8,9,0,1,2]);
        assert.deepEqual(image.layers[0].data, [1,2,3,4,5,6]);
        assert.deepEqual(image.layers[1].data, [7,8,9,0,1,2]);
    });

    it('Should merge data correctly', () => {
        let image = new Image();
        let mergedData = image.loadData(2, 2, [0,2,2,2,1,1,2,2,2,2,1,2,0,0,0,0]);
        assert.deepEqual(mergedData.data, [0,1,1,0]);
    })
})