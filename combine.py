import os
import math

BYTE_MAX = 10_000_000 # 10 MB


filenames = []
set_filenames = set()
buckets = []


for root, dirs, files in os.walk("Textures", topdown=False):
    for name in files:
        full_path = os.path.join(root, name)
        # print(full_path)
        if full_path.count('__JOIN__') > 0:
            # print(name)
            filenames.append(full_path)
            set_filenames.add(full_path.split('__JOIN__')[1])

# for file in filenames:
#     print(file)
print(len(set_filenames), 'files to be reconstructed.')
for file in set_filenames:
    print('- ', file)
print()

count = 0
for file in set_filenames:
    buckets.append(list())
    for f in filenames:
        if file in f:
            buckets[count].append(f)
    count += 1

for bin in buckets: 
    bin.sort()

def find_bin_num(file):
    counter = -1
    for bin_list in buckets:
        counter += 1
        if bin_list[0].count(file) > 0:
            return counter

def stitch_bin(bin, f):
    print('Stitching', f)
    counter = 0
    for file in bin:
        split_str = bin[counter].split('__')
        dir = split_str[0]
        num = int(split_str[1], base=16)
        name = split_str[3]
        opened = open(dir + name, 'ab')
        reading = open(file, 'rb')
        opened.write(reading.read())
        opened.close()
        reading.close()
        counter += 1
    print()

for file in set_filenames:
    bin_num = find_bin_num(file)
    bin = buckets[bin_num]
    stitch_bin(bin, file)

for file in filenames:
    os.remove(file)