import React, { Component } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import KryptoBird from '../abis/KryptoBird.json';


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
        // get the blockchain network id (in our case is Ganache networkd)
        const networkId = await web3.eth.net.getId();
        const networkData = KryptoBird.networks[networkId];
        if (networkData){
            // get the jsonInterface for this contract
            const abi = KryptoBird.abi;
            // get the contract address
            const address = networkData.address;
            // instantiate a new object Contract
            const contract = new web3.eth.Contract(abi, address);
            this.setState({contract}); // the same as {{contract: contract}}
            // display it on the console
            console.log(this.state.contract);

            // call the total supply for this contract
            const totalSupply = await contract.methods.totalSupply().call();
            this.setState({totalSupply});
            console.log('Total Supply: ', this.state.totalSupply);

            // setup an array to keep track of tokens
            for(let i=1; i<=totalSupply; i++){
                const kBird = await contract.methods.kryptoBirdz(i-1).call();
                this.setState({
                    kBirdz:[...this.state.kBirdz, kBird]
                });
            }
            console.log('kBirdz', this.state.kBirdz);


        } else {
            window.alert('Smart contract not deployed.');
        }
    }

    // constructors are used in React to handle the State components
    constructor(props) {
        super(props);
        // initialize the state object with name this.state.account
        this.state = {
            account: '',
            contract: null,
            totalSupply: 0,
            kBirdz:[]
        }
    }

    render() {
        return(
            <div>
                <nav className='navbar navbar-dark fix-top bg-dark flex-md-nownap p-0 shadow'>
                    <div className='navbar-brand col-sm-3 col-md-3 mr-0' style={{font:'white'}}>
                        KryptoBirdz NFTs (Non Fungible Tokens)
                    </div>
                    <ul className='navbar-nav px3'>
                        <li className='nav-item text-nowrap d-none d-sm-none d-sm-block mr-2'>
                            <small className='text-white'>{this.state.account}</small>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }  
}


export default App;