import { CallingPowerService } from '@src/services/CallingPowerService';
import { CallerRepository } from '@src/services/CallerRepository';
import { CallRepository } from '@src/services/CallRepository';
import { ICallingPowerCalculator } from '@src/calculator/NewCallingPowerCalculator';
import { Call, Caller } from '@prisma/client';

jest.mock('@src/services/CallerRepository');
jest.mock('@src/services/CallRepository');

describe('CallingPowerService', () => {
  let callingPowerService: CallingPowerService;
  let mockCallerRepository: jest.Mocked<CallerRepository>;
  let mockCallRepository: jest.Mocked<CallRepository>;
  let mockCallingPowerCalculator: jest.Mocked<ICallingPowerCalculator>;

  beforeEach(() => {
    mockCallerRepository = {
      getCallersWithCallsOnTokens: jest.fn(),
      getAll: jest.fn(),
      updateCallingPower: jest.fn(),
    } as unknown as jest.Mocked<CallerRepository>;

    mockCallRepository = {
      getCallsByTelegramId: jest.fn(),
    } as unknown as jest.Mocked<CallRepository>;

    mockCallingPowerCalculator = {
      computePower: jest.fn(),
    } as unknown as jest.Mocked<ICallingPowerCalculator>;

    callingPowerService = new CallingPowerService(
      mockCallerRepository,
      mockCallRepository,
      mockCallingPowerCalculator
    );
  });

  describe('updateCallingPowerFor', () => {
    it('should update calling power for callers with calls on given tokens', async () => {
      const uniqueTokens = ['token1', 'token2'];
      // prettier-ignore
      const callers: Caller[] = [
        { id: 1, name: 'Caller1', telegramId: '@caller1', image: null, data: {}, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Caller2', telegramId: '@caller2', image: null, data: {}, createdAt: new Date(), updatedAt: new Date() },
      ];

      mockCallerRepository.getCallersWithCallsOnTokens.mockResolvedValue(
        callers
      );

      await callingPowerService.updateCallingPowerFor(uniqueTokens);

      expect(
        mockCallerRepository.getCallersWithCallsOnTokens
      ).toHaveBeenCalledWith(uniqueTokens);
      expect(mockCallerRepository.updateCallingPower).toHaveBeenCalledTimes(2);
    });
  });

  describe('updateAllCallingPower', () => {
    it('should update calling power for all callers', async () => {
      // prettier-ignore
      const callers: Caller[] = [
        { id: 1, name: 'Caller1', telegramId: '@caller1', image: null, data: {}, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Caller2', telegramId: '@caller2', image: null, data: {}, createdAt: new Date(), updatedAt: new Date() },
        { id: 3, name: 'Caller3', telegramId: '@caller3', image: null, data: {}, createdAt: new Date(), updatedAt: new Date() },
      ];

      mockCallerRepository.getAll.mockResolvedValue(callers);

      await callingPowerService.updateAllCallingPower();

      expect(mockCallerRepository.getAll).toHaveBeenCalled();
      expect(mockCallerRepository.updateCallingPower).toHaveBeenCalledTimes(3);
    });
  });

  describe('updateCallingPower', () => {
    it('should update calling power for a single caller', async () => {
      const callerId = 1;
      // prettier-ignore
      const calls: Call[] = [
        { id: 1, callerId: 1, tokenAddress: 'token1', startFDV: 1000, highestFDV: 1100, data: {}, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, callerId: 1, tokenAddress: 'token2', startFDV: 1000, highestFDV: 1100, data: {}, createdAt: new Date(), updatedAt: new Date() },
      ];
      const callerPower = 10;

      mockCallRepository.getCallsByTelegramId.mockResolvedValue(calls);
      mockCallingPowerCalculator.computePower.mockReturnValue(callerPower);

      await callingPowerService.updateCallingPower(callerId);

      expect(mockCallRepository.getCallsByTelegramId).toHaveBeenCalledWith(
        callerId
      );
      expect(mockCallingPowerCalculator.computePower).toHaveBeenCalledWith(
        calls
      );
      expect(mockCallerRepository.updateCallingPower).toHaveBeenCalledWith(
        callerId,
        callerPower
      );
    });
  });

  describe('updateCallingPower error handling', () => {
    it('should catch and not rethrow error when updateCallingPower fails', async () => {
      const callerId = 999;
      const calls: Call[] = [];
      const callerPower = 0;

      mockCallRepository.getCallsByTelegramId.mockResolvedValue(calls);
      mockCallingPowerCalculator.computePower.mockReturnValue(callerPower);
      mockCallerRepository.updateCallingPower.mockRejectedValue(
        new Error('Update failed')
      );

      await expect(
        callingPowerService.updateCallingPower(callerId)
      ).resolves.not.toThrow();

      expect(mockCallRepository.getCallsByTelegramId).toHaveBeenCalledWith(
        callerId
      );
      expect(mockCallingPowerCalculator.computePower).toHaveBeenCalledWith(
        calls
      );
      expect(mockCallerRepository.updateCallingPower).toHaveBeenCalledWith(
        callerId,
        callerPower
      );
    });
  });
});
