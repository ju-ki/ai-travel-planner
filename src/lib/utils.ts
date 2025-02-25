import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 *
 * @param time1 HH:mm
 * @param time2 HH:mm
 * @returns time1とtime2の差分(HH:mm)
 */
export function calcDiffTime(time1: string, time2: string): string {
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);

  // 分単位に変換
  const totalMinutes1 = h1 * 60 + m1;
  const totalMinutes2 = h2 * 60 + m2;

  // 差分を計算（絶対値を取る）
  let diffMinutes = totalMinutes1 - totalMinutes2;

  // 時と分に分割
  const diffHours = Math.floor(diffMinutes / 60);
  diffMinutes %= 60;

  // HH:mm 形式にフォーマット
  return `${String(diffHours).padStart(2, '0')}:${String(diffMinutes).padStart(2, '0')}`;
}

/**
 *
 * @param baseTime 基準となる時間
 * @param diffTime 差分
 * @returns 基準時間に差分を加算した時間
 */
export function updatedTime(baseTime: string, diffTime: string): string {
  const [baseHours, baseMinutes] = baseTime.split(':').map(Number);
  const [diffHours, diffMinutes] = diffTime.split(':').map(Number);

  // 全体を分に変換
  let totalMinutes = baseHours * 60 + baseMinutes + diffHours * 60 + diffMinutes;

  // 24時間制に収める（1440分 = 24時間）
  totalMinutes = totalMinutes % 1440;

  // 時・分を計算
  const updatedHours = Math.floor(totalMinutes / 60);
  const updatedMinutes = totalMinutes % 60;

  // HH:mm 形式に整形
  return `${String(updatedHours).padStart(2, '0')}:${String(updatedMinutes).padStart(2, '0')}`;
}
