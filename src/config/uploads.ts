/**
 * Вложения к заявке «на заказ»: до 5 файлов по 10 МБ (раздел 7 ТЗ).
 * На Netlify тело запроса к функции ограничено 6 МБ, а файлы идут в base64 (+30 %), поэтому там
 * все вложения вместе — до 4 МБ. Общий лимит задаёт next.config.ts при сборке (NEXT_PUBLIC_UPLOAD_TOTAL_MB).
 */
const totalMb = Number(process.env.NEXT_PUBLIC_UPLOAD_TOTAL_MB) || 50
const fileMb = Math.min(10, totalMb)

export const UPLOAD_LIMITS = {
  maxFiles: 5,
  maxFileMb: fileMb,
  maxTotalMb: totalMb,
  maxFileSize: fileMb * 1024 * 1024,
  maxTotalSize: totalMb * 1024 * 1024,
  /** лимит на все файлы вместе строже, чем «по файлу × количество» — показываем его в подсказке */
  totalIsTighter: totalMb < 5 * fileMb,
}
