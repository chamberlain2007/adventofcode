const ImageLayer = require('./image-layer');

/**
 * Represents an image
 */
const Image = class {
    /**
     * Default constructor
     */
    constructor() {
        this.layers = [];
        this.width = 0;
        this.height = 0;
        this.mergedLayer = null;
    }

    /**
     * Load image data into the image
     * @param {number} width The width of the image
     * @param {number} height The height of the image
     * @param {number[]} data The image data
     * @return {ImageLayer} The merged image layer
     */
    loadData(width, height, data) {
        this.width = width;
        this.height = height;
        this.layers = [];

        const dataPerLayer = width * height;

        for (let i = 0; i < data.length; i += dataPerLayer) {
            const layerData = data.slice(i, i + dataPerLayer);
            this.layers.push(new ImageLayer(width, height, layerData));
        }

        this.mergedLayer = this.mergeData();

        return this.mergedLayer;
    }

    /**
     * Merge the image data into a single layer
     * @return {ImageLayer} The merged image layer
     */
    mergeData() {
        const totalDataLength = this.width * this.height;
        const data = Array(totalDataLength).fill(2);
        for (let i = 0; i < totalDataLength; i++) {
            for (let j = 0; j < this.layers.length; j++) {
                const layer = this.layers[j];
                const value = layer.data[i];
                if (value === 0 || value === 1) {
                    data[i] = value;
                    break;
                }
            }
        }

        return new ImageLayer(this.width, this.height, data);
    }
};

module.exports = Image;
