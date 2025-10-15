export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-gray-200 to-blue-200">
            <header className="bg-white shadow-md py-6 px-4">
                <h1 className="text-3xl font-bold text-blue-700 text-center tracking-wide">Recetario</h1>
            </header>
            <main className="flex-1 flex justify-center items-start py-8">
                <div className="w-full max-w-4xl">{children}</div>
            </main>
            <footer className="bg-white shadow-inner py-4 text-center text-gray-500 text-sm">
                © 2025 Recetario
            </footer>
        </div>
    );
}