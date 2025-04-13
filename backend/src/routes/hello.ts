import { createRoute } from '@hono/zod-openapi';

export const getHelloRoutes = createRoute({
  path: '/',
  method: 'get',
  summary: 'Hello World API',
  responses: {
    200: {
      description: 'Hello World APIの応答',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
            required: ['message'],
          },
        },
      },
    },
  },
});
