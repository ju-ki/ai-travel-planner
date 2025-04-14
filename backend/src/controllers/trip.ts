import { Context } from 'hono';
import { getAuth } from '@hono/clerk-auth';

import { TripSchema } from '../models/trip';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export const getTripHandler = {
  // 全ての旅行計画を取得
  getTrips: async (c: Context) => {
    try {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized error' }, 401);
      }

      const userId = auth.userId;

      const tripInfo = await prisma.trip.findMany({
        where: { userId: userId },
        include: {
          tripInfo: true,
          plans: {
            include: {
              departure: true,
              destination: true,
              spots: {
                include: {
                  nearestStation: true,
                },
              },
            },
          },
        },
      });

      if (!tripInfo.length) {
        return c.json([], 200);
      }

      return c.json(tripInfo, 200);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(errorMessage);
      return c.json({ error: 'Internal Server Error', details: errorMessage }, 500);
    }
  },

  // 特定の旅行計画を取得

  getTripDetail: async (c: Context) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const tripId = parseInt(c.req.param('id'));

    const targetTrip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId: auth.userId,
      },
      include: {
        tripInfo: true,
        plans: {
          include: {
            departure: true,
            destination: true,
            spots: {
              include: {
                nearestStation: true,
              },
            },
          },
        },
      },
    });

    if (!targetTrip) {
      return c.json({ error: 'No trip found' }, 404);
    }

    return c.json(targetTrip, 200);
  },

  // 新しい旅行計画を登録
  createTrip: async (c: Context) => {
    try {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const body = await c.req.json();
      if (!body) {
        return c.json({ error: 'Request body is required' }, 400);
      }

      const result = TripSchema.safeParse(body);
      if (!result.success) {
        console.log('Validation errors:', JSON.stringify(result.error.errors, null, 2));
        return c.json({ error: 'Invalid request body', details: result.error.errors }, 400);
      }

      const trip = result.data;
      const newTrip = await prisma.trip.create({
        data: {
          title: trip.title,
          startDate: new Date(trip.start_date),
          endDate: new Date(trip.end_date),
          userId: auth.userId,
          tripInfo: {
            create: trip.tripInfo.map((info) => ({
              date: new Date(info.date),
              genreId: info.genre_id,
              transportationMethods: info.transportation_method,
              memo: info.memo,
            })),
          },
          plans: {
            create: trip.plans.map((plan) => ({
              date: new Date(plan.date),
              departure: {
                create: {
                  name: plan.departure.name,
                  latitude: plan.departure.latitude,
                  longitude: plan.departure.longitude,
                },
              },
              destination: {
                create: {
                  name: plan.destination.name,
                  latitude: plan.destination.latitude,
                  longitude: plan.destination.longitude,
                },
              },
              spots: {
                create:
                  plan.spots?.map((spot) => ({
                    name: spot.name,
                    latitude: spot.latitude,
                    longitude: spot.longitude,
                    stayStart: new Date(`2025-01-01T${spot.stay.start}`),
                    stayEnd: new Date(`2025-01-01T${spot.stay.end}`),
                    memo: spot.memo ?? '',
                    image: spot.image ?? '',
                    rating: spot.rating ?? 0,
                    categories: spot.category ?? [],
                    catchphrase: spot.catchphrase ?? '',
                    description: spot.description ?? '',
                    nearestStation: spot.nearestStation
                      ? {
                          create: {
                            name: spot.nearestStation.name,
                            walkingTime: spot.nearestStation.walkingTime,
                            latitude: spot.nearestStation.latitude,
                            longitude: spot.nearestStation.longitude,
                          },
                        }
                      : undefined,
                  })) ?? [],
              },
            })),
          },
        },
      });

      return c.json(newTrip, 201);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return c.json({ error: 'Internal Server Error', details: errorMessage }, 500);
    }
  },
};
