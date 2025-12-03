const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

/**
 * Deploy FundMeUp V3 Contracts (ETHIndia Edition)
 * Deploys: SoulboundNFT + FundMeUpV3 + ImpactToken
 */

async function main() {
  console.log("\n🚀 FundMeUp V3 Deployment (ETHIndia Edition)\n");
  console.log("═".repeat(60));

  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deploying from:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());
  console.log("═".repeat(60) + "\n");

  // 1. Deploy Soulbound NFT
  console.log("1️⃣  Deploying SoulboundNFT...");
  const SoulboundNFT = await hre.ethers.getContractFactory("SoulboundNFT");
  const soulboundNFT = await SoulboundNFT.deploy();
  await soulboundNFT.deployed();
  console.log("✅ SoulboundNFT deployed to:", soulboundNFT.address);
  console.log("");

  // 2. Deploy FundMeUpV3 (which also deploys Impact Token)
  console.log("2️⃣  Deploying FundMeUpV3...");
  const FundMeUpV3 = await hre.ethers.getContractFactory("FundMeUpV3");
  const fundMeUpV3 = await FundMeUpV3.deploy();
  await fundMeUpV3.deployed();
  console.log("✅ FundMeUpV3 deployed to:", fundMeUpV3.address);
  console.log("");

  // 3. Get Impact Token address
  const impactTokenAddress = await fundMeUpV3.getImpactTokenAddress();
  console.log("3️⃣  ImpactToken address:", impactTokenAddress);
  console.log("");

  console.log("═".repeat(60));
  console.log("📊 DEPLOYMENT SUMMARY");
  console.log("═".repeat(60));
  console.log("SoulboundNFT:  ", soulboundNFT.address);
  console.log("FundMeUpV3:    ", fundMeUpV3.address);
  console.log("ImpactToken:   ", impactTokenAddress);
  console.log("═".repeat(60) + "\n");

  // 4. Save contract addresses and ABIs
  const deploymentData = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      SoulboundNFT: {
        address: soulboundNFT.address,
        abi: SoulboundNFT.interface.format('json')
      },
      FundMeUpV3: {
        address: fundMeUpV3.address,
        abi: FundMeUpV3.interface.format('json')
      },
      ImpactToken: {
        address: impactTokenAddress
      }
    }
  };

  // Save to utils/contractsV3.json
  const utilsDir = path.join(__dirname, '..', 'utils');
  const outputPath = path.join(utilsDir, 'contractsV3.json');
  
  fs.writeFileSync(outputPath, JSON.stringify(deploymentData, null, 2));
  console.log("💾 Contract data saved to:", outputPath);

  // Save ABIs separately for frontend
  const abiDir = path.join(__dirname, '..', 'abis');
  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(abiDir, 'SoulboundNFT.json'),
    JSON.stringify(JSON.parse(SoulboundNFT.interface.format('json')), null, 2)
  );

  fs.writeFileSync(
    path.join(abiDir, 'FundMeUpV3.json'),
    JSON.stringify(JSON.parse(FundMeUpV3.interface.format('json')), null, 2)
  );

  console.log("💾 ABIs saved to:", abiDir);
  console.log("");

  // Create .env update instructions
  console.log("═".repeat(60));
  console.log("📝 UPDATE YOUR .ENV FILE");
  console.log("═".repeat(60));
  console.log(`SOULBOUND_NFT_ADDRESS=${soulboundNFT.address}`);
  console.log(`FUNDMEUP_V3_ADDRESS=${fundMeUpV3.address}`);
  console.log(`IMPACT_TOKEN_ADDRESS=${impactTokenAddress}`);
  console.log("═".repeat(60) + "\n");

  console.log("🎉 Deployment Complete!\n");
  console.log("Next steps:");
  console.log("1. Update .env with contract addresses");
  console.log("2. Run: node backend/seed/seedDataV2.js");
  console.log("3. Start backend: npm run dev");
  console.log("4. Start frontend: cd fundmeup-frontend && npm run dev\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

