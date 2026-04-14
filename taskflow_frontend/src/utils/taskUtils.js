/**
 * Shared presentation constants and pure utility functions for tasks.
 * Import from here instead of re-defining in each component.
 */

export const PRIORITY_RANK = { high: 3, medium: 2, low: 1 };

export const PRIORITY_BADGE = {
  low:    'text-on-surface-variant bg-surface-container-low',
  medium: 'text-on-secondary-fixed-variant bg-secondary-fixed',
  high:   'text-on-error-container bg-error-container',
};

export const PRIORITY_LABEL = {
  low: 'Low Priority',
  medium: 'Medium Priority',
  high: 'High Priority',
};

export const PRIORITY_STYLES = {
  low:    { badge: 'bg-surface-container-low text-on-surface-variant',        label: 'Low' },
  medium: { badge: 'bg-secondary-fixed text-on-secondary-fixed-variant',      label: 'Medium' },
  high:   { badge: 'bg-error-container text-on-error-container',              label: 'High' },
};

/**
 * Format a YYYY-MM-DD date string as "Mon D" (e.g. "Apr 9").
 * Returns null if no date is provided.
 */
export function formatDate(dateStr) {
  if (!dateStr) return null;
  const [, month, day] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}`;
}

/**
 * Return true if the given date string is in the past and the task is not terminal.
 */
export function isOverdue(dateStr, isTerminal = false) {
  if (!dateStr || isTerminal) return false;
  return new Date(dateStr) < new Date(new Date().toDateString());
}
