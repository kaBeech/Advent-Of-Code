import Data.ByteString.Char8 (split)

testInput = "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7"

main = do
  input <- readFile "testInput.dat"
  print (solvePart2 input)

parseSteps = splitStringOn (== ',')

getLabel step = head (splitStringOn (== '=') (filter (/= '-') step))

processStep box step = if isStepARemoveStep step then removeLensFromBox box step else processLens box step

isStepARemoveStep step = length (splitStringOn (== '=') step) == 1

removeLensFromBox box lens = filter (\x -> getLabel x /= getLabel lens) box

processLens box lens = if checkIfBoxHasALensWithThisLabel box lens then replaceLensInBox box lens else addLensToBox box lens

replaceLensInBox box lens = map (\x -> if getLabel lens == getLabel x then lens else x) box

addLensToBox box lens = box ++ [lens]

checkIfBoxHasALensWithThisLabel box lens = any (\x -> getLabel x == getLabel lens) box

solvePart2 puzzleInput = sum (getHASHedValues puzzleInput)

getHASHedValues puzzleInput = map runHASHAlgorithm (splitStringOn (== ',') puzzleInput)

runHASHAlgorithm hashString = foldl runHASHAlgorithmOnChar 0 hashString

runHASHAlgorithmOnChar currentValue nextCharacter = (currentValue + fromEnum nextCharacter) * 17 `mod` 256

splitStringOn delimiter string = case dropWhile delimiter string of
  "" -> []
  string' -> element : splitStringOn delimiter string''
    where
      (element, string'') = break delimiter string'