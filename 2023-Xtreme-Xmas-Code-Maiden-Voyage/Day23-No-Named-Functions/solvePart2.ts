import { XYCoordinates } from "../../tools/commonTypes.ts";

// Declate Types

interface Tile {
  coordinates: XYCoordinates;
  value: "#" | "." | "<" | ">" | "^" | "v";
  adjacentTiles: XYCoordinates[];
  distanceFromStart: number;
  isNode: boolean;
}

interface TrailMap {
  tiles: Tile[];
}

interface Path {
  currentTileCoordinates: XYCoordinates;
  visitedTiles: XYCoordinates[];
}

interface TrailNodeConnection {
  destination: XYCoordinates;
  distance: number;
}

interface TrailNode {
  coordinates: XYCoordinates;
  connections: TrailNodeConnection[];
}

// Parse Input

const inputFile = "./challengeInput.dat"

const inputLines = await Deno.readTextFile(inputFile).then((text: string) => text.trim().split("\n"));

const trailMap: TrailMap = {
  tiles: []
};

// Basically what we're setting up is a reverse of Dijkstra's Algorithm.
// Rather than finding the shortest path, we're looking for the longest.
// Instead of marking distance as Infitinty to start, we make it as 0.
// Since we ideally want to visit all reachable tiles in one path, we leave
// out the unvisitedTiles array that would be common in a Dijkstra's implementation.
// Instead, we will create a call stack called pathsToExplore (declared later) 
// and keep track of the visited tiles in the Path object. This visitedTiles 
// record will keep us from backtracking and visiting the same tile twice.
for (const [y, line] of inputLines.entries()) {
  for (const [x, value] of line.split("").entries()) {
    if (value !== "#") {
      trailMap.tiles.push({
        coordinates: { x, y },
        value,
        distanceFromStart: 0,
        adjacentTiles: [],
        isNode: false,
      });
    }
  }
}

for (const tile of trailMap.tiles) {
  const { x, y } = tile.coordinates;
  const adjacentTiles = [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 }
  ];

  for (const adjacentTileCoordinates of adjacentTiles) {

    // Skip paths that are shorter than the longest known path for the adjacent tile
    if (adjacentTileCoordinates.x < 0 || adjacentTileCoordinates.y < 0 || adjacentTileCoordinates.x >= inputLines[0].length || adjacentTileCoordinates.y >= inputLines.length) {
      continue;
    }

    const adjacentTile = trailMap.tiles.find(
      (t) =>
        t.coordinates.x === adjacentTileCoordinates.x && t.coordinates.y === adjacentTileCoordinates.y
    );

    // Skip the coordinates if they're not in the trailMap
    if (!adjacentTile) {
      continue;
    }
    tile.adjacentTiles.push(adjacentTileCoordinates);
  }
}

const trailNodes: TrailNode[] = [];

for (const tile of trailMap.tiles) {
  if (tile.adjacentTiles.length > 2) {
    tile.isNode = true;
    trailNodes.push({
      coordinates: tile.coordinates,
      connections: []
    });
  }
}

for (const trailNode of trailNodes) {
  const { x, y } = trailNode.coordinates;
  const nodeTile = trailMap.tiles.find((t) => t.coordinates.x === x && t.coordinates.y === y)!;

  for (const connectionRouteStartingCoordinates of nodeTile.adjacentTiles) {
    const path = [trailNode.coordinates, connectionRouteStartingCoordinates];
    let connectionMapped = false
    let currentTileCoordinates = connectionRouteStartingCoordinates;

    while (!connectionMapped) {
      let currentTile = trailMap.tiles.find(
        (tile) =>
          tile.coordinates.x === currentTileCoordinates.x && tile.coordinates.y === currentTileCoordinates.y
      )!;
      if (currentTile.isNode) {
        trailNode.connections.push({
          destination: currentTileCoordinates,
          distance: path.length - 1,
        });
        connectionMapped = true;
      } else {
        const nextTileCoordinates = currentTile.adjacentTiles.find(
          (tile) =>
            tile.x !== path[path.length - 2].x || tile.y !== path[path.length - 2].y
        )!;
        path.push(nextTileCoordinates);
        currentTileCoordinates = nextTileCoordinates;
      }
    }
  }
}

// Reverse Dijsktra's Algorithm

export default (async function(): Promise<number> {

  // This will be our call stack. It relaces the unvisitedTiles array in a 
  // regular Dijkstra's Algorithm.
  const pathsToExplore: Path[] = [];

  // The starting tile's exact X coordinate isn't explicitly stated in the 
  // puzzle, but practically it seems to always be 1.
  // Note: y=0 is the top row when looking at the puzzle input.
  pathsToExplore.push({ currentTileCoordinates: { x: 1, y: 0 }, visitedTiles: [] });

  while (pathsToExplore.length > 0) {
    let currentPath = pathsToExplore.pop()!
    const currentTile = trailMap.tiles.find(
      (t) =>
        t.coordinates.x === currentPath.currentTileCoordinates.x &&
        t.coordinates.y === currentPath.currentTileCoordinates.y
    )!;
    const { x, y } = currentTile.coordinates;


    if (x === inputLines[0].length - 2 && y === inputLines.length - 1) {
      console.log(JSON.stringify(currentPath.visitedTiles));
    }

    for (const adjacentTileCoordinates of currentTile.adjacentTiles) {


      // Skip tiles that have already been visited in this path
      if (currentPath.visitedTiles.find((t) => t.x === adjacentTileCoordinates.x && t.y === adjacentTileCoordinates.y)) {
        continue;
      }


      const adjacentTile = trailMap.tiles.find(
        (t) =>
          t.coordinates.x === adjacentTileCoordinates.x && t.coordinates.y === adjacentTileCoordinates.y
      )!;

      // Skip paths that are shorter than the longest known path for the adjacent tile
      if (adjacentTile.distanceFromStart > currentPath.visitedTiles.length + 1) {
        continue;
      }

      const nextPath = { currentTileCoordinates: adjacentTileCoordinates, visitedTiles: [...currentPath.visitedTiles, currentTile.coordinates] };

      // If the adjacent tile is reachable, update its distance from the start 
      // and add nextPath to the call stack.
      // Since all steep slope tiles are now reachable, we can reach all tiles 
      // that aren't forest tiles
      // if (adjacentTile.value !== "#") {
      // For some reason the distanceFromStart calculation we were using 
      // gives values too large now, so set it based on the length of the 
      // visitedTiles array.
      // adjacentTile.distanceFromStart = currentTile.distanceFromStart + 1;
      // adjacentTile.distanceFromStart = nextPath.visitedTiles.length;
      //   pathsToExplore.push(nextPath);
      // }
      switch (adjacentTile.value) {

        // Skip forest tiles
        case "#":
          break;

        // Add clear path tiles
        case ".":
          // adjacentTile.distanceFromStart = currentTile.distanceFromStart + 1;
          adjacentTile.distanceFromStart = nextPath.visitedTiles.length;
          pathsToExplore.push(nextPath);
          break

        // Add steep slope tiles only if not at the bottom of the slope
        case "<":
          // if (adjacentTileCoordinates.x <= x) {
          // adjacentTile.distanceFromStart = currentTile.distanceFromStart + 1;
          adjacentTile.distanceFromStart = nextPath.visitedTiles.length;
          pathsToExplore.push(nextPath);
          // }
          break;
        case ">":
          // if (adjacentTileCoordinates.x >= x) {
          // adjacentTile.distanceFromStart = currentTile.distanceFromStart + 1;
          adjacentTile.distanceFromStart = nextPath.visitedTiles.length;
          pathsToExplore.push(nextPath);
          // }
          break;
        case "^":
          // if (adjacentTileCoordinates.y <= y) {
          // adjacentTile.distanceFromStart = currentTile.distanceFromStart + 1;
          adjacentTile.distanceFromStart = nextPath.visitedTiles.length;
          pathsToExplore.push(nextPath);
          // }
          break;
        case "v":
          // if (adjacentTileCoordinates.y >= y) {
          // adjacentTile.distanceFromStart = currentTile.distanceFromStart + 1;
          adjacentTile.distanceFromStart = nextPath.visitedTiles.length;
          pathsToExplore.push(nextPath);
          // }
          break;

        default:
          throw new Error(`Unexpected tile value: ${adjacentTile.value}`);
      }

    }
  }

  // Again, the ending tile's exact X coordinate isn't explicitly stated in the 
  // puzzle, but practically it seems to always be at the penultimate index.
  let endingNode = trailMap.tiles.find((t) => t.coordinates.x === inputLines[0].length - 2 && t.coordinates.y === inputLines.length - 1)!;

  const longestHikeSteps = endingNode.distanceFromStart;

  console.log(`Part 2: The longest hike is ${longestHikeSteps} steps long`);

  return longestHikeSteps;
})();
