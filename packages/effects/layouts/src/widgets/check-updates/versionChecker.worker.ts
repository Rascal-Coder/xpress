let oldEtag: null | string = null;
let checkIntervalId: null | number = null;
let checkUpdateUrl = '/';

async function checkVersion() {
  try {
    if (
      location.hostname === 'localhost' ||
      location.hostname === '127.0.0.1'
    ) {
      return;
    }

    const res = await fetch(checkUpdateUrl, {
      cache: 'no-cache',
      method: 'HEAD',
    });
    const newEtag = res.headers.get('etag') || res.headers.get('last-modified');
    if (!newEtag) {
      return;
    }
    // 首次运行时不提示更新
    if (!oldEtag) {
      oldEtag = newEtag;
      return;
    }

    if (newEtag && oldEtag && newEtag !== oldEtag) {
      console.warn('[版本检查] 发现新版本：', newEtag);
      postMessage({
        type: 'version-update',
        versionTag: newEtag,
      });
      oldEtag = newEtag;
    }
  } catch (error) {
    console.error('[版本检查] 检查失败：', error);
  }
}

function startChecking(interval: number, url: string) {
  if (checkIntervalId) {
    clearInterval(checkIntervalId);
    checkIntervalId = null;
  }

  if (interval <= 0) return;

  checkUpdateUrl = url;
  // 转换为毫秒
  const intervalMs = interval * 60 * 1000;
  checkIntervalId = setInterval(checkVersion, intervalMs);

  // 立即执行一次检查
  checkVersion();
}

// 监听主线程消息
addEventListener('message', (e) => {
  switch (e.data.type) {
    case 'check': {
      checkVersion();

      break;
    }
    case 'start': {
      const { interval, url } = e.data;
      startChecking(interval, url);

      break;
    }
    case 'stop': {
      if (checkIntervalId) {
        clearInterval(checkIntervalId);
        checkIntervalId = null;
      }

      break;
    }
  }
});
