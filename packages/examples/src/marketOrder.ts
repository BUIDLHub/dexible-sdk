import {ethers} from 'ethers';
import BaseOrder from './BaseOrder';
import * as TOKENS from './tokens';

const dotenv = require('dotenv');
dotenv.config();

const WETH = TOKENS.WETH_KOVAN;
const DAI = TOKENS.DAI_KOVAN;

const TOKEN_IN = DAI;
const TOKEN_OUT = WETH;
const IN_AMT = ethers.utils.parseEther("50");
class Market extends BaseOrder {}

const main = async () => {

    let amountIn = IN_AMT;
    
    let market = new Market({
        tokenIn: TOKEN_IN,
        tokenOut: TOKEN_OUT,
        amountIn,
        algoDetails: {
            type: "Market",
            params: {
                maxRounds: 10, //min per round is 3 input tokens (30 in/10 rounds)
                gasPolicy: {
                    type: "relative",
                    deviation: 0
                },
                slippagePercent: .5
            }
        }
    });

    let r = await market.createOrder();
    if(r.error) {
        console.log("Problem with order", r.error);
        throw new Error(r.error);
    } else if(!r.order) {
        throw new Error("No order in prepare response");
    } else {
        let order = r.order;
        //could check the quote estimate and make sure it's good
        console.log("Order Quote", order.quote);

        //then submit for execution
        console.log("Submitting order...");
        r = await order.submit();
        if(r.error) {
            throw new Error(r.error);
        } 
        console.log("Order result", r);
    }
}

main();