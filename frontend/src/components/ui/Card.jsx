/**
 * @file Card.jsx
 * @description Flexible container components using the BharatPath theme system.
 * Automatically adapts to dark/light mode via CSS custom properties.
 */

export function Card({ className = '', children, ...props }) {
  return (
    <div className={`bp-card ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }) {
  return (
    <div
      style={{ borderBottom: '1px solid var(--border)' }}
      className={`px-6 py-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }) {
  return (
    <h3
      style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
      className={`text-lg font-bold ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
