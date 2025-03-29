import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';

import { getHelloRoutes } from './routes/hello';
import { getHelloHandler } from './controllers/hello';
import { getTripsRoute, createTripRoute } from './routes/trip';
import { getTripHandler } from './controllers/trip';

const app = new OpenAPIHono().basePath('/api');

//ルートの登録
const helloApp = new OpenAPIHono();
const tripApp = new OpenAPIHono();

tripApp.use('*', clerkMiddleware());

// Helloルートの登録
helloApp.openapi(getHelloRoutes, getHelloHandler);

// トリップルートの登録
tripApp.openapi(getTripsRoute, getTripHandler.getTrips);
tripApp.openapi(createTripRoute, getTripHandler.createTrip);

app.route('/hello', helloApp);
app.route('/trips', tripApp);

// APIドキュメントの登録
app
  .doc('/specification', {
    openapi: '3.0.0',
    info: { title: '旅行計画アプリケーションAPI', version: '1.0.0' },
  })
  .get('/doc', swaggerUI({ url: '/api/specification' }));

export default app;
