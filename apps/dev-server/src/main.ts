import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import cors from '@fastify/cors';
import staticPlugin from '@fastify/static';
import Fastify from 'fastify';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const fastify = Fastify({
    logger: true,
  });

  // 注册 CORS 插件
  await fastify.register(cors, {
    origin: true,
  });

  // 注册静态文件插件
  await fastify.register(staticPlugin, {
    root: join(__dirname, 'public'),
    prefix: '/public/',
  });

  // 健康检查路由
  fastify.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  });

  // 启动服务器
  try {
    await fastify.listen({ port: 3130, host: '0.0.0.0' });
    // console.log('Server is running at http://localhost:3130');
  } catch (error) {
    fastify.log.error(error);
    throw new Error('Failed to start server');
  }
}

main();
