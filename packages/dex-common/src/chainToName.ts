
export default function(network:string, chainId:number) {
    if(network !== 'ethereum' && network !== 'polygon') {
        throw new Error("Only support ethereum and polygon right now");
    }
    switch(chainId) {
        case 1: return "mainnet";
        case 42: return "kovan";
        case 137: return 'mainnet';
        case 80001: return 'mumbai';
        default: throw new Error("Only mainnet, polygon, and kovan are support right now");
    }
}