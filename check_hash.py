import hashlib
import boto3

TEST_TARGETS = ['M0001']
PROBLEM_POS_DOMAIN = [5, 14, 23, 32, 41, 50, 59, 68, 77, 86, 95, 104, 113, 122, 131, 140, 149, 158, 167, 176]

BUCKET = 'rinachan-box'
KEY_FORMAT = 'music-quiz/audio/level{level}/{assetName}.mp3'

client = boto3.client('s3')
# To check if s3 head object correctly works, check head for existing object
client.head_object(
  Bucket=BUCKET,
  Key=KEY_FORMAT.format(level='00', assetName='008f603768c6234450d17086d2f9a9bb5def4b1d677fb11dcc445702ac179a7c')
)

def check_existence(bucket, key):
  try:
    client.head_object(
      Bucket=bucket,
      Key=key,
    )
    return True
  except Exception as e:
    return False

for songId in TEST_TARGETS:
  print(f"Checking {songId}...")
  # Level 0
  assetName = hashlib.sha256(
    f"{songId}-{30}-{0}".encode()
  ).hexdigest()
  key = KEY_FORMAT.format(level='00', assetName=assetName)
  if check_existence(BUCKET, key):
    print(f"Key {key} already exists!!")

  for lvl in range(1, 7):
    for problemPos in PROBLEM_POS_DOMAIN:
      assetName = hashlib.sha256(
        f"{songId}-{problemPos}-{lvl}".encode()
      ).hexdigest()
      key = KEY_FORMAT.format(level=f'0{lvl}', assetName=assetName)
      if check_existence(BUCKET, key):
        print(f"Key {key} already exists!!")
