it("Happy Path: depositEscrow", async function () {
    const contractWithSigner = contract.connect(happyPathAccount);
    const trxHash = await contract.getHash(amount);
    const depositEscrowTx = await contractWithSigner.depositEscrow(trxHash, amount);
   await depositEscrowTx.wait();
    expect(
      (await erc20.balanceOf(happyPathAccount.address)).toString()
    ).to.equal("70000000000000000000");
  });

it('Unhappy Path: depositEscrow - Transaction hash cannot be empty!', async function () {
  const contractWithSigner = contract.connect(unhappyPathAccount);
  let err = '';
  try {
    await contractWithSigner.depositEscrow(ethers.constants.HashZero, amount);
  } catch (e) {
    err = e.message;
  }
  expect(err).to.equal(
    "VM Exception while processing transaction: reverted with reason string 'Transaction hash cannot be empty!'"
  );
});

it("Unhappy Path: depositEscrow - Escrow amount cannot be equal to 0.", async function () {
    const contractWithSigner = contract.connect(unhappyPathAccount);
    const trxHash = await contract.getHash(amount);
    let err = "";
    try {
        await contractWithSigner.depositEscrow(trxHash, ethers.utils.parseUnits("0"))
    }
    catch(e) {
        err = e.message;
    }
    expect(err).to.equal("VM Exception while processing transaction: reverted with reason string 'Escrow amount cannot be equal to 0.'");
});

it("Unhappy Path: depositEscrow - Unique hash conflict, hash is already in use.", async function () {
    const contractWithSigner = contract.connect(happyPathAccount);
    const trxHash = await contract.getHash(amount);
    const depositEscrowTx = await contractWithSigner.depositEscrow(trxHash, amount);
    await depositEscrowTx.wait();
    expect(
        (await erc20.balanceOf(happyPathAccount.address)).toString()
    ).to.equal("60000000000000000000");
    let err = "";
    try {
        await contractWithSigner.depositEscrow(trxHash, amount)
    }
    catch(e) {
        err = e.message;
    }
    expect(err).to.equal("VM Exception while processing transaction: reverted with reason string 'Unique hash conflict, the hash is already in use.'");
});

it("Unhappy Path: depositEscrow - ERC20: insufficient allowance", async function () {
    const contractWithSigner = contract.connect(unhappyPathAccount);
    const trxHash = await contract.getHash(amount);
    let err = "";
    try {
        await contractWithSigner.depositEscrow(trxHash, amount)
    }
    catch(e) {
        err = e.message;
    }
    expect(err).to.equal("VM Exception while processing transaction: reverted with reason string 'ERC20: insufficient allowance'");
});