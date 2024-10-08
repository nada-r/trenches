import { Caller, PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { CallerRepository } from '@src/services/CallerRepository';

// Mock the mintToken function
jest.mock('@src/services/mint', () => ({
  mintToken: jest.fn().mockResolvedValue('mocked-token-address'),
}));

describe('CallerRepository', () => {
  let prisma: DeepMockProxy<PrismaClient>;
  let callerRepository: CallerRepository;

  beforeEach(() => {
    prisma = mockDeep<PrismaClient>();
    callerRepository = new CallerRepository(prisma);
  });

  function createCaller(
    id: number,
    telegramId: string,
    name: string,
    data: any = {}
  ) {
    const mockNewCaller: Caller = {
      id,
      telegramId,
      name,
      image: null,
      data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return mockNewCaller;
  }

  describe('getAll', () => {
    it('should return all callers sorted by rank', async () => {
      const mockCaller1 = createCaller(1, '1', 'User1');
      const mockCaller2 = createCaller(2, '2', 'User2');
      const mockCaller3 = createCaller(3, '3', 'User3');
      // Set the rank data for User1 and User2
      mockCaller1.data = { rank: 2 };
      mockCaller2.data = { rank: 1 };

      const mockCallers = [mockCaller1, mockCaller2, mockCaller3];
      prisma.caller.findMany.mockResolvedValue(mockCallers);

      const result = await callerRepository.getAll();

      expect(result).toEqual([mockCaller2, mockCaller1, mockCaller3]);
      expect(prisma.caller.findMany).toHaveBeenCalledWith({});
    });
  });

  describe('createCaller', () => {
    it('should create a new caller', async () => {
      const mockCaller: Caller = createCaller(1, '123456', 'Test User');

      prisma.caller.create.mockResolvedValue(mockCaller);

      const result = await callerRepository.createCaller({
        telegramId: '123456',
        name: 'Test User',
        image: null,
        data: {},
      });

      expect(result).toEqual(mockCaller);
      expect(prisma.caller.create).toHaveBeenCalledWith({
        data: {
          telegramId: '123456',
          name: 'Test User',
          image: null,
          data: {},
        },
      });
    });
  });

  describe('getOrCreateCaller', () => {
    it('should return existing caller if found', async () => {
      const mockCaller: Caller = createCaller(1, '123456', 'Existing User');

      prisma.caller.findUnique.mockResolvedValue(mockCaller);

      const result = await callerRepository.getOrCreateCaller(
        '123456',
        'Existing User'
      );

      expect(result).toEqual(mockCaller);
      expect(prisma.caller.findUnique).toHaveBeenCalledWith({
        where: { telegramId: '123456' },
      });
      expect(prisma.caller.create).not.toHaveBeenCalled();
    });

    it('should create new caller if not found', async () => {
      const mockNewCaller = createCaller(1, '789012', 'New User');

      prisma.caller.findUnique.mockResolvedValueOnce(null);
      prisma.caller.create.mockResolvedValue(mockNewCaller);
      prisma.caller.findUnique.mockResolvedValueOnce(mockNewCaller);

      const result = await callerRepository.getOrCreateCaller(
        '789012',
        'New User'
      );

      expect(result).toEqual(mockNewCaller);
      expect(prisma.caller.findUnique).toHaveBeenCalledWith({
        where: { telegramId: '789012' },
      });
      expect(prisma.caller.create).toHaveBeenCalledWith({
        data: {
          telegramId: '789012',
          name: 'New User',
          image: null,
          data: {},
        },
      });
      expect(prisma.caller.update).toHaveBeenCalledWith({
        where: { telegramId: '789012' },
        data: {
          data: {
            tokenAddress: 'mocked-token-address',
          },
        },
      });
    });
  });

  describe('addCallerTokenAddress', () => {
    it('should maintain existing data when adding token address', async () => {
      const mockCaller: Caller = createCaller(1, '123456', 'Test User', {
        power: 123,
      });

      prisma.caller.findUnique.mockResolvedValue(mockCaller);
      prisma.caller.update.mockResolvedValue({
        ...mockCaller,
        data: {
          power: 123,
          tokenAddress: 'new-token-address',
        },
      });

      await callerRepository.addCallerTokenAddress(
        '123456',
        'new-token-address'
      );

      expect(prisma.caller.findUnique).toHaveBeenCalledWith({
        where: { telegramId: '123456' },
      });
      expect(prisma.caller.update).toHaveBeenCalledWith({
        where: { telegramId: '123456' },
        data: {
          data: {
            power: 123,
            tokenAddress: 'new-token-address',
          },
        },
      });
    });

    it('should not update if caller is not found', async () => {
      prisma.caller.findUnique.mockResolvedValue(null);

      await callerRepository.addCallerTokenAddress(
        'nonexistent',
        'new-token-address'
      );

      expect(prisma.caller.findUnique).toHaveBeenCalledWith({
        where: { telegramId: 'nonexistent' },
      });
      expect(prisma.caller.update).not.toHaveBeenCalled();
    });
  });

  describe('updateCallingPower', () => {
    it('should update calling power and maintain existing data', async () => {
      const mockCaller: Caller = createCaller(1, '123456', 'Test User', {
        tokenAddress: 'existing-token-address',
        power: 100,
      });

      prisma.caller.findUnique.mockResolvedValue(mockCaller);
      prisma.caller.update.mockResolvedValue({
        ...mockCaller,
        data: {
          tokenAddress: 'existing-token-address',
          power: 150,
        },
      });

      await callerRepository.updateCallingPower(1, 150);
      expect(prisma.caller.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prisma.caller.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          data: {
            tokenAddress: 'existing-token-address',
            power: 150,
          },
        },
      });
    });

    it('should not update if caller is not found', async () => {
      prisma.caller.findUnique.mockResolvedValue(null);

      await expect(
        callerRepository.updateCallingPower(999, 200)
      ).rejects.toThrow(new Error('Caller with id 999 not found'));

      expect(prisma.caller.update).not.toHaveBeenCalled();
    });
  });

  describe('updateCallerRanks', () => {
    it('should update caller ranks based on power', async () => {
      const mockCallers = [
        createCaller(1, '1', 'User1', { power: 100 }),
        createCaller(2, '2', 'User2', { power: 300 }),
        createCaller(3, '3', 'User3', { power: 200 }),
        createCaller(4, '4', 'User4', {}),
      ];

      prisma.caller.findMany.mockResolvedValue(mockCallers);

      await callerRepository.updateCallerRanks();

      expect(prisma.caller.findMany).toHaveBeenCalled();

      expect(prisma.caller.update).toHaveBeenCalledTimes(4);
      expect(prisma.caller.update).toHaveBeenNthCalledWith(1, {
        where: { id: 2 },
        data: { data: { power: 300, rank: 1 } },
      });
      expect(prisma.caller.update).toHaveBeenNthCalledWith(2, {
        where: { id: 3 },
        data: { data: { power: 200, rank: 2 } },
      });
      expect(prisma.caller.update).toHaveBeenNthCalledWith(3, {
        where: { id: 1 },
        data: { data: { power: 100, rank: 3 } },
      });
      expect(prisma.caller.update).toHaveBeenNthCalledWith(4, {
        where: { id: 4 },
        data: { data: { rank: 4 } },
      });
    });

    it('should handle empty caller list', async () => {
      prisma.caller.findMany.mockResolvedValue([]);

      await callerRepository.updateCallerRanks();

      expect(prisma.caller.findMany).toHaveBeenCalled();
      expect(prisma.caller.update).not.toHaveBeenCalled();
    });

    it('should handle callers with same power', async () => {
      const mockCallers = [
        createCaller(1, '1', 'User1', { power: 100 }),
        createCaller(2, '2', 'User2', { power: 100 }),
        createCaller(3, '3', 'User3', { power: 200 }),
      ];

      prisma.caller.findMany.mockResolvedValue(mockCallers);

      await callerRepository.updateCallerRanks();

      expect(prisma.caller.findMany).toHaveBeenCalled();
      expect(prisma.caller.update).toHaveBeenCalledTimes(3);
      expect(prisma.caller.update).toHaveBeenNthCalledWith(1, {
        where: { id: 3 },
        data: { data: { power: 200, rank: 1 } },
      });
      // Note: The order of the next two calls might vary, as they have the same power
      expect(prisma.caller.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { data: { power: 100, rank: 2 } },
      });
      expect(prisma.caller.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: { data: { power: 100, rank: 3 } },
      });
    });
  });
});
