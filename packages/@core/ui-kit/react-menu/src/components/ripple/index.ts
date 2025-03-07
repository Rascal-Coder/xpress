/**
 * Ripple 类用于创建点击涟漪效果
 * 当用户点击元素时，会产生一个从点击位置向外扩散的动画效果
 */
class Ripple {
  // 存储计算涟漪半径时的临时坐标值
  private x: number;
  private y: number;
  private z: number;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  /**
   * 为涟漪元素添加动画效果
   * @param element - 需要添加动画的 DOM 元素
   */
  applyAnimation(element: HTMLElement): void {
    element.animate(
      [
        {
          opacity: 1,
          transform: 'scale(0)',
        },
        {
          opacity: 0,
          transform: 'scale(1.5)',
        },
      ],
      {
        duration: 500,
        easing: 'linear',
      },
    );
  }

  /**
   * 为涟漪元素应用样式
   * @param element - 涟漪元素
   * @param color - 涟漪颜色主题，'dark' 或 'light'
   * @param rect - 容器元素的 DOMRect
   * @param radius - 涟漪半径
   * @param event - 触发涟漪的鼠标事件
   */
  appyStyles(
    element: HTMLElement,
    color: 'dark' | 'light',
    rect: DOMRect,
    radius: number,
    event: MouseEvent,
  ): void {
    element.classList.add('ripple');
    element.style.backgroundColor =
      color === 'dark' ? 'rgba(0,0,0, 0.2)' : 'rgba(255,255,255, 0.3)';
    element.style.borderRadius = '50%';
    element.style.pointerEvents = 'none';
    element.style.position = 'absolute';
    element.style.left = `${event.clientX - rect.left - radius}px`;
    element.style.top = `${event.clientY - rect.top - radius}px`;
    element.style.width = element.style.height = `${radius * 2}px`;
  }

  /**
   * 创建涟漪效果
   * @param event - 触发涟漪的鼠标事件
   * @param color - 涟漪颜色主题
   */
  create(event: MouseEvent, color: 'dark' | 'light'): void {
    const element = event.currentTarget as HTMLElement;

    // 设置容器样式
    element.style.position = 'relative';
    element.style.overflow = 'hidden';

    const rect = element.getBoundingClientRect();

    // 计算涟漪半径
    const radius = this.findFurthestPoint(
      event.clientX,
      element.offsetWidth,
      rect.left,
      event.clientY,
      element.offsetHeight,
      rect.top,
    );

    // 创建涟漪元素
    const circle = document.createElement('span');

    this.appyStyles(circle, color, rect, radius, event);
    this.applyAnimation(circle);

    element.append(circle);

    // 动画结束后移除涟漪元素
    setTimeout(() => circle.remove(), 500);
  }

  /**
   * 计算涟漪效果的最大半径
   * 通过计算点击位置到元素四个角的最大距离来确定
   * @returns 返回计算得到的最大半径
   */
  findFurthestPoint(
    clickPointX: number,
    elementWidth: number,
    offsetX: number,
    clickPointY: number,
    elementHeight: number,
    offsetY: number,
  ): number {
    this.x = clickPointX - offsetX > elementWidth / 2 ? 0 : elementWidth;
    this.y = clickPointY - offsetY > elementHeight / 2 ? 0 : elementHeight;
    this.z = Math.hypot(
      this.x - (clickPointX - offsetX),
      this.y - (clickPointY - offsetY),
    );

    return this.z;
  }
}

export default Ripple;
