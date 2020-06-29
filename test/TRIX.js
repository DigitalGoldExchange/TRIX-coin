const TRIX = artifacts.require("TRIX");

contract('BASIC TEST [TRIX]', async accounts => {

    const BigNumber = web3.BigNumber;

    require('chai')
        .use(require('chai-as-promised'))
        .use(require('chai-bignumber')(BigNumber))
        .should();

    const [host1, host2, host3, host4, host5,
        host6, host7, host8, host9, host10] = accounts;


    /**
    * [owner/burner] test
    * 1. add [owner/burner] 施行
    * 2. [owners/burners] 确认
    * 3. chkOwnerList / chkBurnerList 确认
    * 4. delete [owner/burner] 施行
    * 5. [owners/burners] 确认
    * 6. chkOwnerList / chkBurnerList 确认
  */
    describe('1. [owner / burner] test [Auth : SuperOwner]', () => {

        it("1-1. [owner]", async () => {
            const trix = await TRIX.deployed();

            const superOwner = await trix.superOwner();

            assert.equal(superOwner, host1, "host1 is not SuperOwner");

            let isOwner = await trix.owners(host1);

            assert.equal(isOwner, true, 'host1 is not Owner');

            await trix.addOwner(host2, 0, { from: host1 }).should.be.rejected;

            await trix.addOwner(host2, 1, { from: host1 }).should.be.fulfilled;

            isOwner = await trix.owners(host2);

            assert.equal(isOwner, true, 'host2 is not Owner');

            const chkOwner0 = await trix.chkOwnerList(0);

            const chkOwner1 = await trix.chkOwnerList(1);

            assert.equal(chkOwner0, host1, "host1 is not defined first owner");

            assert.equal(chkOwner1, host2, "host2 is not defined second owner");

            await trix.deleteOwner(host2, 0, { from: host1 }).should.be.rejected;
            await trix.addOwner(host2, 0, { from: host1 }).should.be.rejected;
            await trix.addOwner(host2, 1, { from: host1 }).should.be.rejected;
            await trix.deleteOwner(host2, 1, { from: host1 }).should.be.fulfilled;
            await trix.addOwner(host2, 1, { from: host1 }).should.be.fulfilled;
        })

        it("1-2. [burner]", async () => {
            const trix = await TRIX.deployed();

            const superOwner = await trix.superOwner();

            assert.equal(superOwner, host1, "host1 is not SuperOwner");

            let isBurner = await trix.burners(host1);

            assert.equal(isBurner, false, 'host1 is Burner');

            await trix.addBurner(host1, 0, { from: host1 }).should.be.fulfilled;

            await trix.addBurner(host2, 1, { from: host1 }).should.be.fulfilled;

            isBurner = await trix.burners(host2);

            assert.equal(isBurner, true, 'host2 is not Burner');

            const chkBurner0 = await trix.chkBurnerList(0);

            const chkBurner1 = await trix.chkBurnerList(1);

            assert.equal(chkBurner0, host1, "host1 is not defined first burner");

            assert.equal(chkBurner1, host2, "host2 is not defined second burner");

            await trix.deleteBurner(host2, 0, { from: host1 }).should.be.rejected;
            await trix.addBurner(host2, 0, { from: host1 }).should.be.rejected;
            await trix.addBurner(host2, 1, { from: host1 }).should.be.rejected;
            await trix.deleteBurner(host2, 1, { from: host1 }).should.be.fulfilled;
            await trix.addBurner(host2, 1, { from: host1 }).should.be.fulfilled;
        })
    })
    /**
     * [approve / allowance ] test
     * 1. approve 施行
     * 2. allowance 施行
     * 3. transferFrom 施行
     */

    describe('2. [approve / allowance] test', () => {

        it("2-1. [approve/allowance]", async () => {
            const trix = await TRIX.deployed();

            const amt1 = 1000000;

            await trix.approve(host2, amt1, { from: host1 });

            let getAllowance = await trix.allowance(host1, host2);

            getAllowance = getAllowance.toNumber();

            assert.equal(amt1, getAllowance);

            await trix.transferFrom(host1, host3, amt1, { from: host2 }).should.be.fulfilled;

            let hostBalance = await trix.balanceOf(host3);

            hostBalance = hostBalance.toNumber();

            assert.equal(hostBalance, amt1, 'transferFrom is failed');

        })
    })

    /**
     * changeHiddenOwner / changeSuperOwner test
     * 1. change[Hidden/Super]Owner 施行
     * 2. hiddenOwner/superOwner 确认 
     */
    describe('3. [changeHiddenOwner / changeSuperOwner] test [Auth : HiddenOwner]', () => {

        it("3-1. [changeHiddenOwner]", async () => {
            const trix = await TRIX.deployed();
            let hiddenOwner = await trix.hiddenOwner();

            assert.equal(hiddenOwner, host1, "host1 is not hiddenOwner");

            await trix.changeHiddenOwnership(host2);
            hiddenOwner = await trix.hiddenOwner();

            assert.equal(hiddenOwner, host2, "host2 is not hiddenOwner");
            await trix.changeHiddenOwnership(host1, { from: host2 });
        })

        it("3-2 [changeSuperOwner]", async () => {
            const trix = await TRIX.deployed();
            let superOwner = await trix.superOwner();

            assert.equal(superOwner, host1, "host1 is not superOwner");

            await trix.changeSuperOwnership(host2, { from: host1 });
            superOwner = await trix.superOwner();

            assert.equal(superOwner, host2, "host2 is not superOwner");
            await trix.changeSuperOwnership(host1, { from: host1 });
        })
    })

    /**
     * [pause / unpause] test
     * 1. pause 施行
     * 2. paused 确认
     * 3. unpause 施行 
     */
    describe('6. [pause / unpause] test [Auth : superOwner]', () => {

        it('6-2 [pause]', async () => {
            const amt1 = 1000000;
            const trix = await TRIX.deployed();
            const paused = await trix.paused()

            assert.equal(paused, false, "paused is true");

            await trix.transfer(host2, amt1, { from: host1 }).should.be.fulfilled;
            await trix.pause({ from: host1 });
            await trix.deleteOwner(host1, 0, { from: host1 });
            await trix.transfer(host2, amt1, { from: host1 }).should.be.rejected;
            await trix.addOwner(host1, 0, { from: host1 });
        })

        it('6-3 [unpause]', async () => {
            const trix = await TRIX.deployed();
            const amt1 = 1000000;
            const paused = await trix.paused();

            assert.equal(paused, true, "paused is false");

            await trix.unpause({ from: host1 });
            await trix.transfer(host2, amt1, { from: host1 }).should.be.fulfilled;
        })
    })
    /**
      * [blacklist / unblacklist] test 
      * 1. blacklist 施行
      * 2. isPermitted 确认
      * 3. unblacklist 施行
      * 4. isPermitted 确认
    */
    describe('10. [blacklist(Auth:owner) / unblacklist(Auth:superOwner)] test', () => {

        it('10-1 [auth & blacklist check]', async () => {
            const trix = await TRIX.deployed();
            const superOwner = await trix.superOwner();
            const isOwner = await trix.owners(host2);

            assert.equal(superOwner, host1, 'host1 is not superOwner');
            assert.equal(isOwner, true, 'host2 is not owner');

            let isPermitted = await trix.isPermitted(host3);

            assert.equal(isPermitted, true, 'host3 is not blacklisted')

            await trix.blacklist(host3, { from: host2 }).should.be.fulfilled;

            isPermitted = await trix.isPermitted(host3);
            assert.equal(isPermitted, false, 'host3 is blacklisted')
        })

        it('10-2 [unblacklist check]', async () => {
            const trix = await TRIX.deployed();
            await trix.unblacklist(host3, { from: host2 }).should.be.rejected;

            let isPermitted = await trix.isPermitted(host3);
            assert.equal(isPermitted, false, 'host3 is blacklsited')

            await trix.unblacklist(host3, { from: host1 }).should.be.fulfilled;

            isPermitted = await trix.isPermitted(host3);
            assert.equal(isPermitted, true, 'host3 is not blacklsited');
        })
    })

    /**
    * [basic getter function test]
    * 1. decimals 确认
    * 2. INITIAL_SUPPLY 确认
    * 3. name 确认
    * 4. symbol 确认
   */
    describe('14. [basic getter function] test ', async () => {
        it('14-1. basic getter', async () => {
            const trix = await TRIX.deployed();
            const decimal = await trix.decimals();
            assert.equal(decimal, 18, 'decimal check');

            let INITIAL_SUPPLY = await trix.INITIAL_SUPPLY();
            INITIAL_SUPPLY = INITIAL_SUPPLY.toString();
            // 100억개
            assert.equal(INITIAL_SUPPLY, '10000000000000000000000000000', 'initialBal check');

            const name = await trix.name();
            assert.equal(name, 'TriumphX', 'name check');

            const symbol = await trix.symbol();
            assert.equal(symbol, 'TRIX', 'symbol check');
        })
    })
});