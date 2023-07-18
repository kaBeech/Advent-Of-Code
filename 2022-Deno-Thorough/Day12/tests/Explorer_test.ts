import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Explorer } from "../Explorer.ts";
import { populateTileMap } from "../populateTileMap.ts";

const testTileMap = await populateTileMap("tests/testInput.txt");

const testExplorer = Explorer(testTileMap);

Deno.test("exploring the testTileMap yields shortestPathToDestination of 31 steps", () => {
  assertEquals(testExplorer.findShortestPathToDestination(), 31);
});

Deno.test("exploring the testTileMap yields shortestPathToLowestElevation of 29 steps", () => {
  assertEquals(testExplorer.findShortestPathToLowestElevation(), 29);
});
