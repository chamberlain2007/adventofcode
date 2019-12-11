const Asteroid = require('./asteroid');

/**
 * Represents a map of asteroids
 */
const AsteroidMap = class {
    /**
     * Default constructor
     */
    constructor() {
        this.asteroids = [];
        this.currentAngle = 0;
    }

    /**
     * Parses a grid of characters that represents the map
     * @param {string} definition The map definition
     */
    parseMap(definition) {
        this.asteroids = [];

        definition.split('\n').forEach((row, rowNumber) => {
            row.split('').forEach((elem, columnNumber) => {
                if (elem === '#' || elem === 'X') {
                    this.asteroids.push(new Asteroid(columnNumber, rowNumber, elem === 'X'));
                }
            });
        });
    }

    /**
     * Calculates the visible count for all asteroids in the map
     */
    calculateVisibleCount() {
        this.asteroids.forEach((asteroid) => {
            asteroid.visibleCount = this.asteroids.filter((otherAsteroid) => otherAsteroid !== asteroid).reduce((sum, otherAsteroid) => {
                return sum + !this.asteroids.filter((thirdAsteroid) => thirdAsteroid !== asteroid && thirdAsteroid !== otherAsteroid).some((thirdAsteroid) => {
                    const angleFromFirst = asteroid.calculateAngle(thirdAsteroid);
                    const angleFromSecond = thirdAsteroid.calculateAngle(otherAsteroid);
                    const blocked = angleFromFirst === angleFromSecond;
                    return blocked;
                });
            }, 0);
        });
    }

    /**
     * Sets the asteroid at a given position to the station, and all
     * other asteroids to not be the station.
     * @param {number} x The X position of the station
     * @param {number} y The Y position of the station
     */
    setStation(x, y) {
        this.asteroids.forEach((asteroid) => {
            asteroid.isStation = (asteroid.x === x && asteroid.y === y);
        });
    }

    /**
     * Vaporizes all asteroids, and returns the asteroids in the
     * order that it vaporized them. Leaves the asteroids array in
     * tact.
     * @return {Asteroid[]} The asteroids in the order they were vaporized
     */
    vaporizeAll() {
        const asteroidsInOrder = [];

        const station = this.asteroids.filter((asteroid) => asteroid.isStation)[0];

        let asteroidsWithAngles = this.asteroids.filter((asteroid) => !asteroid.isStation).map((asteroid) => {
            let angle = station.calculateAngle(asteroid)-90;
            if (angle < 0) {
                angle += 360;
            }
            return [asteroid, angle];
        }).sort((a, b) => a[1] - b[1]);

        const recalculateVisibility = () => {
            asteroidsWithAngles.forEach((asteroidWithAngle) => {
                const asteroid = asteroidWithAngle[0];
                asteroid.isVisible = !asteroidsWithAngles.map((asteroidWithAngle) => asteroidWithAngle[0]).filter((thirdAsteroid) => thirdAsteroid !== asteroid).some((thirdAsteroid) => {
                    const angleFromFirst = asteroid.calculateAngle(thirdAsteroid);
                    const angleFromSecond = thirdAsteroid.calculateAngle(station);
                    const blocked = angleFromFirst === angleFromSecond;
                    return blocked;
                });
            });
        };

        recalculateVisibility();

        while (asteroidsWithAngles.length) {
            let minimumAngle = undefined;
            const candidateAsteroids = [];

            asteroidsWithAngles.filter((asteroidWithAngle) => asteroidWithAngle[0].isVisible && asteroidWithAngle[1] >= this.currentAngle).forEach((asteroidWithAngle) => {
                const [asteroid, angle] = asteroidWithAngle;
                if (minimumAngle === undefined || angle === minimumAngle) {
                    candidateAsteroids.push(asteroid);
                    minimumAngle = angle;
                }
            });

            asteroidsInOrder.push(candidateAsteroids[0]);

            if (candidateAsteroids.length === 1) {
                this.currentAngle = minimumAngle;
                asteroidsWithAngles = asteroidsWithAngles.filter((asteroidWithAngle) => !candidateAsteroids.includes(asteroidWithAngle[0]));
            } else {
                this.currentAngle = 0;
                recalculateVisibility();
            }
        }

        return asteroidsInOrder;
    }
};

module.exports = AsteroidMap;
