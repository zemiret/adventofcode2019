def weight(x):
    return x // 3 - 2

with open('input') as infile:
    data = list(map(lambda x: int(x), infile.readlines()))
    res = 0

    while len(data) > 0:
        mod = data.pop()
        w = weight(mod)
        if w > 0:
            res += w
            data.append(w)

    print(res)

