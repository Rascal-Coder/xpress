/**
 * `clamp` 函数将一个数值限制在指定范围内。如果数值在范围内，则返回原值；
 * 如果超出范围，则返回最接近的边界值。
 * @param {number} value - 需要限制范围的数值
 * @param {number} min - 最小边界值。如果 value 小于 min，函数将返回 min
 * @param {number} max - 最大边界值。如果 value 大于 max，函数将返回 max
 * @returns 返回在 min 和 max 范围内的限制后的值
 */
export function clamp(
  value: number,
  min: number = Number.NEGATIVE_INFINITY,
  max: number = Number.POSITIVE_INFINITY,
): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * `roundToStepPrecision` 函数将数值四舍五入到指定的精度步长
 * @param {number} value - 需要进行四舍五入的数值
 * @param {number} step - 精度步长。例如，如果 step 为 0.5，则 value 将被四舍五入到最接近的 0.5
 * @returns 返回按照指定步长精度四舍五入后的值
 */
export function roundToStepPrecision(value: number, step: number) {
  let roundedValue = value;
  const stepString = step.toString();
  const pointIndex = stepString.indexOf('.');
  const precision = pointIndex === -1 ? 0 : stepString.length - pointIndex;
  if (precision > 0) {
    const pow = 10 ** precision;
    roundedValue = Math.round(roundedValue * pow) / pow;
  }
  return roundedValue;
}

/**
 * `snapValueToStep` 函数将给定值调整到指定范围内最接近的步长值
 * @param {number} value - 需要调整的数值
 * @param {number | undefined} min - 最小值。如果 value 小于 min，将被调整到 min。
 * 如果未提供 min（undefined），则不考虑最小值限制
 * @param {number | undefined} max - 最大值。确保调整后的值不会超过此最大值
 * @param {number} step - 步长值，决定调整的精度。例如，如果 step 为 5，
 * 则 value 将被调整到最接近的 5 的倍数
 * @returns 返回在指定最小值和最大值范围内，按步长调整后的数值
 */
export function snapValueToStep(
  value: number,
  min: number | undefined,
  max: number | undefined,
  step: number,
): number {
  min = Number(min);
  max = Number(max);
  const remainder = (value - (Number.isNaN(min) ? 0 : min)) % step;
  let snappedValue = roundToStepPrecision(
    Math.abs(remainder) * 2 >= step
      ? value + Math.sign(remainder) * (step - Math.abs(remainder))
      : value - remainder,
    step,
  );

  if (!Number.isNaN(min)) {
    if (snappedValue < min) snappedValue = min;
    else if (!Number.isNaN(max) && snappedValue > max)
      snappedValue =
        min + Math.floor(roundToStepPrecision((max - min) / step, step)) * step;
  } else if (!Number.isNaN(max) && snappedValue > max) {
    snappedValue = Math.floor(roundToStepPrecision(max / step, step)) * step;
  }

  // correct floating point behavior by rounding to step precision
  snappedValue = roundToStepPrecision(snappedValue, step);

  return snappedValue;
}
