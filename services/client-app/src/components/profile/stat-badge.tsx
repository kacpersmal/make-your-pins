// Update the StatBadge component to be responsive
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
    <div className="flex flex-row items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="mr-2 text-gray-600 dark:text-gray-400">{icon}</div>
      <div className="">
        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  )
}
