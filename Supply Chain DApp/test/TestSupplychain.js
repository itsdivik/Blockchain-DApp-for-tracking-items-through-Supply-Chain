var SupplyChain = artifacts.require('SupplyChain')
const truffleAssert = require('truffle-assertions')

contract('SupplyChain', function(accounts) {
    var sku = 1
    var upc = 1
    const ownerID = accounts[0]
    const originFarmerID = accounts[1]
    const originFarmName = "John Doe"
    const originFarmInformation = "Yarray Valley"
    const originFarmLatitude = "-38.239770"
    const originFarmLongitude = "144.341490"
    var productID = sku + upc
    const productNotes = "Best beans for Espresso"
    const productPrice = web3.utils.toWei("1", "ether")
    var itemState = 0
    const distributorID = accounts[2]
    const retailerID = accounts[3]
    const consumerID = accounts[4]
    const emptyAddress = '0x00000000000000000000000000000000000000'
    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("Farmer: accounts[1] ", accounts[1])
    console.log("Distributor: accounts[2] ", accounts[2])
    console.log("Retailer: accounts[3] ", accounts[3])
    console.log("Consumer: accounts[4] ", accounts[4])

    // 1st Test
    it("Testing smart contract function harvestItem() that allows a farmer to harvest coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        await supplyChain.addFarmer(originFarmerID)

        // Mark an item as Harvested by calling function harvestItem()
        let result = await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes, {from: originFarmerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        console.log(resultBufferOne);
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[2], productID, "Error: Invalid productID")
        assert.equal(resultBufferTwo[3], productNotes, "Error: Invalid productNotes")
        assert.equal(resultBufferTwo[5], itemState, 'Error: Invalid item State')
        truffleAssert.eventEmitted(result, 'Harvested');
    })    

    // 2nd Test
    it("Testing smart contract function processItem() that allows a farmer to process coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        itemState++;
        
        let result = await supplyChain.processItem(upc, {from: originFarmerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 1, 'Error: Invalid item State')
        truffleAssert.eventEmitted(result, 'Processed');
    })

    // 3rd Test
    it("Testing smart contract function packItem() that allows a farmer to pack coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        itemState++;

        let result = await supplyChain.packItem(upc, {from: originFarmerID})
        
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], itemState, 'Error: Invalid item State')
        truffleAssert.eventEmitted(result, 'Packed');
        
    })    

    // 4th Test
    it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        itemState++;

        let result = await supplyChain.sellItem(upc, productPrice, {from: originFarmerID})
        
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[4], productPrice, "Error: Invalid item Price")
        assert.equal(resultBufferTwo[5], itemState, 'Error: Invalid item State')
        truffleAssert.eventEmitted(result, 'ForSale');
    })    

    // 5th Test
    it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        itemState++;

        await supplyChain.addDistributor(distributorID)

        let result = await supplyChain.buyItem(upc, {from: distributorID, value: productPrice})
        
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], distributorID, "Error: Invalid owner.")
        assert.equal(resultBufferTwo[6], distributorID, "Error: Invalid distributor.")
        assert.equal(resultBufferTwo[5], itemState, 'Error: Invalid item State')
        truffleAssert.eventEmitted(result, 'Sold');
    })    

    // 6th Test
    it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        itemState++;

        let result = await supplyChain.shipItem(upc, {from: distributorID})
        
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], itemState, 'Error: Invalid item State')
        truffleAssert.eventEmitted(result, 'Shipped');
    })

    // 7th Test
    it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async() => {
        const supplyChain = await SupplyChain.deployed()

        itemState++;

        await supplyChain.addRetailer(retailerID)

        let result = await supplyChain.receiveItem(upc, {from: retailerID})
        
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], retailerID, "Error: Invalid owner.")
        assert.equal(resultBufferTwo[7], retailerID, "Error: Invalid retailer.")
        assert.equal(resultBufferTwo[5], itemState, 'Error: Invalid item State')
        truffleAssert.eventEmitted(result, 'Received');
    })    

    // 8th Test
    it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        itemState++;

        await supplyChain.addConsumer(consumerID)

        let result = await supplyChain.purchaseItem(upc, {from: consumerID})
        
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], consumerID, "Error: Invalid owner.")
        assert.equal(resultBufferTwo[8], consumerID, "Error: Invalid consumer.")
        assert.equal(resultBufferTwo[5], itemState, 'Error: Invalid item State')
        truffleAssert.eventEmitted(result, 'Purchased');
    })    

    // 9th Test
    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        
        // Verify the result set:
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
    })

    // 10th Test
    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        
        // Verify the result set:
        assert.equal(resultBufferTwo[0], sku, "Error: Invalid SKU")
        assert.equal(resultBufferTwo[1], upc, "Error: Invalid UPC")
        assert.equal(resultBufferTwo[2], productID, "Error: Invalid productID")
        assert.equal(resultBufferTwo[3], productNotes, "Error: Invalid productNotes")
        assert.equal(resultBufferTwo[4], productPrice, "Error: Invalid productPrice")
        assert.equal(resultBufferTwo[5], itemState, "Error: Invalid itemState")
        assert.equal(resultBufferTwo[6], distributorID, "Error: Invalid distributorID")
        assert.equal(resultBufferTwo[7], retailerID, "Error: Invalid retailerID")
        assert.equal(resultBufferTwo[8], consumerID, "Error: Invalid consumerID")
    })

});

