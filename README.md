# Charity-Donation-Dapp
Donation DApp
This decentralized donation application (dApp) allows users to donate ETH to a smart contract, 
securely record donations on the Ethereum blockchain, and display donation history in real-time on a user-friendly frontend.

# Features
Wallet Connection: Seamless MetaMask integration for wallet connection.
Make Donations: Easily donate ETH through the platform.
Blockchain Transparency: All transactions are recorded on the Ethereum blockchain for transparency.
Real-Time Updates: Displays donation history and total donations on the frontend.
Secure Withdrawals: Only the contract owner can withdraw funds.

# Tech Stack
Smart Contract
Solidity
OpenZeppelin library
# Frontend
React.js
ethers.js
# Tools
Truffle (for deployment and testing)
Ganache (for local Ethereum testing)
MetaMask (for wallet integration)
# Setup Instructions
Prerequisites
Node.js
MetaMask (browser extension)
Truffle (globally installed)
Ganache (For local testing)
Installation

# How to Use
Connect Your Wallet:

Open the application and click "Connect Wallet" to link your MetaMask account.
Make a Donation:

Enter the donation amount (in ETH) and click "Donate." Confirm the transaction in MetaMask.
View Donation History:

The donation history table displays all donations, including donor addresses, amounts, and timestamps.
Withdraw Funds (Owner Only):

The contract owner can withdraw all funds using the withdraw function in the smart contract.

# Testing
Run the Truffle tests:
bash
truffle test
Sample Test Scenarios:

# Donation Functionality: Verify ETH is deducted from the donor's wallet and recorded on the blockchain.
Withdrawal Functionality: Ensure only the owner can withdraw funds.
Donation History: Validate the accuracy of recorded donation details.
Smart Contract
The contract manages the donation process, ensuring transparency and security.

# Key Functions
donate(): Accepts ETH donations from users and records the donor details.
withdraw(): Allows the contract owner to withdraw funds.
getDonations(): Returns a list of all donations.
getTotalDonations(): Retrieves the total ETH donated.

# Contributions are welcome!
Fork the repository.
Create a new branch for your feature/bugfix.
Commit your changes and submit a pull request.

# Contact
For questions or feedback:

Email: adeyemijoshua360@gmail.com
X(Twitter): https://x.com/iam_Joshberry
