export type Location = {
  name: string;
  latitude: number;
  longitude: number;
  transport?: {
    name: string;
    time: string;
  };
};

export type Coordination = {
  lat: number;
  lng: number;
};

type Transport = {
  name: string; // 例: "電車" | "バス"
  time: string; // 例: "30分"
};

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
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  stayStart: string;
  stayEnd: string;
  transport?: Transport;
  url?: string;
  memo?: string;
  image?: string; // 画像URL (省略可能)
  rating: number; // 例: 4.7
  category: string[]; // 例: ["文化", "歴史"]
  catchphrase?: string; // キャッチコピー
  description?: string; // 説明文
  nearestStation?: NearestStation; // 最寄駅
};

export type TravelPlanType = {
  date: Date;
  departure: Location;
  destination: Location;
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
