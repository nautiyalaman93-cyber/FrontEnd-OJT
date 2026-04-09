/**
 * @file Button.jsx
 * @description Theme-aware button using BharatPath design system.
 * Primary uses the saffron accent (#FF6B00 light / #FF8C42 dark).
 */

export function Button({
  children,
  variant = 'primary',
  className = '',
  isLoading,
  disabled,
  ...props
}) {
  const variantClass = {
    primary:   'bp-btn--primary',
    secondary: 'bp-btn--secondary',
    outline:   'bp-btn--outline',
    danger:    'bp-btn--danger',
  }[variant] ?? 'bp-btn--primary';

  return (
    <button
      className={`bp-btn ${variantClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Please wait
        </span>
      ) : (
        children
      )}
    </button>
  );
}
