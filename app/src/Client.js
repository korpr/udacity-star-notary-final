import regeneratorRuntime from "regenerator-runtime";
import Web3 from "web3";
import starNotaryArtifact from "../../build/contracts/StarNotary.json";
Number.isPositiveInteger = Number.isPositiveInteger || function (value) {
    return /^\+?\d+$/.test(value);
};
export default class Client {
    web3 = null;
    account = null;
    meta = null

    start = async () => {
        const { web3 } = this;

        try {
            // get contract instance
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = starNotaryArtifact.networks[networkId];
            this.meta = new web3.eth.Contract(
                starNotaryArtifact.abi,
                deployedNetwork.address,
            );

            // get accounts
            const accounts = await web3.eth.getAccounts();
            this.account = accounts[0];
        } catch (error) {
            console.error("Could not connect to contract or chain.");
            console.log(error)
        }
    }

    setStatus = (message) => {
        const status = document.getElementById("status");
        status.innerHTML = message;
    }

    createStar = async (name, id) => {
        const { createStar } = this.meta.methods;

        try {
            if (name.trim().length === 0) {
                //TODO  return status / rise error    App.setStatus("Name is required");
                return { success: false, description: "name is not presented" };
            }

            if (!Number.isPositiveInteger(id) || id < 0) {
                //TODO  return status /rise errro      App.setStatus("Id should be positive integer");
                return { success: false, description: "id should be positive integer" };
            }
            await createStar(name, id).send({ from: this.account });
            return { success: true, description: "The star has been created" };
        } catch (e) {
            console.log(e);
            return { success: false, description: "problem with creating star" };
        }

    }

    // Implement Task 4 Modify the front end of the DAPP
    lookUp = async (id) => {
        if (!Number.isPositiveInteger(id) || id < 0) {
            //TODO  raise error App.setStatus("Id should be positive integer");
            return;
        }

        const { lookUptokenIdToStarInfo } = this.meta.methods;
        let name = await lookUptokenIdToStarInfo(id).call({ from: this.account });
        if (name === '') {
            return { name: `No star found by id ${id}` };
        } else {
            return { name: `The name of the star is ${name}` };
        }
    }
};

window.Client = new Client();

window.addEventListener("load", async function () {
    if (window.ethereum) {
        // use MetaMask's provider
        window.Client.web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // get permission to access accounts
    } else {
        console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        Client.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"),);
    }

    window.Client.start();
});