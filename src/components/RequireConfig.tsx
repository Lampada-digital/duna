import { ReactNode } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, Database, Key, ExternalLink } from 'lucide-react';

export function RequireConfig({ children }: { children: ReactNode }) {
  const { isConfigured } = useApp();

  if (!isConfigured) {
    return <NotConfigured />;
  }

  return <>{children}</>;
}

export function NotConfigured() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={40} className="text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-sand-900 dark:text-sand-50 mb-3">
            Configuração Necessária
          </h1>
          <p className="text-sand-600 dark:text-sand-400 text-lg">
            O Duna precisa do <strong>Supabase</strong> configurado para funcionar como marketplace real.
          </p>
        </div>

        <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 md:p-8 card-shadow space-y-6">
          <div>
            <h2 className="font-heading font-bold text-lg text-sand-900 dark:text-sand-100 mb-4 flex items-center gap-2">
              <Database size={20} className="text-terra-500" /> Por que o Supabase?
            </h2>
            <p className="text-sm text-sand-600 dark:text-sand-400 mb-4">
              O Duna é um marketplace real. Isso significa que precisamos de:
            </p>
            <ul className="space-y-2 text-sm text-sand-700 dark:text-sand-300">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span><strong>Banco de dados real</strong> (PostgreSQL) — não localStorage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span><strong>Autenticação real</strong> — não login falso</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span><strong>Storage real</strong> para upload de imagens</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span><strong>Segurança real</strong> com Row Level Security (RLS)</span>
              </li>
            </ul>
          </div>

          <div className="border-t border-sand-200 dark:border-sand-700 pt-6">
            <h2 className="font-heading font-bold text-lg text-sand-900 dark:text-sand-100 mb-4 flex items-center gap-2">
              <Key size={20} className="text-terra-500" /> Como configurar
            </h2>
            <ol className="space-y-3 text-sm text-sand-700 dark:text-sand-300">
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-terra-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                <div>
                  <p>Crie um projeto gratuito em <a href="https://supabase.com" target="_blank" rel="noopener" className="text-terra-600 dark:text-terra-400 underline font-medium">supabase.com</a></p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-terra-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                <div>
                  <p>Execute <code className="bg-sand-100 dark:bg-sand-700 px-1.5 py-0.5 rounded text-xs">supabase/schema.sql</code> no SQL Editor</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-terra-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                <div>
                  <p>Crie buckets: <code className="bg-sand-100 dark:bg-sand-700 px-1.5 py-0.5 rounded text-xs">property-images</code>, <code className="bg-sand-100 dark:bg-sand-700 px-1.5 py-0.5 rounded text-xs">avatars</code></p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-terra-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                <div>
                  <p>Copie <code className="bg-sand-100 dark:bg-sand-700 px-1.5 py-0.5 rounded text-xs">.env.example</code> para <code className="bg-sand-100 dark:bg-sand-700 px-1.5 py-0.5 rounded text-xs">.env</code> e preencha:</p>
                  <div className="mt-2 bg-sand-900 dark:bg-sand-950 rounded-lg p-3 font-mono text-xs text-green-400">
                    <div>VITE_SUPABASE_URL=https://seu-projeto.supabase.co</div>
                    <div>VITE_SUPABASE_ANON_KEY=eyJhbGc...</div>
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-terra-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                <div>
                  <p>Reinicie o servidor de desenvolvimento</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="border-t border-sand-200 dark:border-sand-700 pt-6">
            <a
              href="https://github.com/duna-marketplace/duna/blob/main/SETUP.md"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-6 py-3 bg-terra-500 hover:bg-terra-600 text-white font-semibold rounded-xl transition-colors"
            >
              Ver guia completo <ExternalLink size={16} />
            </a>
          </div>
        </div>

        <p className="text-center text-sm text-sand-500 mt-6">
          O Duna é um marketplace real. Não simulamos dados.
        </p>
      </div>
    </div>
  );
}
