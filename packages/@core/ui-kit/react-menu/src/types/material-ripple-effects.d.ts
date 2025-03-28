declare module 'material-ripple-effects' {
  export default class Ripple {
    private x: number;
    private y: number;
    private z: number;

    constructor();

    private applyAnimation(element: HTMLElement): void;

    private appyStyles(
      element: HTMLElement,
      color: 'dark' | 'light',
      rect: DOMRect,
      radius: number,
      event: MouseEvent,
    ): void;

    private findFurthestPoint(
      clickPointX: number,
      elementWidth: number,
      offsetX: number,
      clickPointY: number,
      elementHeight: number,
      offsetY: number,
    ): number;

    create(event: MouseEvent, color: 'dark' | 'light'): void;
  }
}
