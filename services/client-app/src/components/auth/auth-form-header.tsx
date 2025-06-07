export default function AuthFormHeader({ h1, p }: { h1: string; p: string }) {
  return (
    <>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">{h1} </h1>
        <p className="text-muted-foreground text-balance">{p}</p>
      </div>
    </>
  )
}
