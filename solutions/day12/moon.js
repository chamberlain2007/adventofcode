/**
 * Represents a moon with a position and velocity
 * @param {number} x The x position
 * @param {number} y The y position
 * @param {number} z The z position
 */
const Moon = class {
    /**
     * Default constructor
     * @param {number} x The x position
     * @param {number} y The y position
     * @param {number} z The z position
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.zVelocity = 0;
    }

    /**
     * Calculate the energy of the moon
     * @return {number} The energy
     */
    calculateEnergy() {
        const potentialEnergy = Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
        const kineticEnergy = Math.abs(this.xVelocity) + Math.abs(this.yVelocity) + Math.abs(this.zVelocity);
        return potentialEnergy * kineticEnergy;
    }
};

module.exports = Moon;
