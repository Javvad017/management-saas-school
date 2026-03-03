const AnnouncementCard = ({ title, message, date }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-700 mb-3">{message}</p>
      <p className="text-sm text-gray-500">{formatDate(date)}</p>
    </div>
  )
}

export default AnnouncementCard
