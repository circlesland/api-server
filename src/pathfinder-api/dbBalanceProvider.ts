import {CrcBalanceProvider} from "./pathfinder";
import BN from "bn.js";
import {Environment} from "../environment";

export class DbBalanceProvider implements CrcBalanceProvider {
  async getCrcBalance(safeAddress:string) : Promise<BN|null> {
    const totalCrcBalanceQuery = `
      select sum(balance)::text as total_crc_balance
      from cache_crc_balances_by_safe_and_token
      where safe_address = $1`;

    const balanceResult = await Environment.indexDb.query(
      totalCrcBalanceQuery,
      [safeAddress]);

    if(balanceResult.rows.filter(o => !!o.total_crc_balance).length == 0) {
      return null;
    }

    const balance = balanceResult.rows[0].total_crc_balance;
    return new BN(balance);
  }
}
