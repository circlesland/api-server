import {Context} from "../../context";
import {PrismaClient} from "../../api-db/client";
import {MutationUpsertOrganisationArgs, Profile} from "../../types";
import {prisma_api_ro, prisma_api_rw} from "../../apiDbClient";

export function upsertOrganisation(prisma_api_rw:PrismaClient) {
    return async (parent:any, args:MutationUpsertOrganisationArgs, context:Context) => {
      const ownProfile = await context.callerProfile;

      if (!ownProfile?.circlesAddress) {
        throw new Error(`You need a completed profile to use this feature.`);
      }

      let organisationProfile:Profile;
      if (args.organisation.id) {

        // TODO: Only admins can upsert an organisation

        organisationProfile = await prisma_api_rw.profile.update({
          where: {
            id: args.organisation.id
          },
          data: {
            id: args.organisation.id,
            firstName: args.organisation.name,
            dream: args.organisation.description,
            circlesAddress: args.organisation.circlesAddress,
            avatarUrl: args.organisation.avatarUrl,
            avatarMimeType: args.organisation.avatarMimeType,
            type: "ORGANISATION",
            cityGeonameid: args.organisation.cityGeonameid
          }
        });
      } else {
        organisationProfile = await prisma_api_rw.profile.create({
          data: {
            firstName: args.organisation.name,
            dream: args.organisation.description,
            circlesAddress: args.organisation.circlesAddress,
            avatarUrl: args.organisation.avatarUrl,
            avatarMimeType: args.organisation.avatarMimeType,
            type: "ORGANISATION",
            cityGeonameid: args.organisation.cityGeonameid
          }
        });
        const adminMembership = await prisma_api_rw.membership.create({
          data: {
            isAdmin: true,
            memberId: ownProfile.id,
            memberAtId: organisationProfile.id
          }
        })
      }

      return {
        success: true,
        organisation: {
          ...args,
          id: organisationProfile.id,
          createdAt: new Date().toJSON(),
          name: organisationProfile.firstName,
          members: []
        }
      };
    }
}