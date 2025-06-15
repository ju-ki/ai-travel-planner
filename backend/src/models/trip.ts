import { z } from '@hono/zod-openapi';

import { TransportNodeType } from '../generated/prisma';

export const TripSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'タイトルは必須です' })
    .max(50, { message: 'タイトルの上限を超えています。50文字以下で入力してください' }),
  imageUrl: z.string().optional(),
  startDate: z.string({ message: '予定日の開始日を入力してください' }),
  endDate: z.string({ message: '予定日の終了日を入力してください' }),
  tripInfo: z.array(
    z.object({
      date: z.string(),
      genreId: z.number(),
      transportationMethod: z.array(z.number()).refine((value) => value.some((item) => item), {
        message: '移動手段は最低でも1つ以上選択してください',
      }),
      memo: z.string().max(1000, { message: 'メモは1000文字以内で記載をお願いします' }).optional(),
    }),
  ),
  plans: z.array(
    z.object({
      date: z.string(),
      spots: z.array(
        z.object({
          id: z.string(),
          location: z.object({
            name: z.string().min(1, { message: '観光地名は必須です' }),
            latitude: z.number().min(-90).max(90, { message: '緯度は -90 から 90 の範囲で指定してください' }),
            longitude: z.number().min(-180).max(180, { message: '経度は -180 から 180 の範囲で指定してください' }),
          }),
          stayStart: z.string().optional(),
          stayEnd: z.string().optional(),
          memo: z.string().max(1000, { message: 'メモは1000文字以内で記載をお願いします' }).optional(),
          image: z.string().url().optional(),
          rating: z.number().optional(),
          category: z.array(z.string()).optional(),
          catchphrase: z.string().optional(),
          description: z.string().optional(),
          transports: z.object({
            transportMethodIds: z.array(z.number()).min(1, { message: '少なくとも1つの移動手段を選択してください' }),
            travelTime: z.string().optional(),
            cost: z.number().optional(),
            fromType: z.nativeEnum(TransportNodeType),
            toType: z.nativeEnum(TransportNodeType),
          }),
          order: z.number().default(0),
          nearestStation: z
            .object({
              name: z.string(),
              walkingTime: z.number(),
              latitude: z.number().min(-90).max(90, { message: '緯度は -90 から 90 の範囲で指定してください' }),
              longitude: z.number().min(-180).max(180, { message: '経度は -180 から 180 の範囲で指定してください' }),
            })
            .optional(),
        }),
      ),
    }),
  ),
});
export type Trip = z.infer<typeof TripSchema>;
