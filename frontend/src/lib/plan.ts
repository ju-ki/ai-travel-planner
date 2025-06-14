import { DateRange } from 'react-day-picker';
import { z } from 'zod';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import {
  SearchSpotByCategoryParams,
  Spot,
  TransportNodeType,
  TravelModeType,
  TravelPlanType,
  TripInfo,
} from '@/types/plan';
import { placeTypeGroups } from '@/data/dummyData';

import { removeTimeFromDate } from './utils';

export const schema = z.object({
  title: z
    .string()
    .min(1, { message: 'タイトルは必須です' })
    .max(50, { message: 'タイトルの上限を超えています。50文字以下で入力してください' }),
  imageUrl: z.string().url().optional(),
  startDate: z.date({ message: '予定日の開始日を入力してください' }),
  endDate: z.date({ message: '予定日の終了日を入力してください' }),
  tripInfo: z.array(
    z.object({
      date: z.date(),
      genreId: z.number(),
      transportationMethod: z.array(z.number()).refine((value) => value.some((item) => item), {
        message: '移動手段は最低でも1つ以上選択してください',
      }),
      memo: z.string().max(1000, { message: 'メモは1000文字以内で記載をお願いします' }).optional(),
    }),
  ),
  plans: z.array(
    z.object({
      date: z.date(),
      spots: z.array(
        z.object({
          id: z.string(),
          location: z.object({
            name: z.string().min(1, { message: '観光地名は必須です' }),
            latitude: z.number().min(-90).max(90, { message: '緯度は -90 から 90 の範囲で指定してください' }),
            longitude: z.number().min(-180).max(180, { message: '経度は -180 から 180 の範囲で指定してください' }),
          }),
          stayStart: z.string().time().optional(),
          stayEnd: z.string().time().optional(),
          memo: z.string().max(1000, { message: 'メモは1000文字以内で記載をお願いします' }).optional(),
          image: z.string().url().optional(),
          rating: z.number().optional(),
          category: z.array(z.string()),
          catchphrase: z.string().optional(),
          description: z.string().optional(),
          transports: z
            .object({
              transportMethodIds: z.array(z.number()).min(1, { message: '少なくとも1つの移動手段を選択してください' }),
              travelTime: z.string().optional(),
              cost: z.number().optional(),
              fromType: z.nativeEnum(TransportNodeType),
              toType: z.nativeEnum(TransportNodeType),
              fromLocationId: z.string().optional(),
              toLocationId: z.string().optional(),
            })
            .optional(),
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

export type FormData = z.infer<typeof schema>;

interface FormState {
  id?: string;
  title: string;
  imageUrl?: string;
  startDate: Date;
  endDate: Date;
  tripInfo: TripInfo[];
  plans: TravelPlanType[];
  errors: Partial<Record<keyof FormData, string>>;
  tripInfoErrors: Partial<Record<string, Partial<Record<keyof TripInfo, string>>>>;
  planErrors: Partial<Record<string, Partial<Record<keyof TravelPlanType, string>>>>;
  spotErrors: Partial<Record<string, Partial<Record<keyof Spot, string>>>>;
  setTripInfo: (
    date: Date,
    name: 'date' | 'genreId' | 'transportationMethod' | 'memo',
    value: Date | number | number[] | string,
  ) => void;
  getSpotInfo: (date: Date, type: TransportNodeType) => Spot[];
  simulationStatus: { date: Date; status: number }[] | null;
  setSimulationStatus: (status: { date: Date; status: number }) => void;
  setSpots: (date: Date, spot: Spot, isDeleted: boolean) => void;
  setFields: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
  setErrors: (errors: Partial<Record<keyof FormData, string>>) => void;
  setTripInfoErrors: (date: Date, errors: Partial<Record<keyof TripInfo, string>>) => void;
  setSpotErrors: (date: Date, errors: Partial<Record<keyof Spot, string>>) => void;
  setPlanErrors: (date: Date, errors: Partial<Record<keyof TravelPlanType, string>>) => void;
  setRangeDate: (date: DateRange | undefined) => void;
  resetErrors: () => void;
  resetForm: () => void;
}

export const useStoreForPlanning = create<FormState>()(
  immer(
    devtools((set, get) => ({
      title: '',
      imageUrl: '',
      startDate: new Date(),
      endDate: new Date(),
      tripInfo: [],
      plans: [
        {
          date: new Date(),
          spots: [],
        },
      ],
      simulationStatus: null,
      setSimulationStatus: (status) => {
        set((state) => {
          if (state.simulationStatus) {
            const existingStatusIndex = state.simulationStatus.findIndex(
              (info) => info.date.toLocaleDateString('ja-JP') === status.date.toLocaleDateString('ja-JP'),
            );
            if (existingStatusIndex >= 0) {
              state.simulationStatus[existingStatusIndex] = {
                ...state.simulationStatus[existingStatusIndex],
                status: status.status,
              };
            } else {
              state.simulationStatus.push({
                date: removeTimeFromDate(status.date),
                status: status.status,
              });
            }
          } else {
            state.simulationStatus = [
              {
                date: removeTimeFromDate(status.date),
                status: status.status,
              },
            ];
          }
        });
      },
      errors: {},
      tripInfoErrors: {},
      spotErrors: {},
      planErrors: {},
      getSpotInfo: (date, type) => {
        const plansForDate = get().plans.filter(
          (plan) => plan.date.toLocaleDateString('ja-JP') === date.toLocaleDateString('ja-JP'),
        );
        if (plansForDate.length > 0) {
          if (type === TransportNodeType.DEPARTURE) {
            return plansForDate[0].spots.filter((spot) => spot.transports?.fromType === type);
          } else if (type === TransportNodeType.DESTINATION) {
            return plansForDate[0].spots.filter((spot) => spot.transports?.toType === type);
          } else {
            return plansForDate[0].spots.filter(
              (spot) => spot.transports?.fromType === type && spot.transports?.toType === type,
            );
          }
        }
        return [];
      },
      setTripInfo: (date, name, value) => {
        set((state) => {
          const existingTripInfoIndex = state.tripInfo.findIndex(
            (info) => info.date.toDateString() === date.toDateString(),
          );

          if (existingTripInfoIndex >= 0) {
            state.tripInfo[existingTripInfoIndex] = {
              ...state.tripInfo[existingTripInfoIndex],
              [name]: value,
            };
          } else {
            state.tripInfo.push({
              date: removeTimeFromDate(date),
              genreId: name === 'genreId' ? Number(value) : 0,
              transportationMethod: name === 'transportationMethod' ? (value as number[]) : [],
              memo: name === 'memo' ? (value as string) : '',
            });
          }
        });
      },
      setSpots: (date, spot, isDeleted = false) => {
        set((state) => {
          const existingPlansIndex = state.plans.findIndex(
            (info) => info.date.toLocaleDateString('ja-JP') === date.toLocaleDateString('ja-JP'),
          );
          const existingSpotIndex = state.plans[existingPlansIndex].spots.findIndex((info) => info.id === spot.id);

          if (existingSpotIndex >= 0 && !isDeleted) {
            state.plans[existingPlansIndex].spots[existingSpotIndex] = spot;
          } else if (existingSpotIndex >= 0 && isDeleted) {
            state.plans[existingPlansIndex].spots.splice(existingSpotIndex, 1);
          } else if (existingSpotIndex < 0 && !isDeleted) {
            state.plans[existingPlansIndex].spots.push(spot);
          }
        });
      },
      setFields: (field, value) =>
        set((state) => {
          state[field] = value;
        }),
      setRangeDate: (date) => set((state) => ({ ...state, startDate: date?.from, endDate: date?.to })),
      setErrors: (errors) => set((state) => ({ ...state, errors })),
      setTripInfoErrors: (date, errors) =>
        set((state) => {
          const dateKey = date.toLocaleDateString('ja-JP');
          state.tripInfoErrors[dateKey] = {
            ...state.tripInfoErrors[dateKey],
            ...errors,
          };
          return state;
        }),
      setPlanErrors: (date, errors) =>
        set((state) => {
          const dateKey = date.toLocaleDateString('ja-JP');
          state.planErrors[dateKey] = {
            ...state.planErrors[dateKey],
            ...errors,
          };
          return state;
        }),
      setSpotErrors: (date, errors) =>
        set((state) => {
          const dateKey = date.toLocaleDateString('ja-JP');
          state.spotErrors[dateKey] = {
            ...state.spotErrors[dateKey],
            ...errors,
          };
          return state;
        }),
      resetErrors: () => set((state) => ({ ...state, tripInfoErrors: {}, planErrors: {}, spotErrors: {} })),
      resetForm: () => set((state) => ({ ...state, errors: {} })),
    })),
  ),
);

type Departure = {
  lat: number;
  lng: number;
};

type PhotoType = {
  flagContentURI: string;
};

export type PlaceInfo = {
  id: string;
  name: string;
  url: string;
  location: Departure;
  photos: PhotoType[];
};

export async function searchSpots(params: SearchSpotByCategoryParams): Promise<Spot[]> {
  const { Place, SearchNearbyRankPreference, SearchByTextRankPreference } = (await google.maps.importLibrary(
    'places',
  )) as google.maps.PlacesLibrary;

  // Restrict within the map viewport.
  const center = new google.maps.LatLng(params.center.lat, params.center.lng);

  // 複数ジャンルを指定した場合にgoogle docsのtypeを使用
  //https://developers.google.com/maps/documentation/places/web-service/place-types?hl=ja&_gl=1*tofb5y*_up*MQ..*_ga*MTQ4MDA4MDA0Mi4xNzQzODkxMDQ4*_ga_NRWSTWS78N*MTc0Mzg5MTA0Ny4xLjEuMTc0Mzg5MTMxNy4wLjAuMA..
  const searchCategoryList: string[] = [];
  params.genreIds?.forEach((genreId) => {
    searchCategoryList.push(...placeTypeGroups[genreId]);
  });

  const placeToSpot = (place: google.maps.places.Place): Spot => ({
    id: place.id,
    location: {
      name: place.displayName ?? '',
      latitude: place.location?.lat() ?? 0,
      longitude: place.location?.lng() ?? 0,
    },
    image: place.photos?.[0]?.getURI() ?? '',
    url: place.googleMapsURI ?? '',
    rating: place.rating ?? 0,
    stayStart: '09:00', // TODO: 仮置き
    stayEnd: '10:00', // TODO: 仮置き
    category: place.types ?? [], // TODO: 日本語化
    transports: {
      transportMethodIds: [0],
      name: 'DEFAULT',
      travelTime: '不明',
      fromType: TransportNodeType.SPOT,
      toType: TransportNodeType.SPOT,
    },
  });

  const fields = [
    'displayName',
    'location',
    'businessStatus',
    'googleMapsURI',
    'photos',
    'rating',
    'types',
    'primaryType',
    'primaryTypeDisplayName',
    'attributions',
    'regularOpeningHours',
  ];

  if (params.searchWord) {
    const request: google.maps.places.SearchByTextRequest = {
      textQuery: params.searchWord,
      fields: fields,
      maxResultCount: params.maxResultLimit,
      rankPreference:
        params.sortOption === 'distance' ? SearchByTextRankPreference.DISTANCE : SearchByTextRankPreference.RELEVANCE,
      language: 'ja',
      region: 'JP',
    };
    const { places } = await Place.searchByText(request);

    return places?.map(placeToSpot) ?? [];
  } else {
    const request: google.maps.places.SearchNearbyRequest = {
      // required parameters
      fields: fields,
      locationRestriction: {
        center: center,
        radius: params.radius * 1000, // 半径をメートルに変換
      },
      // optional parameters
      includedTypes: searchCategoryList,
      maxResultCount: params.maxResultLimit,
      rankPreference:
        params.sortOption === 'popularity'
          ? SearchNearbyRankPreference.POPULARITY
          : SearchNearbyRankPreference.DISTANCE,
      language: 'ja',
      region: 'JP',
    };
    const { places } = await Place.searchNearby(request);
    return places?.map(placeToSpot) ?? [];
  }
}

export type RouteResult = {
  path: google.maps.LatLngLiteral[];
  distance: string;
  duration: string;
  travelMode: TravelModeType;
};

export const getRoute = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  travelMode: TravelModeType = 'WALKING',
): Promise<RouteResult> => {
  try {
    const directionsService = new google.maps.DirectionsService();
    if (travelMode === 'DEFAULT') {
      travelMode = 'WALKING';
    }
    const searchForTravelMode: google.maps.TravelMode = google.maps.TravelMode[travelMode];
    const result = await directionsService.route({
      origin,
      destination,
      travelMode: searchForTravelMode,
    });

    if (result.routes[0]) {
      return {
        path: result.routes[0].overview_path.map((point) => ({
          lat: point.lat(),
          lng: point.lng(),
        })),
        distance: result.routes[0].legs[0].distance?.text || '',
        duration: result.routes[0].legs[0].duration?.text || '',
        travelMode: travelMode || 'DEFAULT',
      };
    }
  } catch (error) {
    console.error('Failed to get route:', error);
  }

  // フォールバック: 直線距離
  return {
    path: [origin, destination],
    distance: '',
    duration: '',
    travelMode: 'DEFAULT',
  };
};
