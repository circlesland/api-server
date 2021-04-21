import { PrismaClient } from "@prisma/client";
import {Context} from "../../context";
import {Session} from "../../session";

export function authenticateAtResolver(prisma_rw:PrismaClient) {
    return async (parent: any, args:{appId:string}, context: Context) => {
        const session = await context.verifySession();
        const now = new Date();
        const delegatedChallengeRequest = await prisma_rw.delegatedChallenges.create({
            data: {
                createdAt: now,
                sessionId: session.sessionId,
                appId: args.appId,
                delegateAuthCode: Session.generateRandomBase64String(16),
                requestValidTo: new Date(now.getTime() + 1000 * 10)
            }
        });

        return {
            success: true,
            appId: delegatedChallengeRequest.appId,
            validTo: delegatedChallengeRequest.requestValidTo.toJSON(),
            delegateAuthCode: delegatedChallengeRequest.delegateAuthCode,
            challengeType: "delegated"
        }
    }
}