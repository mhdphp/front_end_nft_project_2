import React, { Component } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import KryptoBird from '../abis/KryptoBird.json';
import {MDBCard, MDBCardBody, MDBCardTitle, 
    MDBCardText, MDBCardImage, MDBBtn} from 'mdb-react-ui-kit';
import './App.css';


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
            //console.log('No ethereum provider - wallet detected.');
        }
    }

    // get the current account (link to metamask) public key
    async loadBlockChainData() {
        const web3 = window.web3;
        // initiate the account that are linked in metamask to localhost:3000
        const accounts = await web3.eth.getAccounts();
        // set the value of the state object - this.state.account
        this.setState({account:accounts[0]});
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
            //console.log(this.state.contract);

            // call the total supply for this contract
            const totalSupply = await contract.methods.totalSupply().call();
            this.setState({totalSupply});
            //console.log('Total Supply: ', this.state.totalSupply);

            // setup an array to keep track of tokens
            for(let i=1; i<=totalSupply; i++){
                const kBird = await contract.methods.kryptoBirdz(i-1).call();
                this.setState({
                    kBirdz:[...this.state.kBirdz, kBird]
                });
            }
            //console.log('kBirdz', this.state.kBirdz);


        } else {
            window.alert('Smart contract not deployed.');
        }
    }

    // with minting we are sending information and we need to specify the account
    mint = (kBirdToBeMint) => {
        this.state.contract.methods.mint(kBirdToBeMint).send({from:this.state.account})
        .once('receipt', (receipt) =>{
            this.setState({
                kBirdz:[...this.state.kBirdz, kBirdToBeMint]
            });
        });
    }

    testFunc = (arg) =>{
        const result = arg;
        console.log(result);
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

        // in order these functions to be called inside the class APP
        this.testFunc = this.testFunc.bind(this); // for testing
        this.handleSubmit = this.handleSubmit.bind(this);
        this.mint = this.mint.bind(this);
    }

    handleSubmit(event) {
        //alert('An essay was submitted: ' + this.state.value);
        event.preventDefault();
        const kBirdFileLoc = event.target.fileLoc.value;
        this.mint(kBirdFileLoc);
        console.log(kBirdFileLoc);
        // this.testFunc('sarmale');
      }


    render() {
        return(
            <div className='container-filled'>
                {console.log(this.state.kBirdz)}
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
                {/* form for minting*/}
                <div className='container-fluid mt-1'>
                    <div className='row'>
                        <main role='main' className='col-lg-12 d-flex text-center'>
                            <div className='content mr-auto ml-auto' style={{opacity:'0.8'}}>
                                <h2>KryptoBirdz - NFT Marketplace</h2>
                                <form onSubmit={this.handleSubmit} className='mb-2'>
                                    <input 
                                        type="text" 
                                        placeholder='File location' 
                                        className='form-control mb-1'
                                        name='fileLoc'/>

                                    <input 
                                        className='btn btn-primary btn-black' 
                                        type="submit" 
                                        value='MINT' />
                                </form>
                            </div>
                        </main>
                    </div>
                    <hr />
                    <div className='row textCenter'>
                        {this.state.kBirdz.map((kB, key) =>{
                            return(
                            <div className='card-container'>
                                    <MDBCard className='token image' style={{maxWidth:'10rem'}}>
                                        <MDBCardTitle>KryptoBirdz</MDBCardTitle>
                                        <MDBCardImage src={kB} position='top' style={{marginRight:'4px'}}/>
                                        <MDBCardBody>
                                            <MDBCardText>
                                                <p style={{fontSize:'.85rem'}}>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                                            </MDBCardText>
                                        </MDBCardBody>
                                    </MDBCard>
                            </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }  
}


export default App;