import { serve } from '@hono/node-server';

import app from './index';

// ポート番号を指定してサーバーを起動
serve(
  {
    fetch: app.fetch,
    port: 8787, // 任意のポート番号を指定
  },
  (info) => {
    console.log(`Server is running on port ${info.port}`);
  },
);
