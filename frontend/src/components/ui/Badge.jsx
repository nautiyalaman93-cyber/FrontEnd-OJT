/**
 * @file Badge.jsx
 * @description A reusable UI badge for displaying statuses, labels, or tags.
 * 
 * WHY THIS FILE EXISTS:
 * Standardizes the appearance of small status indicators everywhere (e.g., Live, Delayed, Waitlisted).
 * 
 * WHAT WILL BREAK IF REMOVED:
 * Pages needing to display compact statuses will fail to render this component.
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Badge({ children, variant = 'default', className, ...props }) {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase";
  
  const variants = {
    default: "bg-slate-100 text-slate-700 border border-slate-200",
    success: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    warning: "bg-amber-50 text-amber-600 border border-amber-200",
    danger: "bg-red-50 text-red-600 border border-red-200",
    primary: "bg-blue-50 text-blue-600 border border-blue-200",
    purple: "bg-purple-50 text-purple-600 border border-purple-200",
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
