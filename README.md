# K-Means implementation in TypeScript

```ts
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
function clusterize({k, data, centroids, limit = Infinity}: Input): Result
```
