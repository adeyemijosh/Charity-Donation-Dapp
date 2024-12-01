import { ethers } from "ethers";
import DonationContractABI from './DonationContractABI.json'; // Add your ABI JSON file here

const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS"; // Replace with your deployed contract address

export class DonationContract {
    constructor() {
        this.contract = null;
    }

    async init() {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            this.contract = new ethers.Contract(CONTRACT_ADDRESS, DonationContractABI, signer);
        } else {
            console.error("Please install MetaMask!");
        }
    }

    async donate(amount) {
        const tx = await this.contract.donate({ value: ethers.utils.parseEther(amount) });
        await tx.wait();
        console.log("Donation successful!");
    }

    async getDonations() {
        const donations = await this.contract.getDonations();
        return donations;
    }
}
