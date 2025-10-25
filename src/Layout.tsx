import { useAuth } from './hooks/useAuth';

export default function Layout({ children }: { children: React.ReactNode }) {
    const { signOut, user } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
            window.location.href = '/login';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-gray-200 to-blue-200">
            <header className="bg-white shadow-md py-6 px-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-blue-700 tracking-wide">Recetario</h1>
                    
                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-700">
                                        {user.email}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Usuario autenticado
                                    </p>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition text-sm"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <main className="flex-1 flex justify-center items-start py-8">
                <div className="w-full max-w-4xl">{children}</div>
            </main>
            <footer className="bg-white shadow-inner py-4 text-center text-gray-500 text-sm">
                © 2025 Recetario - Ministerio de Salud Pública
            </footer>
        </div>
    );
}