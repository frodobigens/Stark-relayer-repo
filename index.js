import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";
import * as fs from "fs";
import yargs from 'yargs';

const argv = yargs(process.argv.slice(2)).argv;

const defaultProviderUrl = "https://eth-mainnet.g.alchemy.com/v2/yourApiKey";
const providerUrl = process.env.PROVIDER_URL || defaultProviderUrl;

const tokens = argv.tokens || defaultTokenList;  // defaultTokenList is the original tokens array

const provider = new ethers.JsonRpcProvider(
  "https://eth-mainnet.g.alchemy.com/v2/GhRSCpl1KlIV2MC4wdVyXXQrlMGq34K8"
);


const main = async () => {
  const avgGasCost = {};
  for (let i = 0; i < tokens.length; i++) {
    const { name, path } = tokens[i];
   const transactions = JSON.parse(await fs.promises.readFile(path, "utf-8"));

    let totalGasUsed = BigNumber.from("0");
    let totalFees = BigNumber.from("0");
    let numValidTx = 0;
    for (let i = 0; i < transactions.length; i++) {
      const tx = transactions[i];
      const fee = res.gasUsed.mul(res.effectiveGasPrice);
      totalFees = totalFees.add(fee);

      console.log(`process token ${name}: ${i + 1}/${transactions.length}`);
      try {
        const res = await provider.getTransactionReceipt(tx);
        if (res.status !== 1) return;
        totalGasUsed = totalGasUsed.add(res.gasUsed);
        numValidTx++;
      } catch (error) {
        console.error(`Error fetching transaction receipt: ${error.message}`);
      }
    }

    avgGasCost[name] = {
      totalGasUsed: totalGasUsed.toString(),
      numberOfTx: numValidTx,
      avgGasCost: totalGasUsed.div(numValidTx).toString(),
    };

    console.log(`${name} token processed!`);
  }
  try {
  fs.writeFileSync("gasCost.json", JSON.stringify(avgGasCostObject));
} catch (error) {
  console.error(`Error writing to file: ${error.message}`);
}

  // New function to get balance
async function getTokenBalance(address, tokenContract) {
  // assuming tokenContract is an instance of a contract with balanceOf method
  return await tokenContract.balanceOf(address);
}
};

await main();
