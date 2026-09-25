import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Moon, Sun, User, LogOut, Menu, X, Home, Search, Users, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Layout() {
  const { currentUser, darkMode, toggleDarkMode, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen flex flex-col bg-sand-50 dark:bg-sand-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-sand-800/90 backdrop-blur-md border-b border-sand-200 dark:border-sand-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-terra-500 to-terra-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="font-heading font-bold text-xl text-sand-900 dark:text-sand-100">Duna</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/buscar" className="text-sm font-medium text-sand-700 dark:text-sand-300 hover:text-terra-600 dark:hover:text-terra-400 transition-colors flex items-center gap-1">
                <Search size={16} /> Buscar
              </Link>
              <Link to="/afiliados" className="text-sm font-medium text-sand-700 dark:text-sand-300 hover:text-terra-600 dark:hover:text-terra-400 transition-colors flex items-center gap-1">
                <Users size={16} /> Afiliados
              </Link>
              {currentUser?.role === 'guest' && (
                <Link to="/minhas-reservas" className="text-sm font-medium text-sand-700 dark:text-sand-300 hover:text-terra-600 dark:hover:text-terra-400 transition-colors flex items-center gap-1">
                  <Home size={16} /> Minhas Reservas
                </Link>
              )}
              {(currentUser?.role === 'realEstate' || currentUser?.role === 'admin') && (
                <Link to="/painel" className="text-sm font-medium text-sand-700 dark:text-sand-300 hover:text-terra-600 dark:hover:text-terra-400 transition-colors flex items-center gap-1">
                  <LayoutDashboard size={16} /> Painel
                </Link>
              )}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-sand-200 dark:hover:bg-sand-700 transition-colors" aria-label="Alternar tema">
                {darkMode ? <Sun size={18} className="text-sand-300" /> : <Moon size={18} className="text-sand-600" />}
              </button>
              
              {currentUser ? (
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-terra-100 dark:bg-terra-900 flex items-center justify-center">
                    <User size={14} className="text-terra-600 dark:text-terra-400" />
                  </div>
                  <span className="text-sm font-medium text-sand-800 dark:text-sand-200">{currentUser.name}</span>
                  <button onClick={handleLogout} className="p-1.5 rounded-full hover:bg-sand-200 dark:hover:bg-sand-700 transition-colors" aria-label="Sair">
                    <LogOut size={14} className="text-sand-500" />
                  </button>
                </div>
              ) : (
                <button onClick={() => navigate('/buscar')} className="hidden md:block px-4 py-2 bg-terra-500 hover:bg-terra-600 text-white text-sm font-medium rounded-full transition-colors">
                  Entrar
                </button>
              )}

              {/* Mobile menu button */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-sand-200 dark:hover:bg-sand-700 transition-colors">
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden border-t border-sand-200 dark:border-sand-700">
              <nav className="px-4 py-4 space-y-3">
                <Link to="/buscar" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium text-sand-700 dark:text-sand-300">
                  <Search size={16} /> Buscar Imóveis
                </Link>
                <Link to="/afiliados" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium text-sand-700 dark:text-sand-300">
                  <Users size={16} /> Programa de Afiliados
                </Link>
                {currentUser?.role === 'guest' && (
                  <Link to="/minhas-reservas" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium text-sand-700 dark:text-sand-300">
                    <Home size={16} /> Minhas Reservas
                  </Link>
                )}
                {(currentUser?.role === 'realEstate' || currentUser?.role === 'admin') && (
                  <Link to="/painel" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium text-sand-700 dark:text-sand-300">
                    <LayoutDashboard size={16} /> Painel
                  </Link>
                )}
                {currentUser ? (
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-sm font-medium text-red-500">
                    <LogOut size={16} /> Sair
                  </button>
                ) : (
                  <button onClick={() => { navigate('/buscar'); setMobileMenuOpen(false); }} className="w-full px-4 py-2 bg-terra-500 text-white text-sm font-medium rounded-full">
                    Entrar
                  </button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-sand-900 dark:bg-sand-800 text-sand-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-terra-500 to-terra-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
                <span className="font-heading font-bold text-xl text-white">Duna</span>
              </div>
              <p className="text-sm text-sand-400 max-w-md">
                O marketplace de aluguel por temporada que conecta hóspedes a imóveis incríveis em todo o Brasil. 
                Publicidade transparente, reservas seguras e a melhor experiência para sua viagem.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white mb-3">Navegação</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/buscar" className="hover:text-terra-400 transition-colors">Buscar Imóveis</Link></li>
                <li><Link to="/afiliados" className="hover:text-terra-400 transition-colors">Programa de Afiliados</Link></li>
                <li><Link to="/minhas-reservas" className="hover:text-terra-400 transition-colors">Minhas Reservas</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white mb-3">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-terra-400 transition-colors cursor-pointer">Central de Ajuda</span></li>
                <li><span className="hover:text-terra-400 transition-colors cursor-pointer">Política de Cancelamento</span></li>
                <li><span className="hover:text-terra-400 transition-colors cursor-pointer">Contato</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-sand-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-sand-500">© 2024 Duna. Todos os direitos reservados.</p>
            <p className="text-xs text-sand-500">Feito com ☀️ para viajantes e imobiliárias</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
