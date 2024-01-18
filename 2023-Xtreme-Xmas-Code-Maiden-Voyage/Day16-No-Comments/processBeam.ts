import { CardinalDirection, XYCoordinates } from "../../tools/commonTypes.ts";
import getAdjacentCoordinates from "./getAdjacentCoordinates.ts";
import processBeamHittingMirrorBackslash from "./processBeamHittingMirrorBackslash.ts";
import processBeamHittingMirrorSlash from "./processBeamHittingMirrorSlash.ts";
import processBeamHittingVerticalSplitter from "./processBeamHittingVerticalSplitter.ts";
import processBeamIfWithinRange from "./processBeamIfWithinRange.ts";
import processBeamInEmptySpace from "./processBeamInEmptySpace.ts";
import { Grid } from "./types.ts";

export default (
  grid: Grid,
  currentTileCoordinates: XYCoordinates,
  beamIsTravelingToThe: CardinalDirection,
) => {
  const currentTile = grid[currentTileCoordinates.y][currentTileCoordinates.x];

  currentTile.energized = true;

  const adjacentCoordinates = getAdjacentCoordinates(currentTileCoordinates);

  switch (currentTile.contains) {
    case `empty space`:
      processBeamInEmptySpace(
        grid,
        currentTileCoordinates,
        beamIsTravelingToThe,
      );
      break;
    case `mirror slash`:
      processBeamHittingMirrorSlash(
        grid,
        currentTileCoordinates,
        beamIsTravelingToThe,
      );
      break;
    case `mirror backslash`:
      processBeamHittingMirrorBackslash(
        grid,
        currentTileCoordinates,
        beamIsTravelingToThe,
      );
      break;
    case "splitter vertical":
      processBeamHittingVerticalSplitter(
        grid,
        currentTileCoordinates,
        beamIsTravelingToThe,
      );
      break;
    case "splitter horizontal":
      switch (beamIsTravelingToThe) {
        case `East`:
          processBeamIfWithinRange(
            grid,
            adjacentCoordinates.east,
            beamIsTravelingToThe,
          );
          break;
        case `West`:
          processBeamIfWithinRange(
            grid,
            adjacentCoordinates.west,
            beamIsTravelingToThe,
          );
          break;
        case "North" || "South":
          processBeamIfWithinRange(grid, adjacentCoordinates.east, "East");
          processBeamIfWithinRange(grid, adjacentCoordinates.west, "West");
          break;
      }
      break;
  }
};
