module Search (countWords) where

import Types (WordMap)

-- | Takes a word and a WordMap and returns the number of times the word
--   appears in the WordMap, Word Search style.

-- | ==== __Examples__
--   >>> countWords "XMAS" [[('X',(0,0)),('M',(1,0)),('A',(2,0)),('S',(3,0))],[('M',(0,1)),('M',(1,1)),('M',(2,1)),('M',(3,1))],[('A',(0,2)),('M',(1,2)),('S',(2,2)),('M',(3,2))],[('S',(0,3)),('M',(1,3)),('M',(2,3)),('S',(3,3))]]
--   3
--
--   >>> countWords "XMAS" [[('S',(0,0)),('M',(1,0)),('M',(2,0)),('S',(3,0))],[('M',(0,1)),('A',(1,1)),('M',(2,1)),('A',(3,1))],[('M',(0,2)),('M',(1,2)),('M',(2,2)),('M',(3,2))],[('S',(0,3)),('A',(1,3)),('M',(2,3)),('X',(3,3))]]
--   3
--
--   >>> countWords "XMAS" [[('M',(0,0)),('M',(1,0)),('M',(2,0)),('M',(3,0)),('M',(4,0))],[('M',(0,1)),('M',(1,1)),('M',(2,1)),('S',(3,1)),('X',(4,1))],[('M',(0,2)),('M',(1,2)),('A',(2,2)),('M',(3,2)),('M',(4,2))],[('M',(0,3)),('M',(1,3)),('A',(2,3)),('A',(M,3)),('M',(4,3))],[('X',(0,4)),('S',(1,4)),('S',(2,4)),('M',(3,4)),('M',(4,4))]]
--   2
--
--   >>> countWords "XMAS" [[('X',(0,0)),('A',(1,0)),('M',(2,0)),('A',(3,0)),('A',(4,0))],[('S',(0,1)),('X',(1,1)),('M',(2,1)),('A',(3,1)),('M',(4,1))],[('M',(0,2)),('A',(1,2)),('M',(2,2)),('M',(3,2)),('S',(4,2))],[('X',(0,3)),('M',(1,3)),('A',(2,3)),('M',(3,3)),('S',(4,3))],[('X',(0,4)),('M',(1,4)),('A',(2,4)),('S',(3,4)),('X',(4,4))]]
--   0
countWords :: String -> WordMap -> Int
-- For each letter in the WordMap, check if the word appears starting from that
-- letter.
countWords word wordMap = sum [countWordsFromLetter word wordMap (x, y) | x <- [0..length (head wordMap) - 1], y <- [0..length wordMap - 1]]
