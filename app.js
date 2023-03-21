const contractAddress = "0x47dc869CDc39626D0cc3125D44cE00bd3cE4a3c2";
const contractABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"CashbackReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"CashbackWithdrawn","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"cashbackBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"hasCashbackBalance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"registerCashback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawCashback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

let provider;
let signer;
let cashbackContract;
let userAddress;
let contractInstance;

document.addEventListener("DOMContentLoaded", () => {
    const contractAddress = "0xacefAC7f6B940c820eA7c47164b18c06F8A9c81F";

    document.getElementById("connectWalletButton").addEventListener("click", async () => {
        const userAddress = await connectWallet();
        await updateWalletBalance(userAddress, contractInstance);
        await updateCashbackBalance(userAddress, contractInstance);
        displayContractInfo();
      });

      document.getElementById("register").addEventListener("click", async () => {
        const userAddress = await signer.getAddress();
        await registerCashback();
        await updateWalletBalance(userAddress, contractInstance);
        await updateCashbackBalance(userAddress, contractInstance);
      });

      document.getElementById("withdraw").addEventListener("click", async () => {
        const userAddress = await signer.getAddress();
        await withdrawCashback();
        await updateWalletBalance(userAddress, contractInstance);
        await updateCashbackBalance(userAddress, contractInstance);
      });

    function displayContractInfo() {
      document.getElementById("contractAddress").innerText = contractInstance.address;
      contractInstance.admin().then((admin) => {
        document.getElementById("contractAdmin").innerText = admin;
      });
    }

    async function updateWalletBalance() {
      const walletBalance = await provider.getBalance(userAddress);
      document.getElementById("walletBalance").innerText = ethers.utils.formatUnits(walletBalance, "wei");
    }


  });

  async function updateCashbackBalance() {
    const cashbackBalance = await contractInstance.balanceOf(userAddress);
    document.getElementById("cashbackBalance").innerText = ethers.utils.formatUnits(cashbackBalance, "wei");
  }

  async function connectWallet() {
    console.log("Conectando à carteira...");
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        cashbackContract = new ethers.Contract(contractAddress, contractABI, signer);

        document.getElementById("walletAddress").innerText = userAddress;
        updateCashbackBalance();
        return userAddress;
      } catch (error) {
        console.error("Usuário rejeitou o acesso à conta");
      }
    } else {
      alert("Por favor, instale o Metamask ou use um navegador compatível com Ethereum");
    }
  }

async function registerCashback() {
    const amount = document.getElementById("cashbackAmount").value;
    if (amount > 0) {
        try {
            const tx = await cashbackContract.registerCashback(amount);
            await tx.wait();
            updateCashbackBalance();
        } catch (error) {
            console.error("Erro ao registrar cashback:", error);
        }
    } else {
        alert("Por favor, insira um valor de cashback válido");
    }
}

async function checkCashbackBalance() {
    try {
        const address = await signer.getAddress();
        const hasBalance = await cashbackContract.hasCashbackBalance(address);
        return hasBalance;
    } catch (error) {
        console.error("Erro ao verificar o saldo de cashback:", error);
    }
    return false;
}

async function withdrawCashback() {
    if (await checkCashbackBalance()) {
        try {
            const tx = await cashbackContract.withdrawCashback();
            await tx.wait();
            updateCashbackBalance();
        } catch (error) {
            console.error("Erro ao sacar cashback:", error);
        }
    } else {
        alert("Você não possui saldo de cashback para sacar.");
    }
}

async function updateWalletBalance(userAddress) {
    const walletBalance = await provider.getBalance(userAddress);
    document.getElementById("walletBalance").innerText = ethers.utils.formatUnits(walletBalance, "wei");
  }

  async function updateCashbackBalance(userAddress, contractInstance) {
    const cashbackBalance = await contractInstance.balanceOf(userAddress);
    document.getElementById("cashbackBalance").innerText = ethers.utils.formatUnits(cashbackBalance, "wei");
  }




