it('Happy Path: withdrawalEscrow', async function () {
  const contractWithSigner = contract.connect(happyPathAccount);
  const trxHash = await contract.getHash(amount);
  const submitEscrowTx = await contractWithSigner.submitEscrow(trxHash, amount);
  await submitEscrowTx.wait();
  expect((await erc20.balanceOf(happyPathAccount.address)).toString()).to.equal(
    '50000000000000000000'
  );
  const withdrawalEscrowTx = await contractWithSigner.withdrawalEscrow(trxHash);
  await withdrawalEscrowTx.wait();
  expect((await erc20.balanceOf(happyPathAccount.address)).toString()).to.equal(
    '60000000000000000000'
  );
});

it('Unhappy Path: withdrawalEscrow - Transaction hash cannot be empty!', async function () {
  const contractWithSigner = contract.connect(unhappyPathAccount);
  let err = '';
  try {
    await contractWithSigner.withdrawalEscrow(ethers.constants.HashZero);
  } catch (e) {
    err = e.message;
  }
  expect(err).to.equal(
    "VM Exception while processing transaction: reverted with reason string 'Transaction hash cannot be empty!'"
  );
});

it("Unhappy Path: withdrawalEscrow - Escrow with transaction hash doesn't exist.", async function () {
  const contractWithSigner = contract.connect(happyPathAccount);
  const trxHash = await contract.getHash(ethers.utils.parseUnits('1.0'));
  let err = '';
  try {
    await contractWithSigner.withdrawalEscrow(trxHash);
  } catch (e) {
    err = e.message;
  }
  expect(err).to.equal(
    "VM Exception while processing transaction: reverted with reason string 'Escrow with transaction hash doesn't exist.'"
  );
});
