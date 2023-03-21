const fs = require('fs');
const path = require('path');

const getAbi = () => {
  const contractPath = path.join(__dirname, './artifacts/Cashback.json');
  const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
  console.log(JSON.stringify(contract.abi));
};

getAbi();
