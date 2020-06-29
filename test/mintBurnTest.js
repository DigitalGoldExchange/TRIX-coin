const TRIX = artifacts.require("TRIX");

contract('MINT&BURN TEST[TRIX]', async accounts => {

    const BigNumber = web3.BigNumber;

    require('chai')
        .use(require('chai-as-promised'))
        .use(require('chai-bignumber')(BigNumber))
        .should();


    const [host1, host2, host3, host4, host5,
        host6, host7, host8, host9, host10] = accounts;

    describe('1. burn', () => {
        it("1. burn test", async () => {

            let trix = await TRIX.deployed();
            let amt1 = 10000000;
            let totalSupply = await trix.totalSupply();

            totalSupply = totalSupply.toString()

            assert.equal(totalSupply, '10000000000000000000000000000', 'initialBalance1 check');

            //added burner host2 from host1
            await trix.addBurner(host2, 0, { from: host1 }).should.be.fulfilled;

            await trix.addBurnlist(host1, { from: host1 }).should.be.fulfilled;
            await trix.addBurnlist(host1, { from: host2 }).should.be.rejected;

            await trix.burn(host1, amt1, { from: host1 }).should.be.rejected;
            await trix.burn(host1, amt1, { from: host2 }).should.be.fulfilled;

            totalSupply = await trix.totalSupply();
            totalSupply = totalSupply.toString();
            assert.equal(totalSupply, '9999999999999999999990000000', 'initialBalance2 check');
        })
    })
    describe('1. mint', () => {
        it("1. mint test", async () => {

            let trix = await TRIX.deployed();
            let amt1 = 10000000;
            let totalSupply = await trix.totalSupply();

            totalSupply = totalSupply.toString()

            assert.equal(totalSupply, '9999999999999999999990000000', 'initialBalance1 check');

            await trix.mint(amt1, { from: host2 }).should.be.rejected;

            await trix.mint(amt1, { from: host1 }).should.be.fulfilled;


            totalSupply = await trix.totalSupply();
            totalSupply = totalSupply.toString();
            assert.equal(totalSupply, '10000000000000000000000000000', 'initialBalance2 check');

            await trix.mint(amt1, { from: host1 }).should.be.rejected;

        })
    })
})