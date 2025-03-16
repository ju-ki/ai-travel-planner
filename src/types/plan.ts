type Location = {
  name: string;
  latitude: number;
  longitude: number;
  transport?: {
    name: string;
    time: string;
  };
};

type StayDuration = {
  start: string; // 例: "10:00"
  end: string; // 例: "11:30"
};

type Transport = {
  name: string; // 例: "電車" | "バス"
  time: string; // 例: "30分"
};

type NearestStation = {
  name: string; // 最寄駅の名前
  walkingTime: string; // 徒歩時間 (例: "5分")
};

export type TripInfo = {
  date: Date;
  genre_id: number;
  transportation_method: number[];
  memo?: string;
};

export type Spot = {
  name: string;
  lat: number;
  lng: number;
  stay: StayDuration;
  transport: Transport;
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
