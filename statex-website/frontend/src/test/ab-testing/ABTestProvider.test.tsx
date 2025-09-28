import { render, screen, act } from '@testing-library/react';
import { ABTestProvider, useABTestContext } from '@/contexts/ABTestProvider';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Test component that uses the AB test context
const TestComponent = ({ testId }: { testId: string }) => {
  const { getVariant, setVariant, isClient } = useABTestContext();
  const variant = getVariant('test-experiment', ['control', 'variant-a', 'variant-b']);

  return (
    <div data-testid={testId}>
      <div data-testid="variant">{variant}</div>
      <div data-testid="is-client">{isClient.toString()}</div>
      <button
        onClick={() => setVariant('test-experiment', 'variant-a')}
        data-testid="set-variant-a"
      >
        Set Variant A
      </button>
    </div>
  );
};

describe('ABTestProvider', () => {
  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    key: vi.fn(),
    length: 0,
  };

  beforeEach(() => {
    // Reset all mocks and clear localStorage mock
    vi.clearAllMocks();
    global.localStorage = localStorageMock as Storage;
  });

  afterEach(() => {
    // Clean up after each test
    vi.clearAllMocks();
    localStorageMock.getItem.mockReset();
    localStorageMock.setItem.mockReset();
  });

  it('should provide valid variant in client environment', () => {
    // Test in client environment
    const { getByTestId } = render(
      <ABTestProvider>
        <TestComponent testId="client-component" />
      </ABTestProvider>
    );

    // Should return a valid variant from the options
    const variant = getByTestId('variant').textContent;
    expect(['control', 'variant-a', 'variant-b']).toContain(variant);
    expect(getByTestId('is-client').textContent).toBe('true');
  });

  it('should provide consistent variants for the same experiment', () => {
    // Mock client-side
    const { getByTestId } = render(
      <ABTestProvider>
        <TestComponent testId="client-component-1" />
        <TestComponent testId="client-component-2" />
      </ABTestProvider>
    );

    // Both components should get the same variant for the same experiment
    const variant1 = getByTestId('client-component-1').querySelector('[data-testid="variant"]')?.textContent;
    const variant2 = getByTestId('client-component-2').querySelector('[data-testid="variant"]')?.textContent;

    expect(variant1).toBe(variant2);
    expect(['control', 'variant-a', 'variant-b']).toContain(variant1);
  });

  it('should persist variant in localStorage', () => {
    // First render - no stored variant
    const { getByTestId, rerender } = render(
      <ABTestProvider>
        <TestComponent testId="test-component" />
      </ABTestProvider>
    );

    // Should have called getItem
    expect(localStorageMock.getItem).toHaveBeenCalledWith('ab-test-variants');

    // Get the initially assigned variant
    const initialVariant = getByTestId('variant').textContent;

    // Simulate setting a specific variant
    act(() => {
      getByTestId('set-variant-a').click();
    });

    // Should have called setItem with the new variant
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'ab-test-variants',
      JSON.stringify({ 'test-experiment': 'variant-a' })
    );

    // Verify the variant was set correctly
    expect(getByTestId('variant').textContent).toBe('variant-a');

    // Test that localStorage is used for persistence
    // Mock localStorage to return a different variant
    localStorageMock.getItem.mockImplementation(() => JSON.stringify({ 'test-experiment': 'variant-b' }));

    // Create a new provider instance to test localStorage loading
    const { getByTestId: getByTestId2 } = render(
      <ABTestProvider>
        <TestComponent testId="test-component-2" />
      </ABTestProvider>
    );

    // Should now use the variant from localStorage
    expect(getByTestId2('test-component-2').querySelector('[data-testid="variant"]')?.textContent).toBe('variant-b');
  });

  it('should handle localStorage errors gracefully', () => {
    // Simulate localStorage throwing an error
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('Storage error');
    });

    // Should not throw, just log the error
    expect(() => {
      render(
        <ABTestProvider>
          <TestComponent testId="error-component" />
        </ABTestProvider>
      );
    }).not.toThrow();
  });

  it('should maintain variant consistency across multiple experiments', () => {
    const { getByTestId } = render(
      <ABTestProvider>
        <TestComponent testId="multi-experiment" />
      </ABTestProvider>
    );

    // Get the initial variant
    const initialVariant = getByTestId('variant').textContent;

    // Change the variant
    act(() => {
      getByTestId('set-variant-a').click();
    });

    // Should update to the new variant
    expect(getByTestId('variant').textContent).toBe('variant-a');
  });
});
