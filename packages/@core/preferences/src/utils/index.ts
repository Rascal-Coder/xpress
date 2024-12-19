/**
 * Increase string a value with unit
 *
 * @example '2px' + 1 = '3px'
 * @example '15em' + (-2) = '13em'
 */
export function increaseWithUnit(target: number, delta: number): number;
export function increaseWithUnit(target: string, delta: number): string;
export function increaseWithUnit(
  target: number | string,
  delta: number,
): number | string;
export function increaseWithUnit(
  target: number | string,
  delta: number,
): number | string {
  if (typeof target === 'number') return target + delta;
  const value = target.match(/^-?\d+\.?\d*/)?.[0] || '';
  const unit = target.slice(value.length);
  const result = Number.parseFloat(value) + delta;
  if (Number.isNaN(result)) return target;
  return result + unit;
}
