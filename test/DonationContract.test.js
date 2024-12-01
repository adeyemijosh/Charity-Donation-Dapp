const DonationContract = artifacts.require("DonationContract");

contract("DonationContract", accounts => {
    let donationContract;
    const [owner, donor1, donor2] = accounts;

    // Before running the tests, deploy a new instance of the DonationContract
    before(async () => {
        donationContract = await DonationContract.new();
    });

    describe("Donation Functionality", () => {
        it("should accept donations", async () => {
            // Test that a donation is recorded correctly
            const donationAmount = web3.utils.toWei("1", "ether");
            await donationContract.donate({ from: donor1, value: donationAmount });

            const donations = await donationContract.getDonations();
            assert.equal(donations.length, 1, "Donation should be recorded");
            assert.equal(donations[0].donor, donor1, "Donor address should match");
            assert.equal(donations[0].amount.toString(), donationAmount, "Donation amount should match");
        });

        it("should update donor balance correctly", async () => {
            // Test that the donor's balance is updated correctly after a donation
            const balance = await donationContract.getDonorBalance(donor1);
            assert.equal(balance.toString(), web3.utils.toWei("1", "ether"), "Donor balance should be updated");
        });

        it("should accept multiple donations from different donors", async () => {
            // Test that multiple donations are recorded correctly
            const donationAmount = web3.utils.toWei("0.5", "ether");
            await donationContract.donate({ from: donor2, value: donationAmount });

            const donations = await donationContract.getDonations();
            assert.equal(donations.length, 2, "Two donations should be recorded");

            const donor2Balance = await donationContract.getDonorBalance(donor2);
            assert.equal(donor2Balance.toString(), donationAmount, "Donor 2 balance should match donation amount");
        });
    });

    describe("Withdrawals", () => {
        it("should allow the owner to withdraw funds", async () => {
            // Test that the owner can withdraw funds successfully
            const initialOwnerBalance = await web3.eth.getBalance(owner);
            const contractBalance = await web3.eth.getBalance(donationContract.address);

            await donationContract.withdraw({ from: owner });

            const newOwnerBalance = await web3.eth.getBalance(owner);
            assert(newOwnerBalance > initialOwnerBalance, "Owner's balance should increase after withdrawal");

            const updatedContractBalance = await web3.eth.getBalance(donationContract.address);
            assert.equal(updatedContractBalance, 0, "Contract balance should be zero after withdrawal");
        });

        it("should revert if a non-owner tries to withdraw", async () => {
            // Test that non-owners cannot withdraw funds
            try {
                await donationContract.withdraw({ from: donor1 });
                assert.fail("Withdrawal should have reverted");
            } catch (error) {
                assert.include(error.message, "revert", "Error should contain revert message");
            }
        });

        it("should revert if trying to withdraw when no funds are available", async () => {
            // Test that attempting to withdraw from an empty contract reverts
            const newContract = await DonationContract.new();
            try {
                await newContract.withdraw({ from: owner });
                assert.fail("Withdrawal should have reverted");
            } catch (error) {
                assert.include(error.message, "No funds available", "Error should contain no funds message");
            }
        });
    });

    describe("Event Emission", () => {
        it("should emit DonationReceived event on donation", async () => {
            // Test that a DonationReceived event is emitted upon donation
            const donationAmount = web3.utils.toWei("0.2", "ether");
            const result = await donationContract.donate({ from: donor1, value: donationAmount });

            const event = result.logs[0];
            assert.equal(event.event, "DonationReceived", "Event should be DonationReceived");
            assert.equal(event.args.donor, donor1, "Donor address should match");
            assert.equal(event.args.amount.toString(), donationAmount, "Donation amount should match");
        });

        it("should emit FundsWithdrawn event on withdrawal", async () => {
            // Test that a FundsWithdrawn event is emitted upon withdrawal
            const initialContractBalance = await web3.eth.getBalance(donationContract.address);
            const result = await donationContract.withdraw({ from: owner });

            const event = result.logs[0];
            assert.equal(event.event, "FundsWithdrawn", "Event should be FundsWithdrawn");
            assert.equal(event.args.charity, owner, "Owner address should match");
            assert.equal(event.args.amount.toString(), initialContractBalance.toString(), "Withdrawal amount should match");
        });
    });
});
