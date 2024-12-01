// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DonationContract is Ownable {
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }

    Donation[] public donations;
    mapping(address => uint256) public balances;
    uint256 public totalDonations;

    event DonationReceived(address indexed donor, uint256 amount);
    event FundsWithdrawn(address indexed charity, uint256 amount);

    constructor() Ownable(msg.sender) {
        totalDonations = 0;
    }

    function donate() external payable {
        require(msg.value > 0, "Donation must be greater than 0");

        donations.push(
            Donation({
                donor: msg.sender,
                amount: msg.value,
                timestamp: block.timestamp
            })
        );

        balances[msg.sender] += msg.value;
        totalDonations += msg.value;

        emit DonationReceived(msg.sender, msg.value);
    }

    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "No funds available");

        payable(owner()).transfer(amount);
        emit FundsWithdrawn(owner(), amount);
    }

    function getDonations() external view returns (Donation[] memory) {
        return donations;
    }

    function getDonorBalance(address donor) external view returns (uint256) {
        return balances[donor];
    }

    function getTotalDonations() external view returns (uint256) {
        return totalDonations;
    }
}
