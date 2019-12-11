/**
 * Represents an individual asteroid
 * @param {number} x The X position
 * @param {number} y The Y position
 * @param {number} isStation Whether the asteroid is a station
 */
const Asteroid = class {
    /**
     * @param {number} x The X position
     * @param {number} y The Y position
     * @param {number} isStation Whether the asteroid is a station
    */
    constructor(x, y, isStation) {
        this.x = x;
        this.y = y;
        this.isStation = isStation;
        this.visibleCount = 0;
    }

    /**
     * Calculate the angle between two asteroids
     * @param {Asteroid} otherAsteroid The other asteroid
     * @return {number} The angle between the two points
     */
    calculateAngle(otherAsteroid) {
        const deltaX = this.x - otherAsteroid.x;
        const deltaY = this.y - otherAsteroid.y;
        return Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    }
};

module.exports = Asteroid;
