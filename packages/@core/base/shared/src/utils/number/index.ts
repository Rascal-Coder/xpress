import { NumberFormatter, NumberParser } from '@internationalized/number';

/**
 * 使用国际化的数字格式化器
 * @param locale 语言环境
 * @param options 格式化选项
 * @returns 返回国际化的数字格式化器
 */
export function useNumberFormatter(
  locale: string,
  options: Intl.NumberFormatOptions | undefined,
) {
  return new NumberFormatter(locale, options);
}

/**
 * 使用国际化的数字解析器
 * @param locale 语言环境
 * @param options 解析选项
 * @returns 返回国际化的数字解析器
 */
export function useNumberParser(
  locale: string,
  options: Intl.NumberFormatOptions | undefined,
) {
  return new NumberParser(locale, options);
}

/**
 * 处理小数运算的函数
 * 解决JavaScript浮点数计算精度问题
 * @param operator 运算符（加号或减号）
 * @param value1 第一个操作数
 * @param value2 第二个操作数
 * @returns 计算结果
 */
export function handleDecimalOperation(
  operator: '+' | '-',
  value1: number,
  value2: number,
): number {
  let result = operator === '+' ? value1 + value2 : value1 - value2;

  // 检查是否包含小数
  if (value1 % 1 !== 0 || value2 % 1 !== 0) {
    // 将数字转换为字符串并按小数点分割
    const value1Decimal = value1.toString().split('.');
    const value2Decimal = value2.toString().split('.');

    // 获取小数部分的长度
    const value1DecimalLength = value1Decimal[1]?.length ?? 0;
    const value2DecimalLength = value2Decimal[1]?.length ?? 0;

    // 计算需要的倍数，用于将小数转换为整数
    const multiplier = 10 ** Math.max(value1DecimalLength, value2DecimalLength);

    // 将小数转换为整数进行计算
    value1 = Math.round(value1 * multiplier);
    value2 = Math.round(value2 * multiplier);

    // 使用整数进行计算，避免浮点数精度问题
    result = operator === '+' ? value1 + value2 : value1 - value2;

    // 将结果转换回小数
    result /= multiplier;
  }

  return result;
}
