import { ethers } from "hardhat";

async function main() {
  console.log("💰 Deploying Finance Oracle contract...");

  // Get the contract factory
  const FinanceOracle = await ethers.getContractFactory("FinanceOracle");

  console.log("📊 Deploying Finance Oracle contract...");
  console.log(`👤 Deploying from: ${(await ethers.getSigners())[0].address}`);

  // Deploy the contract with an oracle address (using deployer as oracle for demo)
  const oracleAddress = (await ethers.getSigners())[0].address;
  const financeOracle = await FinanceOracle.deploy(oracleAddress);

  await financeOracle.waitForDeployment();

  const address = await financeOracle.getAddress();
  console.log(`✅ Finance Oracle contract deployed to: ${address}`);
  console.log(`🔍 Oracle address: ${oracleAddress}`);

  // Save deployment info
  const deploymentInfo = {
    contractAddress: address,
    oracleAddress: oracleAddress,
    network: "hardhat",
    timestamp: new Date().toISOString(),
    deployer: (await ethers.getSigners())[0].address,
  };

  console.log("📄 Deployment Info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });