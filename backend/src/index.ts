import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { clerkMiddleware } from '@hono/clerk-auth';
import { cors } from 'hono/cors';
import { serve } from 'bun';

import { getTripsRoute, createTripRoute, getTripDetailRoute } from './routes/trip';
import { getTripHandler } from './controllers/trip';
import { getHelloRoutes } from './routes/hello';
import { getHelloHandler } from './controllers/hello';
import { findExistingUserRoute } from './routes/auth';
import { getAuthHandler } from './controllers/auth';

const app = new OpenAPIHono().basePath('/api');

app.use(
  '*',
  cors({
    origin: 'http://localhost:3000',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Clerk-Auth'],
    credentials: true,
    maxAge: 600,
  }),
);

//ルートの登録
const helloApp = new OpenAPIHono();
const tripApp = new OpenAPIHono();
const authApp = new OpenAPIHono();

tripApp.use(
  '*',
  clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  }),
);

authApp.use(
  '*',
  clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  }),
);

helloApp.openapi(getHelloRoutes, getHelloHandler);

// トリップルートの登録
tripApp.openapi(getTripsRoute, getTripHandler.getTrips);
tripApp.openapi(createTripRoute, getTripHandler.createTrip);
tripApp.openapi(getTripDetailRoute, getTripHandler.getTripDetail);

authApp.openapi(findExistingUserRoute, getAuthHandler);

app.route('/hello', helloApp);
app.route('/trips', tripApp);
app.route('/auth', authApp);

// APIドキュメントの登録
app
  .doc('/specification', {
    openapi: '3.0.0',
    info: { title: '旅行計画アプリケーションAPI', version: '1.0.0' },
  })
  .get('/doc', swaggerUI({ url: '/api/specification' }));

app.onError((err, c) => {
  console.error(`${err}`);
  return c.text('Custom Error Message', 500);
});

serve({
  port: 8787,
  fetch: app.fetch,
});

export default app;
