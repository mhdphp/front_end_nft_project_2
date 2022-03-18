import React, { Component } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import KryptoBitd from '../abis/KryptoBird.json';


class App extends Component {

    // mount the components (functions in this case)
    async componentDidMount() {
        await this.loadWeb3();
        // call the function to be mounted
        await this.loadBlockChainData(); 
    }

    // first up is to detect ethereum provider (metamask)
    async loadWeb3() {
        const provider = await detectEthereumProvider();

        // modern browsers
        // if there is a browser provider
        // lets log that it's working
        // set the web3 to the provider
        if (provider) {
            console.log('there is an ethereum provider - aka wallet');
            // connect the ethereum provider to the current page loaded in localhost:3000
            window.web3 = new Web3(provider);
            await window.ethereum.enable(); 
        } else {
            console.log('No ethereum provider - wallet detected.');
        }
    }

    async loadBlockChainData() {
        // initiate the account that are linked in metamask to localhost:3000
        const accounts = await window.web3.eth.getAccounts();
        console.log(accounts);
    }

    render() {
        return(
            <div>
                <h1>NFT Marketplace</h1>
            </div>
        )
    }
    
}


export default App;