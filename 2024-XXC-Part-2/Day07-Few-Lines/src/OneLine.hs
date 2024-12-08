module OneLine
  ( solveParts,
  )
where

solveParts input = (let genOperators n = if n == 0 then [[op] | op <- "*+"] else [operator : rest | rest <- genOperators (n - 1), operator <- "*+"]; tryEquation total equation operators | total == 0 = tryEquation (head (tail equation)) (head equation : tail (tail equation)) operators | null (tail equation) = total == head equation | otherwise = total <= head equation && (if head operators == '|' then tryEquation (read (show total ++ show (head (tail equation)))) (head equation : tail (tail equation)) (tail operators) else if head operators == '+' then tryEquation (total + head (tail equation)) (head equation : tail (tail equation)) (tail operators) else tryEquation (total * head (tail equation)) (head equation : tail (tail equation)) (tail operators)) in sum (map fst (filter (\equation -> any (tryEquation 0 (uncurry (:) equation)) (genOperators (length (snd equation) - 2))) (map (\line -> (read (head (words (map (\c -> if c == ':' then ' ' else c) line))), map read (tail (words (map (\c -> if c == ':' then ' ' else c) line))))) (lines input)))), let genOperators n = if n == 0 then [[op] | op <- "*+|"] else [operator : rest | rest <- genOperators (n - 1), operator <- "*+|"]; tryEquation total equation operators | total == 0 = tryEquation (head (tail equation)) (head equation : tail (tail equation)) operators | null (tail equation) = total == head equation | otherwise = total <= head equation && (if head operators == '|' then tryEquation (read (show total ++ show (head (tail equation)))) (head equation : tail (tail equation)) (tail operators) else if head operators == '+' then tryEquation (total + head (tail equation)) (head equation : tail (tail equation)) (tail operators) else tryEquation (total * head (tail equation)) (head equation : tail (tail equation)) (tail operators)) in sum (map fst (filter (\equation -> any (tryEquation 0 (uncurry (:) equation)) (genOperators (length (snd equation) - 2))) (map (\line -> (read (head (words (map (\c -> if c == ':' then ' ' else c) line))), map read (tail (words (map (\c -> if c == ':' then ' ' else c) line))))) (lines input)))))
