import "./App.css";
import { useState } from "react";
import styles from "./app.module.scss";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import Token from "./artifacts/contracts/Token.sol/Token.json";
import { ethers } from "ethers";

function App() {
  const greeterSmartContract = `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`;
  // const greeterSmartContract = `0x495C498C060Fc5967E4177299d6018a7BA0E4e1E`;

  const tokenSmartContract = `0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44`;
  // const [greeting, setgreeting] = useState("");
  const [greetingInput, setgreetingInput] = useState("");
  const [greetValue, setgreetValue] = useState("");
  const [balanceValue, setbalanceValue] = useState("");

  const [userAccount, setuserAccount] = useState("");
  const [amount, setamount] = useState("");

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // A function that fetches balance of a user
  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        tokenSmartContract,
        Token.abi,
        provider
      );
      try {
        const balance = await contract.balanceOf(account);
        // console.log(balance.toString());
        console.log("Balance", balance.toString() / 10 ** 18);
        const realBalance = balance.toString() / 10 ** 18;
        setbalanceValue(`${realBalance} OHH`);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  // A function that sends coins
  async function sendCoins(e) {
    e.preventDefault();
    if (!userAccount || !amount) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        tokenSmartContract,
        Token.abi,
        signer
      );
      try {
        const price = ethers.utils.parseUnits(amount);
        const calculated = price.toString();
        const transaction = await contract.transfer(userAccount, calculated);
        await transaction.wait();
        console.log(`${calculated} coins successfully sent to ${userAccount}`);
        getBalance();
        setuserAccount("");
        setamount("");
      } catch (error) {
        console.log(error);
      }
    }
  }

  // A function that fetches greeting
  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterSmartContract,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        setgreetValue(data);
        console.log("data: ", data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  // A function that fetches greeting
  async function setGreeting(e) {
    e.preventDefault();
    if (!greetingInput) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        greeterSmartContract,
        Greeter.abi,
        signer
      );
      const transaction = await contract.setGreeting(greetingInput);
      await transaction.wait();
      fetchGreeting();
      setgreetingInput("");
    }
  }

  return (
    <div className={styles.appContainer}>
      <div className={styles.greeterFormContainer}>
        <form
          onSubmit={(e) => {
            setGreeting(e);
          }}
        >
          <div className={styles.greetingContentDiv}>
            <h1>{greetValue}</h1>
          </div>
          <button
            className={styles.fetchGreeting}
            type="button"
            onClick={fetchGreeting}
          >
            Fetch Greeting
          </button>

          <div className={styles.fromGroup}>
            <label>set Greeting</label>
            <input
              placeholder="Enter Greeting"
              type="text"
              value={greetingInput}
              onChange={(event) => {
                setgreetingInput(event.target.value);
              }}
            />
          </div>
          <button>Submit</button>
        </form>
      </div>
      <div className={styles.TokenFormContainer}>
        <form
          onSubmit={(e) => {
            sendCoins(e);
          }}
        >
          <div className={styles.TokenContentDiv}>
            <h3>{balanceValue}</h3>
          </div>
          <button
            className={styles.getBalance}
            type="button"
            onClick={getBalance}
          >
            Get Balance
          </button>
          <div className={styles.fromGroup}>
            <label>Enter account</label>
            <input
              placeholder="insert Account"
              type="text"
              value={userAccount}
              onChange={(event) => {
                setuserAccount(event.target.value);
              }}
            />
          </div>
          <div className={styles.fromGroup}>
            <label>Enter token amount</label>
            <input
              placeholder="insert amount to send"
              type="number"
              value={amount}
              onChange={(event) => {
                setamount(event.target.value);
              }}
            />
          </div>
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default App;
