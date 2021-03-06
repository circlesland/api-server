import {AggregateSource} from "../aggregateSource";
import {
  Erc721Tokens,
  Maybe,
  ProfileAggregate,
  ProfileAggregateFilter
} from "../../../types";
import {RpcGateway} from "../../../circles/rpcGateway";
import {erc721_abi} from "../../../circles/abi/erc721Abi";
import {ProfileLoader} from "../../profileLoader";
import {Environment} from "../../../environment";

const tokenCache: {
  [tokenAddress:string]: {
    [no: number]: {
      address: string,
      no: number,
      url: any,
      symbol: any,
      name: any,
      owner: any
    }
  }
} = {};

export class Erc721BalancesSource implements AggregateSource {
  async getAggregate(forSafeAddress: string, filter?: Maybe<ProfileAggregateFilter>): Promise<ProfileAggregate[]> {

    const tokenResults = await Promise.all([
      Erc721BalancesSource.getHoldingsOfSafe(Environment.gorilloNft.address, forSafeAddress),
      Erc721BalancesSource.getHoldingsOfSafe(Environment.acidPunksNft.address, forSafeAddress)
    ]);

    const tokens = tokenResults[0].concat(tokenResults[1]);
    const lastChangeAtTs = new Date();
    const ownerProfilesPromise = new ProfileLoader().profilesBySafeAddress(Environment.readonlyApiDb, tokens.map(o => o.owner.toLowerCase()));
    const ownerProfilesLookup = await ownerProfilesPromise;

    return [<ProfileAggregate>{
      safe_address: forSafeAddress.toLowerCase(),
      type: "Erc721Tokens",
      payload: <Erc721Tokens> {
        __typename: "Erc721Tokens",
        lastUpdatedAt: lastChangeAtTs.toJSON(),
        balances: tokens.map((o, i) => {
          return {
            token_address: o.address,
            token_no: o.no.toString(),
            token_owner_address: o.owner,
            token_owner_profile: ownerProfilesLookup[o.owner.toLowerCase()],
            token_symbol: o.symbol,
            token_name: o.name,
            token_url: o.url
          };
        })
      }
    }];
  }

  public static async getHoldingsOfSafe(token_address: string, forSafeAddress: string, cacheOnly: boolean = false) {
    const web3 = RpcGateway.get();
    const erc721 = new web3.eth.Contract(erc721_abi, token_address);

    let cacheEntries = tokenCache[token_address];
    if (!cacheEntries) {
      tokenCache[token_address] = {};
      cacheEntries = tokenCache[token_address];
    }

    if (cacheOnly) {
      return Object.values(cacheEntries).filter(o => o.owner.toLowerCase() == forSafeAddress.toLowerCase());
    }

    const lastNo = Object.keys(cacheEntries)
      .map(o => parseInt(o))
      .reduce((p, c) => c > p ? c : p, 0);

    for (let i = lastNo; i < lastNo + 1000; i++) {
      try {
        const tokenData = await Promise.all([
          await erc721.methods.tokenURI(i.toString()).call(),
          await erc721.methods.symbol().call(),
          await erc721.methods.name().call(),
          await erc721.methods.ownerOf(i.toString()).call()
        ]);
        const token = {
          no: i,
          address: token_address,
          url: tokenData[0],
          symbol: tokenData[1],
          name: tokenData[2],
          owner: tokenData[3]
        };

        if (!cacheEntries[token.no]) {
          cacheEntries[token.no] = token;
        }
      } catch (e) {
        console.log(`Erc721BalanceSource: Breaking out of iteration over token ${token_address} because: ` + (<any>e).message);
        break;
      }
    }

    const tokens = Object.values(cacheEntries).filter(o => o.owner.toLowerCase() == forSafeAddress.toLowerCase());
    return tokens;
  }
}
