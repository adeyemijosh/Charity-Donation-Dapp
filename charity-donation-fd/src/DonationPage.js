import React, { useState, useEffect } from 'react';
import { ethers, utils } from 'ethers';
import DonationContractABI from './DonationContractABI.json';
import './DonationPage.css';  // Importing CSS for styling

const contractAddress = '0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8'; // Your contract address
const quickNodeUrl = 'YOUR_QUICKNODE_URL'; // Replace with your QuickNode URL

const DonationPage = ({ account }) => {
    const [amount, setAmount] = useState('');
    const [donations, setDonations] = useState([]);
    const [transactionStatus, setTransactionStatus] = useState('');
    const [totalDonations, setTotalDonations] = useState(0);

    // Load donations and total donations when component mounts
    useEffect(() => {
        const loadProvider = async () => {
            const provider = new ethers.providers.JsonRpcProvider(quickNodeUrl);
            await loadDonations(provider);
            await loadTotalDonations(provider);
        };

        loadProvider();
    }, []);

    // Fetch donation history
    const loadDonations = async (provider) => {
        const contract = new ethers.Contract(contractAddress, DonationContractABI, provider);
        const donationCount = await contract.getDonations();
        const donationsArray = await Promise.all(donationCount.map(async (donation) => ({
            donor: donation.donor,
            amount: utils.formatEther(donation.amount),
            timestamp: new Date(donation.timestamp * 1000).toLocaleString(),
        })));
        setDonations(donationsArray);
    };

    // Fetch total donations
    const loadTotalDonations = async (provider) => {
        const contract = new ethers.Contract(contractAddress, DonationContractABI, provider);
        const total = await contract.getTotalDonations();
        setTotalDonations(utils.formatEther(total));
    };

    // Handle donation
    const handleDonate = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask to use this feature.");
            return;
        }

        if (!account) {
            alert("Please connect your wallet first.");
            return;
        }

        if (parseFloat(amount) <= 0) {
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
            loadDonations(provider);
            loadTotalDonations(provider);
        } catch (error) {
            console.error(error);
            setTransactionStatus("Transaction failed! Please try again.");
        }
    };

    return (
        <div className="donation-page">
            <div className="banner">
                <h1>Charity Donation</h1>
                <p>Make a difference with your generosity.</p>
            </div>

            <div className="content">
                <div className="donation-form">
                    <h2>Donate</h2>
                    <input
                        type="number"
                        placeholder="Enter donation amount in ETH"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="donation-input"
                    />
                    <button className="donate-button" onClick={handleDonate}>Donate Now</button>
                    {transactionStatus && <p className="transaction-status">{transactionStatus}</p>}
                </div>

                <div className="donation-history">
                    <h3>Donation History</h3>
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

                <div className="total-donations">
                    <h3>Total Donations: {totalDonations} ETH</h3>
                </div>
            </div>
        </div>
    );
};

export default DonationPage;
