import { createRoute } from '@hono/zod-openapi';

import { TripSchema } from '../models/trip';

export const getTripsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Trip'],
  summary: '全てのトリップを取得',
  responses: {
    200: {
      description: 'トリップ一覧を返却',
      content: {
        'application/json': {
          schema: TripSchema.array(),
        },
      },
    },
  },
});

export const importDummyDataRoute = createRoute({
  method: 'post',
  path: '/import-dummy',
  tags: ['Trip'],
  summary: 'ダミーデータをインポート',
  responses: {
    200: {
      description: 'ダミーデータのインポート結果',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              count: { type: 'number' },
            },
            required: ['message', 'count'],
          },
        },
      },
    },
  },
});

export const createTripRoute = createRoute({
  method: 'post',
  path: '/create',
  tags: ['Trip'],
  summary: '新しいトリップを作成',
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
      description: '作成されたトリップ',
      content: {
        'application/json': {
          schema: TripSchema,
        },
      },
    },
  },
});
