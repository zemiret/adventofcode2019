import System.IO
import Data.List
import qualified Data.Graph as Graph
import qualified Data.Map as Map 
import qualified Data.Array as Array
import qualified Data.Set as Set

-- Approach
-- 1. Build a dependency graph
-- 2. Find COM in graph
-- 3. Do a "graph walk" 


split :: Eq a => a -> [a] -> [[a]]
split d [] = []
split d s = x : split d (drop 1 y) where
    (x, y) = span (/= d) s

getOrbit :: String -> (String, String) 
getOrbit s = (head x, last x) where
    x = split ')' s


santaPath :: Graph.Graph -> Graph.Vertex -> Graph.Vertex -> Set.Set Graph.Vertex -> Int -> Int
santaPath g s y visited sum
    | (y == s) = sum
    | (null (g Array.! y)) = 0
    | (Set.member y visited) = 0
    | otherwise = foldl (max) 0 childrenPath
    where childrenPath = map (\x -> santaPath g s x (Set.insert y visited) (sum + 1)) (g Array.! y)


main = do
    fContent <- readFile "input.txt"
    let orbits = map getOrbit (split '\n' fContent)
    let objects = nub . concatMap (\(x, y) -> [x, y]) $ orbits
    let objToKey = Map.fromList . zip objects $ [1..length objects]

    let edges = map (\(x, y) -> (objToKey Map.! x, objToKey Map.! y)) orbits ++ map (\(x, y) -> (objToKey Map.! y, objToKey Map.! x)) orbits
    let graph = Graph.buildG (0, length objects) edges 

    let santa = objToKey Map.! "SAN"
    let you = objToKey Map.! "YOU"

    print ((santaPath graph santa you Set.empty 0) - 2)


