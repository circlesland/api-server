import BN from "bn.js";
import {TransitivePath, TransitiveTransfer} from "../types";
import fetch from "cross-fetch";
import {Environment} from "../environment";
import {Context} from "../context";

export interface CrcBalanceProvider {
  getCrcBalance(safeAddress:string) : Promise<BN|null>;
}

export type PathfinderRpcMethod = "compute_transfer";

export class Pathfinder {
  /**
   * Uses the pathfinder to calculate the max transferable crc amount between two safes.
   * @param balanceProvider A way to determine the max. theoretical outgoing crc capacity of the sender
   * @param from Who sends the circles
   * @param to The receiver of the circles
   * @param context The context
   */
  static async findMaxFlow(balanceProvider: CrcBalanceProvider, from: string, to: string, context:Context) : Promise<TransitivePath> {
    const senderCrcBalance = await balanceProvider.getCrcBalance(from);
    if (!senderCrcBalance) {
      return this.zeroResult("0", `Couldn't get the CRC balance of sender '${from}'.`);
    }
    try {
      return await this.findTransitivePath(from, to, senderCrcBalance.toString(), context);
    } catch (e) {
      console.error(e);
      return this.zeroResult(senderCrcBalance?.toString() ?? "0", `An error occurred: ${(<any>e).message}`);
    }
  }

  /**
   * Uses the pathfinder to calculate a payment path for the specified amount.
   * @param from Who sends the circles
   * @param to The receiver of the circles
   * @param amount The amount the user wants to send in decimal wei or undefined
   * @param context The context
   */
  static async findPath(from: string, to: string, amount: string, context:Context) : Promise<TransitivePath> {
    try {
      return await this.findTransitivePath(from, to, amount, context);
    } catch (e) {
      console.error(e);
      return this.zeroResult(amount ?? "0", `An error occurred: ${(<any>e).message}`);
    }
  }

  private static async findTransitivePath(from: string, to: string, amount: string, context:Context): Promise<TransitivePath> {
    const computeTransferParams = {
      from,
      to,
      value: amount,
      iterative: false,
      prune: true
    };

    const response = await this.callJsonRpcMethod("compute_transfer", computeTransferParams, context);

    context.log("Pathfinder response:" + JSON.stringify(response, null, 2));

    return <TransitivePath>{
      flow: response.result.maxFlowValue,
      requestedAmount: amount,
      success: true,
      transfers: response.result.transferSteps.map((o: any) => {
        return <TransitiveTransfer>{
          from: o.from,
          to: o.to,
          tokenOwner: o.token_owner,
          value: o.value
        };
      })
    };
  }

  private static zeroResult(requestedAmount: string, message?:string) {
    return <TransitivePath>{
      __typename: "TransitivePath",
      flow: "0",
      success: false,
      message: message,
      requestedAmount: requestedAmount,
      transfers: [],
    }
  }

  private static async callJsonRpcMethod(method:PathfinderRpcMethod, params: {[x:string]:any}, context:Context) : Promise<any> {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const body = JSON.stringify({
      id: Date.now(),
      method: method,
      params: params
    }, null, 2);

    context.log(`Calling pathfinder at ${Environment.pathfinderUrl} with ${body}`);

    const result = await fetch(Environment.pathfinderUrl, {
      method: 'POST',
      headers,
      body
    });

    return result.json();
  }
}
