export function generateRandStr(length = 10): String {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = length; i > 0; i -= 1)
    result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

export function getTime(): String {
  const date = new Date()
  const time =
    date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  return time
}
