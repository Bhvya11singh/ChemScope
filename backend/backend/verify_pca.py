import json
import urllib.request

payload = json.dumps([{"a": 1, "b": 2}, {"a": 3, "b": 4}]).encode()
req = urllib.request.Request(
    "http://127.0.0.1:8000/pca",
    data=payload,
    headers={"Content-Type": "application/json"},
    method="POST",
)
with urllib.request.urlopen(req, timeout=10) as res:
    print(res.read().decode())
