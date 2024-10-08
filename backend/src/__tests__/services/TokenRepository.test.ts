import { PrismaClient, Token } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { TokenInfo, TokenRepository } from '@src/services/TokenRepository';
import {
  createCall,
  createToken,
  createTokenInfo,
  fromTokenInfo,
} from '@src/__tests__/utils';

describe('TokenRepository', () => {
  let tokenRepository: TokenRepository;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(() => {
    prisma = mockDeep<PrismaClient>();
    tokenRepository = new TokenRepository(prisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrUpdateToken', () => {
    const mockTokenInfo: TokenInfo = createTokenInfo(
      '0x123',
      'TEST',
      'Test Token'
    );

    it('should create or update a token successfully', async () => {
      const mockToken: Token = fromTokenInfo(mockTokenInfo, 1);

      prisma.token.upsert.mockResolvedValue(mockToken);

      const result = await tokenRepository.createOrUpdateToken(mockTokenInfo);

      expect(result).toEqual(mockToken);
      expect(prisma.token.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { address: mockTokenInfo.address },
          update: {
            url: mockTokenInfo.url,
            image_uri: mockTokenInfo.image_uri,
            data: {
              type: mockTokenInfo.type,
              poolAddress: mockTokenInfo.poolAddress,
              mcap: mockTokenInfo.fdv,
            },
          },
          create: {
            address: mockTokenInfo.address,
            name: mockTokenInfo.name,
            ticker: mockTokenInfo.symbol,
            url: mockTokenInfo.url,
            image_uri: mockTokenInfo.image_uri,
            data: {
              type: mockTokenInfo.type,
              poolAddress: mockTokenInfo.poolAddress,
              mcap: mockTokenInfo.fdv,
            },
          },
        })
      );
    });
  });

  describe('updateMcap', () => {
    const mockToken: Token = createToken(1, '0x123', 'Token1', 'TKN1', {
      mcap: 1000000,
    });

    it('should update the mcap for a given token', async () => {
      prisma.token.findUnique.mockResolvedValue(mockToken);
      prisma.token.update.mockResolvedValue({
        ...mockToken,
        data: { type: 'pumpfun', mcap: 2000000 },
      });

      await tokenRepository.updateMcap('0x123', 2000000);

      expect(prisma.token.findUnique).toHaveBeenCalledWith({
        where: { address: '0x123' },
      });
      expect(prisma.token.update).toHaveBeenCalledWith({
        where: { address: '0x123' },
        data: { data: { ...mockToken.data, mcap: 2000000 } },
      });
    });

    it('should throw an error if token is not found', async () => {
      prisma.token.findUnique.mockResolvedValue(null);

      await expect(
        tokenRepository.updateMcap('0x123', 2000000)
      ).rejects.toThrow('Token with address 0x123 not found');
    });

    it('should throw an error if database update fails', async () => {
      prisma.token.findUnique.mockResolvedValue(mockToken);
      prisma.token.update.mockRejectedValue(new Error('Database error'));

      await expect(
        tokenRepository.updateMcap('0x123', 2000000)
      ).rejects.toThrow('Database error');
    });
  });

  describe('findMissingTokens', () => {
    it('should return an array of missing token addresses', async () => {
      const mockCalls = [createCall(1, '0x123'), createCall(2, '0x456')];
      const mockTokens = [createToken(1, '0x123', 'Token1', 'TKN1')];

      prisma.call.findMany.mockResolvedValue(mockCalls);
      prisma.token.findMany.mockResolvedValue(mockTokens);

      const result = await tokenRepository.findMissingTokens();

      expect(result).toEqual(['0x123', '0x456']);
    });
  });
});
