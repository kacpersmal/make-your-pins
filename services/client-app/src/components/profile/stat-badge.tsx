export const StatBadge = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) => {
  return (
    <div className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
      <span className="text-gray-600 dark:text-gray-300">{icon}</span>
      <span className="text-sm font-medium">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  )
}
