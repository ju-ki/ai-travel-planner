import { RouteHandler } from '@hono/zod-openapi';
import { getAuth } from '@hono/clerk-auth';
import { Context } from 'hono';

import { findExistingUserRoute } from '../routes/auth';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export const getAuthHandler: RouteHandler<typeof findExistingUserRoute> = async (c: Context) => {
  try {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id: auth.userId,
      },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: auth.userId,
        },
      });

      return c.json({ status: 201, message: '新規登録成功' });
    }
    return c.json({ status: 200, message: '成功' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(errorMessage);
    return c.json({ error: 'Internal Server Error', details: errorMessage }, 500);
  }
};
