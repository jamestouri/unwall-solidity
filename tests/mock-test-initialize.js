const { expect } = require('chai');
describe('Escrow', function () {
  let contract;
  let erc20;

  let happyPathAccount;
  let unhappyPathAccount;
  const amount = ethers.utils.parseUnits("10.0");
  before(async function () {
    /**
     * Deploy ERC20 token
     * */
    const ERC20Contract = await ethers.getContractFactory("MockDaiToken");
    erc20 = await ERC20Contract.deploy();
    await erc20.deployed()
    /**
     * Get test accounts
     * */
    const accounts = await hre.ethers.getSigners();
    deployer = accounts[0];
    happyPathAccount = accounts[1];
    unhappyPathAccount = accounts[2];
    /**
     * Transfer some ERC20s to happyPathAccount
     * */
    const transferTx = await erc20.transfer(happyPathAccount.address, "80000000000000000000");
    await transferTx.wait();
    /**
     * Deploy Escrow Contract
     *
     * - Add ERC20 address to the constructor
     * - Add escrow admin wallet address to the constructor
     * */
    const EscrowContract = await ethers.getContractFactory("Escrow");
    contract = await EscrowContract.deploy(erc20.address);
    await contract.deployed();
    /** 
     * Seed ERC20 allowance
     * */
    const erc20WithSigner = erc20.connect(happyPathAccount);
    const approveTx = await erc20WithSigner.approve(contract.address, "90000000000000000000");
    await approveTx.wait();
  });
})