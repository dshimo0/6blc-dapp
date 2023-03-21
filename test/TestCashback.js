const YourContract = artifacts.require("Cashback");

contract("Cashback", accounts => {
  it("should do something", async () => {
    const yourContractInstance = await YourContract.deployed();
    // Write your test here, for example:
    // await yourContractInstance.someFunction();
  });
});
