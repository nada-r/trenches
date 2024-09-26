import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const CallerScalarFieldEnumSchema = z.enum(['id','name','image','telegramId','data','createdAt','updatedAt']);

export const CallScalarFieldEnumSchema = z.enum(['id','tokenAddress','startFDV','highestFDV','callerId','createdAt','updatedAt','data']);

export const ClaimScalarFieldEnumSchema = z.enum(['id','walletPubkey','portfolio','createdAt','updatedAt']);

export const PlayerScalarFieldEnumSchema = z.enum(['id','walletPubkey','data','createdAt','updatedAt']);

export const TokenScalarFieldEnumSchema = z.enum(['id','address','name','ticker','url','image_uri','createdAt','updatedAt','data']);

export const TournamentScalarFieldEnumSchema = z.enum(['id','name','status','startedAt','metadata','createdAt','updatedAt']);

export const TournamentParticipationScalarFieldEnumSchema = z.enum(['id','walletPubkey','callers','createdAt','updatedAt','tournamentId']);

export const TournamenCallerPowerScalarFieldEnumSchema = z.enum(['id','callerId','power','tournamentId','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const NullsOrderSchema = z.enum(['first','last']);

export const TournamentStatusSchema = z.enum(['HIDDEN','UPCOMING','STARTED','COMPLETED','CANCELLED']);

export type TournamentStatusType = `${z.infer<typeof TournamentStatusSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// CALLER SCHEMA
/////////////////////////////////////////

/**
 * generate types for front
 */
export const CallerSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  image: z.string().nullish(),
  telegramId: z.string(),
  /**
   * [CallerData]
   */
  data: z.object({ power: z.number() , rank: z.number()}),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Caller = z.infer<typeof CallerSchema>

/////////////////////////////////////////
// CALL SCHEMA
/////////////////////////////////////////

export const CallSchema = z.object({
  id: z.number().int(),
  tokenAddress: z.string(),
  startFDV: z.number(),
  highestFDV: z.number(),
  callerId: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  /**
   * [CallData | null]]
   */
  data: JsonValueSchema.nullable(),
})

export type Call = z.infer<typeof CallSchema>

/////////////////////////////////////////
// CLAIM SCHEMA
/////////////////////////////////////////

export const ClaimSchema = z.object({
  id: z.number().int(),
  walletPubkey: z.string(),
  /**
   * [ClaimMetadata]
   */
  portfolio: z.array(z.object({ callerId: z.number(), balance: z.number() })),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Claim = z.infer<typeof ClaimSchema>

/////////////////////////////////////////
// PLAYER SCHEMA
/////////////////////////////////////////

export const PlayerSchema = z.object({
  id: z.number().int(),
  walletPubkey: z.string(),
  /**
   * [ProfileMetadata]
   */
  data: z.object({ favorites: z.array(z.number()) }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Player = z.infer<typeof PlayerSchema>

/////////////////////////////////////////
// TOKEN SCHEMA
/////////////////////////////////////////

export const TokenSchema = z.object({
  id: z.number().int(),
  address: z.string(),
  name: z.string(),
  ticker: z.string(),
  url: z.string(),
  image_uri: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  /**
   * [TokenData]
   */
  data: JsonValueSchema,
})

export type Token = z.infer<typeof TokenSchema>

/////////////////////////////////////////
// TOURNAMENT SCHEMA
/////////////////////////////////////////

export const TournamentSchema = z.object({
  status: TournamentStatusSchema,
  id: z.number().int(),
  name: z.string(),
  startedAt: z.coerce.date().nullish(),
  /**
   * [TournamentMetadata]
   */
  metadata: z.object({ openDuration: z.number(), endDuration: z.number(), prize: z.number(), supplyBurn: z.number() }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Tournament = z.infer<typeof TournamentSchema>

/////////////////////////////////////////
// TOURNAMENT PARTICIPATION SCHEMA
/////////////////////////////////////////

export const TournamentParticipationSchema = z.object({
  id: z.number().int(),
  walletPubkey: z.string(),
  callers: z.string().array(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  tournamentId: z.number().int(),
})

export type TournamentParticipation = z.infer<typeof TournamentParticipationSchema>

/////////////////////////////////////////
// TOURNAMEN CALLER POWER SCHEMA
/////////////////////////////////////////

export const TournamenCallerPowerSchema = z.object({
  id: z.number().int(),
  callerId: z.number().int(),
  power: z.number(),
  tournamentId: z.number().int(),
  updatedAt: z.coerce.date(),
})

export type TournamenCallerPower = z.infer<typeof TournamenCallerPowerSchema>
