import {
  convertMultiLineFileToDoubleArray,
} from "../../tools/conversionFunctions/convertFileToArray.ts";
import { convertLowercaseLetterToNumber } from "../../tools/conversionFunctions/convertLetterToNumber.ts";
import { Tile } from "./Tile.ts";
import { TileMap, TileType } from "./types.ts";

const populateTileMap = async (challengeInput: string): Promise<TileMap> => {
  const tileMap = {
    allTiles: [] as TileType[][],
    startTile: {} as TileType,
    endTile: {} as TileType,
  } as TileMap;
  const rawMap = await convertMultiLineFileToDoubleArray(challengeInput);
  rawMap.forEach((row, y) => {
    const tileRow = [] as TileType[];
    row.forEach((value, x) => {
      let elevation = -1;
      if (value === "S") {
        elevation = 1;
      } else if (value === "E") {
        elevation = 26;
      } else {
        elevation = convertLowercaseLetterToNumber(value);
      }
      const tile = Tile({ x, y }, elevation, tileMap);
      if (value === "S") {
        tileMap.startTile = tile;
      } else if (value === "E") {
        tileMap.endTile = tile;
      }
      tileRow.push(tile);
    });
    tileMap.allTiles.push(tileRow);
  });
  return tileMap;
};

export { populateTileMap };
