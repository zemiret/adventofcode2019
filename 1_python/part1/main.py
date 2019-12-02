with open('input') as infile:
    print(sum(map(lambda x: (x//3) - 2, map(lambda x: int(x), infile.readlines()))))

