function readfile(file) 
	lines = {}
	local i = 0
	for line in io.lines(file) do
		lines[i] = line
		i = i + 1
	end
	return lines
end

function splitstr(wire)
	a = {}
	for dir in wire:gmatch('[^,]+') do
		table.insert(a, dir)
	end

	return a
end

function coordinatemap(wire)
	local x, y, dy, dx = 0, 0, 0, 0
	ret = {}

	dist = 0

	for i, code in pairs(wire) do
		local dir = code:sub(1, 1) 
		local amount = code:sub(2, code:len())

		if dir == 'L' then
			dx = -1
			dy = 0
		elseif dir == 'R' then
			dx = 1
			dy = 0
		elseif dir == 'U' then
			dx = 0
			dy = 1
		elseif dir == 'D' then
			dx = 0
			dy = -1
		end

        for j=1,amount do
			x = x + dx
			y = y + dy
			dist = dist + 1

			cord = {}
			cord[0] = x
			cord[1] = y
			cord[2] = dist

			print(dist)

			table.insert(ret, cord)
        end
	end

	print()
	return ret
end

local lines = readfile('input')
local w1 = lines[0]
local w2 = lines[1]

w1 = splitstr(w1)
w2 = splitstr(w2)

w1 = coordinatemap(w1)
w2 = coordinatemap(w2)

map1 = {}

for i, cord in pairs(w1) do
	x, y, dist = cord[0], cord[1], cord[2] 

	if map1[x] == nil then
		map1[x] = {}
	end

	ins = {}
	ins[0] = y
	ins[1] = dist
	table.insert(map1[x], ins)
end

inters = {}
min = math.huge

for _, cord in pairs(w2) do
	x, y, dist2 = cord[0], cord[1], cord[2] 

	if map1[x] ~= nil then
		for _, wy1d in pairs(map1[x]) do
			y1, dist1 = wy1d[0], wy1d[1]

			if y == y1 and (dist1 + dist2) < min then
				min = dist1 + dist2
			end
		end
	end
end

print(min)
