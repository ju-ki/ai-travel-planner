export type Location = {
  name: string;
  latitude: number;
  longitude: number;
};

export type Coordination = {
  lat: number;
  lng: number;
};

export type Transport = {
  transportMethodIds: number[];
  name: TravelModeType; // 例: "電車" | "バス"
  cost?: number;
  travelTime: string; // 例: "30分"
  fromType: TransportNodeType;
  toType: TransportNodeType;
  fromLocationId?: string; // 出発地点のID
  toLocationId?: string; // 到着地点のID
};

export enum TransportNodeType {
  DEPARTURE = 'DEPARTURE',
  DESTINATION = 'DESTINATION',
  SPOT = 'SPOT',
}

type NearestStation = {
  name: string; // 最寄駅の名前
  walkingTime: number; // 徒歩時間（分）
  latitude: number;
  longitude: number;
};

export type TripInfo = {
  date: Date;
  genreId: number;
  transportationMethod: number[];
  memo?: string;
};

export type Spot = {
  id?: string;
  location: Location;
  stayStart?: string;
  stayEnd?: string;
  transports: Transport;
  url?: string;
  memo?: string;
  image?: string; // 画像URL (省略可能)
  rating?: number; // 例: 4.7
  category?: string[]; // 例: ["文化", "歴史"]
  catchphrase?: string; // キャッチコピー
  description?: string; // 説明文
  nearestStation?: NearestStation; // 最寄駅
};

export type TravelPlanType = {
  date: Date;
  spots: Spot[];
};

export type PlaceTypeGroupKey = 'culture' | 'nature' | 'leisure' | 'gourmet';

export type SortOption = 'popularity' | 'distance';

export type SearchSpotByCategoryParams = {
  genreIds?: PlaceTypeGroupKey[]; //ジャンルリスト
  center: Coordination; //基準となる地点
  radius: number; //半径
  sortOption: SortOption; //ソートオプション
  maxResultLimit: number; //最大取得件数
  searchWord?: string; //検索ワード
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  isRead: boolean;
};

export type TravelModeType = 'DRIVING' | 'TRANSIT' | 'WALKING' | 'BICYCLING' | 'DEFAULT';

export type TravelModeTypeForDisplay = {
  [key in TravelModeType]: {
    icon: JSX.Element;
    label: string;
  };
};
