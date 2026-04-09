/**
 * @file Input.jsx
 * @description Theme-aware form input using BharatPath design system.
 * Focus ring uses saffron accent color, adapts per theme.
 */

import { forwardRef } from 'react';

export const Input = forwardRef(({
  className = '',
  error,
  label,
  id,
  ...props
}, ref) => {
  return (
    <div className="bp-input-wrapper">
      {label && (
        <label htmlFor={id} className="bp-label">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`bp-input ${error ? 'bp-input--error' : ''} ${className}`}
        {...props}
      />
      {error && <p className="bp-error-msg">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
