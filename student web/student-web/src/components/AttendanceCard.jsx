const AttendanceCard = ({ date, day, status }) => {
  const statusClass = status === 'Present' ? 'badge-present' : 'badge-absent'
  const rowClass = status === 'Present' ? 'bg-green-50' : 'bg-red-50'

  return (
    <tr className={rowClass}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{date}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{day}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={statusClass}>{status}</span>
      </td>
    </tr>
  )
}

export default AttendanceCard
