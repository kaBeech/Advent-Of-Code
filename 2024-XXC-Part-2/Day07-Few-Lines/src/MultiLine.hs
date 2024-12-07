module MultiLine
  ( solvePart1,
  )
where

type Equation = (Int, [Int])

solvePart1 = 1

-- | Takes a raw string input and returns a list of equations.

-- | ==== __Examples__
--   >>> parseInput "190: 10 19\n83: 17 5"
--   [[(190,[10,19])],[(83,[17,5])]]
parseInput :: String -> [Equation]
parseInput input = map parseLine (lines input)

-- | Takes a string and parses it into an equation.
--
-- | ==== __Examples__
--   >>> parseLine "190: 10 19"
--   (190,[10,19])
parseLine :: String -> Equation
parseLine line = (read (head split), map read (tail split))
  where
    split = words (map (\c -> if c == ':' then ' ' else c) line)
