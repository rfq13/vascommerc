const getGambar = (id: string, datas: any[]) => {
  const data = datas?.find((item) => item.id === id)
  const prefix = data?.url?.startsWith('http')
    ? ''
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/`
  return `${prefix}${data?.url}`
}

export default getGambar
