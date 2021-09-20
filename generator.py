import hashlib
import subprocess
import os

PROBLEM_POS_DOMAIN = [5, 14, 23, 32, 41, 50, 59, 68, 77, 86, 95, 104, 113, 122, 131, 140, 149, 158, 167, 176]

directory = "muse"
prefix = "M"
startIdx = 1
endIdx = 120

# Generate directories
for i in range(0, 7):
    try:
        os.mkdir(f"./level0{i}")
    except:
        pass

def getDuration(lvl):
    if lvl == 1: return 3
    if lvl == 2: return 2
    if lvl == 3: return 1.5
    if lvl == 4: return 1
    if lvl == 5: return 0.75
    if lvl == 6: return 0.5
    return None

for songIdx in range(startIdx, endIdx):
    songStr = f"0000{songIdx}"[-4:]
    songName = f"{prefix}{songStr}"
    for lvl in range(1, 7):
        print('Processing song', songName, "level", lvl)
        for problemPos in PROBLEM_POS_DOMAIN:
            assetName = hashlib.sha256(
                f"{songName}-{problemPos}-{lvl}".encode()
            ).hexdigest()
            subprocess.run([
              "ffmpeg",
              "-i", f"./{directory}/{songName}.mp3",
              "-ss", f"{problemPos}",
              "-t", f"{getDuration(lvl)}",
              "-c", "copy",
              "-map_metadata", "-1",
              "-hide_banner", "-loglevel", "panic",
              f"./level0{lvl}/{assetName}.mp3",
            ])
    print('Processing song', songName, 'level', 0)
    assetName = hashlib.sha256(
        f"{songName}-{30}-{0}".encode()
    ).hexdigest()
    subprocess.run([
        "ffmpeg",
        "-i", f"./{directory}/{songName}.mp3",
        "-ss", f"{30}",
        "-t", f"{10}",
        "-c", "copy",
        "-map_metadata", "-1",
        "-hide_banner", "-loglevel", "panic",
        f"./level0{0}/{assetName}.mp3",
    ])

