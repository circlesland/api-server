import {Context} from "../../context";
import {getPool} from "../resolvers";
import {prisma_api_ro} from "../../apiDbClient";

export function lastUbiTransaction() {
    return async (parent:any, args:any, context:Context) => {
        const session = await context.verifySession();
        if (!session.profileId) {
            throw new Error(`You need a profile to use this feature.`);
        }

        const profile = await prisma_api_ro.profile.findUnique({where:{id: session.profileId}});
        if (!profile){
            throw new Error(`You need a profile to use this feature.`);
        }
        if (!profile.circlesAddress) {
            throw new Error(`You need a safe to use this feature.`);
        }

        const pool = getPool();
        try {
            const query = `select timestamp, type
          from crc_safe_timeline_2
          where safe_address = $1
          and type = 'crc_minting'
          order by timestamp desc
          limit 1;`

            const result = await pool.query(query, [profile.circlesAddress]);
            return result.rows.length > 0 ? result.rows[0].timestamp.toJSON() : null;
        } finally {
            await pool.end();
        }
    }
}