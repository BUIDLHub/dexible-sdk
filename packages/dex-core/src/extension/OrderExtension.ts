import * as OrderSupport from 'dexible-order';
import {
    APIClient,
    APIExtensionProps,
    MarketingProps,
    Tag, 
    Token,
} from 'dexible-common';
import { BigNumberish } from 'ethers';
import { IAlgo } from 'dexible-algos';

export interface OrderSpec {
    tokenIn: Token;
    tokenOut: Token;
    amountIn: BigNumberish;
    quoteId?: number;
    algo: IAlgo;
    tags?: Array<Tag>;
}

export interface OrderListParams {
    limit?: number;
    offset?: number;
    state?: "all" | "active" | 'delegated';
}

export class OrderExtension {

    apiClient: APIClient;
    chainId: number;
    gnosisSafe?: string;
    marketing?: MarketingProps;

    constructor(props: APIExtensionProps) {
        this.apiClient = props.apiClient;
        this.chainId = props.chainId;
        this.gnosisSafe = props.gnosisSafe;
        this.marketing = props.marketing;
    }

    async prepare(params: OrderSpec): Promise<OrderSupport.PrepareResponse> {
        let order = new OrderSupport.DexOrder({
            apiClient: this.apiClient,
            chainId: this.chainId,
            quoteId: params.quoteId,
            tokenIn: params.tokenIn,
            tokenOut: params.tokenOut,
            amountIn: params.amountIn,
            maxRounds: params.algo.maxRounds(),
            algo: params.algo,
            tags: params.tags,
            gnosisSafe: this.gnosisSafe,
            marketing: this.marketing,
        });
        return order.prepare();
    }

    async getAll(params:OrderListParams): Promise<Array<any>> {
        return this.apiClient.get({
            endpoint: 'orders',
            requiresAuthentication: true,
            withRetrySupport: true,
            params: {
                ...params,
                gnosisSafe: this.gnosisSafe,
            },
        });
    }

    async getOne(id:number): Promise<any> {
        return this.apiClient.get({
            endpoint: `orders/${id}`,
            requiresAuthentication: true,
            withRetrySupport: true,
        });
    }

    async cancel(orderId:number): Promise<any> {
        return this.apiClient.post({
            data: {orderId},
            endpoint: `orders/${orderId}/actions/cancel`,
            requiresAuthentication: true,
            withRetrySupport: true,
        });
    }

    async pause(orderId:number): Promise<any> {
        return this.apiClient.post({
            data: {orderId},
            endpoint: `orders/${orderId}/actions/pause`,
            requiresAuthentication: true,
            withRetrySupport: true,
        });
    }

    async resume(orderId:number): Promise<any> {
        return this.apiClient.post({
            data: {orderId},
            endpoint: `orders/${orderId}/actions/resume`,
            requiresAuthentication: true,
            withRetrySupport: true,
        });
    }
}
