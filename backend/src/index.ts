import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { clerkMiddleware } from '@hono/clerk-auth';

import { getTripsRoute, createTripRoute, getTripDetailRoute } from './routes/trip';
import { getTripHandler } from './controllers/trip';
import { serve } from 'bun';
import { getHelloRoutes } from './routes/hello';
import { getHelloHandler } from './controllers/hello';

const app = new OpenAPIHono().basePath('/api');

//ルートの登録
const helloApp = new OpenAPIHono();
const tripApp = new OpenAPIHono();

tripApp.use('*', clerkMiddleware());

helloApp.openapi(getHelloRoutes, getHelloHandler);

// トリップルートの登録
tripApp.openapi(getTripsRoute, getTripHandler.getTrips);
tripApp.openapi(createTripRoute, getTripHandler.createTrip);
tripApp.openapi(getTripDetailRoute, getTripHandler.getTripDetail);

app.route('/hello', helloApp);
app.route('/trips', tripApp);

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
