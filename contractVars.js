import { ethers } from "ethers";
import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(
  "https://eth-mainnet.g.alchemy.com/v2/eeTRoWXmVY5EwhqanlW1tOhs6hXH6iYi"
);

export default async function fetchVars(caddress) {
  const abi = await fetch(
    `https://api.etherscan.io/api?module=contract&action=getabi&address=${caddress}&apikey=${process.env.ETHERSCAN_API_KEY}`
  );
  //   console.log(abi);
  const abi_json = await abi.json();

  const data = JSON.parse(abi_json.result);
  // console.log(data);

  const emptyInputs = data.filter(
    (item) => item["inputs"]?.length === 0 && item.stateMutability === "view"
  );

  const contract = new ethers.Contract(caddress, emptyInputs, provider);

  const array = [];
  for (const item of emptyInputs) {
    array.push(item.name && contract[item.name]());
  }

  const fetchedValues = await Promise.all(array);

  const outputs = fetchedValues.map((output, index) => ({
    name: emptyInputs[index].name,
    value: output,
  }));

  outputs.map((output) => {
    if (
      output.name == "cost" ||
      output.name == "price" ||
      output.name == "costCheck"
    )
      output.value = ethers.utils.formatEther(parseInt(output.value)) + "E";
  });
  return outputs;
}
