import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Users, Building2, Home, Link2, Copy, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function AffiliateProgram() {
  const { registerAffiliate, login } = useApp();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [programA, setProgramA] = useState(true);
  const [programB, setProgramB] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  const handleRegister = () => {
    if (!name || !email) return;
    const affiliate = registerAffiliate({ name, email, programA, programB });
    setReferralCode(affiliate.referralCode);
    setRegistered(true);
    login(email, 'affiliate');
  };

  const copyLink = () => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/#/parceiro/${referralCode}`;
    navigator.clipboard.writeText(link);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-terra-50 via-sand-50 to-duna-50 dark:from-sand-950 dark:via-sand-950 dark:to-sand-950" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-terra-200/30 dark:bg-terra-900/20 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-terra-100 dark:bg-terra-900/30 rounded-full mb-6">
              <Sparkles size={14} className="text-terra-600 dark:text-terra-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-terra-700 dark:text-terra-400">Programa de Afiliados</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-sand-900 dark:text-sand-50 leading-tight">
              Ganhe indicando <br className="hidden md:block" />
              <span className="italic text-terra-500">lugares incríveis</span>
            </h1>
            <p className="text-lg md:text-xl text-sand-600 dark:text-sand-400 mt-6 max-w-2xl mx-auto leading-relaxed">
              Dois programas, uma plataforma. Indique imobiliárias ou hóspedes e ganhe comissões recorrentes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Two Programs */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Program A */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-8 card-shadow">
            <div className="w-14 h-14 bg-duna-100 dark:bg-duna-900/30 rounded-2xl flex items-center justify-center mb-5">
              <Building2 size={26} className="text-duna-600 dark:text-duna-400" />
            </div>
            <h3 className="font-display text-2xl font-bold text-sand-900 dark:text-sand-100 mb-2">Programa B2B</h3>
            <p className="text-sand-600 dark:text-sand-400 mb-5">Indique imobiliárias para a plataforma</p>
            <ul className="space-y-3 text-sm text-sand-700 dark:text-sand-300">
              <li className="flex items-start gap-2.5"><CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" /> <span><strong>20% recorrente</strong> sobre a mensalidade</span></li>
              <li className="flex items-start gap-2.5"><CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" /> Comissão válida por <strong>12 meses</strong></li>
              <li className="flex items-start gap-2.5"><CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" /> Link e código exclusivos</li>
              <li className="flex items-start gap-2.5"><CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" /> Rastreamento por cookie (30 dias)</li>
            </ul>
            <div className="mt-6 p-4 bg-duna-50 dark:bg-duna-900/20 rounded-xl border border-duna-200 dark:border-duna-800">
              <p className="text-xs text-duna-700 dark:text-duna-400 font-medium">💡 Exemplo: Indique uma imobiliária que paga R$299/mês → Você ganha R$59,80/mês por 12 meses = <strong>R$717,60</strong></p>
            </div>
          </motion.div>

          {/* Program B */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-8 card-shadow">
            <div className="w-14 h-14 bg-terra-100 dark:bg-terra-900/30 rounded-2xl flex items-center justify-center mb-5">
              <Home size={26} className="text-terra-600 dark:text-terra-400" />
            </div>
            <h3 className="font-display text-2xl font-bold text-sand-900 dark:text-sand-100 mb-2">Programa B2C</h3>
            <p className="text-sand-600 dark:text-sand-400 mb-5">Indique hóspedes que reservam na Duna</p>
            <ul className="space-y-3 text-sm text-sand-700 dark:text-sand-300">
              <li className="flex items-start gap-2.5"><CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" /> <span><strong>15%</strong> da taxa de serviço (6%)</span></li>
              <li className="flex items-start gap-2.5"><CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" /> Comissão sobre a primeira reserva</li>
              <li className="flex items-start gap-2.5"><CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" /> Link e código exclusivos</li>
              <li className="flex items-start gap-2.5"><CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" /> Rastreamento por cookie (15 dias)</li>
            </ul>
            <div className="mt-6 p-4 bg-terra-50 dark:bg-terra-900/20 rounded-xl border border-terra-200 dark:border-terra-800">
              <p className="text-xs text-terra-700 dark:text-terra-400 font-medium">💡 Exemplo: Hóspede reserva R$2.000 → Taxa Duna R$120 → Sua comissão: <strong>R$18,00</strong></p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-sand-100/50 dark:bg-sand-900/50 py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-sand-900 dark:text-sand-50 text-center mb-12">Como funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Cadastre-se', desc: 'Crie sua conta de afiliado gratuitamente' },
              { step: '02', title: 'Compartilhe', desc: 'Use seu link ou código exclusivo' },
              { step: '03', title: 'Converta', desc: 'Indicados se cadastram ou reservam' },
              { step: '04', title: 'Receba', desc: 'Comissões acumuladas e sacáveis' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="text-center md:text-left">
                <span className="font-display text-4xl font-bold text-terra-500/30">{item.step}</span>
                <h4 className="font-heading font-bold text-lg text-sand-900 dark:text-sand-100 mt-2 mb-1">{item.title}</h4>
                <p className="text-sm text-sand-600 dark:text-sand-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="max-w-xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        {!registered ? (
          <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-8 md:p-10 card-shadow">
            {!showForm ? (
              <div className="text-center">
                <h2 className="font-display text-2xl font-bold text-sand-900 dark:text-sand-100 mb-3">Pronto para começar?</h2>
                <p className="text-sand-600 dark:text-sand-400 mb-8">Cadastre-se gratuitamente e comece a ganhar comissões hoje mesmo.</p>
                <button onClick={() => setShowForm(true)} className="px-8 py-3.5 bg-sand-900 dark:bg-sand-100 hover:bg-sand-800 dark:hover:bg-sand-200 text-white dark:text-sand-900 font-semibold rounded-full transition-colors flex items-center gap-2 mx-auto btn-press">
                  Cadastrar como Afiliado <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div>
                <h2 className="font-display text-2xl font-bold text-sand-900 dark:text-sand-100 mb-6">Cadastro de Afiliado</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-sand-500 block mb-2">Nome completo</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200" placeholder="Seu nome" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-sand-500 block mb-2">E-mail</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200" placeholder="seu@email.com" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-sand-500 block mb-3">Programas</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-4 bg-sand-50 dark:bg-sand-700 rounded-xl cursor-pointer hover:bg-sand-100 dark:hover:bg-sand-600 transition-colors border border-sand-200 dark:border-sand-600">
                        <input type="checkbox" checked={programA} onChange={(e) => setProgramA(e.target.checked)} className="w-4 h-4 rounded text-terra-500 focus:ring-terra-500" />
                        <div>
                          <span className="text-sm font-semibold text-sand-800 dark:text-sand-200">Programa B2B</span>
                          <p className="text-xs text-sand-500">Indicar imobiliárias — 20% recorrente</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-4 bg-sand-50 dark:bg-sand-700 rounded-xl cursor-pointer hover:bg-sand-100 dark:hover:bg-sand-600 transition-colors border border-sand-200 dark:border-sand-600">
                        <input type="checkbox" checked={programB} onChange={(e) => setProgramB(e.target.checked)} className="w-4 h-4 rounded text-terra-500 focus:ring-terra-500" />
                        <div>
                          <span className="text-sm font-semibold text-sand-800 dark:text-sand-200">Programa B2C</span>
                          <p className="text-xs text-sand-500">Indicar hóspedes — 15% da taxa</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  <button onClick={handleRegister} disabled={!name || !email} className="w-full py-3.5 bg-terra-500 hover:bg-terra-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors btn-press">
                    Criar conta de afiliado
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-8 md:p-10 card-shadow">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                <CheckCircle size={32} className="text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold text-sand-900 dark:text-sand-100">Bem-vindo à família Duna!</h2>
              <p className="text-sm text-sand-600 dark:text-sand-400 mt-2">Seu código de afiliado:</p>
              <p className="font-mono font-bold text-xl text-terra-600 dark:text-terra-400 mt-1">{referralCode}</p>
            </div>
            <div className="flex items-center gap-2 p-3 bg-sand-50 dark:bg-sand-700 rounded-xl mb-6 border border-sand-200 dark:border-sand-600">
              <Link2 size={16} className="text-terra-500 flex-shrink-0" />
              <span className="text-sm text-sand-700 dark:text-sand-300 flex-1 truncate font-mono">duna.com/#/parceiro/{referralCode}</span>
              <button onClick={copyLink} className="p-2 hover:bg-sand-200 dark:hover:bg-sand-600 rounded-lg transition-colors"><Copy size={14} /></button>
            </div>
            <button onClick={() => navigate('/afiliados/painel')} className="w-full py-3.5 bg-sand-900 dark:bg-sand-100 hover:bg-sand-800 dark:hover:bg-sand-200 text-white dark:text-sand-900 font-semibold rounded-xl transition-colors btn-press">
              Acessar Painel do Afiliado
            </button>
          </motion.div>
        )}
      </section>
    </div>
  );
}
