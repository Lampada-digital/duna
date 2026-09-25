import { useApp } from '../context/AppContext';
import { RequireConfig } from '../components/RequireConfig';
import { AlertTriangle } from 'lucide-react';

export function AdminPanel() {
  return (
    <RequireConfig>
      <AdminPanelContent />
    </RequireConfig>
  );
}

function AdminPanelContent() {
  const { auth } = useApp();

  if (!auth.isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in">
        <AlertTriangle size={48} className="mx-auto text-amber-500 mb-4" />
        <h1 className="font-display text-2xl font-bold text-sand-900 dark:text-sand-100 mb-3">
          Acesso Restrito
        </h1>
        <p className="text-sand-600 dark:text-sand-400 mb-6">
          Você precisa estar autenticado como administrador para acessar esta área.
        </p>
        <a href="#/signin" className="px-6 py-3 bg-terra-500 hover:bg-terra-600 text-white font-semibold rounded-xl transition-colors">
          Fazer login
        </a>
      </div>
    );
  }

  if (auth.profile?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in">
        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
        <h1 className="font-display text-2xl font-bold text-sand-900 dark:text-sand-100 mb-3">
          Acesso Negado
        </h1>
        <p className="text-sand-600 dark:text-sand-400">
          Você não tem permissão para acessar o painel administrativo.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12 animate-fade-in">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-sand-900 dark:text-sand-50 mb-3">
        Painel Administrativo
      </h1>
      <p className="text-sand-500 mb-8">Gerencie usuários, imóveis, reservas e configurações</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Usuários', value: '—', desc: 'Gerenciar usuários' },
          { label: 'Imóveis', value: '—', desc: 'Moderar publicações' },
          { label: 'Reservas', value: '—', desc: 'Visualizar reservas' },
          { label: 'Receita', value: '—', desc: 'Financeiro' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 card-shadow">
            <p className="text-xs font-medium text-sand-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-sand-900 dark:text-sand-100 mb-2">{stat.value}</p>
            <p className="text-xs text-sand-500">{stat.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
        <h3 className="font-heading font-bold text-amber-900 dark:text-amber-300 mb-2">
          ⚠️ Painel em Desenvolvimento
        </h3>
        <p className="text-sm text-amber-800 dark:text-amber-400">
          O painel administrativo completo está sendo implementado com integração real ao Supabase. 
          Em breve você poderá gerenciar usuários, moderar imóveis, visualizar reservas e controlar o financeiro diretamente daqui.
        </p>
      </div>
    </div>
  );
}
