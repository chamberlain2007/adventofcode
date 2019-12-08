const assert = require('assert');
const getDigits = require('../utils/get-digits');

describe('Get Digits', () => {
    it('Should return 0 for 0', () => {
        let digits = getDigits(0);
        assert.deepEqual(digits, [0]);
    });

    it('Should return 1 for 1', () => {
        let digits = getDigits(1);
        assert.deepEqual(digits, [1]);
    });

    it('Should return 1,2 for 12', () => {
        let digits = getDigits(12);
        assert.deepEqual(digits, [1,2]);
    });

    it('Should return 1,2,3 for 123', () => {
        let digits = getDigits(123);
        assert.deepEqual(digits, [1,2,3]);
    });

    it('Should return 1,2,3 for -123', () => {
        let digits = getDigits(-123);
        assert.deepEqual(digits, [1,2,3]);
    });
})