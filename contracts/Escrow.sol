//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Escrow {
    IERC20 public _token;

    constructor(address ERC20Address) {
        _token = IERC20(ERC20Address);
    }

    uint256 deposit_count;
    mapping(bytes32 => uint256) balances;

    function depositEscrow(bytes32 txn_hash, uint256 amount) external {
        // Transaction hash cannot be empty
        require(txn_hash[0] != 0, "Transaction has cannot be empty!");
        // Escrow amount cannot be equal to 0
        require(amount != 0, "Escrow amount cannot be equal to 0.");
        // Transaction hash is already in use
        require(
            balances[txn_hash] == 0,
            "Unique hash conflict, hash is already in use."
        );
        // Transfer ERC20 token from sender to this contract
        require(
            _token.transferFrom(msg.sender, address(this), amount),
            "Transfer to escrow failed!"
        );
        balances[txn_hash] = amount;
        deposit_count++;
    }

    function getHash(uint256 amount) public view returns (bytes32 result) {
        return keccak256(abi.encodePacked(msg.sender, deposit_count, amount));
    }

    function withdrawalEscrow(bytes32 txn_hash) external {
        // Transaction hash cannot be empty
        require(txn_hash[0] != 0, "Transaction hash cannot be empty!");
        // Check if txn_hash exists in balances
        require(
            balances[txn_hash] != 0,
            "Escrow with transaction hash doesn't exist."
        );
        // Transfer escrow to sender
        require(
            _token.transfer(msg.sender, balances[txn_hash]),
            "Escrow retrieval failed!"
        );
        // If all is done, status is amounted to 0
        balances[txn_hash] = 0;
    }
}
