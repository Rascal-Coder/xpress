export default class Ripple {
  private x: number = 0;
  private y: number = 0;
  private z: number = 0;

  private applyAnimation(element: HTMLElement): void {
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

  private appyStyles(
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

  private findFurthestPoint(
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

  create(event: MouseEvent, color: 'dark' | 'light'): void {
    const element = event.currentTarget as HTMLElement;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';

    const rect = element.getBoundingClientRect();

    const radius = this.findFurthestPoint(
      event.clientX,
      element.offsetWidth,
      rect.left,
      event.clientY,
      element.offsetHeight,
      rect.top,
    );

    const circle = document.createElement('span');

    this.appyStyles(circle, color, rect, radius, event);
    this.applyAnimation(circle);

    element.append(circle);

    setTimeout(() => circle.remove(), 500);
  }
}
