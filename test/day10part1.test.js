const assert = require('assert');
const AsteroidMap = require('../solutions/day10/asteroid-map');

describe('Day 10 Part 1', () => {
    it('Should parse map correctly', () => {
        const asteroidMap = new AsteroidMap();
        asteroidMap.parseMap('.#..#\n.....\n#####\n....#\n...##');
        const positions = asteroidMap.asteroids.map((asteroid) => [asteroid.x, asteroid.y]);
        assert.deepEqual(positions, [
            [1, 0],
            [4, 0],
            [0, 2],
            [1, 2],
            [2, 2],
            [3, 2],
            [4, 2],
            [4, 3],
            [3, 4],
            [4, 4]
        ])
    });

    it('Should calculate visible count correctly', () => {
        const asteroidMap = new AsteroidMap();
        asteroidMap.parseMap('.#..#\n.....\n#####\n....#\n...##');
        asteroidMap.calculateVisibleCount();
        const visibleCounts = asteroidMap.asteroids.map((asteroid) => asteroid.visibleCount);
        assert.deepEqual(visibleCounts, [7, 7, 6, 7, 7, 7, 5, 7, 8, 7]);
    });

    it('Should find best position for grid 1', () => {
        const asteroidMap = new AsteroidMap();
        asteroidMap.parseMap('......#.#.\n#..#.#....\n..#######.\n.#.#.###..\n.#..#.....\n..#....#.#\n#..#....#.\n.##.#..###\n##...#..#.\n.#....####');
        asteroidMap.calculateVisibleCount();
        const bestAsteroid = asteroidMap.asteroids.sort((a, b) => b.visibleCount - a.visibleCount)[0];
        assert.equal(bestAsteroid.x, 5);
        assert.equal(bestAsteroid.y, 8);
        assert.equal(bestAsteroid.visibleCount, 33);
    });

    it('Should find best position for grid 2', () => {
        const asteroidMap = new AsteroidMap();
        asteroidMap.parseMap('#.#...#.#.\n.###....#.\n.#....#...\n##.#.#.#.#\n....#.#.#.\n.##..###.#\n..#...##..\n..##....##\n......#...\n.####.###.');
        asteroidMap.calculateVisibleCount();
        const bestAsteroid = asteroidMap.asteroids.sort((a, b) => b.visibleCount - a.visibleCount)[0];
        assert.equal(bestAsteroid.x, 1);
        assert.equal(bestAsteroid.y, 2);
        assert.equal(bestAsteroid.visibleCount, 35);
    });

    it('Should find best position for grid 3', () => {
        const asteroidMap = new AsteroidMap();
        asteroidMap.parseMap('.#..#..###\n####.###.#\n....###.#.\n..###.##.#\n##.##.#.#.\n....###..#\n..#.#..#.#\n#..#.#.###\n.##...##.#\n.....#.#..');
        asteroidMap.calculateVisibleCount();
        const bestAsteroid = asteroidMap.asteroids.sort((a, b) => b.visibleCount - a.visibleCount)[0];
        assert.equal(bestAsteroid.x, 6);
        assert.equal(bestAsteroid.y, 3);
        assert.equal(bestAsteroid.visibleCount, 41);
    });
})