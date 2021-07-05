import { BigNumberish } from '@ethersproject/bignumber';
import axios, { AxiosAdapter } from 'axios';
import {Token} from 'dex-token';
import Logger from 'dex-logger';
import {Services} from 'dex-common';

const log = new Logger({
    component: "QuoteGrabber"
})

export interface QuoteRequest {
    tokenIn: Token;
    tokenOut: Token;
    amountIn: BigNumberish;
    slippagePercent: number;
    minOrderSize?:BigNumberish;
    apiClient: Services.APIClient;
}

export default async (request: QuoteRequest): Promise<any> => {
    const quoteBody = {
        amountIn: request.amountIn.toString(),
        networkId: request.apiClient.chainId,
        tokenIn: request.tokenIn.address,
        tokenOut: request.tokenOut.address,
        minOrderSize: request.minOrderSize,
        slippagePercentage: request.slippagePercent/100
    };

    let r = await request.apiClient.post("quotes", quoteBody);

    if(!r) {
        throw new Error("No data in response");
    }
    return r;
}