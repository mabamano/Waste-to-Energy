/**
 * Utility functions for the WtE Dashboard.
 * All functions are pure (no side effects) for easy testing.
 */

/**
 * Formats a Unix timestamp (ms) or ISO string to HH:mm format.
 * @param {number|string} ts - Timestamp in ms or ISO string
 * @returns {string} Formatted time string
 */
export function formatTime(ts) {
  if (!ts) return '—';
  try {
    const date = new Date(typeof ts === 'number' && ts < 1e12 ? ts * 1000 : ts);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '—';
  }
}

/**
 * Formats a timestamp to a full date-time string.
 * @param {number|string} ts
 * @returns {string}
 */
export function formatDateTime(ts) {
  if (!ts) return '—';
  try {
    const date = new Date(typeof ts === 'number' && ts < 1e12 ? ts * 1000 : ts);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return '—';
  }
}

/**
 * Returns today's date as YYYY-MM-DD.
 * @returns {string}
 */
export function todayString() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Calculates estimated carbon credits from CO₂ offset.
 * 1 carbon credit = 1 tonne of CO₂ = 1000 kg.
 * @param {number|null} co2Kg - CO₂ offset in kilograms
 * @returns {number} Carbon credits (tonnes)
 */
export function calculateCarbonCredits(co2Kg) {
  if (co2Kg == null || isNaN(co2Kg) || co2Kg < 0) return 0;
  return co2Kg / 1000;
}

/**
 * Estimates market value of carbon credits.
 * @param {number} credits - Number of carbon credits
 * @param {number} [ratePerCredit=15] - USD per credit
 * @returns {number} Estimated USD value
 */
export function estimateCreditValue(credits, ratePerCredit = 15) {
  if (!credits || credits < 0) return 0;
  return credits * ratePerCredit;
}

/**
 * Converts an array of sensor reading objects to a CSV string.
 * @param {Array<Object>} records - Array of sensor readings
 * @returns {string} CSV string with header row
 */
export function convertToCsv(records) {
  if (!records || records.length === 0) return '';

  const headers = [
    'timestamp',
    'methane_ppm',
    'temperature_c',
    'humidity_pct',
    'moisture_pct',
  ];

  const rows = records.map((r) =>
    headers
      .map((h) => {
        const val = r[h];
        if (val == null) return '';
        // Wrap strings containing commas or quotes in double quotes
        const str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      })
      .join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Triggers a browser download of a text file.
 * @param {string} content - File content
 * @param {string} filename - Download filename
 * @param {string} [mimeType='text/csv'] - MIME type
 */
export function downloadFile(content, filename, mimeType = 'text/csv') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Safely parses a Firebase snapshot value that may be an object-of-objects
 * (Firebase stores arrays as objects with numeric keys) into a JS array.
 * @param {Object|null} val - Firebase snapshot value
 * @returns {Array}
 */
export function snapshotToArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return Object.values(val);
}

/**
 * Clamps a number between min and max.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Returns a severity color token based on a value and thresholds.
 * @param {number} value
 * @param {number} warnThreshold
 * @param {number} critThreshold
 * @returns {'normal'|'warning'|'critical'}
 */
export function getSeverity(value, warnThreshold, critThreshold) {
  if (value >= critThreshold) return 'critical';
  if (value >= warnThreshold) return 'warning';
  return 'normal';
}
