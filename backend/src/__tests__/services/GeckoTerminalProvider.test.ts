import axios from 'axios';
import { McapEntry } from '@src/services/MCapUpdaterService';
import { GeckoTerminalProvider } from '@src/services/GeckoTerminalProvider';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GeckoTerminalProvider', () => {
  let geckoTerminalProvider: GeckoTerminalProvider;

  beforeEach(() => {
    geckoTerminalProvider = new GeckoTerminalProvider(mockedAxios);
    jest.clearAllMocks();
  });

  describe('getSolPrice', () => {
    it('should return cached price if cache is valid', async () => {
      const cachedPrice = 100;
      (geckoTerminalProvider as any).solPriceCache = {
        price: cachedPrice,
        timestamp: Date.now(),
      };

      const result = await geckoTerminalProvider.getSolPrice();
      expect(result).toBe(cachedPrice);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should fetch new price if cache is expired', async () => {
      const newPrice = 200;
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: {
            attributes: {
              token_prices: {
                So11111111111111111111111111111111111111112: newPrice,
              },
            },
          },
        },
      });

      (geckoTerminalProvider as any).solPriceCache = {
        price: 100,
        timestamp: Date.now() - 61000, // Expired cache
      };

      const result = await geckoTerminalProvider.getSolPrice();
      expect(result).toBe(newPrice);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    test.each([[404], [429], [500]])(
      'should handle API errors gracefully',
      async (code: number) => {
        mockedAxios.get.mockRejectedValueOnce({
          response: { status: code },
          config: { url: 'test-url' },
        });

        const result = await geckoTerminalProvider.getSolPrice();
        expect(result).toBeNull();
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      }
    );
  });

  describe('getTokenMCapHistory', () => {
    it('should return token market cap history', async () => {
      const mockOhlcvList = [
        [2000, 12, 18, 10, 14],
        [1000, 10, 15, 8, 12],
      ];
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: {
            attributes: {
              ohlcv_list: mockOhlcvList,
            },
          },
        },
      });

      const result =
        await geckoTerminalProvider.getTokenMCapHistory('token123');
      const expected: McapEntry[] = [
        {
          timestamp: 1000,
          close: 12 * 1_000_000_000,
        },
        {
          timestamp: 2000,
          close: 14 * 1_000_000_000,
        },
      ];
      expect(result).toEqual(expected);
    });

    it('should normalize high values that are 50% higher than close values', async () => {
      const mockOhlcvList = [
        [3000, 12, 18, 10, 14],
        [2000, 12, 30, 10, 19],
        [1000, 10, 15, 8, 12],
      ];
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: {
            attributes: {
              ohlcv_list: mockOhlcvList,
            },
          },
        },
      });

      const result =
        await geckoTerminalProvider.getTokenMCapHistory('token123');
      const expected: McapEntry[] = [
        {
          timestamp: 1000,
          close: 12 * 1_000_000_000,
        },
        {
          timestamp: 2000,
          close: 19 * 1_000_000_000,
        },
        {
          timestamp: 3000,
          close: 14 * 1_000_000_000,
        },
      ];
      expect(result).toEqual(expected);
    });

    test.each([[404], [429], [500]])(
      'should handle HTTP errors',
      async (code: number) => {
        mockedAxios.get.mockRejectedValueOnce({
          response: { status: code },
          config: { url: 'test-url' },
        });

        const result =
          await geckoTerminalProvider.getTokenMCapHistory('token123');
        expect(result).toBeNull();
      }
    );
  });
});
