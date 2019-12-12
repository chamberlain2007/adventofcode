const outputArray = require('../../utils/output-array');

/**
 * Represents an image layer, simply an array of data
 * with a specific width and height
 * @param {number} width The width of the layer
 * @param {number} height The height of the layer
 * @param {number[]} data The image data
 */
const ImageLayer = class {
    /**
     * Default constructor
     * @param {number} width The width of the layer
     * @param {number} height The height of the layer
     * @param {number[]} data The image data
     */
    constructor(width, height, data) {
        this.width = width;
        this.height = height;
        this.data = data;
    }

    /**
     * Render the image layer to the screen
     */
    render() {
        const data = [...Array(this.height).keys()].map((i) => this.data.slice(i * this.width, (i + 1) * this.width - 1));
        outputArray(data, (value) => value === 1 ? '\u25A0' : ' ');
    }
};

module.exports = ImageLayer;
