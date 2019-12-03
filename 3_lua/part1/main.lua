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

        for i=1,amount do
			x = x + dx
			y = y + dy

			local p = {}
			p[0] = x
			p[1] = y

			table.insert(ret, p)
        end
	end

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

for _, cord in pairs(w1) do
	x, y = cord[0], cord[1]
	if map1[x] == nil then
		map1[x] = {}
	end

	table.insert(map1[x], y)
end

inters = {}

for _, cord in pairs(w2) do
	x, y = cord[0], cord[1]
	if map1[x] ~= nil then
		for _, w1y in pairs(map1[x]) do
			if y == w1y then
				pair = {}
				pair[0] = x
				pair[1] = y
				table.insert(inters, pair)
			end
		end
	end
end

local min = math.huge
local respoint = {}


for _, inter in pairs(inters) do
	x, y = inter[0], inter[1]
	dist = math.abs(x) + math.abs(y)

	if dist < min then
		min = dist
		respoint[0] = x
		respoint[1] = y
	end
end

print(respoint)
print(min)

