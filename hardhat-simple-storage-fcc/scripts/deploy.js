// imports
const { ethers, run, network } = require("hardhat")
require("dotenv").config()

// async main
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying Contract ...")
    const SimpleStorage = await SimpleStorageFactory.deploy()
    await SimpleStorage.deployed()
    console.log("Deployed Contract to:",SimpleStorage.address)
    // console.log(network.config)

    const currentValue = await SimpleStorage.retrieve()
    console.log(`Current Value is: ${currentValue}`)
    // Updating the current value
    const transactionResponse = await SimpleStorage.store(7)
    await transactionResponse.wait(1)
    const updatedValue = await SimpleStorage.retrieve()
    console.log(`Updated Value is: ${updatedValue}`)

    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block transactions...")
        await SimpleStorage.deployTransaction.wait(6)
        verify(SimpleStorage.address, [])
    }
}

async function verify(contractAddress, args) {
    console.log("Verifying Contract ...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
