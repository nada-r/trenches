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

export const CardScalarFieldEnumSchema = z.enum(['id','name','price','image','createdAt','updatedAt','powerId']);

export const PowerScalarFieldEnumSchema = z.enum(['id','name','value','createdAt','updatedAt']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','walletString','createdAt','updatedAt']);

export const TestScalarFieldEnumSchema = z.enum(['id','name','createdAt','updatedAt']);

export const TournamentScalarFieldEnumSchema = z.enum(['id','name','status','startedAt','metadata','createdAt','updatedAt']);

export const TournamentParticipationScalarFieldEnumSchema = z.enum(['id','walletString','tournamentId']);

export const CallerScalarFieldEnumSchema = z.enum(['id','name','image','telegramId','createdAt','updatedAt']);

export const CallScalarFieldEnumSchema = z.enum(['id','tokenAddress','startFDV','highestFDV','callerId','createdAt','updatedAt','data']);

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
// CARD SCHEMA
/////////////////////////////////////////

/**
 * generate types for front
 */
export const CardSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  price: z.number().int(),
  image: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  powerId: z.number().int(),
})

export type Card = z.infer<typeof CardSchema>

/////////////////////////////////////////
// POWER SCHEMA
/////////////////////////////////////////

export const PowerSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  value: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Power = z.infer<typeof PowerSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  walletString: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// TEST SCHEMA
/////////////////////////////////////////

export const TestSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Test = z.infer<typeof TestSchema>

/////////////////////////////////////////
// TOURNAMENT SCHEMA
/////////////////////////////////////////

export const TournamentSchema = z.object({
  status: TournamentStatusSchema,
  id: z.number().int(),
  name: z.string(),
  startedAt: z.coerce.date().nullable(),
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
  walletString: z.string(),
  tournamentId: z.number().int(),
})

export type TournamentParticipation = z.infer<typeof TournamentParticipationSchema>

/////////////////////////////////////////
// CALLER SCHEMA
/////////////////////////////////////////

export const CallerSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  image: z.string().nullable(),
  telegramId: z.string(),
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
  data: JsonValueSchema.nullable(),
})

export type Call = z.infer<typeof CallSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// CARD
//------------------------------------------------------

export const CardIncludeSchema: z.ZodType<Prisma.CardInclude> = z.object({
  power: z.union([z.boolean(),z.lazy(() => PowerArgsSchema)]).optional(),
  tournamentParticipations: z.union([z.boolean(),z.lazy(() => TournamentParticipationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CardCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CardArgsSchema: z.ZodType<Prisma.CardDefaultArgs> = z.object({
  select: z.lazy(() => CardSelectSchema).optional(),
  include: z.lazy(() => CardIncludeSchema).optional(),
}).strict();

export const CardCountOutputTypeArgsSchema: z.ZodType<Prisma.CardCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CardCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CardCountOutputTypeSelectSchema: z.ZodType<Prisma.CardCountOutputTypeSelect> = z.object({
  tournamentParticipations: z.boolean().optional(),
}).strict();

export const CardSelectSchema: z.ZodType<Prisma.CardSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  price: z.boolean().optional(),
  image: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  powerId: z.boolean().optional(),
  power: z.union([z.boolean(),z.lazy(() => PowerArgsSchema)]).optional(),
  tournamentParticipations: z.union([z.boolean(),z.lazy(() => TournamentParticipationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CardCountOutputTypeArgsSchema)]).optional(),
}).strict()

// POWER
//------------------------------------------------------

export const PowerIncludeSchema: z.ZodType<Prisma.PowerInclude> = z.object({
  card: z.union([z.boolean(),z.lazy(() => CardArgsSchema)]).optional(),
}).strict()

export const PowerArgsSchema: z.ZodType<Prisma.PowerDefaultArgs> = z.object({
  select: z.lazy(() => PowerSelectSchema).optional(),
  include: z.lazy(() => PowerIncludeSchema).optional(),
}).strict();

export const PowerSelectSchema: z.ZodType<Prisma.PowerSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  value: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  card: z.union([z.boolean(),z.lazy(() => CardArgsSchema)]).optional(),
}).strict()

// USER
//------------------------------------------------------

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  walletString: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
}).strict()

// TEST
//------------------------------------------------------

export const TestSelectSchema: z.ZodType<Prisma.TestSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
}).strict()

// TOURNAMENT
//------------------------------------------------------

export const TournamentIncludeSchema: z.ZodType<Prisma.TournamentInclude> = z.object({
  participations: z.union([z.boolean(),z.lazy(() => TournamentParticipationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TournamentCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const TournamentArgsSchema: z.ZodType<Prisma.TournamentDefaultArgs> = z.object({
  select: z.lazy(() => TournamentSelectSchema).optional(),
  include: z.lazy(() => TournamentIncludeSchema).optional(),
}).strict();

export const TournamentCountOutputTypeArgsSchema: z.ZodType<Prisma.TournamentCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => TournamentCountOutputTypeSelectSchema).nullish(),
}).strict();

export const TournamentCountOutputTypeSelectSchema: z.ZodType<Prisma.TournamentCountOutputTypeSelect> = z.object({
  participations: z.boolean().optional(),
}).strict();

export const TournamentSelectSchema: z.ZodType<Prisma.TournamentSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  status: z.boolean().optional(),
  startedAt: z.boolean().optional(),
  metadata: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  participations: z.union([z.boolean(),z.lazy(() => TournamentParticipationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TournamentCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TOURNAMENT PARTICIPATION
//------------------------------------------------------

export const TournamentParticipationIncludeSchema: z.ZodType<Prisma.TournamentParticipationInclude> = z.object({
  cardIds: z.union([z.boolean(),z.lazy(() => CardFindManyArgsSchema)]).optional(),
  tournament: z.union([z.boolean(),z.lazy(() => TournamentArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TournamentParticipationCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const TournamentParticipationArgsSchema: z.ZodType<Prisma.TournamentParticipationDefaultArgs> = z.object({
  select: z.lazy(() => TournamentParticipationSelectSchema).optional(),
  include: z.lazy(() => TournamentParticipationIncludeSchema).optional(),
}).strict();

export const TournamentParticipationCountOutputTypeArgsSchema: z.ZodType<Prisma.TournamentParticipationCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => TournamentParticipationCountOutputTypeSelectSchema).nullish(),
}).strict();

export const TournamentParticipationCountOutputTypeSelectSchema: z.ZodType<Prisma.TournamentParticipationCountOutputTypeSelect> = z.object({
  cardIds: z.boolean().optional(),
}).strict();

export const TournamentParticipationSelectSchema: z.ZodType<Prisma.TournamentParticipationSelect> = z.object({
  id: z.boolean().optional(),
  walletString: z.boolean().optional(),
  tournamentId: z.boolean().optional(),
  cardIds: z.union([z.boolean(),z.lazy(() => CardFindManyArgsSchema)]).optional(),
  tournament: z.union([z.boolean(),z.lazy(() => TournamentArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TournamentParticipationCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CALLER
//------------------------------------------------------

export const CallerIncludeSchema: z.ZodType<Prisma.CallerInclude> = z.object({
  calls: z.union([z.boolean(),z.lazy(() => CallFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CallerCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CallerArgsSchema: z.ZodType<Prisma.CallerDefaultArgs> = z.object({
  select: z.lazy(() => CallerSelectSchema).optional(),
  include: z.lazy(() => CallerIncludeSchema).optional(),
}).strict();

export const CallerCountOutputTypeArgsSchema: z.ZodType<Prisma.CallerCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CallerCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CallerCountOutputTypeSelectSchema: z.ZodType<Prisma.CallerCountOutputTypeSelect> = z.object({
  calls: z.boolean().optional(),
}).strict();

export const CallerSelectSchema: z.ZodType<Prisma.CallerSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  image: z.boolean().optional(),
  telegramId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  calls: z.union([z.boolean(),z.lazy(() => CallFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CallerCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CALL
//------------------------------------------------------

export const CallIncludeSchema: z.ZodType<Prisma.CallInclude> = z.object({
  caller: z.union([z.boolean(),z.lazy(() => CallerArgsSchema)]).optional(),
}).strict()

export const CallArgsSchema: z.ZodType<Prisma.CallDefaultArgs> = z.object({
  select: z.lazy(() => CallSelectSchema).optional(),
  include: z.lazy(() => CallIncludeSchema).optional(),
}).strict();

export const CallSelectSchema: z.ZodType<Prisma.CallSelect> = z.object({
  id: z.boolean().optional(),
  tokenAddress: z.boolean().optional(),
  startFDV: z.boolean().optional(),
  highestFDV: z.boolean().optional(),
  callerId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  data: z.boolean().optional(),
  caller: z.union([z.boolean(),z.lazy(() => CallerArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const CardWhereInputSchema: z.ZodType<Prisma.CardWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CardWhereInputSchema),z.lazy(() => CardWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CardWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CardWhereInputSchema),z.lazy(() => CardWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  price: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  image: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  powerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  power: z.union([ z.lazy(() => PowerRelationFilterSchema),z.lazy(() => PowerWhereInputSchema) ]).optional(),
  tournamentParticipations: z.lazy(() => TournamentParticipationListRelationFilterSchema).optional()
}).strict();

export const CardOrderByWithRelationInputSchema: z.ZodType<Prisma.CardOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  powerId: z.lazy(() => SortOrderSchema).optional(),
  power: z.lazy(() => PowerOrderByWithRelationInputSchema).optional(),
  tournamentParticipations: z.lazy(() => TournamentParticipationOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CardWhereUniqueInputSchema: z.ZodType<Prisma.CardWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    powerId: z.number().int()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    powerId: z.number().int(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  powerId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => CardWhereInputSchema),z.lazy(() => CardWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CardWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CardWhereInputSchema),z.lazy(() => CardWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  price: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  image: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  power: z.union([ z.lazy(() => PowerRelationFilterSchema),z.lazy(() => PowerWhereInputSchema) ]).optional(),
  tournamentParticipations: z.lazy(() => TournamentParticipationListRelationFilterSchema).optional()
}).strict());

export const CardOrderByWithAggregationInputSchema: z.ZodType<Prisma.CardOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  powerId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CardCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CardAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CardMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CardMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CardSumOrderByAggregateInputSchema).optional()
}).strict();

export const CardScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CardScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CardScalarWhereWithAggregatesInputSchema),z.lazy(() => CardScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CardScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CardScalarWhereWithAggregatesInputSchema),z.lazy(() => CardScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  price: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  image: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  powerId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const PowerWhereInputSchema: z.ZodType<Prisma.PowerWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PowerWhereInputSchema),z.lazy(() => PowerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PowerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PowerWhereInputSchema),z.lazy(() => PowerWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  card: z.union([ z.lazy(() => CardNullableRelationFilterSchema),z.lazy(() => CardWhereInputSchema) ]).optional().nullable(),
}).strict();

export const PowerOrderByWithRelationInputSchema: z.ZodType<Prisma.PowerOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  card: z.lazy(() => CardOrderByWithRelationInputSchema).optional()
}).strict();

export const PowerWhereUniqueInputSchema: z.ZodType<Prisma.PowerWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => PowerWhereInputSchema),z.lazy(() => PowerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PowerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PowerWhereInputSchema),z.lazy(() => PowerWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  card: z.union([ z.lazy(() => CardNullableRelationFilterSchema),z.lazy(() => CardWhereInputSchema) ]).optional().nullable(),
}).strict());

export const PowerOrderByWithAggregationInputSchema: z.ZodType<Prisma.PowerOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PowerCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PowerAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PowerMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PowerMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PowerSumOrderByAggregateInputSchema).optional()
}).strict();

export const PowerScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PowerScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PowerScalarWhereWithAggregatesInputSchema),z.lazy(() => PowerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PowerScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PowerScalarWhereWithAggregatesInputSchema),z.lazy(() => PowerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  walletString: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  walletString: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  walletString: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  walletString: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserSumOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  walletString: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TestWhereInputSchema: z.ZodType<Prisma.TestWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TestWhereInputSchema),z.lazy(() => TestWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestWhereInputSchema),z.lazy(() => TestWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TestOrderByWithRelationInputSchema: z.ZodType<Prisma.TestOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestWhereUniqueInputSchema: z.ZodType<Prisma.TestWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => TestWhereInputSchema),z.lazy(() => TestWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestWhereInputSchema),z.lazy(() => TestWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict());

export const TestOrderByWithAggregationInputSchema: z.ZodType<Prisma.TestOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TestCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => TestAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TestMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TestMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => TestSumOrderByAggregateInputSchema).optional()
}).strict();

export const TestScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TestScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TestScalarWhereWithAggregatesInputSchema),z.lazy(() => TestScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestScalarWhereWithAggregatesInputSchema),z.lazy(() => TestScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TournamentWhereInputSchema: z.ZodType<Prisma.TournamentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TournamentWhereInputSchema),z.lazy(() => TournamentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TournamentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TournamentWhereInputSchema),z.lazy(() => TournamentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumTournamentStatusFilterSchema),z.lazy(() => TournamentStatusSchema) ]).optional(),
  startedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  metadata: z.lazy(() => JsonFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  participations: z.lazy(() => TournamentParticipationListRelationFilterSchema).optional()
}).strict();

export const TournamentOrderByWithRelationInputSchema: z.ZodType<Prisma.TournamentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  metadata: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  participations: z.lazy(() => TournamentParticipationOrderByRelationAggregateInputSchema).optional()
}).strict();

export const TournamentWhereUniqueInputSchema: z.ZodType<Prisma.TournamentWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => TournamentWhereInputSchema),z.lazy(() => TournamentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TournamentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TournamentWhereInputSchema),z.lazy(() => TournamentWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumTournamentStatusFilterSchema),z.lazy(() => TournamentStatusSchema) ]).optional(),
  startedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  metadata: z.lazy(() => JsonFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  participations: z.lazy(() => TournamentParticipationListRelationFilterSchema).optional()
}).strict());

export const TournamentOrderByWithAggregationInputSchema: z.ZodType<Prisma.TournamentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  metadata: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TournamentCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => TournamentAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TournamentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TournamentMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => TournamentSumOrderByAggregateInputSchema).optional()
}).strict();

export const TournamentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TournamentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TournamentScalarWhereWithAggregatesInputSchema),z.lazy(() => TournamentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TournamentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TournamentScalarWhereWithAggregatesInputSchema),z.lazy(() => TournamentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumTournamentStatusWithAggregatesFilterSchema),z.lazy(() => TournamentStatusSchema) ]).optional(),
  startedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  metadata: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TournamentParticipationWhereInputSchema: z.ZodType<Prisma.TournamentParticipationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TournamentParticipationWhereInputSchema),z.lazy(() => TournamentParticipationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TournamentParticipationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TournamentParticipationWhereInputSchema),z.lazy(() => TournamentParticipationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  walletString: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tournamentId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  cardIds: z.lazy(() => CardListRelationFilterSchema).optional(),
  tournament: z.union([ z.lazy(() => TournamentRelationFilterSchema),z.lazy(() => TournamentWhereInputSchema) ]).optional(),
}).strict();

export const TournamentParticipationOrderByWithRelationInputSchema: z.ZodType<Prisma.TournamentParticipationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  walletString: z.lazy(() => SortOrderSchema).optional(),
  tournamentId: z.lazy(() => SortOrderSchema).optional(),
  cardIds: z.lazy(() => CardOrderByRelationAggregateInputSchema).optional(),
  tournament: z.lazy(() => TournamentOrderByWithRelationInputSchema).optional()
}).strict();

export const TournamentParticipationWhereUniqueInputSchema: z.ZodType<Prisma.TournamentParticipationWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => TournamentParticipationWhereInputSchema),z.lazy(() => TournamentParticipationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TournamentParticipationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TournamentParticipationWhereInputSchema),z.lazy(() => TournamentParticipationWhereInputSchema).array() ]).optional(),
  walletString: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tournamentId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  cardIds: z.lazy(() => CardListRelationFilterSchema).optional(),
  tournament: z.union([ z.lazy(() => TournamentRelationFilterSchema),z.lazy(() => TournamentWhereInputSchema) ]).optional(),
}).strict());

export const TournamentParticipationOrderByWithAggregationInputSchema: z.ZodType<Prisma.TournamentParticipationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  walletString: z.lazy(() => SortOrderSchema).optional(),
  tournamentId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TournamentParticipationCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => TournamentParticipationAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TournamentParticipationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TournamentParticipationMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => TournamentParticipationSumOrderByAggregateInputSchema).optional()
}).strict();

export const TournamentParticipationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TournamentParticipationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TournamentParticipationScalarWhereWithAggregatesInputSchema),z.lazy(() => TournamentParticipationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TournamentParticipationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TournamentParticipationScalarWhereWithAggregatesInputSchema),z.lazy(() => TournamentParticipationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  walletString: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tournamentId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const CallerWhereInputSchema: z.ZodType<Prisma.CallerWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CallerWhereInputSchema),z.lazy(() => CallerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallerWhereInputSchema),z.lazy(() => CallerWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  telegramId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  calls: z.lazy(() => CallListRelationFilterSchema).optional()
}).strict();

export const CallerOrderByWithRelationInputSchema: z.ZodType<Prisma.CallerOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  telegramId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  calls: z.lazy(() => CallOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CallerWhereUniqueInputSchema: z.ZodType<Prisma.CallerWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    telegramId: z.string()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    telegramId: z.string(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  telegramId: z.string().optional(),
  AND: z.union([ z.lazy(() => CallerWhereInputSchema),z.lazy(() => CallerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallerWhereInputSchema),z.lazy(() => CallerWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  calls: z.lazy(() => CallListRelationFilterSchema).optional()
}).strict());

export const CallerOrderByWithAggregationInputSchema: z.ZodType<Prisma.CallerOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  telegramId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CallerCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CallerAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CallerMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CallerMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CallerSumOrderByAggregateInputSchema).optional()
}).strict();

export const CallerScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CallerScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CallerScalarWhereWithAggregatesInputSchema),z.lazy(() => CallerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallerScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallerScalarWhereWithAggregatesInputSchema),z.lazy(() => CallerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  image: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  telegramId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const CallWhereInputSchema: z.ZodType<Prisma.CallWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CallWhereInputSchema),z.lazy(() => CallWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallWhereInputSchema),z.lazy(() => CallWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  startFDV: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  highestFDV: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  callerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  data: z.lazy(() => JsonNullableFilterSchema).optional(),
  caller: z.union([ z.lazy(() => CallerRelationFilterSchema),z.lazy(() => CallerWhereInputSchema) ]).optional(),
}).strict();

export const CallOrderByWithRelationInputSchema: z.ZodType<Prisma.CallOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  startFDV: z.lazy(() => SortOrderSchema).optional(),
  highestFDV: z.lazy(() => SortOrderSchema).optional(),
  callerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  data: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  caller: z.lazy(() => CallerOrderByWithRelationInputSchema).optional()
}).strict();

export const CallWhereUniqueInputSchema: z.ZodType<Prisma.CallWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => CallWhereInputSchema),z.lazy(() => CallWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallWhereInputSchema),z.lazy(() => CallWhereInputSchema).array() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  startFDV: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  highestFDV: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  callerId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  data: z.lazy(() => JsonNullableFilterSchema).optional(),
  caller: z.union([ z.lazy(() => CallerRelationFilterSchema),z.lazy(() => CallerWhereInputSchema) ]).optional(),
}).strict());

export const CallOrderByWithAggregationInputSchema: z.ZodType<Prisma.CallOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  startFDV: z.lazy(() => SortOrderSchema).optional(),
  highestFDV: z.lazy(() => SortOrderSchema).optional(),
  callerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  data: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => CallCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CallAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CallMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CallMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CallSumOrderByAggregateInputSchema).optional()
}).strict();

export const CallScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CallScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CallScalarWhereWithAggregatesInputSchema),z.lazy(() => CallScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallScalarWhereWithAggregatesInputSchema),z.lazy(() => CallScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  startFDV: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  highestFDV: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  callerId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  data: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional()
}).strict();

export const CardCreateInputSchema: z.ZodType<Prisma.CardCreateInput> = z.object({
  name: z.string(),
  price: z.number().int(),
  image: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  power: z.lazy(() => PowerCreateNestedOneWithoutCardInputSchema),
  tournamentParticipations: z.lazy(() => TournamentParticipationCreateNestedManyWithoutCardIdsInputSchema).optional()
}).strict();

export const CardUncheckedCreateInputSchema: z.ZodType<Prisma.CardUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  price: z.number().int(),
  image: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  powerId: z.number().int(),
  tournamentParticipations: z.lazy(() => TournamentParticipationUncheckedCreateNestedManyWithoutCardIdsInputSchema).optional()
}).strict();

export const CardUpdateInputSchema: z.ZodType<Prisma.CardUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  power: z.lazy(() => PowerUpdateOneRequiredWithoutCardNestedInputSchema).optional(),
  tournamentParticipations: z.lazy(() => TournamentParticipationUpdateManyWithoutCardIdsNestedInputSchema).optional()
}).strict();

export const CardUncheckedUpdateInputSchema: z.ZodType<Prisma.CardUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  powerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tournamentParticipations: z.lazy(() => TournamentParticipationUncheckedUpdateManyWithoutCardIdsNestedInputSchema).optional()
}).strict();

export const CardCreateManyInputSchema: z.ZodType<Prisma.CardCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  price: z.number().int(),
  image: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  powerId: z.number().int()
}).strict();

export const CardUpdateManyMutationInputSchema: z.ZodType<Prisma.CardUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CardUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CardUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  powerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PowerCreateInputSchema: z.ZodType<Prisma.PowerCreateInput> = z.object({
  name: z.string(),
  value: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  card: z.lazy(() => CardCreateNestedOneWithoutPowerInputSchema).optional()
}).strict();

export const PowerUncheckedCreateInputSchema: z.ZodType<Prisma.PowerUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  value: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  card: z.lazy(() => CardUncheckedCreateNestedOneWithoutPowerInputSchema).optional()
}).strict();

export const PowerUpdateInputSchema: z.ZodType<Prisma.PowerUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  card: z.lazy(() => CardUpdateOneWithoutPowerNestedInputSchema).optional()
}).strict();

export const PowerUncheckedUpdateInputSchema: z.ZodType<Prisma.PowerUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  card: z.lazy(() => CardUncheckedUpdateOneWithoutPowerNestedInputSchema).optional()
}).strict();

export const PowerCreateManyInputSchema: z.ZodType<Prisma.PowerCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  value: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PowerUpdateManyMutationInputSchema: z.ZodType<Prisma.PowerUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PowerUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PowerUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  name: z.string(),
  walletString: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  walletString: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletString: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletString: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  walletString: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletString: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletString: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TestCreateInputSchema: z.ZodType<Prisma.TestCreateInput> = z.object({
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TestUncheckedCreateInputSchema: z.ZodType<Prisma.TestUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TestUpdateInputSchema: z.ZodType<Prisma.TestUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TestUncheckedUpdateInputSchema: z.ZodType<Prisma.TestUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TestCreateManyInputSchema: z.ZodType<Prisma.TestCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TestUpdateManyMutationInputSchema: z.ZodType<Prisma.TestUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TestUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TestUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TournamentCreateInputSchema: z.ZodType<Prisma.TournamentCreateInput> = z.object({
  name: z.string(),
  status: z.lazy(() => TournamentStatusSchema).optional(),
  startedAt: z.coerce.date().optional().nullable(),
  metadata: z.union([ z.lazy(() => JsonNullValueInputSchema),z.object({ openDuration: z.number(), endDuration: z.number(), prize: z.number(), supplyBurn: z.number() }) ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  participations: z.lazy(() => TournamentParticipationCreateNestedManyWithoutTournamentInputSchema).optional()
}).strict();

export const TournamentUncheckedCreateInputSchema: z.ZodType<Prisma.TournamentUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  status: z.lazy(() => TournamentStatusSchema).optional(),
  startedAt: z.coerce.date().optional().nullable(),
  metadata: z.union([ z.lazy(() => JsonNullValueInputSchema),z.object({ openDuration: z.number(), endDuration: z.number(), prize: z.number(), supplyBurn: z.number() }) ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  participations: z.lazy(() => TournamentParticipationUncheckedCreateNestedManyWithoutTournamentInputSchema).optional()
}).strict();

export const TournamentUpdateInputSchema: z.ZodType<Prisma.TournamentUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => TournamentStatusSchema),z.lazy(() => EnumTournamentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => JsonNullValueInputSchema),z.object({ openDuration: z.number(), endDuration: z.number(), prize: z.number(), supplyBurn: z.number() }) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  participations: z.lazy(() => TournamentParticipationUpdateManyWithoutTournamentNestedInputSchema).optional()
}).strict();

export const TournamentUncheckedUpdateInputSchema: z.ZodType<Prisma.TournamentUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => TournamentStatusSchema),z.lazy(() => EnumTournamentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => JsonNullValueInputSchema),z.object({ openDuration: z.number(), endDuration: z.number(), prize: z.number(), supplyBurn: z.number() }) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  participations: z.lazy(() => TournamentParticipationUncheckedUpdateManyWithoutTournamentNestedInputSchema).optional()
}).strict();

export const TournamentCreateManyInputSchema: z.ZodType<Prisma.TournamentCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  status: z.lazy(() => TournamentStatusSchema).optional(),
  startedAt: z.coerce.date().optional().nullable(),
  metadata: z.union([ z.lazy(() => JsonNullValueInputSchema),z.object({ openDuration: z.number(), endDuration: z.number(), prize: z.number(), supplyBurn: z.number() }) ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TournamentUpdateManyMutationInputSchema: z.ZodType<Prisma.TournamentUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => TournamentStatusSchema),z.lazy(() => EnumTournamentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => JsonNullValueInputSchema),z.object({ openDuration: z.number(), endDuration: z.number(), prize: z.number(), supplyBurn: z.number() }) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TournamentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TournamentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => TournamentStatusSchema),z.lazy(() => EnumTournamentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => JsonNullValueInputSchema),z.object({ openDuration: z.number(), endDuration: z.number(), prize: z.number(), supplyBurn: z.number() }) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TournamentParticipationCreateInputSchema: z.ZodType<Prisma.TournamentParticipationCreateInput> = z.object({
  walletString: z.string(),
  cardIds: z.lazy(() => CardCreateNestedManyWithoutTournamentParticipationsInputSchema).optional(),
  tournament: z.lazy(() => TournamentCreateNestedOneWithoutParticipationsInputSchema)
}).strict();

export const TournamentParticipationUncheckedCreateInputSchema: z.ZodType<Prisma.TournamentParticipationUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  walletString: z.string(),
  tournamentId: z.number().int(),
  cardIds: z.lazy(() => CardUncheckedCreateNestedManyWithoutTournamentParticipationsInputSchema).optional()
}).strict();

export const TournamentParticipationUpdateInputSchema: z.ZodType<Prisma.TournamentParticipationUpdateInput> = z.object({
  walletString: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cardIds: z.lazy(() => CardUpdateManyWithoutTournamentParticipationsNestedInputSchema).optional(),
  tournament: z.lazy(() => TournamentUpdateOneRequiredWithoutParticipationsNestedInputSchema).optional()
}).strict();

export const TournamentParticipationUncheckedUpdateInputSchema: z.ZodType<Prisma.TournamentParticipationUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  walletString: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tournamentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cardIds: z.lazy(() => CardUncheckedUpdateManyWithoutTournamentParticipationsNestedInputSchema).optional()
}).strict();

export const TournamentParticipationCreateManyInputSchema: z.ZodType<Prisma.TournamentParticipationCreateManyInput> = z.object({
  id: z.number().int().optional(),
  walletString: z.string(),
  tournamentId: z.number().int()
}).strict();

export const TournamentParticipationUpdateManyMutationInputSchema: z.ZodType<Prisma.TournamentParticipationUpdateManyMutationInput> = z.object({
  walletString: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TournamentParticipationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TournamentParticipationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  walletString: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tournamentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallerCreateInputSchema: z.ZodType<Prisma.CallerCreateInput> = z.object({
  name: z.string(),
  image: z.string().optional().nullable(),
  telegramId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  calls: z.lazy(() => CallCreateNestedManyWithoutCallerInputSchema).optional()
}).strict();

export const CallerUncheckedCreateInputSchema: z.ZodType<Prisma.CallerUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  image: z.string().optional().nullable(),
  telegramId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  calls: z.lazy(() => CallUncheckedCreateNestedManyWithoutCallerInputSchema).optional()
}).strict();

export const CallerUpdateInputSchema: z.ZodType<Prisma.CallerUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  telegramId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  calls: z.lazy(() => CallUpdateManyWithoutCallerNestedInputSchema).optional()
}).strict();

export const CallerUncheckedUpdateInputSchema: z.ZodType<Prisma.CallerUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  telegramId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  calls: z.lazy(() => CallUncheckedUpdateManyWithoutCallerNestedInputSchema).optional()
}).strict();

export const CallerCreateManyInputSchema: z.ZodType<Prisma.CallerCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  image: z.string().optional().nullable(),
  telegramId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CallerUpdateManyMutationInputSchema: z.ZodType<Prisma.CallerUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  telegramId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallerUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CallerUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  telegramId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallCreateInputSchema: z.ZodType<Prisma.CallCreateInput> = z.object({
  tokenAddress: z.string(),
  startFDV: z.number(),
  highestFDV: z.number(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  caller: z.lazy(() => CallerCreateNestedOneWithoutCallsInputSchema)
}).strict();

export const CallUncheckedCreateInputSchema: z.ZodType<Prisma.CallUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  tokenAddress: z.string(),
  startFDV: z.number(),
  highestFDV: z.number(),
  callerId: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const CallUpdateInputSchema: z.ZodType<Prisma.CallUpdateInput> = z.object({
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startFDV: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  highestFDV: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  caller: z.lazy(() => CallerUpdateOneRequiredWithoutCallsNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateInputSchema: z.ZodType<Prisma.CallUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startFDV: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  highestFDV: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  callerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const CallCreateManyInputSchema: z.ZodType<Prisma.CallCreateManyInput> = z.object({
  id: z.number().int().optional(),
  tokenAddress: z.string(),
  startFDV: z.number(),
  highestFDV: z.number(),
  callerId: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const CallUpdateManyMutationInputSchema: z.ZodType<Prisma.CallUpdateManyMutationInput> = z.object({
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startFDV: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  highestFDV: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const CallUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startFDV: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  highestFDV: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  callerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const PowerRelationFilterSchema: z.ZodType<Prisma.PowerRelationFilter> = z.object({
  is: z.lazy(() => PowerWhereInputSchema).optional(),
  isNot: z.lazy(() => PowerWhereInputSchema).optional()
}).strict();

export const TournamentParticipationListRelationFilterSchema: z.ZodType<Prisma.TournamentParticipationListRelationFilter> = z.object({
  every: z.lazy(() => TournamentParticipationWhereInputSchema).optional(),
  some: z.lazy(() => TournamentParticipationWhereInputSchema).optional(),
  none: z.lazy(() => TournamentParticipationWhereInputSchema).optional()
}).strict();

export const TournamentParticipationOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TournamentParticipationOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CardCountOrderByAggregateInputSchema: z.ZodType<Prisma.CardCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  powerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CardAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CardAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  powerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CardMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CardMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  powerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CardMinOrderByAggregateInputSchema: z.ZodType<Prisma.CardMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  powerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CardSumOrderByAggregateInputSchema: z.ZodType<Prisma.CardSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  powerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const CardNullableRelationFilterSchema: z.ZodType<Prisma.CardNullableRelationFilter> = z.object({
  is: z.lazy(() => CardWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => CardWhereInputSchema).optional().nullable()
}).strict();

export const PowerCountOrderByAggregateInputSchema: z.ZodType<Prisma.PowerCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PowerAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PowerAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PowerMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PowerMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PowerMinOrderByAggregateInputSchema: z.ZodType<Prisma.PowerMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PowerSumOrderByAggregateInputSchema: z.ZodType<Prisma.PowerSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  walletString: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  walletString: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  walletString: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestCountOrderByAggregateInputSchema: z.ZodType<Prisma.TestCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestAvgOrderByAggregateInputSchema: z.ZodType<Prisma.TestAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TestMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestMinOrderByAggregateInputSchema: z.ZodType<Prisma.TestMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TestSumOrderByAggregateInputSchema: z.ZodType<Prisma.TestSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumTournamentStatusFilterSchema: z.ZodType<Prisma.EnumTournamentStatusFilter> = z.object({
  equals: z.lazy(() => TournamentStatusSchema).optional(),
  in: z.lazy(() => TournamentStatusSchema).array().optional(),
  notIn: z.lazy(() => TournamentStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => TournamentStatusSchema),z.lazy(() => NestedEnumTournamentStatusFilterSchema) ]).optional(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const TournamentCountOrderByAggregateInputSchema: z.ZodType<Prisma.TournamentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.lazy(() => SortOrderSchema).optional(),
  metadata: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TournamentAvgOrderByAggregateInputSchema: z.ZodType<Prisma.TournamentAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TournamentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TournamentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TournamentMinOrderByAggregateInputSchema: z.ZodType<Prisma.TournamentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TournamentSumOrderByAggregateInputSchema: z.ZodType<Prisma.TournamentSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumTournamentStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumTournamentStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TournamentStatusSchema).optional(),
  in: z.lazy(() => TournamentStatusSchema).array().optional(),
  notIn: z.lazy(() => TournamentStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => TournamentStatusSchema),z.lazy(() => NestedEnumTournamentStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTournamentStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTournamentStatusFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional()
}).strict();

export const CardListRelationFilterSchema: z.ZodType<Prisma.CardListRelationFilter> = z.object({
  every: z.lazy(() => CardWhereInputSchema).optional(),
  some: z.lazy(() => CardWhereInputSchema).optional(),
  none: z.lazy(() => CardWhereInputSchema).optional()
}).strict();

export const TournamentRelationFilterSchema: z.ZodType<Prisma.TournamentRelationFilter> = z.object({
  is: z.lazy(() => TournamentWhereInputSchema).optional(),
  isNot: z.lazy(() => TournamentWhereInputSchema).optional()
}).strict();

export const CardOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CardOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TournamentParticipationCountOrderByAggregateInputSchema: z.ZodType<Prisma.TournamentParticipationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  walletString: z.lazy(() => SortOrderSchema).optional(),
  tournamentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TournamentParticipationAvgOrderByAggregateInputSchema: z.ZodType<Prisma.TournamentParticipationAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tournamentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TournamentParticipationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TournamentParticipationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  walletString: z.lazy(() => SortOrderSchema).optional(),
  tournamentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TournamentParticipationMinOrderByAggregateInputSchema: z.ZodType<Prisma.TournamentParticipationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  walletString: z.lazy(() => SortOrderSchema).optional(),
  tournamentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TournamentParticipationSumOrderByAggregateInputSchema: z.ZodType<Prisma.TournamentParticipationSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tournamentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const CallListRelationFilterSchema: z.ZodType<Prisma.CallListRelationFilter> = z.object({
  every: z.lazy(() => CallWhereInputSchema).optional(),
  some: z.lazy(() => CallWhereInputSchema).optional(),
  none: z.lazy(() => CallWhereInputSchema).optional()
}).strict();

export const CallOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CallOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallerCountOrderByAggregateInputSchema: z.ZodType<Prisma.CallerCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  telegramId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallerAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CallerAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallerMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CallerMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  telegramId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallerMinOrderByAggregateInputSchema: z.ZodType<Prisma.CallerMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  telegramId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallerSumOrderByAggregateInputSchema: z.ZodType<Prisma.CallerSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const CallerRelationFilterSchema: z.ZodType<Prisma.CallerRelationFilter> = z.object({
  is: z.lazy(() => CallerWhereInputSchema).optional(),
  isNot: z.lazy(() => CallerWhereInputSchema).optional()
}).strict();

export const CallCountOrderByAggregateInputSchema: z.ZodType<Prisma.CallCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  startFDV: z.lazy(() => SortOrderSchema).optional(),
  highestFDV: z.lazy(() => SortOrderSchema).optional(),
  callerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  data: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CallAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  startFDV: z.lazy(() => SortOrderSchema).optional(),
  highestFDV: z.lazy(() => SortOrderSchema).optional(),
  callerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CallMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  startFDV: z.lazy(() => SortOrderSchema).optional(),
  highestFDV: z.lazy(() => SortOrderSchema).optional(),
  callerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallMinOrderByAggregateInputSchema: z.ZodType<Prisma.CallMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  startFDV: z.lazy(() => SortOrderSchema).optional(),
  highestFDV: z.lazy(() => SortOrderSchema).optional(),
  callerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallSumOrderByAggregateInputSchema: z.ZodType<Prisma.CallSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  startFDV: z.lazy(() => SortOrderSchema).optional(),
  highestFDV: z.lazy(() => SortOrderSchema).optional(),
  callerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional()
}).strict();

export const PowerCreateNestedOneWithoutCardInputSchema: z.ZodType<Prisma.PowerCreateNestedOneWithoutCardInput> = z.object({
  create: z.union([ z.lazy(() => PowerCreateWithoutCardInputSchema),z.lazy(() => PowerUncheckedCreateWithoutCardInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PowerCreateOrConnectWithoutCardInputSchema).optional(),
  connect: z.lazy(() => PowerWhereUniqueInputSchema).optional()
}).strict();

export const TournamentParticipationCreateNestedManyWithoutCardIdsInputSchema: z.ZodType<Prisma.TournamentParticipationCreateNestedManyWithoutCardIdsInput> = z.object({
  create: z.union([ z.lazy(() => TournamentParticipationCreateWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationCreateWithoutCardIdsInputSchema).array(),z.lazy(() => TournamentParticipationUncheckedCreateWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationUncheckedCreateWithoutCardIdsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TournamentParticipationCreateOrConnectWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationCreateOrConnectWithoutCardIdsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TournamentParticipationWhereUniqueInputSchema),z.lazy(() => TournamentParticipationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TournamentParticipationUncheckedCreateNestedManyWithoutCardIdsInputSchema: z.ZodType<Prisma.TournamentParticipationUncheckedCreateNestedManyWithoutCardIdsInput> = z.object({
  create: z.union([ z.lazy(() => TournamentParticipationCreateWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationCreateWithoutCardIdsInputSchema).array(),z.lazy(() => TournamentParticipationUncheckedCreateWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationUncheckedCreateWithoutCardIdsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TournamentParticipationCreateOrConnectWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationCreateOrConnectWithoutCardIdsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TournamentParticipationWhereUniqueInputSchema),z.lazy(() => TournamentParticipationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const PowerUpdateOneRequiredWithoutCardNestedInputSchema: z.ZodType<Prisma.PowerUpdateOneRequiredWithoutCardNestedInput> = z.object({
  create: z.union([ z.lazy(() => PowerCreateWithoutCardInputSchema),z.lazy(() => PowerUncheckedCreateWithoutCardInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PowerCreateOrConnectWithoutCardInputSchema).optional(),
  upsert: z.lazy(() => PowerUpsertWithoutCardInputSchema).optional(),
  connect: z.lazy(() => PowerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PowerUpdateToOneWithWhereWithoutCardInputSchema),z.lazy(() => PowerUpdateWithoutCardInputSchema),z.lazy(() => PowerUncheckedUpdateWithoutCardInputSchema) ]).optional(),
}).strict();

export const TournamentParticipationUpdateManyWithoutCardIdsNestedInputSchema: z.ZodType<Prisma.TournamentParticipationUpdateManyWithoutCardIdsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TournamentParticipationCreateWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationCreateWithoutCardIdsInputSchema).array(),z.lazy(() => TournamentParticipationUncheckedCreateWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationUncheckedCreateWithoutCardIdsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TournamentParticipationCreateOrConnectWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationCreateOrConnectWithoutCardIdsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TournamentParticipationUpsertWithWhereUniqueWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationUpsertWithWhereUniqueWithoutCardIdsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TournamentParticipationWhereUniqueInputSchema),z.lazy(() => TournamentParticipationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TournamentParticipationWhereUniqueInputSchema),z.lazy(() => TournamentParticipationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TournamentParticipationWhereUniqueInputSchema),z.lazy(() => TournamentParticipationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TournamentParticipationWhereUniqueInputSchema),z.lazy(() => TournamentParticipationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TournamentParticipationUpdateWithWhereUniqueWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationUpdateWithWhereUniqueWithoutCardIdsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TournamentParticipationUpdateManyWithWhereWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationUpdateManyWithWhereWithoutCardIdsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TournamentParticipationScalarWhereInputSchema),z.lazy(() => TournamentParticipationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TournamentParticipationUncheckedUpdateManyWithoutCardIdsNestedInputSchema: z.ZodType<Prisma.TournamentParticipationUncheckedUpdateManyWithoutCardIdsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TournamentParticipationCreateWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationCreateWithoutCardIdsInputSchema).array(),z.lazy(() => TournamentParticipationUncheckedCreateWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationUncheckedCreateWithoutCardIdsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TournamentParticipationCreateOrConnectWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationCreateOrConnectWithoutCardIdsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TournamentParticipationUpsertWithWhereUniqueWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationUpsertWithWhereUniqueWithoutCardIdsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TournamentParticipationWhereUniqueInputSchema),z.lazy(() => TournamentParticipationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TournamentParticipationWhereUniqueInputSchema),z.lazy(() => TournamentParticipationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TournamentParticipationWhereUniqueInputSchema),z.lazy(() => TournamentParticipationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TournamentParticipationWhereUniqueInputSchema),z.lazy(() => TournamentParticipationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TournamentParticipationUpdateWithWhereUniqueWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationUpdateWithWhereUniqueWithoutCardIdsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TournamentParticipationUpdateManyWithWhereWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationUpdateManyWithWhereWithoutCardIdsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TournamentParticipationScalarWhereInputSchema),z.lazy(() => TournamentParticipationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CardCreateNestedOneWithoutPowerInputSchema: z.ZodType<Prisma.CardCreateNestedOneWithoutPowerInput> = z.object({
  create: z.union([ z.lazy(() => CardCreateWithoutPowerInputSchema),z.lazy(() => CardUncheckedCreateWithoutPowerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CardCreateOrConnectWithoutPowerInputSchema).optional(),
  connect: z.lazy(() => CardWhereUniqueInputSchema).optional()
}).strict();

export const CardUncheckedCreateNestedOneWithoutPowerInputSchema: z.ZodType<Prisma.CardUncheckedCreateNestedOneWithoutPowerInput> = z.object({
  create: z.union([ z.lazy(() => CardCreateWithoutPowerInputSchema),z.lazy(() => CardUncheckedCreateWithoutPowerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CardCreateOrConnectWithoutPowerInputSchema).optional(),
  connect: z.lazy(() => CardWhereUniqueInputSchema).optional()
}).strict();

export const CardUpdateOneWithoutPowerNestedInputSchema: z.ZodType<Prisma.CardUpdateOneWithoutPowerNestedInput> = z.object({
  create: z.union([ z.lazy(() => CardCreateWithoutPowerInputSchema),z.lazy(() => CardUncheckedCreateWithoutPowerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CardCreateOrConnectWithoutPowerInputSchema).optional(),
  upsert: z.lazy(() => CardUpsertWithoutPowerInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CardWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CardWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CardWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CardUpdateToOneWithWhereWithoutPowerInputSchema),z.lazy(() => CardUpdateWithoutPowerInputSchema),z.lazy(() => CardUncheckedUpdateWithoutPowerInputSchema) ]).optional(),
}).strict();

export const CardUncheckedUpdateOneWithoutPowerNestedInputSchema: z.ZodType<Prisma.CardUncheckedUpdateOneWithoutPowerNestedInput> = z.object({
  create: z.union([ z.lazy(() => CardCreateWithoutPowerInputSchema),z.lazy(() => CardUncheckedCreateWithoutPowerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CardCreateOrConnectWithoutPowerInputSchema).optional(),
  upsert: z.lazy(() => CardUpsertWithoutPowerInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CardWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CardWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CardWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CardUpdateToOneWithWhereWithoutPowerInputSchema),z.lazy(() => CardUpdateWithoutPowerInputSchema),z.lazy(() => CardUncheckedUpdateWithoutPowerInputSchema) ]).optional(),
}).strict();

export const TournamentParticipationCreateNestedManyWithoutTournamentInputSchema: z.ZodType<Prisma.TournamentParticipationCreateNestedManyWithoutTournamentInput> = z.object({
  create: z.union([ z.lazy(() => TournamentParticipationCreateWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationCreateWithoutTournamentInputSchema).array(),z.lazy(() => TournamentParticipationUncheckedCreateWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationUncheckedCreateWithoutTournamentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TournamentParticipationCreateOrConnectWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationCreateOrConnectWithoutTournamentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TournamentParticipationCreateManyTournamentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TournamentParticipationWhereUniqueInputSchema),z.lazy(() => TournamentParticipationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TournamentParticipationUncheckedCreateNestedManyWithoutTournamentInputSchema: z.ZodType<Prisma.TournamentParticipationUncheckedCreateNestedManyWithoutTournamentInput> = z.object({
  create: z.union([ z.lazy(() => TournamentParticipationCreateWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationCreateWithoutTournamentInputSchema).array(),z.lazy(() => TournamentParticipationUncheckedCreateWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationUncheckedCreateWithoutTournamentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TournamentParticipationCreateOrConnectWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationCreateOrConnectWithoutTournamentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TournamentParticipationCreateManyTournamentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TournamentParticipationWhereUniqueInputSchema),z.lazy(() => TournamentParticipationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumTournamentStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumTournamentStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => TournamentStatusSchema).optional()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const TournamentParticipationUpdateManyWithoutTournamentNestedInputSchema: z.ZodType<Prisma.TournamentParticipationUpdateManyWithoutTournamentNestedInput> = z.object({
  create: z.union([ z.lazy(() => TournamentParticipationCreateWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationCreateWithoutTournamentInputSchema).array(),z.lazy(() => TournamentParticipationUncheckedCreateWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationUncheckedCreateWithoutTournamentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TournamentParticipationCreateOrConnectWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationCreateOrConnectWithoutTournamentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TournamentParticipationUpsertWithWhereUniqueWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationUpsertWithWhereUniqueWithoutTournamentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TournamentParticipationCreateManyTournamentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TournamentParticipationWhereUniqueInputSchema),z.lazy(() => TournamentParticipationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TournamentParticipationWhereUniqueInputSchema),z.lazy(() => TournamentParticipationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TournamentParticipationWhereUniqueInputSchema),z.lazy(() => TournamentParticipationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TournamentParticipationWhereUniqueInputSchema),z.lazy(() => TournamentParticipationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TournamentParticipationUpdateWithWhereUniqueWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationUpdateWithWhereUniqueWithoutTournamentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TournamentParticipationUpdateManyWithWhereWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationUpdateManyWithWhereWithoutTournamentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TournamentParticipationScalarWhereInputSchema),z.lazy(() => TournamentParticipationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TournamentParticipationUncheckedUpdateManyWithoutTournamentNestedInputSchema: z.ZodType<Prisma.TournamentParticipationUncheckedUpdateManyWithoutTournamentNestedInput> = z.object({
  create: z.union([ z.lazy(() => TournamentParticipationCreateWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationCreateWithoutTournamentInputSchema).array(),z.lazy(() => TournamentParticipationUncheckedCreateWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationUncheckedCreateWithoutTournamentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TournamentParticipationCreateOrConnectWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationCreateOrConnectWithoutTournamentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TournamentParticipationUpsertWithWhereUniqueWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationUpsertWithWhereUniqueWithoutTournamentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TournamentParticipationCreateManyTournamentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TournamentParticipationWhereUniqueInputSchema),z.lazy(() => TournamentParticipationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TournamentParticipationWhereUniqueInputSchema),z.lazy(() => TournamentParticipationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TournamentParticipationWhereUniqueInputSchema),z.lazy(() => TournamentParticipationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TournamentParticipationWhereUniqueInputSchema),z.lazy(() => TournamentParticipationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TournamentParticipationUpdateWithWhereUniqueWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationUpdateWithWhereUniqueWithoutTournamentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TournamentParticipationUpdateManyWithWhereWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationUpdateManyWithWhereWithoutTournamentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TournamentParticipationScalarWhereInputSchema),z.lazy(() => TournamentParticipationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CardCreateNestedManyWithoutTournamentParticipationsInputSchema: z.ZodType<Prisma.CardCreateNestedManyWithoutTournamentParticipationsInput> = z.object({
  create: z.union([ z.lazy(() => CardCreateWithoutTournamentParticipationsInputSchema),z.lazy(() => CardCreateWithoutTournamentParticipationsInputSchema).array(),z.lazy(() => CardUncheckedCreateWithoutTournamentParticipationsInputSchema),z.lazy(() => CardUncheckedCreateWithoutTournamentParticipationsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CardCreateOrConnectWithoutTournamentParticipationsInputSchema),z.lazy(() => CardCreateOrConnectWithoutTournamentParticipationsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CardWhereUniqueInputSchema),z.lazy(() => CardWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TournamentCreateNestedOneWithoutParticipationsInputSchema: z.ZodType<Prisma.TournamentCreateNestedOneWithoutParticipationsInput> = z.object({
  create: z.union([ z.lazy(() => TournamentCreateWithoutParticipationsInputSchema),z.lazy(() => TournamentUncheckedCreateWithoutParticipationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TournamentCreateOrConnectWithoutParticipationsInputSchema).optional(),
  connect: z.lazy(() => TournamentWhereUniqueInputSchema).optional()
}).strict();

export const CardUncheckedCreateNestedManyWithoutTournamentParticipationsInputSchema: z.ZodType<Prisma.CardUncheckedCreateNestedManyWithoutTournamentParticipationsInput> = z.object({
  create: z.union([ z.lazy(() => CardCreateWithoutTournamentParticipationsInputSchema),z.lazy(() => CardCreateWithoutTournamentParticipationsInputSchema).array(),z.lazy(() => CardUncheckedCreateWithoutTournamentParticipationsInputSchema),z.lazy(() => CardUncheckedCreateWithoutTournamentParticipationsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CardCreateOrConnectWithoutTournamentParticipationsInputSchema),z.lazy(() => CardCreateOrConnectWithoutTournamentParticipationsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CardWhereUniqueInputSchema),z.lazy(() => CardWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CardUpdateManyWithoutTournamentParticipationsNestedInputSchema: z.ZodType<Prisma.CardUpdateManyWithoutTournamentParticipationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CardCreateWithoutTournamentParticipationsInputSchema),z.lazy(() => CardCreateWithoutTournamentParticipationsInputSchema).array(),z.lazy(() => CardUncheckedCreateWithoutTournamentParticipationsInputSchema),z.lazy(() => CardUncheckedCreateWithoutTournamentParticipationsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CardCreateOrConnectWithoutTournamentParticipationsInputSchema),z.lazy(() => CardCreateOrConnectWithoutTournamentParticipationsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CardUpsertWithWhereUniqueWithoutTournamentParticipationsInputSchema),z.lazy(() => CardUpsertWithWhereUniqueWithoutTournamentParticipationsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => CardWhereUniqueInputSchema),z.lazy(() => CardWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CardWhereUniqueInputSchema),z.lazy(() => CardWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CardWhereUniqueInputSchema),z.lazy(() => CardWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CardWhereUniqueInputSchema),z.lazy(() => CardWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CardUpdateWithWhereUniqueWithoutTournamentParticipationsInputSchema),z.lazy(() => CardUpdateWithWhereUniqueWithoutTournamentParticipationsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CardUpdateManyWithWhereWithoutTournamentParticipationsInputSchema),z.lazy(() => CardUpdateManyWithWhereWithoutTournamentParticipationsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CardScalarWhereInputSchema),z.lazy(() => CardScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TournamentUpdateOneRequiredWithoutParticipationsNestedInputSchema: z.ZodType<Prisma.TournamentUpdateOneRequiredWithoutParticipationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TournamentCreateWithoutParticipationsInputSchema),z.lazy(() => TournamentUncheckedCreateWithoutParticipationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TournamentCreateOrConnectWithoutParticipationsInputSchema).optional(),
  upsert: z.lazy(() => TournamentUpsertWithoutParticipationsInputSchema).optional(),
  connect: z.lazy(() => TournamentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TournamentUpdateToOneWithWhereWithoutParticipationsInputSchema),z.lazy(() => TournamentUpdateWithoutParticipationsInputSchema),z.lazy(() => TournamentUncheckedUpdateWithoutParticipationsInputSchema) ]).optional(),
}).strict();

export const CardUncheckedUpdateManyWithoutTournamentParticipationsNestedInputSchema: z.ZodType<Prisma.CardUncheckedUpdateManyWithoutTournamentParticipationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CardCreateWithoutTournamentParticipationsInputSchema),z.lazy(() => CardCreateWithoutTournamentParticipationsInputSchema).array(),z.lazy(() => CardUncheckedCreateWithoutTournamentParticipationsInputSchema),z.lazy(() => CardUncheckedCreateWithoutTournamentParticipationsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CardCreateOrConnectWithoutTournamentParticipationsInputSchema),z.lazy(() => CardCreateOrConnectWithoutTournamentParticipationsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CardUpsertWithWhereUniqueWithoutTournamentParticipationsInputSchema),z.lazy(() => CardUpsertWithWhereUniqueWithoutTournamentParticipationsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => CardWhereUniqueInputSchema),z.lazy(() => CardWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CardWhereUniqueInputSchema),z.lazy(() => CardWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CardWhereUniqueInputSchema),z.lazy(() => CardWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CardWhereUniqueInputSchema),z.lazy(() => CardWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CardUpdateWithWhereUniqueWithoutTournamentParticipationsInputSchema),z.lazy(() => CardUpdateWithWhereUniqueWithoutTournamentParticipationsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CardUpdateManyWithWhereWithoutTournamentParticipationsInputSchema),z.lazy(() => CardUpdateManyWithWhereWithoutTournamentParticipationsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CardScalarWhereInputSchema),z.lazy(() => CardScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CallCreateNestedManyWithoutCallerInputSchema: z.ZodType<Prisma.CallCreateNestedManyWithoutCallerInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutCallerInputSchema),z.lazy(() => CallCreateWithoutCallerInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutCallerInputSchema),z.lazy(() => CallUncheckedCreateWithoutCallerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutCallerInputSchema),z.lazy(() => CallCreateOrConnectWithoutCallerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyCallerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CallUncheckedCreateNestedManyWithoutCallerInputSchema: z.ZodType<Prisma.CallUncheckedCreateNestedManyWithoutCallerInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutCallerInputSchema),z.lazy(() => CallCreateWithoutCallerInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutCallerInputSchema),z.lazy(() => CallUncheckedCreateWithoutCallerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutCallerInputSchema),z.lazy(() => CallCreateOrConnectWithoutCallerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyCallerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const CallUpdateManyWithoutCallerNestedInputSchema: z.ZodType<Prisma.CallUpdateManyWithoutCallerNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutCallerInputSchema),z.lazy(() => CallCreateWithoutCallerInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutCallerInputSchema),z.lazy(() => CallUncheckedCreateWithoutCallerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutCallerInputSchema),z.lazy(() => CallCreateOrConnectWithoutCallerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CallUpsertWithWhereUniqueWithoutCallerInputSchema),z.lazy(() => CallUpsertWithWhereUniqueWithoutCallerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyCallerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CallUpdateWithWhereUniqueWithoutCallerInputSchema),z.lazy(() => CallUpdateWithWhereUniqueWithoutCallerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CallUpdateManyWithWhereWithoutCallerInputSchema),z.lazy(() => CallUpdateManyWithWhereWithoutCallerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CallUncheckedUpdateManyWithoutCallerNestedInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyWithoutCallerNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutCallerInputSchema),z.lazy(() => CallCreateWithoutCallerInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutCallerInputSchema),z.lazy(() => CallUncheckedCreateWithoutCallerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutCallerInputSchema),z.lazy(() => CallCreateOrConnectWithoutCallerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CallUpsertWithWhereUniqueWithoutCallerInputSchema),z.lazy(() => CallUpsertWithWhereUniqueWithoutCallerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyCallerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CallUpdateWithWhereUniqueWithoutCallerInputSchema),z.lazy(() => CallUpdateWithWhereUniqueWithoutCallerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CallUpdateManyWithWhereWithoutCallerInputSchema),z.lazy(() => CallUpdateManyWithWhereWithoutCallerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CallerCreateNestedOneWithoutCallsInputSchema: z.ZodType<Prisma.CallerCreateNestedOneWithoutCallsInput> = z.object({
  create: z.union([ z.lazy(() => CallerCreateWithoutCallsInputSchema),z.lazy(() => CallerUncheckedCreateWithoutCallsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CallerCreateOrConnectWithoutCallsInputSchema).optional(),
  connect: z.lazy(() => CallerWhereUniqueInputSchema).optional()
}).strict();

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const CallerUpdateOneRequiredWithoutCallsNestedInputSchema: z.ZodType<Prisma.CallerUpdateOneRequiredWithoutCallsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallerCreateWithoutCallsInputSchema),z.lazy(() => CallerUncheckedCreateWithoutCallsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CallerCreateOrConnectWithoutCallsInputSchema).optional(),
  upsert: z.lazy(() => CallerUpsertWithoutCallsInputSchema).optional(),
  connect: z.lazy(() => CallerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CallerUpdateToOneWithWhereWithoutCallsInputSchema),z.lazy(() => CallerUpdateWithoutCallsInputSchema),z.lazy(() => CallerUncheckedUpdateWithoutCallsInputSchema) ]).optional(),
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedEnumTournamentStatusFilterSchema: z.ZodType<Prisma.NestedEnumTournamentStatusFilter> = z.object({
  equals: z.lazy(() => TournamentStatusSchema).optional(),
  in: z.lazy(() => TournamentStatusSchema).array().optional(),
  notIn: z.lazy(() => TournamentStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => TournamentStatusSchema),z.lazy(() => NestedEnumTournamentStatusFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumTournamentStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumTournamentStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TournamentStatusSchema).optional(),
  in: z.lazy(() => TournamentStatusSchema).array().optional(),
  notIn: z.lazy(() => TournamentStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => TournamentStatusSchema),z.lazy(() => NestedEnumTournamentStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTournamentStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTournamentStatusFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const PowerCreateWithoutCardInputSchema: z.ZodType<Prisma.PowerCreateWithoutCardInput> = z.object({
  name: z.string(),
  value: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PowerUncheckedCreateWithoutCardInputSchema: z.ZodType<Prisma.PowerUncheckedCreateWithoutCardInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  value: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PowerCreateOrConnectWithoutCardInputSchema: z.ZodType<Prisma.PowerCreateOrConnectWithoutCardInput> = z.object({
  where: z.lazy(() => PowerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PowerCreateWithoutCardInputSchema),z.lazy(() => PowerUncheckedCreateWithoutCardInputSchema) ]),
}).strict();

export const TournamentParticipationCreateWithoutCardIdsInputSchema: z.ZodType<Prisma.TournamentParticipationCreateWithoutCardIdsInput> = z.object({
  walletString: z.string(),
  tournament: z.lazy(() => TournamentCreateNestedOneWithoutParticipationsInputSchema)
}).strict();

export const TournamentParticipationUncheckedCreateWithoutCardIdsInputSchema: z.ZodType<Prisma.TournamentParticipationUncheckedCreateWithoutCardIdsInput> = z.object({
  id: z.number().int().optional(),
  walletString: z.string(),
  tournamentId: z.number().int()
}).strict();

export const TournamentParticipationCreateOrConnectWithoutCardIdsInputSchema: z.ZodType<Prisma.TournamentParticipationCreateOrConnectWithoutCardIdsInput> = z.object({
  where: z.lazy(() => TournamentParticipationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TournamentParticipationCreateWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationUncheckedCreateWithoutCardIdsInputSchema) ]),
}).strict();

export const PowerUpsertWithoutCardInputSchema: z.ZodType<Prisma.PowerUpsertWithoutCardInput> = z.object({
  update: z.union([ z.lazy(() => PowerUpdateWithoutCardInputSchema),z.lazy(() => PowerUncheckedUpdateWithoutCardInputSchema) ]),
  create: z.union([ z.lazy(() => PowerCreateWithoutCardInputSchema),z.lazy(() => PowerUncheckedCreateWithoutCardInputSchema) ]),
  where: z.lazy(() => PowerWhereInputSchema).optional()
}).strict();

export const PowerUpdateToOneWithWhereWithoutCardInputSchema: z.ZodType<Prisma.PowerUpdateToOneWithWhereWithoutCardInput> = z.object({
  where: z.lazy(() => PowerWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PowerUpdateWithoutCardInputSchema),z.lazy(() => PowerUncheckedUpdateWithoutCardInputSchema) ]),
}).strict();

export const PowerUpdateWithoutCardInputSchema: z.ZodType<Prisma.PowerUpdateWithoutCardInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PowerUncheckedUpdateWithoutCardInputSchema: z.ZodType<Prisma.PowerUncheckedUpdateWithoutCardInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TournamentParticipationUpsertWithWhereUniqueWithoutCardIdsInputSchema: z.ZodType<Prisma.TournamentParticipationUpsertWithWhereUniqueWithoutCardIdsInput> = z.object({
  where: z.lazy(() => TournamentParticipationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TournamentParticipationUpdateWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationUncheckedUpdateWithoutCardIdsInputSchema) ]),
  create: z.union([ z.lazy(() => TournamentParticipationCreateWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationUncheckedCreateWithoutCardIdsInputSchema) ]),
}).strict();

export const TournamentParticipationUpdateWithWhereUniqueWithoutCardIdsInputSchema: z.ZodType<Prisma.TournamentParticipationUpdateWithWhereUniqueWithoutCardIdsInput> = z.object({
  where: z.lazy(() => TournamentParticipationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TournamentParticipationUpdateWithoutCardIdsInputSchema),z.lazy(() => TournamentParticipationUncheckedUpdateWithoutCardIdsInputSchema) ]),
}).strict();

export const TournamentParticipationUpdateManyWithWhereWithoutCardIdsInputSchema: z.ZodType<Prisma.TournamentParticipationUpdateManyWithWhereWithoutCardIdsInput> = z.object({
  where: z.lazy(() => TournamentParticipationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TournamentParticipationUpdateManyMutationInputSchema),z.lazy(() => TournamentParticipationUncheckedUpdateManyWithoutCardIdsInputSchema) ]),
}).strict();

export const TournamentParticipationScalarWhereInputSchema: z.ZodType<Prisma.TournamentParticipationScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TournamentParticipationScalarWhereInputSchema),z.lazy(() => TournamentParticipationScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TournamentParticipationScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TournamentParticipationScalarWhereInputSchema),z.lazy(() => TournamentParticipationScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  walletString: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tournamentId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const CardCreateWithoutPowerInputSchema: z.ZodType<Prisma.CardCreateWithoutPowerInput> = z.object({
  name: z.string(),
  price: z.number().int(),
  image: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tournamentParticipations: z.lazy(() => TournamentParticipationCreateNestedManyWithoutCardIdsInputSchema).optional()
}).strict();

export const CardUncheckedCreateWithoutPowerInputSchema: z.ZodType<Prisma.CardUncheckedCreateWithoutPowerInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  price: z.number().int(),
  image: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tournamentParticipations: z.lazy(() => TournamentParticipationUncheckedCreateNestedManyWithoutCardIdsInputSchema).optional()
}).strict();

export const CardCreateOrConnectWithoutPowerInputSchema: z.ZodType<Prisma.CardCreateOrConnectWithoutPowerInput> = z.object({
  where: z.lazy(() => CardWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CardCreateWithoutPowerInputSchema),z.lazy(() => CardUncheckedCreateWithoutPowerInputSchema) ]),
}).strict();

export const CardUpsertWithoutPowerInputSchema: z.ZodType<Prisma.CardUpsertWithoutPowerInput> = z.object({
  update: z.union([ z.lazy(() => CardUpdateWithoutPowerInputSchema),z.lazy(() => CardUncheckedUpdateWithoutPowerInputSchema) ]),
  create: z.union([ z.lazy(() => CardCreateWithoutPowerInputSchema),z.lazy(() => CardUncheckedCreateWithoutPowerInputSchema) ]),
  where: z.lazy(() => CardWhereInputSchema).optional()
}).strict();

export const CardUpdateToOneWithWhereWithoutPowerInputSchema: z.ZodType<Prisma.CardUpdateToOneWithWhereWithoutPowerInput> = z.object({
  where: z.lazy(() => CardWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CardUpdateWithoutPowerInputSchema),z.lazy(() => CardUncheckedUpdateWithoutPowerInputSchema) ]),
}).strict();

export const CardUpdateWithoutPowerInputSchema: z.ZodType<Prisma.CardUpdateWithoutPowerInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tournamentParticipations: z.lazy(() => TournamentParticipationUpdateManyWithoutCardIdsNestedInputSchema).optional()
}).strict();

export const CardUncheckedUpdateWithoutPowerInputSchema: z.ZodType<Prisma.CardUncheckedUpdateWithoutPowerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tournamentParticipations: z.lazy(() => TournamentParticipationUncheckedUpdateManyWithoutCardIdsNestedInputSchema).optional()
}).strict();

export const TournamentParticipationCreateWithoutTournamentInputSchema: z.ZodType<Prisma.TournamentParticipationCreateWithoutTournamentInput> = z.object({
  walletString: z.string(),
  cardIds: z.lazy(() => CardCreateNestedManyWithoutTournamentParticipationsInputSchema).optional()
}).strict();

export const TournamentParticipationUncheckedCreateWithoutTournamentInputSchema: z.ZodType<Prisma.TournamentParticipationUncheckedCreateWithoutTournamentInput> = z.object({
  id: z.number().int().optional(),
  walletString: z.string(),
  cardIds: z.lazy(() => CardUncheckedCreateNestedManyWithoutTournamentParticipationsInputSchema).optional()
}).strict();

export const TournamentParticipationCreateOrConnectWithoutTournamentInputSchema: z.ZodType<Prisma.TournamentParticipationCreateOrConnectWithoutTournamentInput> = z.object({
  where: z.lazy(() => TournamentParticipationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TournamentParticipationCreateWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationUncheckedCreateWithoutTournamentInputSchema) ]),
}).strict();

export const TournamentParticipationCreateManyTournamentInputEnvelopeSchema: z.ZodType<Prisma.TournamentParticipationCreateManyTournamentInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TournamentParticipationCreateManyTournamentInputSchema),z.lazy(() => TournamentParticipationCreateManyTournamentInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TournamentParticipationUpsertWithWhereUniqueWithoutTournamentInputSchema: z.ZodType<Prisma.TournamentParticipationUpsertWithWhereUniqueWithoutTournamentInput> = z.object({
  where: z.lazy(() => TournamentParticipationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TournamentParticipationUpdateWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationUncheckedUpdateWithoutTournamentInputSchema) ]),
  create: z.union([ z.lazy(() => TournamentParticipationCreateWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationUncheckedCreateWithoutTournamentInputSchema) ]),
}).strict();

export const TournamentParticipationUpdateWithWhereUniqueWithoutTournamentInputSchema: z.ZodType<Prisma.TournamentParticipationUpdateWithWhereUniqueWithoutTournamentInput> = z.object({
  where: z.lazy(() => TournamentParticipationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TournamentParticipationUpdateWithoutTournamentInputSchema),z.lazy(() => TournamentParticipationUncheckedUpdateWithoutTournamentInputSchema) ]),
}).strict();

export const TournamentParticipationUpdateManyWithWhereWithoutTournamentInputSchema: z.ZodType<Prisma.TournamentParticipationUpdateManyWithWhereWithoutTournamentInput> = z.object({
  where: z.lazy(() => TournamentParticipationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TournamentParticipationUpdateManyMutationInputSchema),z.lazy(() => TournamentParticipationUncheckedUpdateManyWithoutTournamentInputSchema) ]),
}).strict();

export const CardCreateWithoutTournamentParticipationsInputSchema: z.ZodType<Prisma.CardCreateWithoutTournamentParticipationsInput> = z.object({
  name: z.string(),
  price: z.number().int(),
  image: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  power: z.lazy(() => PowerCreateNestedOneWithoutCardInputSchema)
}).strict();

export const CardUncheckedCreateWithoutTournamentParticipationsInputSchema: z.ZodType<Prisma.CardUncheckedCreateWithoutTournamentParticipationsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  price: z.number().int(),
  image: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  powerId: z.number().int()
}).strict();

export const CardCreateOrConnectWithoutTournamentParticipationsInputSchema: z.ZodType<Prisma.CardCreateOrConnectWithoutTournamentParticipationsInput> = z.object({
  where: z.lazy(() => CardWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CardCreateWithoutTournamentParticipationsInputSchema),z.lazy(() => CardUncheckedCreateWithoutTournamentParticipationsInputSchema) ]),
}).strict();

export const TournamentCreateWithoutParticipationsInputSchema: z.ZodType<Prisma.TournamentCreateWithoutParticipationsInput> = z.object({
  name: z.string(),
  status: z.lazy(() => TournamentStatusSchema).optional(),
  startedAt: z.coerce.date().optional().nullable(),
  metadata: z.union([ z.lazy(() => JsonNullValueInputSchema),z.object({ openDuration: z.number(), endDuration: z.number(), prize: z.number(), supplyBurn: z.number() }) ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TournamentUncheckedCreateWithoutParticipationsInputSchema: z.ZodType<Prisma.TournamentUncheckedCreateWithoutParticipationsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  status: z.lazy(() => TournamentStatusSchema).optional(),
  startedAt: z.coerce.date().optional().nullable(),
  metadata: z.union([ z.lazy(() => JsonNullValueInputSchema),z.object({ openDuration: z.number(), endDuration: z.number(), prize: z.number(), supplyBurn: z.number() }) ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TournamentCreateOrConnectWithoutParticipationsInputSchema: z.ZodType<Prisma.TournamentCreateOrConnectWithoutParticipationsInput> = z.object({
  where: z.lazy(() => TournamentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TournamentCreateWithoutParticipationsInputSchema),z.lazy(() => TournamentUncheckedCreateWithoutParticipationsInputSchema) ]),
}).strict();

export const CardUpsertWithWhereUniqueWithoutTournamentParticipationsInputSchema: z.ZodType<Prisma.CardUpsertWithWhereUniqueWithoutTournamentParticipationsInput> = z.object({
  where: z.lazy(() => CardWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CardUpdateWithoutTournamentParticipationsInputSchema),z.lazy(() => CardUncheckedUpdateWithoutTournamentParticipationsInputSchema) ]),
  create: z.union([ z.lazy(() => CardCreateWithoutTournamentParticipationsInputSchema),z.lazy(() => CardUncheckedCreateWithoutTournamentParticipationsInputSchema) ]),
}).strict();

export const CardUpdateWithWhereUniqueWithoutTournamentParticipationsInputSchema: z.ZodType<Prisma.CardUpdateWithWhereUniqueWithoutTournamentParticipationsInput> = z.object({
  where: z.lazy(() => CardWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CardUpdateWithoutTournamentParticipationsInputSchema),z.lazy(() => CardUncheckedUpdateWithoutTournamentParticipationsInputSchema) ]),
}).strict();

export const CardUpdateManyWithWhereWithoutTournamentParticipationsInputSchema: z.ZodType<Prisma.CardUpdateManyWithWhereWithoutTournamentParticipationsInput> = z.object({
  where: z.lazy(() => CardScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CardUpdateManyMutationInputSchema),z.lazy(() => CardUncheckedUpdateManyWithoutTournamentParticipationsInputSchema) ]),
}).strict();

export const CardScalarWhereInputSchema: z.ZodType<Prisma.CardScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CardScalarWhereInputSchema),z.lazy(() => CardScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CardScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CardScalarWhereInputSchema),z.lazy(() => CardScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  price: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  image: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  powerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const TournamentUpsertWithoutParticipationsInputSchema: z.ZodType<Prisma.TournamentUpsertWithoutParticipationsInput> = z.object({
  update: z.union([ z.lazy(() => TournamentUpdateWithoutParticipationsInputSchema),z.lazy(() => TournamentUncheckedUpdateWithoutParticipationsInputSchema) ]),
  create: z.union([ z.lazy(() => TournamentCreateWithoutParticipationsInputSchema),z.lazy(() => TournamentUncheckedCreateWithoutParticipationsInputSchema) ]),
  where: z.lazy(() => TournamentWhereInputSchema).optional()
}).strict();

export const TournamentUpdateToOneWithWhereWithoutParticipationsInputSchema: z.ZodType<Prisma.TournamentUpdateToOneWithWhereWithoutParticipationsInput> = z.object({
  where: z.lazy(() => TournamentWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TournamentUpdateWithoutParticipationsInputSchema),z.lazy(() => TournamentUncheckedUpdateWithoutParticipationsInputSchema) ]),
}).strict();

export const TournamentUpdateWithoutParticipationsInputSchema: z.ZodType<Prisma.TournamentUpdateWithoutParticipationsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => TournamentStatusSchema),z.lazy(() => EnumTournamentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => JsonNullValueInputSchema),z.object({ openDuration: z.number(), endDuration: z.number(), prize: z.number(), supplyBurn: z.number() }) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TournamentUncheckedUpdateWithoutParticipationsInputSchema: z.ZodType<Prisma.TournamentUncheckedUpdateWithoutParticipationsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => TournamentStatusSchema),z.lazy(() => EnumTournamentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => JsonNullValueInputSchema),z.object({ openDuration: z.number(), endDuration: z.number(), prize: z.number(), supplyBurn: z.number() }) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallCreateWithoutCallerInputSchema: z.ZodType<Prisma.CallCreateWithoutCallerInput> = z.object({
  tokenAddress: z.string(),
  startFDV: z.number(),
  highestFDV: z.number(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const CallUncheckedCreateWithoutCallerInputSchema: z.ZodType<Prisma.CallUncheckedCreateWithoutCallerInput> = z.object({
  id: z.number().int().optional(),
  tokenAddress: z.string(),
  startFDV: z.number(),
  highestFDV: z.number(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const CallCreateOrConnectWithoutCallerInputSchema: z.ZodType<Prisma.CallCreateOrConnectWithoutCallerInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CallCreateWithoutCallerInputSchema),z.lazy(() => CallUncheckedCreateWithoutCallerInputSchema) ]),
}).strict();

export const CallCreateManyCallerInputEnvelopeSchema: z.ZodType<Prisma.CallCreateManyCallerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CallCreateManyCallerInputSchema),z.lazy(() => CallCreateManyCallerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CallUpsertWithWhereUniqueWithoutCallerInputSchema: z.ZodType<Prisma.CallUpsertWithWhereUniqueWithoutCallerInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CallUpdateWithoutCallerInputSchema),z.lazy(() => CallUncheckedUpdateWithoutCallerInputSchema) ]),
  create: z.union([ z.lazy(() => CallCreateWithoutCallerInputSchema),z.lazy(() => CallUncheckedCreateWithoutCallerInputSchema) ]),
}).strict();

export const CallUpdateWithWhereUniqueWithoutCallerInputSchema: z.ZodType<Prisma.CallUpdateWithWhereUniqueWithoutCallerInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CallUpdateWithoutCallerInputSchema),z.lazy(() => CallUncheckedUpdateWithoutCallerInputSchema) ]),
}).strict();

export const CallUpdateManyWithWhereWithoutCallerInputSchema: z.ZodType<Prisma.CallUpdateManyWithWhereWithoutCallerInput> = z.object({
  where: z.lazy(() => CallScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CallUpdateManyMutationInputSchema),z.lazy(() => CallUncheckedUpdateManyWithoutCallerInputSchema) ]),
}).strict();

export const CallScalarWhereInputSchema: z.ZodType<Prisma.CallScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  startFDV: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  highestFDV: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  callerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  data: z.lazy(() => JsonNullableFilterSchema).optional()
}).strict();

export const CallerCreateWithoutCallsInputSchema: z.ZodType<Prisma.CallerCreateWithoutCallsInput> = z.object({
  name: z.string(),
  image: z.string().optional().nullable(),
  telegramId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CallerUncheckedCreateWithoutCallsInputSchema: z.ZodType<Prisma.CallerUncheckedCreateWithoutCallsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  image: z.string().optional().nullable(),
  telegramId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CallerCreateOrConnectWithoutCallsInputSchema: z.ZodType<Prisma.CallerCreateOrConnectWithoutCallsInput> = z.object({
  where: z.lazy(() => CallerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CallerCreateWithoutCallsInputSchema),z.lazy(() => CallerUncheckedCreateWithoutCallsInputSchema) ]),
}).strict();

export const CallerUpsertWithoutCallsInputSchema: z.ZodType<Prisma.CallerUpsertWithoutCallsInput> = z.object({
  update: z.union([ z.lazy(() => CallerUpdateWithoutCallsInputSchema),z.lazy(() => CallerUncheckedUpdateWithoutCallsInputSchema) ]),
  create: z.union([ z.lazy(() => CallerCreateWithoutCallsInputSchema),z.lazy(() => CallerUncheckedCreateWithoutCallsInputSchema) ]),
  where: z.lazy(() => CallerWhereInputSchema).optional()
}).strict();

export const CallerUpdateToOneWithWhereWithoutCallsInputSchema: z.ZodType<Prisma.CallerUpdateToOneWithWhereWithoutCallsInput> = z.object({
  where: z.lazy(() => CallerWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CallerUpdateWithoutCallsInputSchema),z.lazy(() => CallerUncheckedUpdateWithoutCallsInputSchema) ]),
}).strict();

export const CallerUpdateWithoutCallsInputSchema: z.ZodType<Prisma.CallerUpdateWithoutCallsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  telegramId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallerUncheckedUpdateWithoutCallsInputSchema: z.ZodType<Prisma.CallerUncheckedUpdateWithoutCallsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  telegramId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TournamentParticipationUpdateWithoutCardIdsInputSchema: z.ZodType<Prisma.TournamentParticipationUpdateWithoutCardIdsInput> = z.object({
  walletString: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tournament: z.lazy(() => TournamentUpdateOneRequiredWithoutParticipationsNestedInputSchema).optional()
}).strict();

export const TournamentParticipationUncheckedUpdateWithoutCardIdsInputSchema: z.ZodType<Prisma.TournamentParticipationUncheckedUpdateWithoutCardIdsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  walletString: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tournamentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TournamentParticipationUncheckedUpdateManyWithoutCardIdsInputSchema: z.ZodType<Prisma.TournamentParticipationUncheckedUpdateManyWithoutCardIdsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  walletString: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tournamentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TournamentParticipationCreateManyTournamentInputSchema: z.ZodType<Prisma.TournamentParticipationCreateManyTournamentInput> = z.object({
  id: z.number().int().optional(),
  walletString: z.string()
}).strict();

export const TournamentParticipationUpdateWithoutTournamentInputSchema: z.ZodType<Prisma.TournamentParticipationUpdateWithoutTournamentInput> = z.object({
  walletString: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cardIds: z.lazy(() => CardUpdateManyWithoutTournamentParticipationsNestedInputSchema).optional()
}).strict();

export const TournamentParticipationUncheckedUpdateWithoutTournamentInputSchema: z.ZodType<Prisma.TournamentParticipationUncheckedUpdateWithoutTournamentInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  walletString: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cardIds: z.lazy(() => CardUncheckedUpdateManyWithoutTournamentParticipationsNestedInputSchema).optional()
}).strict();

export const TournamentParticipationUncheckedUpdateManyWithoutTournamentInputSchema: z.ZodType<Prisma.TournamentParticipationUncheckedUpdateManyWithoutTournamentInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  walletString: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CardUpdateWithoutTournamentParticipationsInputSchema: z.ZodType<Prisma.CardUpdateWithoutTournamentParticipationsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  power: z.lazy(() => PowerUpdateOneRequiredWithoutCardNestedInputSchema).optional()
}).strict();

export const CardUncheckedUpdateWithoutTournamentParticipationsInputSchema: z.ZodType<Prisma.CardUncheckedUpdateWithoutTournamentParticipationsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  powerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CardUncheckedUpdateManyWithoutTournamentParticipationsInputSchema: z.ZodType<Prisma.CardUncheckedUpdateManyWithoutTournamentParticipationsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  powerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallCreateManyCallerInputSchema: z.ZodType<Prisma.CallCreateManyCallerInput> = z.object({
  id: z.number().int().optional(),
  tokenAddress: z.string(),
  startFDV: z.number(),
  highestFDV: z.number(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const CallUpdateWithoutCallerInputSchema: z.ZodType<Prisma.CallUpdateWithoutCallerInput> = z.object({
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startFDV: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  highestFDV: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const CallUncheckedUpdateWithoutCallerInputSchema: z.ZodType<Prisma.CallUncheckedUpdateWithoutCallerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startFDV: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  highestFDV: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const CallUncheckedUpdateManyWithoutCallerInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyWithoutCallerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startFDV: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  highestFDV: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const CardFindFirstArgsSchema: z.ZodType<Prisma.CardFindFirstArgs> = z.object({
  select: CardSelectSchema.optional(),
  include: CardIncludeSchema.optional(),
  where: CardWhereInputSchema.optional(),
  orderBy: z.union([ CardOrderByWithRelationInputSchema.array(),CardOrderByWithRelationInputSchema ]).optional(),
  cursor: CardWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CardScalarFieldEnumSchema,CardScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CardFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CardFindFirstOrThrowArgs> = z.object({
  select: CardSelectSchema.optional(),
  include: CardIncludeSchema.optional(),
  where: CardWhereInputSchema.optional(),
  orderBy: z.union([ CardOrderByWithRelationInputSchema.array(),CardOrderByWithRelationInputSchema ]).optional(),
  cursor: CardWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CardScalarFieldEnumSchema,CardScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CardFindManyArgsSchema: z.ZodType<Prisma.CardFindManyArgs> = z.object({
  select: CardSelectSchema.optional(),
  include: CardIncludeSchema.optional(),
  where: CardWhereInputSchema.optional(),
  orderBy: z.union([ CardOrderByWithRelationInputSchema.array(),CardOrderByWithRelationInputSchema ]).optional(),
  cursor: CardWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CardScalarFieldEnumSchema,CardScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CardAggregateArgsSchema: z.ZodType<Prisma.CardAggregateArgs> = z.object({
  where: CardWhereInputSchema.optional(),
  orderBy: z.union([ CardOrderByWithRelationInputSchema.array(),CardOrderByWithRelationInputSchema ]).optional(),
  cursor: CardWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CardGroupByArgsSchema: z.ZodType<Prisma.CardGroupByArgs> = z.object({
  where: CardWhereInputSchema.optional(),
  orderBy: z.union([ CardOrderByWithAggregationInputSchema.array(),CardOrderByWithAggregationInputSchema ]).optional(),
  by: CardScalarFieldEnumSchema.array(),
  having: CardScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CardFindUniqueArgsSchema: z.ZodType<Prisma.CardFindUniqueArgs> = z.object({
  select: CardSelectSchema.optional(),
  include: CardIncludeSchema.optional(),
  where: CardWhereUniqueInputSchema,
}).strict() ;

export const CardFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CardFindUniqueOrThrowArgs> = z.object({
  select: CardSelectSchema.optional(),
  include: CardIncludeSchema.optional(),
  where: CardWhereUniqueInputSchema,
}).strict() ;

export const PowerFindFirstArgsSchema: z.ZodType<Prisma.PowerFindFirstArgs> = z.object({
  select: PowerSelectSchema.optional(),
  include: PowerIncludeSchema.optional(),
  where: PowerWhereInputSchema.optional(),
  orderBy: z.union([ PowerOrderByWithRelationInputSchema.array(),PowerOrderByWithRelationInputSchema ]).optional(),
  cursor: PowerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PowerScalarFieldEnumSchema,PowerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PowerFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PowerFindFirstOrThrowArgs> = z.object({
  select: PowerSelectSchema.optional(),
  include: PowerIncludeSchema.optional(),
  where: PowerWhereInputSchema.optional(),
  orderBy: z.union([ PowerOrderByWithRelationInputSchema.array(),PowerOrderByWithRelationInputSchema ]).optional(),
  cursor: PowerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PowerScalarFieldEnumSchema,PowerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PowerFindManyArgsSchema: z.ZodType<Prisma.PowerFindManyArgs> = z.object({
  select: PowerSelectSchema.optional(),
  include: PowerIncludeSchema.optional(),
  where: PowerWhereInputSchema.optional(),
  orderBy: z.union([ PowerOrderByWithRelationInputSchema.array(),PowerOrderByWithRelationInputSchema ]).optional(),
  cursor: PowerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PowerScalarFieldEnumSchema,PowerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PowerAggregateArgsSchema: z.ZodType<Prisma.PowerAggregateArgs> = z.object({
  where: PowerWhereInputSchema.optional(),
  orderBy: z.union([ PowerOrderByWithRelationInputSchema.array(),PowerOrderByWithRelationInputSchema ]).optional(),
  cursor: PowerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PowerGroupByArgsSchema: z.ZodType<Prisma.PowerGroupByArgs> = z.object({
  where: PowerWhereInputSchema.optional(),
  orderBy: z.union([ PowerOrderByWithAggregationInputSchema.array(),PowerOrderByWithAggregationInputSchema ]).optional(),
  by: PowerScalarFieldEnumSchema.array(),
  having: PowerScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PowerFindUniqueArgsSchema: z.ZodType<Prisma.PowerFindUniqueArgs> = z.object({
  select: PowerSelectSchema.optional(),
  include: PowerIncludeSchema.optional(),
  where: PowerWhereUniqueInputSchema,
}).strict() ;

export const PowerFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PowerFindUniqueOrThrowArgs> = z.object({
  select: PowerSelectSchema.optional(),
  include: PowerIncludeSchema.optional(),
  where: PowerWhereUniqueInputSchema,
}).strict() ;

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const TestFindFirstArgsSchema: z.ZodType<Prisma.TestFindFirstArgs> = z.object({
  select: TestSelectSchema.optional(),
  where: TestWhereInputSchema.optional(),
  orderBy: z.union([ TestOrderByWithRelationInputSchema.array(),TestOrderByWithRelationInputSchema ]).optional(),
  cursor: TestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TestScalarFieldEnumSchema,TestScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TestFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TestFindFirstOrThrowArgs> = z.object({
  select: TestSelectSchema.optional(),
  where: TestWhereInputSchema.optional(),
  orderBy: z.union([ TestOrderByWithRelationInputSchema.array(),TestOrderByWithRelationInputSchema ]).optional(),
  cursor: TestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TestScalarFieldEnumSchema,TestScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TestFindManyArgsSchema: z.ZodType<Prisma.TestFindManyArgs> = z.object({
  select: TestSelectSchema.optional(),
  where: TestWhereInputSchema.optional(),
  orderBy: z.union([ TestOrderByWithRelationInputSchema.array(),TestOrderByWithRelationInputSchema ]).optional(),
  cursor: TestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TestScalarFieldEnumSchema,TestScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TestAggregateArgsSchema: z.ZodType<Prisma.TestAggregateArgs> = z.object({
  where: TestWhereInputSchema.optional(),
  orderBy: z.union([ TestOrderByWithRelationInputSchema.array(),TestOrderByWithRelationInputSchema ]).optional(),
  cursor: TestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TestGroupByArgsSchema: z.ZodType<Prisma.TestGroupByArgs> = z.object({
  where: TestWhereInputSchema.optional(),
  orderBy: z.union([ TestOrderByWithAggregationInputSchema.array(),TestOrderByWithAggregationInputSchema ]).optional(),
  by: TestScalarFieldEnumSchema.array(),
  having: TestScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TestFindUniqueArgsSchema: z.ZodType<Prisma.TestFindUniqueArgs> = z.object({
  select: TestSelectSchema.optional(),
  where: TestWhereUniqueInputSchema,
}).strict() ;

export const TestFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TestFindUniqueOrThrowArgs> = z.object({
  select: TestSelectSchema.optional(),
  where: TestWhereUniqueInputSchema,
}).strict() ;

export const TournamentFindFirstArgsSchema: z.ZodType<Prisma.TournamentFindFirstArgs> = z.object({
  select: TournamentSelectSchema.optional(),
  include: TournamentIncludeSchema.optional(),
  where: TournamentWhereInputSchema.optional(),
  orderBy: z.union([ TournamentOrderByWithRelationInputSchema.array(),TournamentOrderByWithRelationInputSchema ]).optional(),
  cursor: TournamentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TournamentScalarFieldEnumSchema,TournamentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TournamentFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TournamentFindFirstOrThrowArgs> = z.object({
  select: TournamentSelectSchema.optional(),
  include: TournamentIncludeSchema.optional(),
  where: TournamentWhereInputSchema.optional(),
  orderBy: z.union([ TournamentOrderByWithRelationInputSchema.array(),TournamentOrderByWithRelationInputSchema ]).optional(),
  cursor: TournamentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TournamentScalarFieldEnumSchema,TournamentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TournamentFindManyArgsSchema: z.ZodType<Prisma.TournamentFindManyArgs> = z.object({
  select: TournamentSelectSchema.optional(),
  include: TournamentIncludeSchema.optional(),
  where: TournamentWhereInputSchema.optional(),
  orderBy: z.union([ TournamentOrderByWithRelationInputSchema.array(),TournamentOrderByWithRelationInputSchema ]).optional(),
  cursor: TournamentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TournamentScalarFieldEnumSchema,TournamentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TournamentAggregateArgsSchema: z.ZodType<Prisma.TournamentAggregateArgs> = z.object({
  where: TournamentWhereInputSchema.optional(),
  orderBy: z.union([ TournamentOrderByWithRelationInputSchema.array(),TournamentOrderByWithRelationInputSchema ]).optional(),
  cursor: TournamentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TournamentGroupByArgsSchema: z.ZodType<Prisma.TournamentGroupByArgs> = z.object({
  where: TournamentWhereInputSchema.optional(),
  orderBy: z.union([ TournamentOrderByWithAggregationInputSchema.array(),TournamentOrderByWithAggregationInputSchema ]).optional(),
  by: TournamentScalarFieldEnumSchema.array(),
  having: TournamentScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TournamentFindUniqueArgsSchema: z.ZodType<Prisma.TournamentFindUniqueArgs> = z.object({
  select: TournamentSelectSchema.optional(),
  include: TournamentIncludeSchema.optional(),
  where: TournamentWhereUniqueInputSchema,
}).strict() ;

export const TournamentFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TournamentFindUniqueOrThrowArgs> = z.object({
  select: TournamentSelectSchema.optional(),
  include: TournamentIncludeSchema.optional(),
  where: TournamentWhereUniqueInputSchema,
}).strict() ;

export const TournamentParticipationFindFirstArgsSchema: z.ZodType<Prisma.TournamentParticipationFindFirstArgs> = z.object({
  select: TournamentParticipationSelectSchema.optional(),
  include: TournamentParticipationIncludeSchema.optional(),
  where: TournamentParticipationWhereInputSchema.optional(),
  orderBy: z.union([ TournamentParticipationOrderByWithRelationInputSchema.array(),TournamentParticipationOrderByWithRelationInputSchema ]).optional(),
  cursor: TournamentParticipationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TournamentParticipationScalarFieldEnumSchema,TournamentParticipationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TournamentParticipationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TournamentParticipationFindFirstOrThrowArgs> = z.object({
  select: TournamentParticipationSelectSchema.optional(),
  include: TournamentParticipationIncludeSchema.optional(),
  where: TournamentParticipationWhereInputSchema.optional(),
  orderBy: z.union([ TournamentParticipationOrderByWithRelationInputSchema.array(),TournamentParticipationOrderByWithRelationInputSchema ]).optional(),
  cursor: TournamentParticipationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TournamentParticipationScalarFieldEnumSchema,TournamentParticipationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TournamentParticipationFindManyArgsSchema: z.ZodType<Prisma.TournamentParticipationFindManyArgs> = z.object({
  select: TournamentParticipationSelectSchema.optional(),
  include: TournamentParticipationIncludeSchema.optional(),
  where: TournamentParticipationWhereInputSchema.optional(),
  orderBy: z.union([ TournamentParticipationOrderByWithRelationInputSchema.array(),TournamentParticipationOrderByWithRelationInputSchema ]).optional(),
  cursor: TournamentParticipationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TournamentParticipationScalarFieldEnumSchema,TournamentParticipationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TournamentParticipationAggregateArgsSchema: z.ZodType<Prisma.TournamentParticipationAggregateArgs> = z.object({
  where: TournamentParticipationWhereInputSchema.optional(),
  orderBy: z.union([ TournamentParticipationOrderByWithRelationInputSchema.array(),TournamentParticipationOrderByWithRelationInputSchema ]).optional(),
  cursor: TournamentParticipationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TournamentParticipationGroupByArgsSchema: z.ZodType<Prisma.TournamentParticipationGroupByArgs> = z.object({
  where: TournamentParticipationWhereInputSchema.optional(),
  orderBy: z.union([ TournamentParticipationOrderByWithAggregationInputSchema.array(),TournamentParticipationOrderByWithAggregationInputSchema ]).optional(),
  by: TournamentParticipationScalarFieldEnumSchema.array(),
  having: TournamentParticipationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TournamentParticipationFindUniqueArgsSchema: z.ZodType<Prisma.TournamentParticipationFindUniqueArgs> = z.object({
  select: TournamentParticipationSelectSchema.optional(),
  include: TournamentParticipationIncludeSchema.optional(),
  where: TournamentParticipationWhereUniqueInputSchema,
}).strict() ;

export const TournamentParticipationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TournamentParticipationFindUniqueOrThrowArgs> = z.object({
  select: TournamentParticipationSelectSchema.optional(),
  include: TournamentParticipationIncludeSchema.optional(),
  where: TournamentParticipationWhereUniqueInputSchema,
}).strict() ;

export const CallerFindFirstArgsSchema: z.ZodType<Prisma.CallerFindFirstArgs> = z.object({
  select: CallerSelectSchema.optional(),
  include: CallerIncludeSchema.optional(),
  where: CallerWhereInputSchema.optional(),
  orderBy: z.union([ CallerOrderByWithRelationInputSchema.array(),CallerOrderByWithRelationInputSchema ]).optional(),
  cursor: CallerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CallerScalarFieldEnumSchema,CallerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CallerFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CallerFindFirstOrThrowArgs> = z.object({
  select: CallerSelectSchema.optional(),
  include: CallerIncludeSchema.optional(),
  where: CallerWhereInputSchema.optional(),
  orderBy: z.union([ CallerOrderByWithRelationInputSchema.array(),CallerOrderByWithRelationInputSchema ]).optional(),
  cursor: CallerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CallerScalarFieldEnumSchema,CallerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CallerFindManyArgsSchema: z.ZodType<Prisma.CallerFindManyArgs> = z.object({
  select: CallerSelectSchema.optional(),
  include: CallerIncludeSchema.optional(),
  where: CallerWhereInputSchema.optional(),
  orderBy: z.union([ CallerOrderByWithRelationInputSchema.array(),CallerOrderByWithRelationInputSchema ]).optional(),
  cursor: CallerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CallerScalarFieldEnumSchema,CallerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CallerAggregateArgsSchema: z.ZodType<Prisma.CallerAggregateArgs> = z.object({
  where: CallerWhereInputSchema.optional(),
  orderBy: z.union([ CallerOrderByWithRelationInputSchema.array(),CallerOrderByWithRelationInputSchema ]).optional(),
  cursor: CallerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CallerGroupByArgsSchema: z.ZodType<Prisma.CallerGroupByArgs> = z.object({
  where: CallerWhereInputSchema.optional(),
  orderBy: z.union([ CallerOrderByWithAggregationInputSchema.array(),CallerOrderByWithAggregationInputSchema ]).optional(),
  by: CallerScalarFieldEnumSchema.array(),
  having: CallerScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CallerFindUniqueArgsSchema: z.ZodType<Prisma.CallerFindUniqueArgs> = z.object({
  select: CallerSelectSchema.optional(),
  include: CallerIncludeSchema.optional(),
  where: CallerWhereUniqueInputSchema,
}).strict() ;

export const CallerFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CallerFindUniqueOrThrowArgs> = z.object({
  select: CallerSelectSchema.optional(),
  include: CallerIncludeSchema.optional(),
  where: CallerWhereUniqueInputSchema,
}).strict() ;

export const CallFindFirstArgsSchema: z.ZodType<Prisma.CallFindFirstArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  where: CallWhereInputSchema.optional(),
  orderBy: z.union([ CallOrderByWithRelationInputSchema.array(),CallOrderByWithRelationInputSchema ]).optional(),
  cursor: CallWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CallScalarFieldEnumSchema,CallScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CallFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CallFindFirstOrThrowArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  where: CallWhereInputSchema.optional(),
  orderBy: z.union([ CallOrderByWithRelationInputSchema.array(),CallOrderByWithRelationInputSchema ]).optional(),
  cursor: CallWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CallScalarFieldEnumSchema,CallScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CallFindManyArgsSchema: z.ZodType<Prisma.CallFindManyArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  where: CallWhereInputSchema.optional(),
  orderBy: z.union([ CallOrderByWithRelationInputSchema.array(),CallOrderByWithRelationInputSchema ]).optional(),
  cursor: CallWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CallScalarFieldEnumSchema,CallScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CallAggregateArgsSchema: z.ZodType<Prisma.CallAggregateArgs> = z.object({
  where: CallWhereInputSchema.optional(),
  orderBy: z.union([ CallOrderByWithRelationInputSchema.array(),CallOrderByWithRelationInputSchema ]).optional(),
  cursor: CallWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CallGroupByArgsSchema: z.ZodType<Prisma.CallGroupByArgs> = z.object({
  where: CallWhereInputSchema.optional(),
  orderBy: z.union([ CallOrderByWithAggregationInputSchema.array(),CallOrderByWithAggregationInputSchema ]).optional(),
  by: CallScalarFieldEnumSchema.array(),
  having: CallScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CallFindUniqueArgsSchema: z.ZodType<Prisma.CallFindUniqueArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  where: CallWhereUniqueInputSchema,
}).strict() ;

export const CallFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CallFindUniqueOrThrowArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  where: CallWhereUniqueInputSchema,
}).strict() ;

export const CardCreateArgsSchema: z.ZodType<Prisma.CardCreateArgs> = z.object({
  select: CardSelectSchema.optional(),
  include: CardIncludeSchema.optional(),
  data: z.union([ CardCreateInputSchema,CardUncheckedCreateInputSchema ]),
}).strict() ;

export const CardUpsertArgsSchema: z.ZodType<Prisma.CardUpsertArgs> = z.object({
  select: CardSelectSchema.optional(),
  include: CardIncludeSchema.optional(),
  where: CardWhereUniqueInputSchema,
  create: z.union([ CardCreateInputSchema,CardUncheckedCreateInputSchema ]),
  update: z.union([ CardUpdateInputSchema,CardUncheckedUpdateInputSchema ]),
}).strict() ;

export const CardCreateManyArgsSchema: z.ZodType<Prisma.CardCreateManyArgs> = z.object({
  data: z.union([ CardCreateManyInputSchema,CardCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CardCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CardCreateManyAndReturnArgs> = z.object({
  data: z.union([ CardCreateManyInputSchema,CardCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CardDeleteArgsSchema: z.ZodType<Prisma.CardDeleteArgs> = z.object({
  select: CardSelectSchema.optional(),
  include: CardIncludeSchema.optional(),
  where: CardWhereUniqueInputSchema,
}).strict() ;

export const CardUpdateArgsSchema: z.ZodType<Prisma.CardUpdateArgs> = z.object({
  select: CardSelectSchema.optional(),
  include: CardIncludeSchema.optional(),
  data: z.union([ CardUpdateInputSchema,CardUncheckedUpdateInputSchema ]),
  where: CardWhereUniqueInputSchema,
}).strict() ;

export const CardUpdateManyArgsSchema: z.ZodType<Prisma.CardUpdateManyArgs> = z.object({
  data: z.union([ CardUpdateManyMutationInputSchema,CardUncheckedUpdateManyInputSchema ]),
  where: CardWhereInputSchema.optional(),
}).strict() ;

export const CardDeleteManyArgsSchema: z.ZodType<Prisma.CardDeleteManyArgs> = z.object({
  where: CardWhereInputSchema.optional(),
}).strict() ;

export const PowerCreateArgsSchema: z.ZodType<Prisma.PowerCreateArgs> = z.object({
  select: PowerSelectSchema.optional(),
  include: PowerIncludeSchema.optional(),
  data: z.union([ PowerCreateInputSchema,PowerUncheckedCreateInputSchema ]),
}).strict() ;

export const PowerUpsertArgsSchema: z.ZodType<Prisma.PowerUpsertArgs> = z.object({
  select: PowerSelectSchema.optional(),
  include: PowerIncludeSchema.optional(),
  where: PowerWhereUniqueInputSchema,
  create: z.union([ PowerCreateInputSchema,PowerUncheckedCreateInputSchema ]),
  update: z.union([ PowerUpdateInputSchema,PowerUncheckedUpdateInputSchema ]),
}).strict() ;

export const PowerCreateManyArgsSchema: z.ZodType<Prisma.PowerCreateManyArgs> = z.object({
  data: z.union([ PowerCreateManyInputSchema,PowerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PowerCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PowerCreateManyAndReturnArgs> = z.object({
  data: z.union([ PowerCreateManyInputSchema,PowerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PowerDeleteArgsSchema: z.ZodType<Prisma.PowerDeleteArgs> = z.object({
  select: PowerSelectSchema.optional(),
  include: PowerIncludeSchema.optional(),
  where: PowerWhereUniqueInputSchema,
}).strict() ;

export const PowerUpdateArgsSchema: z.ZodType<Prisma.PowerUpdateArgs> = z.object({
  select: PowerSelectSchema.optional(),
  include: PowerIncludeSchema.optional(),
  data: z.union([ PowerUpdateInputSchema,PowerUncheckedUpdateInputSchema ]),
  where: PowerWhereUniqueInputSchema,
}).strict() ;

export const PowerUpdateManyArgsSchema: z.ZodType<Prisma.PowerUpdateManyArgs> = z.object({
  data: z.union([ PowerUpdateManyMutationInputSchema,PowerUncheckedUpdateManyInputSchema ]),
  where: PowerWhereInputSchema.optional(),
}).strict() ;

export const PowerDeleteManyArgsSchema: z.ZodType<Prisma.PowerDeleteManyArgs> = z.object({
  where: PowerWhereInputSchema.optional(),
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const TestCreateArgsSchema: z.ZodType<Prisma.TestCreateArgs> = z.object({
  select: TestSelectSchema.optional(),
  data: z.union([ TestCreateInputSchema,TestUncheckedCreateInputSchema ]),
}).strict() ;

export const TestUpsertArgsSchema: z.ZodType<Prisma.TestUpsertArgs> = z.object({
  select: TestSelectSchema.optional(),
  where: TestWhereUniqueInputSchema,
  create: z.union([ TestCreateInputSchema,TestUncheckedCreateInputSchema ]),
  update: z.union([ TestUpdateInputSchema,TestUncheckedUpdateInputSchema ]),
}).strict() ;

export const TestCreateManyArgsSchema: z.ZodType<Prisma.TestCreateManyArgs> = z.object({
  data: z.union([ TestCreateManyInputSchema,TestCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TestCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TestCreateManyAndReturnArgs> = z.object({
  data: z.union([ TestCreateManyInputSchema,TestCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TestDeleteArgsSchema: z.ZodType<Prisma.TestDeleteArgs> = z.object({
  select: TestSelectSchema.optional(),
  where: TestWhereUniqueInputSchema,
}).strict() ;

export const TestUpdateArgsSchema: z.ZodType<Prisma.TestUpdateArgs> = z.object({
  select: TestSelectSchema.optional(),
  data: z.union([ TestUpdateInputSchema,TestUncheckedUpdateInputSchema ]),
  where: TestWhereUniqueInputSchema,
}).strict() ;

export const TestUpdateManyArgsSchema: z.ZodType<Prisma.TestUpdateManyArgs> = z.object({
  data: z.union([ TestUpdateManyMutationInputSchema,TestUncheckedUpdateManyInputSchema ]),
  where: TestWhereInputSchema.optional(),
}).strict() ;

export const TestDeleteManyArgsSchema: z.ZodType<Prisma.TestDeleteManyArgs> = z.object({
  where: TestWhereInputSchema.optional(),
}).strict() ;

export const TournamentCreateArgsSchema: z.ZodType<Prisma.TournamentCreateArgs> = z.object({
  select: TournamentSelectSchema.optional(),
  include: TournamentIncludeSchema.optional(),
  data: z.union([ TournamentCreateInputSchema,TournamentUncheckedCreateInputSchema ]),
}).strict() ;

export const TournamentUpsertArgsSchema: z.ZodType<Prisma.TournamentUpsertArgs> = z.object({
  select: TournamentSelectSchema.optional(),
  include: TournamentIncludeSchema.optional(),
  where: TournamentWhereUniqueInputSchema,
  create: z.union([ TournamentCreateInputSchema,TournamentUncheckedCreateInputSchema ]),
  update: z.union([ TournamentUpdateInputSchema,TournamentUncheckedUpdateInputSchema ]),
}).strict() ;

export const TournamentCreateManyArgsSchema: z.ZodType<Prisma.TournamentCreateManyArgs> = z.object({
  data: z.union([ TournamentCreateManyInputSchema,TournamentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TournamentCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TournamentCreateManyAndReturnArgs> = z.object({
  data: z.union([ TournamentCreateManyInputSchema,TournamentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TournamentDeleteArgsSchema: z.ZodType<Prisma.TournamentDeleteArgs> = z.object({
  select: TournamentSelectSchema.optional(),
  include: TournamentIncludeSchema.optional(),
  where: TournamentWhereUniqueInputSchema,
}).strict() ;

export const TournamentUpdateArgsSchema: z.ZodType<Prisma.TournamentUpdateArgs> = z.object({
  select: TournamentSelectSchema.optional(),
  include: TournamentIncludeSchema.optional(),
  data: z.union([ TournamentUpdateInputSchema,TournamentUncheckedUpdateInputSchema ]),
  where: TournamentWhereUniqueInputSchema,
}).strict() ;

export const TournamentUpdateManyArgsSchema: z.ZodType<Prisma.TournamentUpdateManyArgs> = z.object({
  data: z.union([ TournamentUpdateManyMutationInputSchema,TournamentUncheckedUpdateManyInputSchema ]),
  where: TournamentWhereInputSchema.optional(),
}).strict() ;

export const TournamentDeleteManyArgsSchema: z.ZodType<Prisma.TournamentDeleteManyArgs> = z.object({
  where: TournamentWhereInputSchema.optional(),
}).strict() ;

export const TournamentParticipationCreateArgsSchema: z.ZodType<Prisma.TournamentParticipationCreateArgs> = z.object({
  select: TournamentParticipationSelectSchema.optional(),
  include: TournamentParticipationIncludeSchema.optional(),
  data: z.union([ TournamentParticipationCreateInputSchema,TournamentParticipationUncheckedCreateInputSchema ]),
}).strict() ;

export const TournamentParticipationUpsertArgsSchema: z.ZodType<Prisma.TournamentParticipationUpsertArgs> = z.object({
  select: TournamentParticipationSelectSchema.optional(),
  include: TournamentParticipationIncludeSchema.optional(),
  where: TournamentParticipationWhereUniqueInputSchema,
  create: z.union([ TournamentParticipationCreateInputSchema,TournamentParticipationUncheckedCreateInputSchema ]),
  update: z.union([ TournamentParticipationUpdateInputSchema,TournamentParticipationUncheckedUpdateInputSchema ]),
}).strict() ;

export const TournamentParticipationCreateManyArgsSchema: z.ZodType<Prisma.TournamentParticipationCreateManyArgs> = z.object({
  data: z.union([ TournamentParticipationCreateManyInputSchema,TournamentParticipationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TournamentParticipationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TournamentParticipationCreateManyAndReturnArgs> = z.object({
  data: z.union([ TournamentParticipationCreateManyInputSchema,TournamentParticipationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TournamentParticipationDeleteArgsSchema: z.ZodType<Prisma.TournamentParticipationDeleteArgs> = z.object({
  select: TournamentParticipationSelectSchema.optional(),
  include: TournamentParticipationIncludeSchema.optional(),
  where: TournamentParticipationWhereUniqueInputSchema,
}).strict() ;

export const TournamentParticipationUpdateArgsSchema: z.ZodType<Prisma.TournamentParticipationUpdateArgs> = z.object({
  select: TournamentParticipationSelectSchema.optional(),
  include: TournamentParticipationIncludeSchema.optional(),
  data: z.union([ TournamentParticipationUpdateInputSchema,TournamentParticipationUncheckedUpdateInputSchema ]),
  where: TournamentParticipationWhereUniqueInputSchema,
}).strict() ;

export const TournamentParticipationUpdateManyArgsSchema: z.ZodType<Prisma.TournamentParticipationUpdateManyArgs> = z.object({
  data: z.union([ TournamentParticipationUpdateManyMutationInputSchema,TournamentParticipationUncheckedUpdateManyInputSchema ]),
  where: TournamentParticipationWhereInputSchema.optional(),
}).strict() ;

export const TournamentParticipationDeleteManyArgsSchema: z.ZodType<Prisma.TournamentParticipationDeleteManyArgs> = z.object({
  where: TournamentParticipationWhereInputSchema.optional(),
}).strict() ;

export const CallerCreateArgsSchema: z.ZodType<Prisma.CallerCreateArgs> = z.object({
  select: CallerSelectSchema.optional(),
  include: CallerIncludeSchema.optional(),
  data: z.union([ CallerCreateInputSchema,CallerUncheckedCreateInputSchema ]),
}).strict() ;

export const CallerUpsertArgsSchema: z.ZodType<Prisma.CallerUpsertArgs> = z.object({
  select: CallerSelectSchema.optional(),
  include: CallerIncludeSchema.optional(),
  where: CallerWhereUniqueInputSchema,
  create: z.union([ CallerCreateInputSchema,CallerUncheckedCreateInputSchema ]),
  update: z.union([ CallerUpdateInputSchema,CallerUncheckedUpdateInputSchema ]),
}).strict() ;

export const CallerCreateManyArgsSchema: z.ZodType<Prisma.CallerCreateManyArgs> = z.object({
  data: z.union([ CallerCreateManyInputSchema,CallerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CallerCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CallerCreateManyAndReturnArgs> = z.object({
  data: z.union([ CallerCreateManyInputSchema,CallerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CallerDeleteArgsSchema: z.ZodType<Prisma.CallerDeleteArgs> = z.object({
  select: CallerSelectSchema.optional(),
  include: CallerIncludeSchema.optional(),
  where: CallerWhereUniqueInputSchema,
}).strict() ;

export const CallerUpdateArgsSchema: z.ZodType<Prisma.CallerUpdateArgs> = z.object({
  select: CallerSelectSchema.optional(),
  include: CallerIncludeSchema.optional(),
  data: z.union([ CallerUpdateInputSchema,CallerUncheckedUpdateInputSchema ]),
  where: CallerWhereUniqueInputSchema,
}).strict() ;

export const CallerUpdateManyArgsSchema: z.ZodType<Prisma.CallerUpdateManyArgs> = z.object({
  data: z.union([ CallerUpdateManyMutationInputSchema,CallerUncheckedUpdateManyInputSchema ]),
  where: CallerWhereInputSchema.optional(),
}).strict() ;

export const CallerDeleteManyArgsSchema: z.ZodType<Prisma.CallerDeleteManyArgs> = z.object({
  where: CallerWhereInputSchema.optional(),
}).strict() ;

export const CallCreateArgsSchema: z.ZodType<Prisma.CallCreateArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  data: z.union([ CallCreateInputSchema,CallUncheckedCreateInputSchema ]),
}).strict() ;

export const CallUpsertArgsSchema: z.ZodType<Prisma.CallUpsertArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  where: CallWhereUniqueInputSchema,
  create: z.union([ CallCreateInputSchema,CallUncheckedCreateInputSchema ]),
  update: z.union([ CallUpdateInputSchema,CallUncheckedUpdateInputSchema ]),
}).strict() ;

export const CallCreateManyArgsSchema: z.ZodType<Prisma.CallCreateManyArgs> = z.object({
  data: z.union([ CallCreateManyInputSchema,CallCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CallCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CallCreateManyAndReturnArgs> = z.object({
  data: z.union([ CallCreateManyInputSchema,CallCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CallDeleteArgsSchema: z.ZodType<Prisma.CallDeleteArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  where: CallWhereUniqueInputSchema,
}).strict() ;

export const CallUpdateArgsSchema: z.ZodType<Prisma.CallUpdateArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  data: z.union([ CallUpdateInputSchema,CallUncheckedUpdateInputSchema ]),
  where: CallWhereUniqueInputSchema,
}).strict() ;

export const CallUpdateManyArgsSchema: z.ZodType<Prisma.CallUpdateManyArgs> = z.object({
  data: z.union([ CallUpdateManyMutationInputSchema,CallUncheckedUpdateManyInputSchema ]),
  where: CallWhereInputSchema.optional(),
}).strict() ;

export const CallDeleteManyArgsSchema: z.ZodType<Prisma.CallDeleteManyArgs> = z.object({
  where: CallWhereInputSchema.optional(),
}).strict() ;