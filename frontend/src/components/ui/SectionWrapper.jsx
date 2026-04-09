/**
 * @file SectionWrapper.jsx
 * @description A reusable wrapper for separating main sections with headings and descriptions.
 * Uses CSS custom properties so it adapts to both dark and light themes.
 */

export function SectionWrapper({ title, description, children, className = '', actionContent }) {
  return (
    <div className={`w-full space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {title && (
            <h1
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--text-heading)',
                fontFamily: "'Poppins', sans-serif",
                margin: 0,
              }}
            >
              {title}
            </h1>
          )}
          {description && (
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                margin: 0,
              }}
            >
              {description}
            </p>
          )}
        </div>
        {actionContent && <div className="shrink-0">{actionContent}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
