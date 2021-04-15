import { PrismaClient } from "@prisma/client";
import {CirclesTokenTransfer} from "../../../types";
import {Context} from "../../../context";

export function objectResolver(prisma:PrismaClient) {
    return async (parent: CirclesTokenTransfer, args: any, context: Context) => {
        const transfer = await prisma.circlesTokenTransfer.findUnique({
            where: {
                id: parent.id
            },
            include: {
                object: true
            }
        });
        if (!transfer) {
            throw new Error(`Couldn't find a circles transfer with id ${parent.id}`);
        }
        return transfer.object;
    };
}