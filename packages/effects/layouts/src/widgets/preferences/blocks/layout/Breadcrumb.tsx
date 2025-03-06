import type { BreadcrumbStyleType } from '@xpress-core/typings';

import { usePreferencesContext } from '@xpress-core/preferences';

import { SwitchItem } from '../SwitchItem';
import { ToggleItem } from '../ToggleItem';

export const Breadcrumb = () => {
  const { preferences, updatePreferences } = usePreferencesContext();
  const breadcrumbTypeItems = [
    { label: '常规', value: 'normal' },
    { label: '背景', value: 'background' },
  ];
  return (
    <>
      <SwitchItem
        checked={preferences.breadcrumb.enable}
        onChange={(value) => {
          updatePreferences({ breadcrumb: { enable: value } });
        }}
      >
        开启面包屑导航
      </SwitchItem>
      <SwitchItem
        checked={preferences.breadcrumb.hideOnlyOne}
        disabled={!preferences.breadcrumb.enable}
        onChange={(value) => {
          updatePreferences({ breadcrumb: { hideOnlyOne: value } });
        }}
      >
        仅有一个时隐藏
      </SwitchItem>
      <SwitchItem
        checked={preferences.breadcrumb.showIcon}
        disabled={!preferences.breadcrumb.enable}
        onChange={(value) => {
          updatePreferences({ breadcrumb: { showIcon: value } });
        }}
      >
        显示面包屑图标
      </SwitchItem>
      <SwitchItem
        checked={preferences.breadcrumb.showHome}
        disabled={!preferences.breadcrumb.enable}
        onChange={(value) => {
          updatePreferences({ breadcrumb: { showHome: value } });
        }}
      >
        显示首页按钮
      </SwitchItem>
      <ToggleItem
        disabled={!preferences.breadcrumb.enable}
        items={breadcrumbTypeItems}
        onChange={(value) => {
          updatePreferences({
            breadcrumb: { styleType: value as BreadcrumbStyleType },
          });
        }}
        value={preferences.breadcrumb.styleType}
      >
        面包屑风格
      </ToggleItem>
    </>
  );
};
