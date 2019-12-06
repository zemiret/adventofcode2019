import System.IO
import Data.List
import qualified Data.Graph as Graph
import qualified Data.Map as Map 
import qualified Data.Array as Array

-- Approach
-- 1. Build a dependency graph
-- 2. Find COM in graph
-- 3. Do a "Tree walk" and sum the lengths to leaves (cause this graph will be a tree)


split :: Eq a => a -> [a] -> [[a]]
split d [] = []
split d s = x : split d (drop 1 y) where
    (x, y) = span (/= d) s

getOrbit :: String -> (String, String) 
getOrbit s = (head x, last x) where
    x = split ')' s


computePaths :: Graph.Graph -> Graph.Vertex -> [Graph.Vertex] -> Int -> Int -> Int
computePaths g node [] level sum = sum + level
computePaths g node children level sum = sum + level + childrenValue where
    childrenValue = foldl (+) 0 . map (\x -> computePaths g x (g Array.! x) (level + 1) sum) $ children 


main = do
    fContent <- readFile "input.txt"
    let orbits = map getOrbit (split '\n' fContent)
    let objects = nub . concatMap (\(x, y) -> [x, y]) $ orbits
    let objToKey = Map.fromList . zip objects $ [1..length objects]

    let edges = map (\(x, y) -> (objToKey Map.! x, objToKey Map.! y)) orbits
    let graph = Graph.buildG (0, length objects) edges 

    let com = objToKey Map.! "COM"

    print (computePaths graph com (graph Array.! com) 0 0)

