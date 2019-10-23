import {minMax, eucDistance, random, clusterize} from './kMeans';

describe('kMeans', () => {

	describe('utils', () => {

		test('minMax', () => {
			expect(minMax([
				[0, 50.5, 200],
				[50, 50.55, 200],
				[100, 40, -1],
				[-50, 20, -1],
			])).toStrictEqual([
				[-50, 20, -1],
				[100, 50.55, 200]
			]);
		});

		test('eucDistance', () => {
			expect(typeof eucDistance).toStrictEqual('function');
		});

		test('random', () => {
			const rng = 100;
			Array.from({length: rng}, (_, n) => n).forEach(n => {
				const rand = random(n-rng, n);
				expect(rand).toBeGreaterThanOrEqual(n-rng);
				expect(rand).toBeLessThanOrEqual(n);
			});
		});

	});

	describe('clusterize ', () => {

		it('should find 2 clusters for 2 points', () => {
			const res = clusterize({
				data: [[1, 1], [2, 2]],
				k: 2,
			});

			expect(res.clusters.length).toStrictEqual(2);
			expect(res.clusters[0].length).toEqual(1);
			expect(res.clusters[1].length).toEqual(1);
		});

		it('should find 2 clusters', () => {
			const res = clusterize({
				k: 2,
				data: [{
					x: 15,
					y: 62,
				},{
					x: 1000,
					y: 1700,
				},{
					x: 1200,
					y: 2000,
				},{
					x: 21,
					y: 63,
				},{
					x: 800,
					y: 1650,
				},{
					x: 15,
					y: 45,
				}].map(d => [d.x, d.y])
			});

			expect(res.clusters.length).toStrictEqual(2);
			expect(res.clusters[0].length).toEqual(3);
			expect(res.clusters[1].length).toEqual(3);
		});

		it('should find 3 clusters', () => {
			const res = clusterize({
				k: 3,
				data: [
					[1, 2, 3],
					[2010, 2030, 2010],
					[2015, 2000, 2030],
					[210, 200, 250],
					[3, 4, 5],
					[5, 3, 6],
					[210, 250, 230],
					[2, 1, 1],
					[250, 230, 260],
					[2000, 2050, 2050],
					[211, 200, 250],
					[2020, 2030, 2010],
				],
			});

			expect(res.clusters.length).toStrictEqual(3);
			expect(res.clusters[0].length).toEqual(4);
			expect(res.clusters[1].length).toEqual(4);
			expect(res.clusters[2].length).toEqual(4);
		});

		it('should find 2 clusters with provided centers', () => {
			const res = clusterize({
				k: 2,
				centroids: [[10, 10], [1000, 1000]],
				data: [
					[1, 2, 3],
					[3, 4, 5],
					[5, 3, 6],
					[2, 1, 1],
					[1210, 1250, 1230],
					[1210, 1200, 1250],
					[1250, 1230, 1260],
					[1211, 1200, 1250],
				],
			});

			expect(res.clusters.length).toStrictEqual(2);
			expect(res.clusters[0].length).toEqual(4);
			expect(res.clusters[1].length).toEqual(4);
		});

	});

});
