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
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const value = this.data[i * this.width + j];
                process.stdout.write(value === 1 ? '\u25A0' : ' ');
            }
            process.stdout.write('\n');
        }
    }
};

module.exports = ImageLayer;
