const { ethers } = require("ethers");
const provider = new ethers.JsonRpcProvider("https://coston2-api.flare.network/ext/C/rpc", { chainId: 114, name: "coston2" });
const REGISTRY = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";
const REGISTRY_ABI = ["function getContractAddressByName(string) view returns (address)"];
const ASSET_MGR_ABI = ["function fAsset() view returns (address)"];

async function main() {
  const reg = new ethers.Contract(REGISTRY, REGISTRY_ABI, provider);
  const keys = ["AssetManagerFXRP", "AssetManagerFBTC", "AssetManagerFDOGE"];
  for (const key of keys) {
    try {
      const mgrAddr = await reg.getContractAddressByName(key);
      console.log(key, "manager:", mgrAddr);
      if (mgrAddr && mgrAddr !== "0x0000000000000000000000000000000000000000") {
        const mgr = new ethers.Contract(mgrAddr, ASSET_MGR_ABI, provider);
        const tokenAddr = await mgr.fAsset();
        console.log(key, "token:", tokenAddr);
      }
    } catch(e) { console.log(key, "ERR:" + e.message.slice(0,120)); }
  }
}
main().catch(console.error);
