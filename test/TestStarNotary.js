const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async () => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, { from: accounts[0] })
    assert.equal((await instance.tokenIdToStarInfo.call(tokenId)).name, 'Awesome Star!')
});

it('lets user1 put up their star for sale', async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, { from: user2, value: balance });
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, { from: user2, value: balance });
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, { from: user2, value: balance, gasPrice: 0 });
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async () => {
    // 1. create a Star with different tokenId

    let instance = await StarNotary.deployed();

    let user1 = accounts[1];
    let starId = 6;

    await instance.createStar("the new start", starId, { from: user1 });
    //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided

    assert.equal(await instance.symbol(), "SNF");
    assert.equal(await instance.name(), "StartNotaryFinal");
});

it('lookUptokenIdToStarInfo test', async () => {
    // 1. create a Star with different tokenId
    let instance = await StarNotary.deployed();

    let user1 = accounts[1];
    let starName = 'Star for lookup';
    let starId = 7;

    await instance.createStar(starName, starId, { from: user1 });
    // 2. Call your method lookUptokenIdToStarInfo
    let foundedStarName = await instance.lookUptokenIdToStarInfo(starId);
    // 3. Verify if you Star name is the same
    assert.equal(foundedStarName, starName);
    // 4. Verify that nothing has been founded
    let notFounded = await instance.lookUptokenIdToStarInfo(777);
    assert.isNotOk(notFounded, 'No stars founded by token id');

});

it('lets 2 users exchange stars', async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    // 1. create 2 Stars with different tokenId
    let starOneId = 8;
    await instance.createStar("1", starOneId, { from: user1 });
    let starTwoId = 9;
    await instance.createStar("2", starTwoId, { from: user2 });
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    await instance.exchangeStars(starOneId, starTwoId, { from: user2 });
    // 3. Verify that the owners changed
    assert.equal(await instance.ownerOf(starTwoId), user1);
    assert.equal(await instance.ownerOf(starOneId), user2);
});

it("exchange should fail. One of the stars doen't exist", async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    // 1. create 2 Stars with different tokenId
    let starOneId = 10;
    await instance.createStar("1", starOneId, { from: user1 });
    let starTwoId = 11;
    //second star didnt exist
    instance.exchangeStars(starOneId, starTwoId, { from: user1 })
        .then(() => {
            console.log(e)
            assert.ok(false, "It didn't fail");
        })
        .catch(() => { assert.ok(true, "Passed"); });

    //first star didnt exist
    instance.exchangeStars(starOneId, starTwoId, { from: user1 })
        .then(() => { assert.ok(false, "It didn't fail"); })
        .catch(() => { assert.ok(true, "Passed"); });
});
it("exchange should fail. Try to exchange the same star", () => {
    StarNotary.deployed().then(instance => {
        let user1 = accounts[1];
        // 1. create 2 Stars with different tokenId
        let starOneId = 11;
        instance.createStar("1", starOneId, { from: user1 }).then(() => {
            //second star didnt exist
            instance.exchangeStars(starOneId, starOneId, { from: user1 })
                .then(() => { assert.ok(false, "It didn't fail"); })
                .catch(() => { assert.ok(true, "Passed"); });
        });
    });
});


it('exchange should fail. Both stars are owned by one use', async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    // 1. create 2 Stars with different tokenId
    let starOneId = 12;
    await instance.createStar("1", starOneId, { from: user1 });
    let starTwoId = 13;
    await instance.createStar("2", starTwoId, { from: user1 });
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    instance.exchangeStars(starOneId, starTwoId, { from: user1 })
        .then(() => { assert.ok(false, "It didn't fail"); })
        .catch(() => { assert.ok(true, "Passed"); });

});
it('exchange should fail. Exchange fired by stranger', async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let user3 = accounts[3];
    // 1. create 2 Stars with different tokenId
    let starOneId = 14;
    await instance.createStar("1", starOneId, { from: user1 });
    let starTwoId = 15;
    await instance.createStar("2", starTwoId, { from: user2 });
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    instance.exchangeStars(starOneId, starTwoId, { from: user3 })
        .then(() => { assert.ok(false, "It didn't fail"); })
        .catch(() => { assert.ok(true, "Passed"); });

    assert.equal(await instance.ownerOf(starOneId), user1);
    assert.equal(await instance.ownerOf(starTwoId), user2);
});

it('exchange should success. Exchange fired by approved account', async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let user3 = accounts[3];
    // 1. create 2 Stars with different tokenId
    let starOneId = 16;
    await instance.createStar("1", starOneId, { from: user1 });
    await instance.approve(user3, starOneId, { from: user1 })
    let starTwoId = 17;
    await instance.createStar("2", starTwoId, { from: user2 });
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    await instance.exchangeStars(starOneId, starTwoId, { from: user3 });

    assert.equal(await instance.ownerOf(starTwoId), user1);
    assert.equal(await instance.ownerOf(starOneId), user2);
});
it('lets a user transfer a star', async () => {
    // 1. create a Star with different tokenId
    // 2. use the transferStar function implemented in the Smart Contract
    // 3. Verify the star owner changed.
    assert.fail("not implemented yet");
});

