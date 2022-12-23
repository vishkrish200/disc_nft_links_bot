import { BigNumber, ethers } from "ethers";
import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(
  "https://eth-mainnet.g.alchemy.com/v2/eeTRoWXmVY5EwhqanlW1tOhs6hXH6iYi"
);

export let contract_name;
export let cost;

export default async function fetchVars(caddress) {
  try {
    const abi = await fetch(
      `https://api.etherscan.io/api?module=contract&action=getabi&address=${caddress}&apikey=${process.env.ETHERSCAN_API_KEY}`
    );
    //   console.log(abi);
    const abi_json = await abi.json();

    const data = JSON.parse(abi_json.result);
    // console.log(data);

    const emptyInputs = data.filter(
      (item) =>
        item["inputs"]?.length == 0 &&
        item.stateMutability == "view" &&
        item.name != "contractURI" &&
        item.name != "owner" &&
        item.name != "baseURI" &&
        item["outputs"]?.length <= 1
    );
    // console.log(emptyInputs);
    const contract = new ethers.Contract(caddress, emptyInputs, provider);
    // console.log(contract);

    const array = [];
    for (const item of emptyInputs) {
      array.push(item.name && contract[item.name]());
    }

    const fetchedValues = await Promise.all(array);
    // console.log(fetchedValues);

    const outputs = fetchedValues.map((output, index) => ({
      name: emptyInputs[index].name,
      value: output,
    }));

    // console.log(
    //   "---------------------------------------------------------------"
    // );
    // console.log(outputs);
    outputs.map((output, index) => {
      // console.log(output);
      // if (output.name == "contractData") output.value = "problem";
      // console.log(output.value);
      if (
        // output.value > "100000" ||
        output.name == "cost" ||
        output.name == "price" ||
        output.name == "costCheck" ||
        (output.value?._isBigNumber && output.value?._hex > 0x186a0)
      ) {
        output.value =
          `${ethers.utils.formatEther(BigNumber.from(output.value))}` + "E";
        // console.log("Cost" + cost);
        // console.log("name" + contract_name);
      }
      if (output.name == "name") contract_name = output.value;
    });
    console.log("contract success");
    return outputs;
  } catch (error) {
    console.log("failed contract");
  }
}

// export default async function fetchVars(caddress) {
//   const abi = await fetch(
//     `https://api.etherscan.io/api?module=contract&action=getabi&address=${caddress}&apikey=${process.env.ETHERSCAN_API_KEY}`
//   );
//   //   console.log(abi);
//   const abi_json = await abi.json();

//   const data = JSON.parse(abi_json.result);
//   // console.log(data);

//   const emptyInputs = data.filter(
//     (item) =>
//       item["inputs"]?.length == 0 &&
//       item.stateMutability == "view" &&
//       item.name != "contractURI" &&
//       item.name != "owner" &&
//       item.name != "baseURI" &&
//       item["outputs"]?.length <= 1
//   );
//   console.log(emptyInputs);
//   const contract = new ethers.Contract(caddress, emptyInputs, provider);
//   // console.log(contract);

//   const array = [];
//   for (const item of emptyInputs) {
//     array.push(item.name && contract[item.name]());
//   }

//   const fetchedValues = await Promise.all(array);
//   // console.log(fetchedValues);

//   const outputs = fetchedValues.map((output, index) => ({
//     name: emptyInputs[index].name,
//     value: output,
//   }));

//   console.log(
//     "---------------------------------------------------------------"
//   );
//   console.log(outputs);
//   outputs.map((output, index) => {
//     // console.log(output);
//     // if (output.name == "contractData") output.value = "problem";
//     // console.log(output.value);
//     if (
//       output.value > "100000" ||
//       output.name == "cost" ||
//       output.name == "price" ||
//       output.name == "costCheck" ||
//       (output.value?._isBigNumber && output.value?._hex > 0x186a0)
//     ) {
//       output.value =
//         `${ethers.utils.formatEther(BigNumber.from(output.value))}` + "E";
//       // console.log("Cost" + cost);
//       // console.log("name" + contract_name);
//     }
//     if (output.name == "name") contract_name = output.value;
//   });
//   console.log("contract success");
//   return outputs;
// }
