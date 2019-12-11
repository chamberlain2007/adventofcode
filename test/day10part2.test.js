const assert = require('assert');
const AsteroidMap = require('../solutions/day10/asteroid-map');

describe('Day 10 Part 2', () => {
    it('Should vaporize asteroids correctly', () => {
        const asteroidMap = new AsteroidMap();
        asteroidMap.parseMap('.#....#####...#..\n##...##.#####..##\n##...#...#.#####.\n..#.....X...###..\n..#.#.....#....##');
        const vaporizedAsteroids = asteroidMap.vaporizeAll();
        const positions = vaporizedAsteroids.map((asteroid) => [asteroid.x, asteroid.y]);
        assert.deepEqual(positions, [
            [8, 1],
            [9, 0],
            [9, 1],
            [10, 0],
            [9, 2],
            [11, 1],
            [12, 1],
            [11, 2],
            [15, 1],
            [12, 2],
            [13, 2],
            [14, 2],
            [15, 2],
            [12, 3],
            [16, 4],
            [15, 4],
            [10, 4],
            [4, 4],
            [2, 4],
            [2, 3],
            [0, 2],
            [1, 2],
            [0, 1],
            [1, 1],
            [5, 2],
            [1, 0],
            [5, 1],
            [6, 1],
            [6, 0],
            [7, 0],
            [8, 0],
            [10, 1],
            [14, 0],
            [16, 1],
            [13, 3],
            [14, 3]
        ])
    });
})