import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useABTest } from './useABTest';

describe('useABTest Hook', () => {
  describe('Basic Functionality', () => {
    it('should return first variant by default', () => {
      const { result } = renderHook(() => useABTest('test-experiment', ['A', 'B', 'C']));

      expect(result.current).toBe('A');
    });

    it('should return default when no variants provided', () => {
      const { result } = renderHook(() => useABTest('test-experiment', []));

      expect(result.current).toBe('default');
    });

    it('should return first variant when only one variant provided', () => {
      const { result } = renderHook(() => useABTest('test-experiment', ['B']));

      expect(result.current).toBe('B');
    });
  });

  describe('Consistency', () => {
    it('should return consistent result for same experiment', () => {
      const { result, rerender } = renderHook(() => useABTest('test-experiment', ['A', 'B', 'C']));

      const firstResult = result.current;

      // Re-render multiple times
      rerender();
      rerender();
      rerender();

      expect(result.current).toBe(firstResult);
    });

    it('should return consistent result across different calls', () => {
      const { result: result1 } = renderHook(() => useABTest('test-experiment', ['A', 'B', 'C']));
      const { result: result2 } = renderHook(() => useABTest('test-experiment', ['A', 'B', 'C']));

      expect(result1.current).toBe(result2.current);
    });
  });

  describe('Different Experiments', () => {
    it('should handle different experiment names', () => {
      const { result: result1 } = renderHook(() => useABTest('experiment-1', ['A', 'B']));
      const { result: result2 } = renderHook(() => useABTest('experiment-2', ['X', 'Y']));

      expect(result1.current).toBe('A');
      expect(result2.current).toBe('X');
    });

    it('should handle different variant arrays', () => {
      const { result: result1 } = renderHook(() => useABTest('test', ['A', 'B']));
      const { result: result2 } = renderHook(() => useABTest('test', ['X', 'Y', 'Z']));

      expect(result1.current).toBe('A');
      expect(result2.current).toBe('X');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty experiment name', () => {
      const { result } = renderHook(() => useABTest('', ['A', 'B']));

      expect(result.current).toBe('A');
    });

    it('should handle special characters in experiment name', () => {
      const { result } = renderHook(() => useABTest('test-experiment-123!@#', ['A', 'B']));

      expect(result.current).toBe('A');
    });

    it('should handle numeric variants', () => {
      const { result } = renderHook(() => useABTest('test', ['1', '2', '3']));

      expect(result.current).toBe('1');
    });
  });

  describe('Performance', () => {
    it('should memoize result correctly', () => {
      const variants = ['A', 'B', 'C']; // Define variants outside to maintain reference
      const { result, rerender } = renderHook(() => useABTest('test-experiment', variants));

      const firstResult = result.current;

      // Re-render with same parameters
      rerender();

      expect(result.current).toBe(firstResult);
    });
  });
});
