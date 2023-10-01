function subStringText(text: string, limit?: number) {
  const limitString = limit || 30

  const title = text.substring(0, limitString)
  const dotText = text.length > limitString ? '...' : ''

  return `${title} ${dotText}`
}

export default subStringText
