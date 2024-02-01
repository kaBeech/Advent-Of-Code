import { Heap } from "npm:heap-js";

const c = async (input) => {
  const s = await Deno.readTextFile(input);
  const a = [];
  s.trimEnd()
    .split(/\n/)
    .forEach((l) => {
      a.push(l.split(""));
    });
  return a;
};

const getNeighbors = (currentNode, cityMap) => {
  const neighbors = [];
  const { x, y } = currentNode.block.coordinates;

  if (
    y > 0 &&
    currentNode.direction !== "south" &&
    (currentNode.direction === "north" ||
      currentNode.consecutiveStepsInSameDirection > 3)
  ) {
    neighbors.push({
      block: cityMap[y - 1][x],
      direction: "north",
      consecutiveStepsInSameDirection: 1,
      routeHeatLoss: currentNode.routeHeatLoss + cityMap[y - 1][x].heatLoss,
      heatLossRecord: [
        ...currentNode.heatLossRecord,
        {
          nodeHeatLoss: cityMap[y - 1][x].heatLoss,
          cumulativeHeatLoss:
            currentNode.routeHeatLoss + cityMap[y - 1][x].heatLoss,
          consecutiveStepsInSameDirection: 1,
          coordinates: { x, y: y - 1 },
        },
      ],
    });
  }
  if (
    x < cityMap[0].length - 1 &&
    currentNode.direction !== "west" &&
    (currentNode.direction === "east" ||
      currentNode.consecutiveStepsInSameDirection > 3)
  ) {
    neighbors.push({
      block: cityMap[y][x + 1],
      direction: "east",
      consecutiveStepsInSameDirection: 1,
      routeHeatLoss: currentNode.routeHeatLoss + cityMap[y][x + 1].heatLoss,
      heatLossRecord: [
        ...currentNode.heatLossRecord,
        {
          nodeHeatLoss: cityMap[y][x + 1].heatLoss,
          cumulativeHeatLoss:
            currentNode.routeHeatLoss + cityMap[y][x + 1].heatLoss,
          consecutiveStepsInSameDirection: 1,
          coordinates: { x: x + 1, y },
        },
      ],
    });
  }
  if (
    y < cityMap.length - 1 &&
    currentNode.direction !== "north" &&
    (currentNode.direction === "south" ||
      currentNode.consecutiveStepsInSameDirection > 3)
  ) {
    neighbors.push({
      block: cityMap[y + 1][x],
      direction: "south",
      consecutiveStepsInSameDirection: 1,
      routeHeatLoss: currentNode.routeHeatLoss + cityMap[y + 1][x].heatLoss,
      heatLossRecord: [
        ...currentNode.heatLossRecord,
        {
          nodeHeatLoss: cityMap[y + 1][x].heatLoss,
          cumulativeHeatLoss:
            currentNode.routeHeatLoss + cityMap[y + 1][x].heatLoss,
          consecutiveStepsInSameDirection: 1,
          coordinates: { x, y: y + 1 },
        },
      ],
    });
  }
  if (
    x > 0 &&
    currentNode.direction !== "east" &&
    (currentNode.direction === "west" ||
      currentNode.consecutiveStepsInSameDirection > 3)
  ) {
    neighbors.push({
      block: cityMap[y][x - 1],
      direction: "west",
      consecutiveStepsInSameDirection: 1,
      routeHeatLoss: currentNode.routeHeatLoss + cityMap[y][x - 1].heatLoss,
      heatLossRecord: [
        ...currentNode.heatLossRecord,
        {
          nodeHeatLoss: cityMap[y][x - 1].heatLoss,
          cumulativeHeatLoss:
            currentNode.routeHeatLoss + cityMap[y][x - 1].heatLoss,
          consecutiveStepsInSameDirection: 1,
          coordinates: { x: x - 1, y },
        },
      ],
    });
  }

  const directionNeighbor = neighbors.find(
    (neighbor) => neighbor.direction === currentNode.direction
  );

  if (directionNeighbor) {
    directionNeighbor.consecutiveStepsInSameDirection =
      currentNode.consecutiveStepsInSameDirection + 1;
    directionNeighbor.heatLossRecord[
      directionNeighbor.heatLossRecord.length - 1
    ].consecutiveStepsInSameDirection =
      currentNode.consecutiveStepsInSameDirection + 1;
  }

  return neighbors;
};

const parseInput = async () => {
  const cityMap = [];
  const cityMapString = await c("./t.dat");
  let y = 0;

  for (const rawCityRow of cityMapString) {
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
    cityMap.push(cityRow);
    y++;
  }
  return cityMap;
};

const cityMap = await parseInput();

export default (function () {
  const machinePartsFactory =
    cityMap[cityMap.length - 1][cityMap[0].length - 1];
  const visited = new Map();
  const nodesToVisit = new Heap((a, b) => a.routeHeatLoss - b.routeHeatLoss);
  nodesToVisit.push({
    block: cityMap[0][1],
    direction: "east",
    consecutiveStepsInSameDirection: 1,
    routeHeatLoss: cityMap[0][1].heatLoss,
    heatLossRecord: [
      {
        nodeHeatLoss: cityMap[0][1].heatLoss,
        cumulativeHeatLoss: cityMap[0][1].heatLoss,
        consecutiveStepsInSameDirection: 1,
        coordinates: { x: 1, y: 0 },
      },
    ],
  });
  nodesToVisit.push({
    block: cityMap[1][0],
    direction: "south",
    consecutiveStepsInSameDirection: 1,
    routeHeatLoss: cityMap[1][0].heatLoss,
    heatLossRecord: [
      {
        nodeHeatLoss: cityMap[1][0].heatLoss,
        cumulativeHeatLoss: cityMap[1][0].heatLoss,
        consecutiveStepsInSameDirection: 1,
        coordinates: { x: 0, y: 1 },
      },
    ],
  });

  while (nodesToVisit.length > 0) {
    const currentNode = nodesToVisit.pop();

    if (currentNode.block === machinePartsFactory) {
      if (
        currentNode.routeHeatLoss < machinePartsFactory.minimumRouteHeatLoss
      ) {
        machinePartsFactory.finalNode = currentNode;
      }
      machinePartsFactory.minimumRouteHeatLoss = Math.min(
        currentNode.routeHeatLoss,
        machinePartsFactory.minimumRouteHeatLoss
      );

      continue;
    }

    const cacheKey = `${currentNode.block.coordinates.x}-${currentNode.block.coordinates.y}-${currentNode.direction}-${currentNode.consecutiveStepsInSameDirection}`;
    if (
      visited.has(cacheKey) &&
      visited.get(cacheKey) <= currentNode.routeHeatLoss
    ) {
      continue;
    }
    visited.set(cacheKey, currentNode.routeHeatLoss);

    const neighbors = getNeighbors(currentNode, cityMap);

    for (const neighborNode of neighbors) {
      if (
        neighborNode &&
        neighborNode.consecutiveStepsInSameDirection < 11 &&
        neighborNode.routeHeatLoss < machinePartsFactory.minimumRouteHeatLoss
      ) {
        if (neighborNode.block === machinePartsFactory) {
          neighborNode.block.finalNode = currentNode;
        }
        neighborNode.block.minimumRouteHeatLoss =
          currentNode.routeHeatLoss + neighborNode.block.heatLoss;
        nodesToVisit.push(neighborNode);
      }
    }
  }

  const lowestPossibleHeatLoss = machinePartsFactory.minimumRouteHeatLoss;

  console.log(
    `Part 1: The lowest possible heat loss is ${lowestPossibleHeatLoss}.`
  );

  return lowestPossibleHeatLoss;
})();
