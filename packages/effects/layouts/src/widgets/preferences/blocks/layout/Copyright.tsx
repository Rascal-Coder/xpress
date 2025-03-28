import { usePreferencesContext } from '@xpress-core/preferences';

import { useMemo } from 'react';

import { InputItem } from '../InputItem';
import { SwitchItem } from '../SwitchItem';

export const Copyright = () => {
  const { preferences, updatePreferences } = usePreferencesContext();
  const itemDisabled = useMemo(() => {
    return !preferences.footer.enable || !preferences.copyright.enable;
  }, [preferences.footer.enable, preferences.copyright.enable]);
  return (
    <>
      <SwitchItem
        checked={preferences.copyright.enable}
        disabled={!preferences.footer.enable}
        onChange={(value) => {
          updatePreferences({
            copyright: {
              ...preferences.copyright,
              enable: value,
            },
          });
        }}
      >
        启用版权
      </SwitchItem>
      <InputItem
        disabled={itemDisabled}
        onChange={(value) => {
          updatePreferences({
            copyright: {
              ...preferences.copyright,
              companyName: value,
            },
          });
        }}
        value={preferences.copyright.companyName}
      >
        公司名称
      </InputItem>
      <InputItem
        disabled={itemDisabled}
        onChange={(value) => {
          updatePreferences({
            copyright: {
              ...preferences.copyright,
              companySiteLink: value,
            },
          });
        }}
        value={preferences.copyright.companySiteLink}
      >
        公司网站链接
      </InputItem>
      <InputItem
        disabled={itemDisabled}
        onChange={(value) => {
          updatePreferences({
            copyright: {
              ...preferences.copyright,
              date: value,
            },
          });
        }}
        value={preferences.copyright.date}
      >
        日期
      </InputItem>
      <InputItem
        disabled={itemDisabled}
        onChange={(value) => {
          updatePreferences({
            copyright: {
              ...preferences.copyright,
              icp: value,
            },
          });
        }}
        value={preferences.copyright.icp}
      >
        备案号
      </InputItem>
      <InputItem
        disabled={itemDisabled}
        onChange={(value) => {
          updatePreferences({
            copyright: {
              ...preferences.copyright,
              icpLink: value,
            },
          });
        }}
        value={preferences.copyright.icpLink}
      >
        备案号链接
      </InputItem>
    </>
  );
};
