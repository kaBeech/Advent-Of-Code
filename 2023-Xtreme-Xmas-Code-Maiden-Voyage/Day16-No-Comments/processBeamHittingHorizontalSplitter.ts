import { CardinalDirection, XYCoordinates } from "../../tools/commonTypes.ts";
import getAdjacentCoordinates from "./getAdjacentCoordinates.ts";
import processBeamIfWithinRange from "./processBeamIfWithinRange.ts";
import { Grid } from "./types.ts";

export default (
  grid: Grid,
  currentTileCoordinates: XYCoordinates,
  beamIsTravelingToThe: CardinalDirection,
) => {
  const currentTile = grid[currentTileCoordinates.y][currentTileCoordinates.x];

  if (currentTile.isHalfProcessed) currentTile.isFullyProcessed = true;
  else currentTile.isHalfProcessed = true;

  const adjacentCoordinates = getAdjacentCoordinates(currentTileCoordinates);

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
    case `North`:
    case `South`:
      processBeamIfWithinRange(
        grid,
        adjacentCoordinates.east,
        `East`,
      );
      processBeamIfWithinRange(
        grid,
        adjacentCoordinates.west,
        `West`,
      );
      break;
  }
};
