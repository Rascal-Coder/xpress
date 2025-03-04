import type { ContentCompactType } from '@xpress-core/typings';

import { usePreferencesContext } from '@xpress-core/preferences';

import { useState } from 'react';

import { ContentCompact, HeaderNav as ContentWide } from '../../icons';

const components: Record<ContentCompactType, JSX.Element> = {
  compact: <ContentCompact></ContentCompact>,
  wide: <ContentWide></ContentWide>,
};

const PRESET = [
  {
    name: '流式',
    type: 'wide' as ContentCompactType,
  },
  {
    name: '定宽',
    type: 'compact' as ContentCompactType,
  },
];

export const Content = () => {
  const { preferences, updatePreferences } = usePreferencesContext();
  const [contentCompact, setContentCompact] = useState(
    preferences.app.contentCompact,
  );

  return (
    <div className="flex w-full gap-5">
      {PRESET.map((item) => (
        <div
          className={`flex w-[100px] cursor-pointer flex-col`}
          key={item.type}
          onClick={() => {
            updatePreferences({ app: { contentCompact: item.type } });
            setContentCompact(item.type);
          }}
        >
          <div
            className={`outline-box flex-center ${
              contentCompact === item.type ? 'outline-box-active' : ''
            }`}
          >
            {components[item.type]}
          </div>
          <div className="text-muted-foreground mt-2 text-center text-xs">
            {item.name}
          </div>
        </div>
      ))}
    </div>
  );
};
