import { PumpfunProvider } from '@src/services/PumpfunProvider';
import { GeckoTerminalProvider } from '@src/services/GeckoTerminalProvider';
import {
  McapEntry,
  MCapUpdaterService,
} from '@src/services/MCapUpdaterService';

// Mock the dependencies
jest.mock('@src/services/PumpfunProvider');
jest.mock('@src/services/GeckoTerminalProvider');

describe('MCapUpdaterService', () => {
  let mCapUpdaterService: MCapUpdaterService;
  let mockPumpfunProvider: jest.Mocked<PumpfunProvider>;
  let mockGeckoTerminalProvider: jest.Mocked<GeckoTerminalProvider>;

  beforeEach(() => {
    mockPumpfunProvider = {
      getTokenMCapHistory: jest.fn(),
    } as unknown as jest.Mocked<PumpfunProvider>;
    mockGeckoTerminalProvider = {
      getTokenMCapHistory: jest.fn(),
    } as unknown as jest.Mocked<GeckoTerminalProvider>;

    mCapUpdaterService = new MCapUpdaterService(
      mockPumpfunProvider,
      mockGeckoTerminalProvider
    );
    jest.clearAllMocks();
  });

  describe('getMcapHistory', () => {
    it('should get mcap history from GeckoTerminal for tokens with poolAddress', async () => {
      const mockMcapHistory: McapEntry[] = [
        { timestamp: 1000, highest: 100, close: 90 },
      ];
      mockGeckoTerminalProvider.getTokenMCapHistory.mockResolvedValue(
        mockMcapHistory
      );

      const result = await mCapUpdaterService.getMcapHistory({
        tokenAddress: 'token123',
        poolAddress: 'pool456',
      });

      expect(result).toEqual(mockMcapHistory);
      expect(
        mockGeckoTerminalProvider.getTokenMCapHistory
      ).toHaveBeenCalledWith('pool456');
    });

    it('should get mcap history from GeckoTerminal for non-pump tokens', async () => {
      const mockMcapHistory: McapEntry[] = [
        { timestamp: 1000, highest: 100, close: 90 },
      ];
      mockGeckoTerminalProvider.getTokenMCapHistory.mockResolvedValueOnce(
        mockMcapHistory
      );

      const result = await mCapUpdaterService.getMcapHistory({
        tokenAddress: 'token123',
        poolAddress: undefined,
      });

      expect(result).toEqual(mockMcapHistory);
      expect(
        mockGeckoTerminalProvider.getTokenMCapHistory
      ).toHaveBeenCalledWith('token123');
    });

    it('should get mcap history from PumpfunProvider for pump tokens', async () => {
      const mockMcapHistory: McapEntry[] = [
        { timestamp: 1000, highest: 100, close: 90 },
      ];
      mockPumpfunProvider.getTokenMCapHistory.mockResolvedValue(
        mockMcapHistory
      );

      const result = await mCapUpdaterService.getMcapHistory({
        tokenAddress: 'token123pump',
        poolAddress: undefined,
      });

      expect(result).toEqual(mockMcapHistory);
      expect(mockPumpfunProvider.getTokenMCapHistory).toHaveBeenCalledWith(
        'token123pump'
      );
      expect(
        mockGeckoTerminalProvider.getTokenMCapHistory
      ).toHaveBeenCalledTimes(0);
    });

    it('should get mcap history from PumpfunProvider for pump tokens that doesnt look vanity pump address', async () => {
      const mockMcapHistory: McapEntry[] = [
        { timestamp: 1000, highest: 100, close: 90 },
      ];
      mockGeckoTerminalProvider.getTokenMCapHistory.mockResolvedValue(null);
      mockPumpfunProvider.getTokenMCapHistory.mockResolvedValue(
        mockMcapHistory
      );

      const result = await mCapUpdaterService.getMcapHistory({
        tokenAddress: 'token123',
        poolAddress: undefined,
      });

      expect(result).toEqual(mockMcapHistory);
      expect(
        mockGeckoTerminalProvider.getTokenMCapHistory
      ).toHaveBeenCalledWith('token123');
      expect(mockPumpfunProvider.getTokenMCapHistory).toHaveBeenCalledWith(
        'token123'
      );
    });
  });

  describe('getHighestMcap', () => {
    it('should return the highest mcap after the given date', () => {
      const mcapHistory: McapEntry[] = [
        { timestamp: 1620000000, highest: 1000, close: 900 },
        { timestamp: 1620086400, highest: 1500, close: 1400 },
        { timestamp: 1620172800, highest: 2200, close: 1900 },
        { timestamp: 1620259200, highest: 1800, close: 1700 },
        { timestamp: 1620345600, highest: 2000, close: 2100 },
      ];

      const after = new Date(1620172800 * 1000);

      const result = mCapUpdaterService.getHighestMcap(mcapHistory, after);

      expect(result).toBe(2000);
    });

    it('should return 0 if no mcap entries are after the given date', () => {
      const mcapHistory: McapEntry[] = [
        { timestamp: 1620000000, highest: 1000, close: 900 },
        { timestamp: 1620086400, highest: 1500, close: 1400 },
      ];

      const after = new Date('2021-05-10T00:00:00Z'); // After all entries

      const result = mCapUpdaterService.getHighestMcap(mcapHistory, after);

      expect(result).toBe(0);
    });

    it('should handle an empty mcap history', () => {
      const mcapHistory: McapEntry[] = [];

      const after = new Date('2021-05-01T00:00:00Z');

      const result = mCapUpdaterService.getHighestMcap(mcapHistory, after);

      expect(result).toBe(0);
    });
  });
});