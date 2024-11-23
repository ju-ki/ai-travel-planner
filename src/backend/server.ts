import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();

// エンドポイント
app.get('/', (c) => c.text('Hello, Hono!'));
app.get('/api/greet', (c) => c.json({ message: 'Welcome to the API!' }));

// サーバーの起動
serve(app);
