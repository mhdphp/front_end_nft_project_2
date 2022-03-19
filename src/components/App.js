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

    // get the current account (link to metamask) public key
    async loadBlockChainData() {
        const web3 = window.web3;
        // initiate the account that are linked in metamask to localhost:3000
        const accounts = await web3.eth.getAccounts();
        // set the value of the state object - this.state.account
        this.setState({account:accounts});
        console.log(this.state.account);
    }

    // constructors are used in React to handle the State components
    constructor(props) {
        super(props);
        // initialize the state object with name this.state.account
        this.state = {
            account: ''
        }
    }

    render() {
        return(
            <div>
                <h1>NFT Marketplace</h1>
                <h2>The current account linked</h2>
                {/* display the current account public key */}
                <p>{this.state.account}</p>
            </div>
        )
    }  
}


export default App;