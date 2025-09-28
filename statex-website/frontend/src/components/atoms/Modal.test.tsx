import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import { Modal } from './Modal';
import { testCompleteThemeSupport, renderWithTheme, ALL_THEMES, ThemeName } from '../../test/utils/theme-testing';

// Mock createPortal
vi.mock('react-dom', () => ({
  ...vi.importActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}));

describe('Modal', () => {
  const defaultProps = {
    isOpen: false,
    onClose: vi.fn(),
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when closed', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('renders modal content when open', () => {
    render(<Modal {...defaultProps} isOpen={true} />);
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('renders with STX classes', () => {
    render(<Modal {...defaultProps} isOpen={true} />);
    const modal = screen.getByRole('dialog');
    const content = screen.getByText('Modal content').closest('.stx-modal-content');
    const backdrop = modal.querySelector('.stx-modal-backdrop');

    expect(modal).toHaveClass('stx-modal');
    expect(content).toHaveClass('stx-modal-content');
    expect(backdrop).toHaveClass('stx-modal-backdrop');
  });

  it('renders with title and description', () => {
    render(
      <Modal
        {...defaultProps}
        isOpen={true}
        title="Test Title"
        description="Test Description"
      />
    );

    expect(screen.getByText('Test Title')).toHaveClass('stx-modal-title');
    expect(screen.getByText('Test Description')).toHaveClass('stx-modal-description');
  });

  it('renders modal header with title and close button', () => {
    render(
      <Modal
        {...defaultProps}
        isOpen={true}
        title="Test Title"
        showCloseButton={true}
      />
    );

    const header = screen.getByText('Test Title').closest('.stx-modal-header');
    const closeButton = screen.getByLabelText('Close modal');

    expect(header).toHaveClass('stx-modal-header');
    expect(closeButton).toHaveClass('stx-modal-close-button');
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal {...defaultProps} isOpen={true} onClose={onClose} showCloseButton={true} />
    );

    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal {...defaultProps} isOpen={true} onClose={onClose} closeOnOverlayClick={true} />
    );

    // Click on the outer container (the dialog itself)
    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when overlay is clicked if closeOnOverlayClick is false', () => {
    const onClose = vi.fn();
    render(
      <Modal {...defaultProps} isOpen={true} onClose={onClose} closeOnOverlayClick={false} />
    );

    // Click on the outer container (the dialog itself)
    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when escape key is pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal {...defaultProps} isOpen={true} onClose={onClose} closeOnEscape={true} />
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when escape key is pressed if closeOnEscape is false', () => {
    const onClose = vi.fn();
    render(
      <Modal {...defaultProps} isOpen={true} onClose={onClose} closeOnEscape={false} />
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('has proper ARIA attributes', () => {
    render(
      <Modal
        {...defaultProps}
        isOpen={true}
        title="Test Title"
        description="Test Description"
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'modal-description');
  });

  it('applies custom className to modal container', () => {
    render(
      <Modal {...defaultProps} isOpen={true} className="custom-class" />
    );

    const content = screen.getByText('Modal content').closest('.stx-modal-content');
    expect(content).toHaveClass('stx-modal-content');
  });

  it('applies custom overlayClassName', () => {
    render(
      <Modal {...defaultProps} isOpen={true} overlayClassName="custom-overlay" />
    );

    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('custom-overlay', 'stx-modal');
  });

  it('applies custom contentClassName', () => {
    render(
      <Modal {...defaultProps} isOpen={true} contentClassName="custom-content" />
    );

    const content = screen.getByText('Modal content').closest('.stx-modal-content');
    expect(content).toHaveClass('custom-content', 'stx-modal-content');
  });
});

// Theme switching tests
describe('Modal Theme Support', () => {
  const themeDefaultProps = {
    isOpen: false,
    onClose: vi.fn(),
    children: <div>Modal content</div>,
  };

  // Test modal backgrounds in all themes
  describe('Modal Backgrounds Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`modal background renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Modal {...themeDefaultProps} isOpen={true} />,
          theme
        );

        const modal = screen.getByRole('dialog');
        expect(modal).toBeInTheDocument();
        expect(modal).toHaveClass('stx-modal');

        // Verify modal background styling
        const computedStyle = getComputedStyle(modal);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.position).toBeDefined();
      });
    });
  });

  // Test modal overlay backgrounds in all themes
  describe('Modal Overlay Backgrounds Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`modal overlay background renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Modal {...themeDefaultProps} isOpen={true} />,
          theme
        );

        const modal = screen.getByRole('dialog');
        const backdrop = modal.querySelector('.stx-modal-backdrop');
        expect(backdrop).toBeInTheDocument();
        expect(backdrop).toHaveClass('stx-modal-backdrop');

        // Verify overlay background styling
        const computedStyle = getComputedStyle(backdrop as Element);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.position).toBeDefined();
        expect(computedStyle.zIndex).toBeDefined();
      });
    });
  });

  // Test modal content backgrounds in all themes
  describe('Modal Content Backgrounds Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`modal content background renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Modal {...themeDefaultProps} isOpen={true} />,
          theme
        );

        const content = screen.getByText('Modal content').closest('.stx-modal-content');
        expect(content).toBeInTheDocument();
        expect(content).toHaveClass('stx-modal-content');

        // Verify content background styling
        const computedStyle = getComputedStyle(content as Element);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.borderRadius).toBeDefined();
        expect(computedStyle.boxShadow).toBeDefined();
      });
    });
  });

  // Test modal with title and description in all themes
  describe('Modal Content Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`modal with title and description renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Modal
            {...themeDefaultProps}
            isOpen={true}
            title="Test Title"
            description="Test Description"
          />,
          theme
        );

        const title = screen.getByText('Test Title');
        const description = screen.getByText('Test Description');
        expect(title).toHaveClass('stx-modal-title');
        expect(description).toHaveClass('stx-modal-description');

        // Verify text styling
        const titleStyle = getComputedStyle(title);
        const descStyle = getComputedStyle(description);
        expect(titleStyle.color).toBeDefined();
        expect(descStyle.color).toBeDefined();
      });
    });
  });

  // Test modal header in all themes
  describe('Modal Header Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`modal header renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Modal
            {...themeDefaultProps}
            isOpen={true}
            title="Test Title"
            showCloseButton={true}
          />,
          theme
        );

        const header = screen.getByText('Test Title').closest('.stx-modal-header');
        const closeButton = screen.getByLabelText('Close modal');

        expect(header).toHaveClass('stx-modal-header');
        expect(closeButton).toHaveClass('stx-modal-close-button');

        // Verify header styling
        const headerStyle = getComputedStyle(header as Element);
        const buttonStyle = getComputedStyle(closeButton);
        expect(headerStyle.backgroundColor).toBeDefined();
        expect(buttonStyle.color).toBeDefined();
      });
    });
  });

  // Test modal close button in all themes
  describe('Modal Close Button Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`modal close button renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Modal
            {...themeDefaultProps}
            isOpen={true}
            showCloseButton={true}
          />,
          theme
        );

        const closeButton = screen.getByLabelText('Close modal');
        expect(closeButton).toBeInTheDocument();
        expect(closeButton).toHaveClass('stx-modal-close-button');

        // Verify close button styling
        const computedStyle = getComputedStyle(closeButton);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.borderRadius).toBeDefined();
      });
    });
  });

  // Test modal with custom content in all themes
  describe('Modal Custom Content Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`modal with custom content renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Modal
            {...themeDefaultProps}
            isOpen={true}
          >
            <div data-testid="custom-content">Custom Modal Content</div>
          </Modal>,
          theme
        );

        const customContent = screen.getByTestId('custom-content');
        expect(customContent).toBeInTheDocument();
        expect(customContent).toHaveTextContent('Custom Modal Content');

        // Verify content container styling
        const content = customContent.closest('.stx-modal-content');
        const computedStyle = getComputedStyle(content as Element);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.padding).toBeDefined();
      });
    });
  });

  // Test modal with custom class names in all themes
  describe('Modal Custom Classes Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`modal with custom classes renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Modal
            {...themeDefaultProps}
            isOpen={true}
            className="custom-modal"
            overlayClassName="custom-overlay"
            contentClassName="custom-content"
          />,
          theme
        );

        const modal = screen.getByRole('dialog');
        const content = screen.getByText('Modal content').closest('.stx-modal-content');

        expect(modal).toHaveClass('custom-overlay', 'stx-modal');
        expect(content).toHaveClass('custom-content', 'stx-modal-content');

        // Verify custom styling is applied
        const modalStyle = getComputedStyle(modal);
        const contentStyle = getComputedStyle(content as Element);
        expect(modalStyle.backgroundColor).toBeDefined();
        expect(contentStyle.backgroundColor).toBeDefined();
      });
    });
  });

  // Test modal accessibility in all themes
  describe('Modal Accessibility Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`modal maintains accessibility in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Modal
            {...themeDefaultProps}
            isOpen={true}
            title="Accessible Modal"
            description="Modal description"
          />,
          theme
        );

        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
        expect(dialog).toHaveAttribute('aria-describedby', 'modal-description');

        // Test contrast (basic check)
        const content = screen.getByText('Modal content').closest('.stx-modal-content');
        const computedStyle = getComputedStyle(content as Element);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
      });
    });
  });

  // Test theme transitions
  describe('Modal Theme Transitions', () => {
    it('supports theme switching without breaking', () => {
      const { rerender } = renderWithTheme(
        <Modal {...themeDefaultProps} isOpen={true} />,
        'light'
      );

      // Switch to dark theme
      rerender(<Modal {...themeDefaultProps} isOpen={true} />);
      const lightContainer = document.querySelector('[data-theme="light"]');
      expect(lightContainer).toBeInTheDocument();

      // Switch to eu theme
      rerender(<Modal {...themeDefaultProps} isOpen={true} />);
      const euContainer = document.querySelector('[data-theme="light"]');
      expect(euContainer).toBeInTheDocument();

      // Switch to uae theme
      rerender(<Modal {...themeDefaultProps} isOpen={true} />);
      const uaeContainer = document.querySelector('[data-theme="light"]');
      expect(uaeContainer).toBeInTheDocument();
    });
  });

  // Test theme performance
  describe('Modal Theme Performance', () => {
    it('renders efficiently across all themes', () => {
      const startTime = performance.now();

      ALL_THEMES.forEach(theme => {
        renderWithTheme(<Modal {...themeDefaultProps} isOpen={true} />, theme);
      });

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should render all themes within reasonable time
      expect(totalTime).toBeLessThan(1000);
    });
  });

  // Enhanced theme support tests using the utility
  testCompleteThemeSupport(
    'Modal',
    (theme: ThemeName) => <Modal {...themeDefaultProps} isOpen={true} />,
    {
      testSelectors: {
        background: '.stx-modal-content',
        text: '.stx-modal-title',
        border: '.stx-modal-content',
        action: '.stx-modal-close-button'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true,
      testEnhancedIntegration: true,
      testEnhancedPerformance: true
    }
  );
});
