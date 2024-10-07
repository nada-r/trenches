import { Call } from '@prisma/client';
import { NewCallingPowerCalculator } from '@src/calculator/NewCallingPowerCalculator';

describe('NewCallingPowerCalculator', () => {
  let calculator: NewCallingPowerCalculator;

  beforeEach(() => {
    calculator = new NewCallingPowerCalculator();
  });

  it('should compute power correctly', () => {
    const calls: Call[] = [
      {
        id: 1,
        tokenAddress: 'token1',
        startFDV: 1000,
        highestFDV: 1500,
        callerId: 1,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        updatedAt: new Date(),
        data: null,
      },
      {
        id: 2,
        tokenAddress: 'token2',
        startFDV: 2000,
        highestFDV: 2200,
        callerId: 1,
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 36 hours ago
        updatedAt: new Date(),
        data: null,
      },
    ];

    const power = calculator.computePower(calls);
    expect(power).toBeGreaterThan(0);
    expect(power).toBeLessThan(100);
  });

  it('should return 0 for empty calls array', () => {
    const power = calculator.computePower([]);
    expect(power).toBe(0);
  });
});
