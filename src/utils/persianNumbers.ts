/**
 * Utility functions for converting numbers and formatting digits into Persian.
 */

const ENGLISH_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/**
 * Converts all English digits in a string to Persian digits.
 * Skips HTML tag contents or attributes if raw html is passed (best used on text strings).
 */
export function toPersianDigits(input: string | number): string {
  if (input === null || input === undefined) return '';
  let str = String(input);
  for (let i = 0; i < 10; i++) {
    str = str.replace(new RegExp(ENGLISH_DIGITS[i], 'g'), PERSIAN_DIGITS[i]);
  }
  return str;
}

/**
 * Formats a degree string (e.g. "18°36'" or "18°36′") into Persian digits ("۱۸°۳۶′")
 */
export function formatPersianDegree(degreeStr: string): string {
  if (!degreeStr) return '۰۰°۰۰′';
  return toPersianDigits(degreeStr).replace(/'/g, '′');
}
