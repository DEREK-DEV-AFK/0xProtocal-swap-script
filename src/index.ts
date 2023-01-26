import axios from 'axios';
import qs from 'qs';
import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import { ContractWrappers, ERC20TokenContract, WETH9Contract} from '@0x/contract-wrappers';
import { BigNumber } from '@0x/utils';
import { env } from 'process';
import { Credentials } from '@truffle/hdwallet-provider/dist/constructor/LegacyConstructor';
require('dotenv').config()
import erc20Abi from './abi/erc20.json'
// console.log("ENV ",env.INFURA_URL);

///////////////- NEED TO CHANGE -/////////////
let INFURA_URL:Credentials = 'https://goerli.infura.io/v3/<key>' // paste your infura url
const takerAddress:string = '< address >' // provide ur wallet address
let MNEMONIC:Credentials = '< mnemonic of address >' //paste your takerAddressmnemonic here
//////////////////////////////////////////////

//////////- Global Variables -/////////////
const WETH:string = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'
const USDC:string = '0x07865c6e87b9f70255377e024ace6630c1eaa37f'
const DAI:string = '0xE68104D83e647b7c1C15a91a8D8aAD21a51B3B3E'
const Tether:string = '0x509Ee0d083DdF8AC028f2a56731412edD63223B9'
const USDCdecimals:number = 6
const ETHdecimals:number = 18
///////////////////////////////////////////

///////////- Wallet Connect -//////////////
const provider:any = new HDWalletProvider(MNEMONIC, INFURA_URL)
const web3:any = new Web3(provider);
///////////////////////////////////////////

/**
 * the main function which perform swap 
 * @param sellToken token you are giving
 * @param buyToken token you want in return
 * @param sellAmount amount you are giving
 * @param selldecimalOfToken decimal of token
 */
const getQuote = async (sellToken:string, buyToken:string, sellAmount:number, selldecimalOfToken:number, takerAddress:string) => {

    // params object
    const params = {
        sellToken: sellToken,
        buyToken: buyToken,
        sellAmount: (sellAmount * Math.pow(10,selldecimalOfToken)).toString(),
        takerAddress: takerAddress
    }
    console.log("parameters ", params)


    // checking token
    if(sellToken == 'ETH'){
        console.log("is ETH")

        try {
            // getting qoute
            const response = await axios.get(`https://goerli.api.0x.org/swap/v1/quote?${qs.stringify(params)}`);
            if(response.status == 200) {

                console.log("Quote ",response.data);
        
                // Perform the swap
                let tx = await web3.eth.sendTransaction(await response.data);
                console.log("hash : ",tx)
            } else {
                console.log("Quote faliled, maybe there will be not liquidity in DEXs for you will not be having token in your specified address")
                console.log("REASON : ",response.data)
            }
    
        } catch(error:any) {
            console.error(error.response.data)
        }  
        
    } else {
        console.log("is Token")
     
        try {
            // url
            let text = `https://goerli.api.0x.org/swap/v1/quote?sellToken=${params.sellToken}&buyToken=${params.buyToken}&sellAmount=${params.sellAmount}&takerAddress=${params.takerAddress}`
            // getting qoute
            const response = await axios.get(
                text
            );
            if(response.status == 200){
                console.log("Quote ", response.data);

                console.log('approving before sending txn')

                let approveResult: any = await allowance(response.data)
                if (approveResult == true) {
                    console.log("in true")
                    // response.data.from = takerAddress
                    console.log("response ", response.data)
                    console.log("sending txn")
                    // Perform the swap
                    let tx = await web3.eth.sendTransaction(response.data, async function (error: any, result: any) {
                        if (error) {
                            console.log("error ", error)
                        } else {
                            console.log("hash ", result)
                        }
                    });
                } else {
                    console.log("approve failed")
                }
            } else {
                console.log("Quote faliled, maybe there will be not liquidity in DEXs for you will not be having token in your specified address")
                console.log("REASON : ",response.data)
            }

            

        } catch(error:any){
            console.error("error : ",error)
        }

    } 
}

/**
 * This function call the contract and give allowance to perform swap
 * @param transactionObj quote object 
 */
async function allowance(transactionObj:any) {
    const minApproval = new BigNumber(transactionObj.sellAmount + '0');
    const maxApproval = new BigNumber(2).pow(256).minus(1);

    const USDCcontract = new web3.eth.Contract(erc20Abi, transactionObj.sellTokenAddress);
 
    try {
        let hash = await USDCcontract.methods.approve(transactionObj.allowanceTarget, maxApproval).send({from: takerAddress})
        console.log("waiting for confirmation")
        if(hash.status){
            console.log("approve txn hash : ",hash.transactionHash)
            return true
        } else {
            return false
        }
        
    } catch(error:any){
        console.error(error)
    }
}


getQuote(USDC,Tether,0.1,ETHdecimals,takerAddress)
// allowance()
