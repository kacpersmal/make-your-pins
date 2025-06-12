export default function AssetsThumbnailCard({ assetId }: { assetId: string }) {
  return (
    <>
      <div className="h-full bg-black/10 rounded-2xl flex justify-center items-center">
        {' '}
        {assetId}
      </div>
    </>
  )
}
