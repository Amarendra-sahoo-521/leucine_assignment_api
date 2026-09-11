import { describe, it, expect } from 'vitest';
import { formatPaginationResponse, parsePaginationParams } from './pagination';

describe('parsePaginationParams', () => {
  it('defaults to page 1, limit 10 when nothing is passed', () => {
    expect(parsePaginationParams({})).toEqual({ page: 1, limit: 10, search: undefined });
  });

  it('parses valid page and limit from query strings', () => {
    expect(parsePaginationParams({ page: '3', limit: '25' })).toEqual({
      page: 3,
      limit: 25,
      search: undefined,
    });
  });

  it('clamps page below 1 up to 1', () => {
    expect(parsePaginationParams({ page: '-5' }).page).toBe(1);
    expect(parsePaginationParams({ page: '0' }).page).toBe(1);
  });

  it('falls back to limit 10 when limit is below 1', () => {
    expect(parsePaginationParams({ limit: '0' }).limit).toBe(10);
    expect(parsePaginationParams({ limit: '-3' }).limit).toBe(10);
  });

  it('caps limit at 100', () => {
    expect(parsePaginationParams({ limit: '500' }).limit).toBe(100);
  });

  it('ignores non-numeric input and falls back to defaults', () => {
    expect(parsePaginationParams({ page: 'abc', limit: 'xyz' })).toEqual({
      page: 1,
      limit: 10,
      search: undefined,
    });
  });
});

// src/utils/pagination.test.ts (same file, or split if you prefer)
describe('formatPaginationResponse', () => {
  it('computes totalPages with an exact division', () => {
    const result = formatPaginationResponse([], 100, 2, 10);
    expect(result.pagination.totalPages).toBe(10);
  });

  it('rounds totalPages up when total does not divide evenly', () => {
    const result = formatPaginationResponse([], 95, 1, 10);
    expect(result.pagination.totalPages).toBe(10); // 9.5 -> 10
  });

  it('returns totalPages 0 when total is 0', () => {
    const result = formatPaginationResponse([], 0, 1, 10);
    expect(result.pagination.totalPages).toBe(0);
  });

  it('echoes back the requested page and limit', () => {
    const result = formatPaginationResponse(['a', 'b'], 50, 3, 20);
    expect(result.pagination).toMatchObject({ page: 3, limit: 20, total: 50 });
  });
});