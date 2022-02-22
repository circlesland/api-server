import { PrismaClient } from "../../api-db/client";
import { Context } from "../../context";
import { Organisation, Profile, QueryOrganisationsArgs } from "../../types";
import { ProfileLoader } from "../../profileLoader";
import { Environment } from "../../environment";

export function organisations(prisma: PrismaClient) {
  return async (
    parent: any,
    args: QueryOrganisationsArgs,
    context: Context
  ) => {
    let organisationSignupQuery = `
          select organisation, timestamp
          from crc_organisation_signup_2`;

    let limit = 100;

    if (args.pagination) {
      limit =
        Number.isInteger(args.pagination.limit) &&
        args.pagination.limit > 0 &&
        args.pagination.limit <= 100
          ? args.pagination.limit
          : 100;

      if (args.pagination.continueAt) {
        const continueAtDate = new Date(Date.parse(args.pagination.continueAt));
        organisationSignupQuery += ` where timestamp < '${continueAtDate.toISOString()}'`;
      }
    }
    organisationSignupQuery += ` order by timestamp desc`;
    organisationSignupQuery += ` limit ${limit}`;

    const organisationSignupsResult = await Environment.indexDb.query(
      organisationSignupQuery
    );
    if (organisationSignupsResult.rows.length == 0) {
      return [];
    }

    const allCreationDates = organisationSignupsResult.rows.reduce((p, c) => {
      p[c.organisation] = new Date(c.timestamp);
      return p;
    }, {});

    const profileLoader = new ProfileLoader();
    const profiles = await profileLoader.profilesBySafeAddress(
      prisma,
      Object.keys(allCreationDates)
    );

    return organisationSignupsResult.rows.map((o) => {
      const p: Profile = profiles[o.organisation] ?? {
        id: -1,
        firstName: o.organisation,
        circlesAddress: o.organisation,
      };

      return <Organisation>{
        id: p.id,
        createdAt: allCreationDates[p.circlesAddress ?? ""].toJSON(),
        name: p.firstName,
        cityGeonameid: p.cityGeonameid,
        circlesAddress: p.circlesAddress,
        avatarUrl: p.avatarUrl,
        description: p.dream,
        avatarMimeType: p.avatarMimeType,
      };
    });
  };
}
