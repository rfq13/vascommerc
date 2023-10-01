function DashboardTable(props: { data: any[]; columns: any[] }) {
  const { data, columns } = props
  return (
    <table className="w-full table-auto">
      <thead>
        <tr>
          {columns.map((column, key) => {
            const isFirst = key === 0
            const isLast = key === columns.length - 1
            return (
              <th
                className={`${isLast && 'rounded-br-md rounded-tr-md'} 
                ${isFirst && 'rounded-bl-md rounded-tl-md'}
                bg-[var(--primary-color)] px-4 py-3 text-left text-sm font-medium text-white`}
              >
                {column.title}
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-100 text-sm text-zinc-700">
        {data.map((row) => {
          return (
            <tr className=" bg-transparent">
              {columns.map((column) => {
                return (
                  <td className="px-4 py-3">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default DashboardTable
