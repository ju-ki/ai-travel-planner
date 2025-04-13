import { RouteHandler } from '@hono/zod-openapi';

import { getHelloRoutes } from '../routes/hello';

export const getHelloHandler: RouteHandler<typeof getHelloRoutes> = async (c) => {
  return c.json({ status: 200, message: 'Hello from Hono!' });
};
