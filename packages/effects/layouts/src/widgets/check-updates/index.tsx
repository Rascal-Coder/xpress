import { Modal } from '@xpress-core/popup-ui';

import { useCallback, useEffect, useRef, useState } from 'react';

interface CheckUpdatesProps {
  /** 轮询时间，单位：分钟，默认1分钟 */
  checkUpdatesInterval?: number;
  /** 检查更新的地址 */
  checkUpdateUrl?: string;
}

export const CheckUpdates = ({
  checkUpdatesInterval = 1,
  checkUpdateUrl = '/',
}: CheckUpdatesProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const workerRef = useRef<null | Worker>(null);

  const handleWorkerMessage = useCallback((e: MessageEvent) => {
    if (e.data.type === 'version-update') {
      setIsModalOpen(true);
    }
  }, []);

  useEffect(() => {
    // 创建 Worker 实例
    workerRef.current = new Worker(
      new URL('versionChecker.worker.ts', import.meta.url),
    );

    // 添加消息监听
    workerRef.current.addEventListener('message', handleWorkerMessage);

    // 启动检查
    workerRef.current.postMessage({
      type: 'start',
      interval: checkUpdatesInterval,
      url: checkUpdateUrl,
    });

    const handleVisibilityChange = () => {
      if (document.hidden) {
        workerRef.current?.postMessage({ type: 'stop' });
      } else {
        workerRef.current?.postMessage({
          type: 'start',
          interval: checkUpdatesInterval,
          url: checkUpdateUrl,
        });
      }
    };

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (workerRef.current) {
        workerRef.current.postMessage({ type: 'stop' });
        workerRef.current.removeEventListener('message', handleWorkerMessage);
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [checkUpdatesInterval, checkUpdateUrl, handleWorkerMessage]);

  const handleConfirm = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

  return (
    <Modal
      cancelText="取消"
      confirmText="刷新"
      isOpen={isModalOpen}
      onModalCancel={() => setIsModalOpen(false)}
      onModalConfirm={handleConfirm}
      setIsOpen={setIsModalOpen}
      title="新版本可用"
    >
      <div className="p-4">点击刷新以获取最新版本</div>
    </Modal>
  );
};
