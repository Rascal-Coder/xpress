import { usePreferencesContext } from '@xpress-core/preferences';
import { cn } from '@xpress-core/shared/utils';

import React from 'react';

import Copyright from '../basic/copyright';
import { AuthenticationFormView } from './AuthenticationFormView';
import { IconCloud } from './IconCloud';
import { Toolbar } from './Toolbar';

import './style.css';

// 使用React.memo包装IconCloud组件的使用
const MemoizedIconCloud = React.memo(({ images }: { images: string[] }) => (
  <IconCloud images={images} />
));
MemoizedIconCloud.displayName = 'MemoizedIconCloud';

export const Authentication = ({
  toolbarList = ['theme'],
  children,
  pageTitle,
  pageDescription,
  customSlugs,
  logo,
  appName,
}: {
  appName: string;
  children: React.ReactNode;
  customSlugs?: React.ReactNode;
  logo: string;
  pageDescription: string;
  pageTitle: string;
  toolbarList?: string[];
}) => {
  const { isDark, preferences } = usePreferencesContext();
  // TODO: 使用本地的图标png
  const slugs = [
    'typescript',
    'javascript',
    'dart',
    'react',
    'flutter',
    'android',
    'html5',
    'css3',
    'nodedotjs',
    'express',
    'nextdotjs',
    'prisma',
    'postgresql',
    'firebase',
    'nginx',
    'vercel',
    'testinglibrary',
    'jest',
    'cypress',
    'docker',
    'git',
    'jira',
    'github',
    'gitlab',
    'androidstudio',
    'sonarqube',
    'figma',
  ];
  const images = slugs.map(
    (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`,
  );

  const leftContent = React.useMemo(() => {
    return (
      <>
        {customSlugs || <MemoizedIconCloud images={images} />}
        <div className="text-1xl text-foreground mt-6 font-sans lg:text-2xl">
          {pageTitle}
        </div>
        <div className="dark:text-muted-foreground mt-2">{pageDescription}</div>
      </>
    );
  }, [customSlugs, images, pageTitle, pageDescription]);

  return (
    <div
      className={cn(
        'flex min-h-full flex-1 select-none overflow-x-hidden',
        isDark,
      )}
    >
      <Toolbar toolbarList={toolbarList} />
      <div className="absolute left-0 top-0 z-10 flex flex-1">
        <div className="text-foreground lg:text-foreground ml-4 mt-4 flex flex-1 items-center sm:left-6 sm:top-6">
          <img className="mr-2" src={logo} width="42" />
          <p className="m-0 text-xl font-medium">{appName}</p>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="bg-background-deep absolute inset-0 h-full w-full dark:bg-[#070709]">
          <div className="login-background absolute left-0 top-0 size-full"></div>
          <div className="flex-col-center -enter-x mr-20 h-full">
            {leftContent}
          </div>
        </div>
      </div>
      {/* 右侧表单 */}
      <AuthenticationFormView
        className="min-h-full w-full flex-1 md:w-[50%] lg:w-[34%]"
        copyright={<Copyright {...preferences.copyright} />}
      >
        {children}
      </AuthenticationFormView>
    </div>
  );
};
