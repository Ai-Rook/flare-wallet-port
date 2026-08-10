import json

with open("app.json", "r") as f:
    d = json.load(f)

d["expo"]["name"] = "Flare Wallet"
d["expo"]["slug"] = "flare-wallet"

with open("app.json", "w") as f:
    json.dump(d, f, indent=2)

print("FIXED")
