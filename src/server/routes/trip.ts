import { createRoute } from '@hono/zod-openapi';

import { TripSchema } from '../models/trip';

export const getTripsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Trip'],
  summary: '全ての旅行計画を取得',
  responses: {
    200: {
      description: '旅行計画一覧を返却',
      content: {
        'application/json': {
          schema: TripSchema.array(),
        },
      },
    },
  },
});

export const createTripRoute = createRoute({
  method: 'post',
  path: '/create',
  tags: ['Trip'],
  summary: '新しい旅行計画を作成',
  request: {
    body: {
      content: {
        'application/json': {
          schema: TripSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: '作成された旅行計画',
      content: {
        'application/json': {
          schema: TripSchema,
        },
      },
    },
  },
});
