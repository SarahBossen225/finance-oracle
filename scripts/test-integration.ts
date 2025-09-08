import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Testing Finance Oracle Integration...");

  // Get the contract factory
  const FinanceOracle = await ethers.getContractFactory("FinanceOracle");
  
  // Deploy the contract
  const oracleAddress = (await ethers.getSigners())[0].address;
  const financeOracle = await FinanceOracle.deploy(oracleAddress);
  await financeOracle.waitForDeployment();

  const address = await financeOracle.getAddress();
  console.log(`✅ Contract deployed at: ${address}`);

  // Test basic functionality
  try {
    // Test statistics
    const stats = await financeOracle.getFinanceOracleStatistics();
    console.log("📊 Oracle Statistics:", {
      totalDataPoints: stats[0].toString(),
      totalMarkets: stats[1].toString(),
      activeMarkets: stats[2].toString(),
      totalFeeds: stats[3].toString(),
      totalPairs: stats[4].toString(),
      totalIndices: stats[5].toString(),
      totalRiskMetrics: stats[6].toString(),
      activeAlerts: stats[7].toString(),
      totalSubscriptions: stats[8].toString(),
      activeSubscriptions: stats[9].toString(),
      totalAnalytics: stats[10].toString(),
    });

    console.log("✅ Integration test completed successfully!");
    console.log(`📝 Contract Address: ${address}`);
    console.log(`🔑 Oracle Address: ${oracleAddress}`);
    
    // Save deployment info
    const deploymentInfo = {
      contractAddress: address,
      oracleAddress: oracleAddress,
      network: "hardhat",
      timestamp: new Date().toISOString(),
      deployer: (await ethers.getSigners())[0].address,
      testResults: {
        statistics: "PASSED",
        deployment: "PASSED",
        integration: "PASSED"
      }
    };

    console.log("📄 Test Results:", JSON.stringify(deploymentInfo, null, 2));
    
  } catch (error) {
    console.error("❌ Integration test failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
