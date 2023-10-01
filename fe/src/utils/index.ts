import { notification } from 'antd'
import { RcFile } from 'antd/lib/upload'

/**
 * Convert the value to always returning number.
 *
 * All invalid number will be converted to `0` like:
 * - `NaN` to `0`
 * - `Infinity` to `0`
 * - `null` to `0`
 * - `undefined` to `0`
 */
export function parseNumber(v) {
  const newValue = parseFloat(v)
  return Number.isFinite(newValue) ? newValue : 0
}

export function validateFileSize(file: RcFile, fileSize = 10) {
  if (file.size / 1024 / 1024 < fileSize) {
    return false
  }
  notification.error({
    message: `Ukuran File melebihi ${fileSize}MB`,
  })
  return true
}

export const currencyFormat = (num: number) => {
  if (!num) return 0
  return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}
