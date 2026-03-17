interface AlertProps {
  message: string
  type: 'success' | 'error'
}

export default function Alert({ message, type }: AlertProps) {
  return (
    <div className={`p-4 rounded ${type === 'success' ? 'bg-green-200' : 'bg-red-200'}`}>
      {message}
    </div>
  )
}