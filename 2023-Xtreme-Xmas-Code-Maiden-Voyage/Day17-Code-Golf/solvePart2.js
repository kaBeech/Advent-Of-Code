import { Heap } from "npm:heap-js";

const getNeighbors = (currentNode, cityMap) => {
  const neighbors = [];
  const { x, y } = currentNode.block.coordinates;
  const minStepsReached = currentNode.consecutiveStepsInSameDirection > 3;
  const d = currentNode.direction;

  if (y > 0 && d !== "south" && (d === "north" || minStepsReached)) {
    neighbors.push({
      block: cityMap[y - 1][x],
      direction: "north",
      consecutiveStepsInSameDirection: 1,
      routeHeatLoss: currentNode.routeHeatLoss + cityMap[y - 1][x].heatLoss,
    });
  }
  if (
    x < cityMap[0].length - 1 &&
    d !== "west" &&
    (d === "east" || minStepsReached)
  ) {
    neighbors.push({
      block: cityMap[y][x + 1],
      direction: "east",
      consecutiveStepsInSameDirection: 1,
      routeHeatLoss: currentNode.routeHeatLoss + cityMap[y][x + 1].heatLoss,
    });
  }
  if (
    y < cityMap.length - 1 &&
    d !== "north" &&
    (d === "south" || minStepsReached)
  ) {
    neighbors.push({
      block: cityMap[y + 1][x],
      direction: "south",
      consecutiveStepsInSameDirection: 1,
      routeHeatLoss: currentNode.routeHeatLoss + cityMap[y + 1][x].heatLoss,
    });
  }
  if (x > 0 && d !== "east" && (d === "west" || minStepsReached)) {
    neighbors.push({
      block: cityMap[y][x - 1],
      direction: "west",
      consecutiveStepsInSameDirection: 1,
      routeHeatLoss: currentNode.routeHeatLoss + cityMap[y][x - 1].heatLoss,
    });
  }

  const directionNeighbor = neighbors.find(
    (neighbor) => neighbor.direction === d
  );

  if (directionNeighbor) {
    directionNeighbor.consecutiveStepsInSameDirection =
      currentNode.consecutiveStepsInSameDirection + 1;
  }

  return neighbors;
};

const m = [];
const s = await Deno.readTextFile("./t.dat");
const a = [];
s.trimEnd()
  .split(/\n/)
  .forEach((l) => {
    a.push(l.split(""));
  });
let y = 0;

for (const rawCityRow of a) {
  const cityRow = [];
  let x = 0;
  for (const rawCityBlock of rawCityRow) {
    cityRow.push({
      heatLoss: +rawCityBlock,
      minimumRouteHeatLoss: Infinity,
      coordinates: { x, y },
    });
    x++;
  }
  m.push(cityRow);
  y++;
}

export default (function () {
  const machinePartsFactory = m[m.length - 1][m[0].length - 1];
  const visited = new Map();
  const nodesToVisit = new Heap((a, b) => a.routeHeatLoss - b.routeHeatLoss);
  nodesToVisit.push(
    {
      block: m[0][1],
      direction: "east",
      consecutiveStepsInSameDirection: 1,
      routeHeatLoss: m[0][1].heatLoss,
    },
    {
      block: m[1][0],
      direction: "south",
      consecutiveStepsInSameDirection: 1,
      routeHeatLoss: m[1][0].heatLoss,
    }
  );

  while (nodesToVisit.length > 0) {
    const currentNode = nodesToVisit.pop();
    const { block, routeHeatLoss, direction, consecutiveStepsInSameDirection } =
      currentNode;
    const { x, y } = block.coordinates;
    let endMinimumRouteHeatLoss = machinePartsFactory.minimumRouteHeatLoss;

    if (block === machinePartsFactory) {
      if (routeHeatLoss < endMinimumRouteHeatLoss) {
        machinePartsFactory.finalNode = currentNode;
      }
      endMinimumRouteHeatLoss = Math.min(
        routeHeatLoss,
        endMinimumRouteHeatLoss
      );
      continue;
    }

    const cacheKey = `${x}-${y}-${direction}-${consecutiveStepsInSameDirection}`;
    if (visited.has(cacheKey) && visited.get(cacheKey) <= routeHeatLoss) {
      continue;
    }
    visited.set(cacheKey, routeHeatLoss);

    const neighbors = getNeighbors(currentNode, m);

    for (const neighborNode of neighbors) {
      if (
        neighborNode &&
        neighborNode.consecutiveStepsInSameDirection < 11 &&
        neighborNode.routeHeatLoss < endMinimumRouteHeatLoss
      ) {
        const nBlock = neighborNode.block;
        if (nBlock === machinePartsFactory) {
          nBlock.finalNode = currentNode;
        }
        nBlock.minimumRouteHeatLoss = routeHeatLoss + nBlock.heatLoss;
        nodesToVisit.push(neighborNode);
      }
    }
  }

  console.log(
    `Part 2: The lowest possible heat loss is ${machinePartsFactory.minimumRouteHeatLoss}.`
  );

  return machinePartsFactory.minimumRouteHeatLoss;
})();
