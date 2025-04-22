import { z } from '@hono/zod-openapi';

export const TripSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'タイトルは必須です' })
    .max(50, { message: 'タイトルの上限を超えています。50文字以下で入力してください' }),
  startDate: z.coerce.date({ message: '予定日の開始日を入力してください' }),
  endDate: z.coerce.date({ message: '予定日の終了日を入力してください' }),
  tripInfo: z.array(
    z.object({
      date: z.coerce.date(),
      genreId: z.number(),
      transportationMethod: z.array(z.number()).refine((value) => value.some((item) => item), {
        message: '移動手段は最低でも1つ以上選択してください',
      }),
      memo: z.string().max(1000, { message: 'メモは1000文字以内で記載をお願いします' }).optional(),
    }),
  ),
  plans: z.array(
    z.object({
      date: z.coerce.date(),
      departure: z.object({
        name: z.string().min(1, { message: '出発地は必須です' }),
        latitude: z.number().min(-90).max(90, { message: '緯度は -90 から 90 の範囲で指定してください' }),
        longitude: z.number().min(-180).max(180, { message: '経度は -180 から 180 の範囲で指定してください' }),
      }),
      destination: z.object({
        name: z.string().min(1, { message: '目的地は必須です' }),
        latitude: z.number().min(-90).max(90, { message: '緯度は -90 から 90 の範囲で指定してください' }),
        longitude: z.number().min(-180).max(180, { message: '経度は -180 から 180 の範囲で指定してください' }),
      }),
      spots: z.array(
        z.object({
          id: z.string(),
          name: z.string().min(1, { message: '観光地名は必須です' }),
          latitude: z.number().min(-90).max(90, { message: '緯度は -90 から 90 の範囲で指定してください' }),
          longitude: z.number().min(-180).max(180, { message: '経度は -180 から 180 の範囲で指定してください' }),
          stay: z.object({
            start: z.string(), //TODO: HH:mm形式でのバリデーションにできないか考える
            end: z.string(),
          }),
          memo: z.string().max(1000, { message: 'メモは1000文字以内で記載をお願いします' }).optional(),
          image: z.string().optional(),
          rating: z.number().optional(),
          category: z.array(z.string()),
          catchphrase: z.string().optional(),
          description: z.string().optional(),
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
