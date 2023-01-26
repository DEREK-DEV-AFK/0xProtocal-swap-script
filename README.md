# 0x-Prototype Project
This project include script for swaping token using 0x protocal on `goerli testnet`
## Dependencies used
- axios - for HTTP request
- truffle/hdwalletprovider - for connecting address with web3 to send transaction
- qs - for converting json to string, NOTE: this can be done with inbuild `JSON` function
- web3 - for intreacting with blockchain
- 0x/utils - for converting number into base 10 number

## How to run
- Step 1 : Intall all the dependencies
```
npm install -f
```

- Step 2 : Add Credentials
Add all the credentials require in `NEED TO CHANGE` comment block

- Step 3 : Before running the file, few things to know
    - for performing swap with any token, there must be liquidity available in the DEXs or else the tx will not success
    - for ETH swap we can simply give `ETH` in parameter but for other we have to pass address and the it decimals and amount 
- Step 3 : Running the file
```
npm run start:dev
```


## Connect
Feel free to raise issue or connect with me