export type omitPrisma<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
