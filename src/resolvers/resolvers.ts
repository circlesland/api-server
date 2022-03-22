import {Resolvers} from "../types";
import {queryResolvers} from "./queries/queryResolvers";
import {mutationResolvers} from "./mutations/mutationResolvers";
import {subscriptionResolvers} from "./subscriptions/subscriptionResolvers";
import {profilePropertyResolvers} from "./properties/profile";
import {contactPropertyResolver} from "./properties/contact";
import {purchasePropertyResolvers} from "./properties/purchase";
import {invoicePropertyResolver} from "./properties/invoice";
import {invoiceLinePropertyResolver} from "./properties/invoiceLine";
import {purchaseLinePropertyResolvers} from "./properties/purchaseLine";
import {claimedInvitationPropertyResolver} from "./properties/claimedInvitation";
import {profileEventPropertyResolver} from "./properties/profileEvent";
import {offerPropertyResolver} from "./properties/offer";
import {organisationPropertyResolver} from "./properties/organsiation";
import {GraphQLScalarType} from "graphql";

export const resolvers: Resolvers = {
  ...{
    Date: new GraphQLScalarType({
      name: 'Date',
      description: 'Date custom scalar type',
      parseValue(value) {
        return new Date(value); // value from the client
      },
      serialize(value) {
        return value.toJSON(); // value sent to the client
      }
    }),
    Profile: profilePropertyResolvers,
    Contact: contactPropertyResolver,
    Purchase: purchasePropertyResolvers,
    Invoice: invoicePropertyResolver,
    InvoiceLine: invoiceLinePropertyResolver,
    PurchaseLine: purchaseLinePropertyResolvers,
    ClaimedInvitation: claimedInvitationPropertyResolver,
    ProfileEvent: profileEventPropertyResolver,
    Offer: offerPropertyResolver,
    Organisation: organisationPropertyResolver
  },
  Query: queryResolvers,
  Mutation: mutationResolvers,
  Subscription: subscriptionResolvers
};