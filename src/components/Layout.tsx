import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Moon, Sun, User, LogOut, Menu, X, Search, Globe, Heart } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Layout() {
  const { currentUser, darkMode, toggleDarkMode, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => { logout(); setUserMenuOpen(false); navigate('/'); };

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-sand-50 dark:bg-sand-950 transition-colors duration-300">
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isHome ? 'glass border-b border-sand-200/60 dark:border-sand-800/60' : 'bg-white dark:bg-sand-900 border-b border-sand-200 dark:border-sand-800'}`}>
        <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-terra-400 via-terra-500 to-terra-700 rounded-xl flex items-center justify-center shadow-lg shadow-terra-500/20 group-hover:shadow-terra-500/40 transition-shadow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M2 18C2 18 5 12 8 12C11 12 11 16 14 16C17 16 22 10 22 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M2 22C2 22 6 17 9 17C12 17 13 20 16 20C19 20 22 16 22 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
                  </svg>
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-2xl tracking-tight text-sand-900 dark:text-sand-50">duna</span>
              </div>
            </Link>

            {/* Center - Search Pill (Desktop) */}
            <button
              onClick={() => navigate('/buscar')}
              className="hidden md:flex items-center h-12 border border-sand-200 dark:border-sand-700 rounded-full shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-sand-800 btn-press"
            >
              <div className="px-5 py-2.5">
                <p className="text-sm font-semibold text-sand-900 dark:text-sand-100">Para onde?</p>
                <p className="text-xs text-sand-500">Qualquer lugar • Qualquer semana</p>
              </div>
              <div className="w-8 h-8 bg-terra-500 rounded-full flex items-center justify-center mr-2">
                <Search size={14} className="text-white" />
              </div>
            </button>

            {/* Right side */}
            <div className="flex items-center gap-1">
              <Link to="/afiliados" className="hidden lg:flex items-center px-4 py-2.5 text-sm font-semibold text-sand-700 dark:text-sand-300 hover:bg-sand-100 dark:hover:bg-sand-800 rounded-full transition-colors">
                Seja um anfitrião
              </Link>

              <button onClick={toggleDarkMode} className="p-2.5 rounded-full hover:bg-sand-100 dark:hover:bg-sand-800 transition-colors" aria-label="Alternar tema">
                {darkMode ? <Sun size={18} className="text-sand-300" /> : <Moon size={18} className="text-sand-700" />}
              </button>

              {/* User menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 ml-2 p-1.5 pl-3 border border-sand-200 dark:border-sand-700 rounded-full hover:shadow-md transition-all bg-white dark:bg-sand-800"
                >
                  <Menu size={16} className="text-sand-700 dark:text-sand-300" />
                  <div className="w-7 h-7 bg-sand-600 dark:bg-sand-400 rounded-full flex items-center justify-center">
                    {currentUser ? (
                      <span className="text-xs font-bold text-white">{currentUser.name[0]}</span>
                    ) : (
                      <User size={14} className="text-white" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-sand-800 rounded-xl shadow-xl border border-sand-200 dark:border-sand-700 overflow-hidden"
                    >
                      {currentUser ? (
                        <>
                          <div className="px-4 py-3 border-b border-sand-100 dark:border-sand-700">
                            <p className="text-sm font-semibold text-sand-900 dark:text-sand-100">{currentUser.name}</p>
                            <p className="text-xs text-sand-500">{currentUser.email}</p>
                          </div>
                          <div className="py-2">
                            {currentUser.role === 'guest' && (
                              <Link to="/minhas-reservas" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-sand-700 dark:text-sand-300 hover:bg-sand-50 dark:hover:bg-sand-700">
                                <Heart size={16} /> Minhas reservas
                              </Link>
                            )}
                            {(currentUser.role === 'realEstate' || currentUser.role === 'admin') && (
                              <Link to="/painel" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-sand-700 dark:text-sand-300 hover:bg-sand-50 dark:hover:bg-sand-700">
                                <Globe size={16} /> Painel da imobiliária
                              </Link>
                            )}
                            <Link to="/afiliados/painel" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-sand-700 dark:text-sand-300 hover:bg-sand-50 dark:hover:bg-sand-700">
                              <User size={16} /> Painel de afiliado
                            </Link>
                          </div>
                          <div className="border-t border-sand-100 dark:border-sand-700 py-2">
                            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-sand-700 dark:text-sand-300 hover:bg-sand-50 dark:hover:bg-sand-700 w-full">
                              <LogOut size={16} /> Sair
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="py-2">
                          <button onClick={() => { navigate('/buscar'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-sand-900 dark:text-sand-100 hover:bg-sand-50 dark:hover:bg-sand-700">
                            Entrar
                          </button>
                          <button onClick={() => { navigate('/buscar'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-sand-700 dark:text-sand-300 hover:bg-sand-50 dark:hover:bg-sand-700">
                            Cadastrar
                          </button>
                          <div className="border-t border-sand-100 dark:border-sand-700 mt-2 pt-2">
                            <Link to="/painel" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-sand-700 dark:text-sand-300 hover:bg-sand-50 dark:hover:bg-sand-700">
                              Publicar imóvel na Duna
                            </Link>
                            <Link to="/afiliados" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-sand-700 dark:text-sand-300 hover:bg-sand-50 dark:hover:bg-sand-700">
                              Programa de afiliados
                            </Link>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden px-4 pb-3">
          <button
            onClick={() => navigate('/buscar')}
            className="w-full flex items-center gap-3 h-12 bg-white dark:bg-sand-800 border border-sand-200 dark:border-sand-700 rounded-xl shadow-sm px-4"
          >
            <Search size={16} className="text-sand-700 dark:text-sand-300" />
            <div className="text-left">
              <p className="text-sm font-semibold text-sand-900 dark:text-sand-100">Para onde?</p>
              <p className="text-xs text-sand-500">Qualquer lugar • Qualquer semana</p>
            </div>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-sand-100 dark:bg-sand-900 border-t border-sand-200 dark:border-sand-800 mt-auto">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-sand-200 dark:border-sand-800">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-terra-400 to-terra-700 rounded-lg flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M2 18C2 18 5 12 8 12C11 12 11 16 14 16C17 16 22 10 22 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M2 22C2 22 6 17 9 17C12 17 13 20 16 20C19 20 22 16 22 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
                  </svg>
                </div>
                <span className="font-display font-bold text-xl text-sand-900 dark:text-sand-50">duna</span>
              </div>
              <p className="text-sm text-sand-600 dark:text-sand-400 leading-relaxed">
                O marketplace de aluguel por temporada que conecta você a lugares extraordinários.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm text-sand-900 dark:text-sand-100 mb-4">Suporte</h4>
              <ul className="space-y-3 text-sm">
                <li><span className="text-sand-600 dark:text-sand-400 hover:text-sand-900 dark:hover:text-sand-100 cursor-pointer transition-colors">Central de Ajuda</span></li>
                <li><span className="text-sand-600 dark:text-sand-400 hover:text-sand-900 dark:hover:text-sand-100 cursor-pointer transition-colors">Segurança</span></li>
                <li><span className="text-sand-600 dark:text-sand-400 hover:text-sand-900 dark:hover:text-sand-100 cursor-pointer transition-colors">Acessibilidade</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm text-sand-900 dark:text-sand-100 mb-4">Hospedagem</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/painel" className="text-sand-600 dark:text-sand-400 hover:text-sand-900 dark:hover:text-sand-100 transition-colors">Publicar imóvel</Link></li>
                <li><Link to="/afiliados" className="text-sand-600 dark:text-sand-400 hover:text-sand-900 dark:hover:text-sand-100 transition-colors">Seja afiliado</Link></li>
                <li><span className="text-sand-600 dark:text-sand-400 hover:text-sand-900 dark:hover:text-sand-100 cursor-pointer transition-colors">Recursos</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm text-sand-900 dark:text-sand-100 mb-4">Duna</h4>
              <ul className="space-y-3 text-sm">
                <li><span className="text-sand-600 dark:text-sand-400 hover:text-sand-900 dark:hover:text-sand-100 cursor-pointer transition-colors">Sobre nós</span></li>
                <li><span className="text-sand-600 dark:text-sand-400 hover:text-sand-900 dark:hover:text-sand-100 cursor-pointer transition-colors">Blog</span></li>
                <li><span className="text-sand-600 dark:text-sand-400 hover:text-sand-900 dark:hover:text-sand-100 cursor-pointer transition-colors">Carreiras</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-sand-500">© 2024 Duna, Inc. Todos os direitos reservados.</p>
            <div className="flex items-center gap-6 text-xs text-sand-500">
              <span className="hover:text-sand-700 dark:hover:text-sand-300 cursor-pointer">Privacidade</span>
              <span className="hover:text-sand-700 dark:hover:text-sand-300 cursor-pointer">Termos</span>
              <span className="hover:text-sand-700 dark:hover:text-sand-300 cursor-pointer">Mapa do site</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
