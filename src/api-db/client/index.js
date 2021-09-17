
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  warnEnvConflicts,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  Decimal,
  findSync
} = require('./runtime')

const path = require('path')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 2.30.2
 * Query Engine version: b8c35d44de987a9691890b3ddf3e2e7effb9bf20
 */
Prisma.prismaVersion = {
  client: "2.30.2",
  engine: "b8c35d44de987a9691890b3ddf3e2e7effb9bf20"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */

Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = () => (val) => val


// folder where the generated client is found
const dirname = findSync(process.cwd(), [
  '"src/api-db/client"',
  '"api-db/client"',
], ['d'], ['d'], 1)[0] || __dirname

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.Prisma.SessionScalarFieldEnum = makeEnum({
  sessionId: 'sessionId',
  emailAddress: 'emailAddress',
  profileId: 'profileId',
  issuedBy: 'issuedBy',
  jti: 'jti',
  createdAt: 'createdAt',
  endedAt: 'endedAt',
  endReason: 'endReason',
  maxLifetime: 'maxLifetime'
});

exports.Prisma.InvitationScalarFieldEnum = makeEnum({
  id: 'id',
  createdByProfileId: 'createdByProfileId',
  createdAt: 'createdAt',
  code: 'code',
  claimedByProfileId: 'claimedByProfileId',
  claimedAt: 'claimedAt',
  redeemedByProfileId: 'redeemedByProfileId',
  redeemedAt: 'redeemedAt',
  key: 'key'
});

exports.Prisma.RedeemInvitationRequestScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  createdByProfileId: 'createdByProfileId',
  workerProcess: 'workerProcess',
  pickedAt: 'pickedAt',
  invitationToRedeemId: 'invitationToRedeemId'
});

exports.Prisma.ProfileScalarFieldEnum = makeEnum({
  id: 'id',
  lastUpdateAt: 'lastUpdateAt',
  emailAddress: 'emailAddress',
  status: 'status',
  circlesAddress: 'circlesAddress',
  circlesSafeOwner: 'circlesSafeOwner',
  circlesTokenAddress: 'circlesTokenAddress',
  firstName: 'firstName',
  lastName: 'lastName',
  avatarUrl: 'avatarUrl',
  avatarCid: 'avatarCid',
  avatarMimeType: 'avatarMimeType',
  dream: 'dream',
  country: 'country',
  newsletter: 'newsletter',
  cityGeonameid: 'cityGeonameid',
  lastAcknowledged: 'lastAcknowledged',
  verifySafeChallenge: 'verifySafeChallenge',
  newSafeAddress: 'newSafeAddress'
});

exports.Prisma.SubscriptionScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  subscriberProfileId: 'subscriberProfileId',
  subscribingToOfferId: 'subscribingToOfferId',
  subscribingToProfileId: 'subscribingToProfileId'
});

exports.Prisma.ChatMessageScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  from: 'from',
  to: 'to',
  text: 'text'
});

exports.Prisma.DelegatedChallengesScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  appId: 'appId',
  sessionId: 'sessionId',
  requestValidTo: 'requestValidTo',
  delegateAuthCode: 'delegateAuthCode',
  challenge: 'challenge',
  challengeDepositedAt: 'challengeDepositedAt',
  challengeValidTo: 'challengeValidTo',
  challengedReadAt: 'challengedReadAt'
});

exports.Prisma.OfferScalarFieldEnum = makeEnum({
  id: 'id',
  createdByProfileId: 'createdByProfileId',
  publishedAt: 'publishedAt',
  unlistedAt: 'unlistedAt',
  title: 'title',
  pictureUrl: 'pictureUrl',
  pictureMimeType: 'pictureMimeType',
  description: 'description',
  categoryTagId: 'categoryTagId',
  geonameid: 'geonameid',
  pricePerUnit: 'pricePerUnit',
  unitTagId: 'unitTagId',
  maxUnits: 'maxUnits',
  deliveryTermsTagId: 'deliveryTermsTagId'
});

exports.Prisma.PurchaseScalarFieldEnum = makeEnum({
  id: 'id',
  purchasedByProfileId: 'purchasedByProfileId',
  purchasedAt: 'purchasedAt',
  purchasedProvenAt: 'purchasedProvenAt',
  purchasedItemId: 'purchasedItemId',
  purchasedItemTitle: 'purchasedItemTitle',
  pricePerUnit: 'pricePerUnit',
  purchasedUnits: 'purchasedUnits',
  grandTotal: 'grandTotal',
  purchasedItemVat: 'purchasedItemVat',
  status: 'status'
});

exports.Prisma.TransactionJobsScalarFieldEnum = makeEnum({
  id: 'id',
  transactionhash: 'transactionhash',
  status: 'status',
  user: 'user',
  purchaseId: 'purchaseId'
});

exports.Prisma.TagTypeScalarFieldEnum = makeEnum({
  id: 'id'
});

exports.Prisma.TransactionScalarFieldEnum = makeEnum({
  transactionHash: 'transactionHash'
});

exports.Prisma.TagScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  createdByProfileId: 'createdByProfileId',
  isPrivate: 'isPrivate',
  transactionHash: 'transactionHash',
  typeId: 'typeId',
  chatMessageId: 'chatMessageId',
  value: 'value'
});

exports.Prisma.SortOrder = makeEnum({
  asc: 'asc',
  desc: 'desc'
});

exports.Prisma.QueryMode = makeEnum({
  default: 'default',
  insensitive: 'insensitive'
});
exports.PurchaseStatus = makeEnum({
  INVALID: 'INVALID',
  ITEM_LOCKED: 'ITEM_LOCKED',
  PAYMENT_PROVEN: 'PAYMENT_PROVEN'
});

exports.Prisma.ModelName = makeEnum({
  Session: 'Session',
  Invitation: 'Invitation',
  RedeemInvitationRequest: 'RedeemInvitationRequest',
  Profile: 'Profile',
  Subscription: 'Subscription',
  ChatMessage: 'ChatMessage',
  DelegatedChallenges: 'DelegatedChallenges',
  Offer: 'Offer',
  Purchase: 'Purchase',
  TransactionJobs: 'TransactionJobs',
  TagType: 'TagType',
  Transaction: 'Transaction',
  Tag: 'Tag'
});


/**
 * DMMF
 */

// We are parsing 2 times, as we want independent objects, because
// DMMFClass introduces circular references in the dmmf object
const dmmf = JSON.parse(dmmfString)
exports.Prisma.dmmf = JSON.parse(dmmfString)

/**
 * Create the Client
 */

const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/home/daniel/src/circles-world/api-server/src/api-db/client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "binary"
    },
    "binaryTargets": [],
    "previewFeatures": [],
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null
  },
  "relativePath": "..",
  "clientVersion": "2.30.2",
  "engineVersion": "b8c35d44de987a9691890b3ddf3e2e7effb9bf20",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql"
}
config.document = dmmf
config.dirname = dirname

/**
 * Only for env conflict warning
 * loading of env variable occurs in getPrismaClient
 */
const envPaths = {
  rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(dirname, config.relativeEnvPaths.rootEnvPath),
  schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(dirname, config.relativeEnvPaths.schemaEnvPath)
}
warnEnvConflicts(envPaths)

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)

/**
 * Build tool annotations
 * In order to make `ncc` and `@vercel/nft` happy.
 * The process.cwd() annotation is only needed for https://github.com/vercel/vercel/tree/master/packages/now-next
**/
path.join(__dirname, 'query-engine-debian-openssl-1.1.x');
path.join(process.cwd(), './src/api-db/client/query-engine-debian-openssl-1.1.x')
/**
 * Annotation for `@vercel/nft`
 * The process.cwd() annotation is only needed for https://github.com/vercel/vercel/tree/master/packages/now-next
**/
path.join(__dirname, 'schema.prisma');
path.join(process.cwd(), './src/api-db/client/schema.prisma');