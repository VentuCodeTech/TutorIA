import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600">TutorIA</div>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
          <Link href="/pricing" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Comecar
          </Link>
        </div>
      </nav>
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Estude com <span className="text-indigo-600">IA Adaptativa</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Prepare-se para ENEM, OAB, Concursos e CPA-20
        </p>
        <Link href="/pricing" className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition">
          Ver Planos
        </Link>
      </section>
    </main>
  )
}
