type Input = {
	data: Point[];			// data sample
	k: number;				// number of clusters 
	limit?: number;			// max times to run kMeans iteration until convergence, defaults to Infinity
	centroids?: Point[],	// predefined centroids
	// precision?: number,		// TODO add float point precision option
};

type Result = {
	clusters: Point[][],	// data separated into clusters
	centroids: Point[],		// final centroid
	iterations: number,		// number of iterations kMeans did reclusterization
	totalDistance: number,	// sum of distances from examples to each cluster center
};

type Point = number[];

/**
 * @throws error if invalid data provided 
 */
export function clusterize({k, data, centroids, limit = Infinity}: Input): Result {
	if (k && k < 2) {
		throw new Error('K should be greater than 1!');
	}
	if (data.length === 0) {
		throw new Error('Your data set is empty!');
	}
	if (centroids && k && centroids.length !== k) {
		throw new Error('K is not equal to the number of centroids provided!');
	}
	if (centroids && !k) {
		throw new Error('When providing centroids, please provide K!');
	}
	
	let iterations = 0;
	let clusters: Point[][] = [];

	// 1. Select k random initial points to represent `cluster centers`
	if (centroids === undefined) {
		centroids = getRandCentroids(k, data);
	}
	
	// 2. Repeat until convergence or limit is reached
	while (iterations < limit) {
		// 2.1 All data points are assigned to the cluster of the nearest center
		clusters = getClusters(centroids, data);
		// 2.2 The mean point of each cluster is going to be new centroid
		const newCentroids = getMeanCentroids(clusters);
		if (centroids.length === newCentroids.length && centroids.every((ct, idx) => pointsEqual(ct, newCentroids[idx]))) {
			break;
		}
		centroids = newCentroids;
		iterations++;
	}

	return {
		clusters,
		centroids,
		iterations,
		totalDistance: round(sum(centroids.flatMap((ct, idx) => clusters[idx].map(p => eucDistance(ct, p))))),
	};
}

export function getClusters(centroids: Point[], points: Point[]): Point[][] {
	const clusters: Point[][] = Array.from({length: centroids.length}, () => ([]));

	points.forEach(point => {
		let minDist = Infinity;
		const index = centroids.reduce((index, ct, idx) => {
			const dist = eucDistance(ct, point);
			if (dist < minDist) {
				minDist = dist;
				index = idx;
			}
			return index;
		}, 0);
		clusters[index].push(point);
	});

	return clusters;
}

export function getMeanCentroids(clusters: Point[][]): Point[] {
	return clusters.map((cl) => {
		return cl.length ? cl[0].map((_, idx) => {
			return round(cl.reduce((sum, point) => sum + point[idx], 0) / cl.length);
		}, {}) : getRandCentroids(1, clusters.flatMap(x => x))[0]; 
	});
}

export function getRandCentroids(k: number, points: Point[]): Point[] {
	const [min, max] = minMax(points);
	const centroids: Point[] = [];
	
	while (centroids.length < k) {
		const point = points[0].map((_, idx) => random(min[idx], max[idx]));
		if (!centroids.some(ct => pointsEqual(ct, point))) {
			centroids.push(point);
		}
	}

	return centroids;
}

export function minMax(points: Point[]) {
	return [
		points[0].map((_, idx) => Math.min(...points.map(p => p[idx]))),
		points[0].map((_, idx) => Math.max(...points.map(p => p[idx]))),
	];
}

export function random(min: number, max: number) {
    return round(Math.random() * (max - min + 1) + min);
}

export function eucDistance(a: Point, b: Point): number {
	return round(Math.sqrt(a.reduce((s, _, idx) => s + (a[idx] - b[idx]) ** 2, 0)));
}

export function pointsEqual(a: Point, b: Point): boolean {
	return a.length === b.length && a.every((x, idx) => x === b[idx]);
}

export function sum(nums: number[]) {
	return nums.reduce((s, n) => s + n, 0);
}

export function round(num: number) {
	// return roundToTwo(num);
	// return num;
	// return Math.round(num);
	return Math.floor(num);
}

export function roundToTwo(num: number) {    
    return Math.round(num * 100 + Number.EPSILON) / 100;
}
