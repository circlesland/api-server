import {QueryDirectPathArgs} from "../../types";
import BN from "bn.js";
import {Context} from "../../context";
import {Pathfinder} from "../../pathfinder-api/pathfinder";
import {PathValidator} from "../../pathfinder-api/pathValidator";
import {DbBalanceProvider} from "../../pathfinder-api/dbBalanceProvider";

export const directPath = async (parent: any, args: QueryDirectPathArgs, context: Context) => {
  const from = args.from.toLowerCase();
  const to = args.to.toLowerCase();

  const balanceProvider = new DbBalanceProvider();

  const amount = args.amount.trim();

  let isBn: boolean;
  try {
    const bn = new BN(amount);
    isBn = true;
  } catch {
    isBn = false;
  }

  if (!isBn) {
    throw new Error(`Amount is not a big integer`);
  }

  const path = amount != "0"
      ? await Pathfinder.findPath(from, to, args.amount, context)
      : await Pathfinder.findMaxFlow(balanceProvider, from, to, context);

  const validationResult = await PathValidator.validate(path);
  if (validationResult.error) {
    console.error(`Invalid path call data: ${validationResult.calldata}`);
  }

  if (validationResult.error) {
    context.log(`The path couldn't be validated at the hub contract: ${validationResult.calldata}`);

    if (path.flow) {
      const flowBn = new BN(path.flow);
      const amountBn = new BN(args.amount);
      if (flowBn.gtn(0) && flowBn.lt(amountBn)) {
        context.log(`The max. flow as determined by the pathfinder is ${flowBn} but the user requested ${amountBn}`);
      }
    }
  }

  return path;
};
