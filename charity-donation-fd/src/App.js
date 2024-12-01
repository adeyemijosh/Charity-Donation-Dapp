import React, { useEffect, useState } from 'react';
import './App.css';
import { ethers, utils } from 'ethers';
import DonationPage from './DonationPage';
import DonationContractABI from './DonationContractABI.json';

const contractAddress = '0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8';

const App = () => {
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [donations, setDonations] = useState([]);
  const [transactionStatus, setTransactionStatus] = useState('');
  const [totalDonations, setTotalDonations] = useState(0);

  useEffect(() => {
    const loadProvider = async () => {
      if (!window.ethereum) {
        alert("Please install MetaMask to use this feature.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }

      await loadDonations(provider);
      await loadTotalDonations(provider);
    };

    loadProvider();

    // Event listener for account changes in MetaMask
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          loadDonations(new ethers.providers.Web3Provider(window.ethereum));
          loadTotalDonations(new ethers.providers.Web3Provider(window.ethereum));
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => { });
      }
    };
  }, []);

  const loadDonations = async (provider) => {
    try {
      const contract = new ethers.Contract(contractAddress, DonationContractABI, provider);
      const donationCount = await contract.getDonations();
      const donationsArray = await Promise.all(donationCount.map(async (donation) => ({
        donor: donation.donor,
        amount: utils.formatEther(donation.amount),
        timestamp: new Date(donation.timestamp * 1000).toLocaleString(),
      })));
      setDonations(donationsArray);
    } catch (error) {
      console.error(error);
      alert("Failed to load donations.");
    }
  };

  const loadTotalDonations = async (provider) => {
    try {
      const contract = new ethers.Contract(contractAddress, DonationContractABI, provider);
      const total = await contract.getTotalDonations();
      setTotalDonations(utils.formatEther(total));
    } catch (error) {
      console.error(error);
      alert("Failed to load total donations.");
    }
  };

  const handleConnectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature.");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
    loadDonations(provider);
    loadTotalDonations(provider);
  };

  const handleDisconnectWallet = () => {
    setAccount('');
    setDonations([]);
    setTotalDonations(0);
  };

  const handleDonate = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature.");
      return;
    }

    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }

    // Validate donation amount
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, DonationContractABI, signer);

    try {
      const tx = await contract.donate({ value: utils.parseEther(amount) });
      setTransactionStatus("Processing...");
      await tx.wait();
      setTransactionStatus("Donation successful!");
      setAmount('');

      // Reload donations and total donations after successful transaction
      loadDonations(provider);
      loadTotalDonations(provider);
    } catch (error) {
      console.error(error);
      setTransactionStatus("Transaction failed! Please try again.");
    }
  };

  return (
    <div className="app-container">
      <div className="banner">
        <h1>Charity Donation</h1>
      </div>
      <div className="content">
        <button className="connect-button" onClick={handleConnectWallet}>
          {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
        </button>

        {/* Disconnect Button */}
        {account && (
          <button className="disconnect-button" onClick={handleDisconnectWallet}>
            Disconnect Wallet
          </button>
        )}

        {account && (
          <>
            <h3>Total Donations: {totalDonations} ETH</h3>
            <div className="donation-section">
              <h2>Donate</h2>
              <input
                type="number"
                placeholder="Enter donation amount in ETH"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="donation-input"
              />
              <div className="button-group">
                <button className="donate-button" onClick={handleDonate}>Donate</button>
              </div>
              {transactionStatus && <p className="transaction-status">{transactionStatus}</p>}
            </div>
            <div className="donation-history">
              <h2>Donation History</h2>
              <table>
                <thead>
                  <tr>
                    <th>Donor</th>
                    <th>Amount (ETH)</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.length > 0 ? donations.map((donation, index) => (
                    <tr key={index}>
                      <td>{donation.donor}</td>
                      <td>{donation.amount}</td>
                      <td>{donation.timestamp}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3">No donations yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
