import {ethers} from 'ethers';
import { Price } from 'dexible-common';
import BaseOrder from './BaseOrder';
import * as TOKENS from './tokens';

const dotenv = require('dotenv');
dotenv.config();

const DAI = TOKENS.DAI_KOVAN;
const WETH = TOKENS.WETH_KOVAN;

const TOKEN_IN = WETH;
const TOKEN_OUT = DAI;
const AMT_IN = ethers.utils.parseEther("5.175");

class StopLoss extends BaseOrder {};

const main = async () => {

    let sdk = BaseOrder.createDexibleSDK();
    
    //tokens have to be resolved on-chain by address so we get token metadata
    console.log("Looking up in/out tokens...");
    let tokenIn = await sdk.token.lookup(TOKEN_IN);
    let tokenOut = await sdk.token.lookup(TOKEN_OUT);

    console.log("TokenIn Decimals", tokenIn.decimals, "Balance", tokenIn.balance?.toString(), "Allowance", tokenIn.allowance?.toString());
    let amountIn = AMT_IN;
    

    let stop = new StopLoss({
        tokenIn,
        tokenOut,
        amountIn,
        algoDetails: {
            type: "StopLoss",
            params: {
                isAbove: false,
                triggerPrice: Price.unitsToPrice({
                    inToken: tokenIn,
                    outToken: tokenOut,
                    inUnits: 1, //1 weth
                    outUnits: 1375 //for this amount of dai
                }),
                gasPolicy: {
                    type: "relative",
                    deviation: 0
                },
                slippagePercent: .5
            }
        }
    });
    
    let r = await stop.createOrder();
    if(r.error) {
        console.log("Problem with order", r.error);
        throw new Error(r.error);
    } else if(!r.order) {
        throw new Error("No order in prepare response");
    } else {
        let order = r.order;
        //could check the quote estimate and make sure it's good
        console.log("Order Quote", order.quote);

        if(order.quote.rounds === 1) {
            console.log("Single-round order quote so will not submit");
        } else {
            //then submit for execution
            console.log("Submitting order...");
            r = await order.submit();
            if(r.error) {
                throw new Error(r.error);
            } 
            console.log("Order result", r);
        }
    }
}

main();