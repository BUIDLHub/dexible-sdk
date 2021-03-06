import {Serializable, Verifiable} from 'dexible-common';

type SlippageGetter = () => number;
type MaxRounds = () => number;

export default interface IAlgo {
    name: string;
    maxRounds: MaxRounds;
    getSlippage: SlippageGetter;
    serialize: Serializable;
    verify: Verifiable;
}