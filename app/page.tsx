import Calculator from '@/components/Calculator'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Calculadora de Notas
      </h1>
      <Calculator />
    </div>
  )
}
