import { Modal as UpdateNoticeModal } from '@xpress-core/popup-ui';

import { useEffect, useRef, useState } from 'react';

interface Props {
  // 轮训时间，分钟
  checkUpdatesInterval?: number;
  // 检查更新的地址
  checkUpdateUrl?: string;
}

export const CheckUpdates = ({
  checkUpdatesInterval = 1,
  checkUpdateUrl = '/',
}: Props) => {
  const [currentVersionTag, setCurrentVersionTag] = useState('');
  const [lastVersionTag, setLastVersionTag] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const isCheckingUpdates = useRef(false);
  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleNotice = (versionTag: string) => {
    setCurrentVersionTag(versionTag);
    setIsOpen(true);
  };
  const getVersionTag = async () => {
    try {
      if (
        location.hostname === 'localhost' ||
        location.hostname === '127.0.0.1'
      ) {
        return null;
      }
      const response = await fetch(checkUpdateUrl, {
        cache: 'no-cache',
        method: 'HEAD',
      });

      return (
        response.headers.get('etag') || response.headers.get('last-modified')
      );
    } catch (error) {
      console.error('Failed to fetch version tag', error);
      return null;
    }
  };

  const checkForUpdates = async () => {
    const versionTag = await getVersionTag();
    if (!versionTag) return;

    if (!lastVersionTag) {
      setLastVersionTag(versionTag);
      return;
    }

    if (lastVersionTag !== versionTag) {
      stop();
      handleNotice(versionTag);
    }
  };

  const handleConfirm = () => {
    setLastVersionTag(currentVersionTag);
    window.location.reload();
  };

  const start = () => {
    if (checkUpdatesInterval <= 0) return;
    timerRef.current = setInterval(
      checkForUpdates,
      checkUpdatesInterval * 60 * 1000,
    );
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      stop();
    } else {
      if (!isCheckingUpdates.current) {
        isCheckingUpdates.current = true;
        checkForUpdates().finally(() => {
          isCheckingUpdates.current = false;
          start();
        });
      }
    }
  };

  useEffect(() => {
    start();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <UpdateNoticeModal
      cancelText="取消"
      centered
      closeClass="top-1"
      confirmText="刷新"
      contentClass="px-8 min-h-10"
      footerClass="border-none mb-3 mr-3"
      headerClass="border-none pt-3"
      isOpen={isOpen}
      modal={true}
      onModalCancel={() => setIsOpen(false)}
      onModalConfirm={handleConfirm}
      setIsOpen={setIsOpen}
      title="新版本可用"
    >
      点击刷新以获取最新版本
    </UpdateNoticeModal>
  );
};
