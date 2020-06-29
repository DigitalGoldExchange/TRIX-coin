const TRIX = artifacts.require("TRIX");

contract('TRANSFER TEST [TRIX]', async accounts => {

  const BigNumber = web3.BigNumber;

  require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

  const [host1, host2, host3, host4, host5,
    host6, host7, host8, host9, host10] = accounts;


  describe('1', () => {

    it("1-1", async () => {
      let trix = await TRIX.deployed();

      // host2에게 토큰 지급
      await trix.transfer(host2, 3000000, { from: host1 }).should.be.fulfilled;

      // host2 -> host3에게 토큰 전송 성공
      await trix.transfer(host3, 300, { from: host2 }).should.be.fulfilled;

      assert.equal(false, await trix.blackTransferAddrs(host2), 'host2 is one of blackTransferAddrs');
      assert.equal(true, await trix.isPermitted(host3), 'host3 is blacklisted');

      // host3는 현재 blacklist 안되었으므로 transfer 가능.
      await trix.transfer(host4, 100, { from: host3 }).should.be.fulfilled;

      // host2를 blackTransfer로 지정
      await trix.addBlackTransfer(host2, 1, { from: host1 }).should.be.fulfilled;

      // host2 -> host3로 토큰 전송되면서 host3는 blacklisted 됨.
      await trix.transfer(host3, 300, { from: host2 }).should.be.fulfilled;

      // host2는 blackTransfer
      assert.equal(true, await trix.blackTransferAddrs(host2), 'host2 is not one of blackTransferAddrs');
      // host3 는 blacklisted
      assert.equal(false, await trix.isPermitted(host3), 'host3 is not blacklisted');

      // host3 transfer 불가
      await trix.transfer(host4, 100, { from: host3 }).should.be.rejected;


      // 3개월 뒤 unblacklist
      await trix.unblacklist(host3, { from: host1 }).should.be.fulfilled;
      // host3 transfer 가능
      await trix.transfer(host4, 100, { from: host3 }).should.be.fulfilled;


      let isSuperOwner = await trix.superOwner();

      assert.equal(isSuperOwner, host1, "host1 is not SuperOwner");

      let isOwner = await trix.owners(host1);

      assert.equal(isOwner, true, 'host1 is not Owner');

    })
  })
});