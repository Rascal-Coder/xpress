import { type AnimationDirection } from '@xpress-core/hooks';
import { usePreferencesContext } from '@xpress-core/preferences';

import { SwitchItem } from '../../SwitchItem';
import { PreviewAnimationCell } from './PreviewAnimationCell';

export const Animation = () => {
  const { preferences, updatePreferences } = usePreferencesContext();
  const transitionPreset = ['left', 'right', 'top', 'bottom'];

  // const getPreviewAnimation = (direction: AnimationDirection) => {
  //   const baseTransition = {
  //     duration: 1.5,
  //     ease: 'easeInOut',
  //     repeat: Infinity,
  //     repeatDelay: 0.5,
  //   };

  //   switch (direction) {
  //     case 'bottom': {
  //       return {
  //         hidden: { y: -20, opacity: 0 },
  //         visible: { y: 0, opacity: 1, transition: baseTransition },
  //       };
  //     }
  //     case 'left': {
  //       return {
  //         hidden: { x: 20, opacity: 0 },
  //         visible: { x: 0, opacity: 1, transition: baseTransition },
  //       };
  //     }
  //     case 'right': {
  //       return {
  //         hidden: { x: -20, opacity: 0 },
  //         visible: { x: 0, opacity: 1, transition: baseTransition },
  //       };
  //     }
  //     case 'top': {
  //       return {
  //         hidden: { y: 20, opacity: 0 },
  //         visible: { y: 0, opacity: 1, transition: baseTransition },
  //       };
  //     }
  //     default: {
  //       return {
  //         hidden: { x: 20, opacity: 0 },
  //         visible: { x: 0, opacity: 1, transition: baseTransition },
  //       };
  //     }
  //   }
  // };

  return (
    <>
      <SwitchItem
        checked={preferences.transition.progress}
        onChange={(value) => {
          updatePreferences({ transition: { progress: value } });
        }}
      >
        页面切换进度条
      </SwitchItem>
      <SwitchItem
        checked={preferences.transition.enable}
        onChange={(value) => {
          updatePreferences({ transition: { enable: value } });
        }}
      >
        页面切换动画
      </SwitchItem>
      <div className="mb-2 mt-3 flex justify-between gap-3 px-2">
        {preferences.transition.enable &&
          transitionPreset.map((item) => (
            <div
              className={`outline-box p-2 ${
                preferences.transition.name === item && 'outline-box-active'
              }`}
              key={item}
              onClick={() => {
                updatePreferences({ transition: { name: item } });
              }}
            >
              <PreviewAnimationCell direction={item as AnimationDirection} />
            </div>
          ))}
      </div>
    </>
  );
};
