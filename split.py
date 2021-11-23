import os
import math

BYTE_MAX = 10_000_000 # 10 MB
# BYTE_MAX = 1_000_000 # 1 MB

def get_iterations(bytes):
    return math.ceil(bytes / BYTE_MAX)

def split_files(path, bytes, root, name):
    file = open(path, "rb")
    iters = get_iterations(bytes)
    for i in range(iters):
        temp_bytes = file.read(BYTE_MAX)
        temp_filename = root + '/__' + hex(i) + '__JOIN__' + name
        temp_file = open(temp_filename, "wb")
        temp_file.write(temp_bytes)
        temp_file.close()
    file.close()
    os.remove(path)



for root, dirs, files in os.walk("Textures", topdown=False):
    for name in files:
        full_path = os.path.join(root, name)
        size = os.stat(full_path).st_size
        size_MB = size / 10E5
        # print(full_path)
        if size >= BYTE_MAX and not name.startswith('__'):
            print(full_path)
            print(round(size_MB, 3), 'MB')
            split_files(full_path, size, root, name)
    
