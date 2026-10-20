import { isDraftStale } from './draftWorkout';

describe('isDraftStale', () => {
  it('is not stale when started earlier today', () => {
    const now = new Date(2026, 9, 20, 20);
    const startedAt = new Date(2026, 9, 20, 6).toISOString();
    expect(isDraftStale(startedAt, now)).toBe(false);
  });

  it('is stale when started yesterday', () => {
    const now = new Date(2026, 9, 20, 6);
    const startedAt = new Date(2026, 9, 19, 20).toISOString();
    expect(isDraftStale(startedAt, now)).toBe(true);
  });

  it('is stale across a month boundary', () => {
    const now = new Date(2026, 10, 1, 6);
    const startedAt = new Date(2026, 9, 31, 20).toISOString();
    expect(isDraftStale(startedAt, now)).toBe(true);
  });

  it('is stale across a year boundary', () => {
    const now = new Date(2027, 0, 1, 6);
    const startedAt = new Date(2026, 11, 31, 20).toISOString();
    expect(isDraftStale(startedAt, now)).toBe(true);
  });
});
