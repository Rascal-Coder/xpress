import type { Watermark, WatermarkOptions } from 'watermark-js-plus';

import { useEffect, useRef, useState } from 'react';

const defaultOptions: Partial<WatermarkOptions> = {
  advancedStyle: {
    colorStops: [
      {
        color: 'gray',
        offset: 0,
      },
      {
        color: 'gray',
        offset: 1,
      },
    ],
    type: 'linear',
  },
  content: '',
  contentType: 'multi-line-text',
  globalAlpha: 0.25,
  gridLayoutOptions: {
    cols: 2,
    gap: [20, 20],
    matrix: [
      [1, 0],
      [0, 1],
    ],
    rows: 2,
  },
  height: 200,
  layout: 'grid',
  rotate: 30,
  width: 160,
};

export function useWatermark() {
  const [watermarkInstance, setWatermarkInstance] = useState<Watermark>();
  const optionsRef = useRef<Partial<WatermarkOptions>>(defaultOptions);

  const initWatermark = async (options: Partial<WatermarkOptions>) => {
    const { Watermark } = await import('watermark-js-plus');

    optionsRef.current = {
      ...optionsRef.current,
      ...options,
    };

    const instance = new Watermark(optionsRef.current);
    await instance.create();
    setWatermarkInstance(instance);
  };

  const updateWatermark = async (options: Partial<WatermarkOptions>) => {
    await (watermarkInstance
      ? watermarkInstance.changeOptions({
          ...optionsRef.current,
          ...options,
        })
      : initWatermark(options));
  };

  const destroyWatermark = () => {
    if (watermarkInstance) {
      watermarkInstance.destroy();
      setWatermarkInstance(undefined);
    }
  };

  useEffect(() => {
    return () => {
      destroyWatermark();
    };
  }, []);

  return {
    destroyWatermark,
    updateWatermark,
    watermark: watermarkInstance,
  };
}
