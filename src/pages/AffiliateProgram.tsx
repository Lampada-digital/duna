import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Users, Building2, Home, TrendingUp, Link2, Copy, CheckCircle, ArrowRight } from 'lucide-react';
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
    // Auto-login as affiliate
    login(email, 'affiliate');
  };

  const copyLink = (type: 'A' | 'B') => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/parceiro/${referralCode}`;
    navigator.clipboard.writeText(link);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-br from-terra-50 to-sand-100 dark:from-sand-900 dark:to-sand-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-terra-100 dark:bg-terra-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users size={32} className="text-terra-600 dark:text-terra-400" />
            </div>
            <h1 className="font-heading font-extrabold text-3xl md:text-5xl text-sand-900 dark:text-sand-100 mb-4">
              Programa de Afiliados <span className="text-terra-500">Duna</span>
            </h1>
            <p className="text-lg text-sand-600 dark:text-sand-400 max-w-2xl mx-auto">
              Ganhe comissões indicando imobiliárias e hóspedes para a plataforma Duna. Dois programas, uma única plataforma.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Two Programs */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Program A */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-8">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
              <Building2 size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-heading font-bold text-xl text-sand-900 dark:text-sand-100 mb-2">Programa B2B</h3>
            <p className="text-sm text-sand-600 dark:text-sand-400 mb-4">Indique imobiliárias para a plataforma Duna</p>
            <ul className="space-y-3 text-sm text-sand-700 dark:text-sand-300">
              <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" /> 20% de comissão recorrente sobre a mensalidade</li>
              <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" /> Comissão válida por 12 meses</li>
              <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" /> Link e código de indicação exclusivos</li>
              <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" /> Rastreamento por cookie (30 dias)</li>
            </ul>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Exemplo: Indique uma imobiliária que paga R$299/mês → Você ganha R$59,80/mês por 12 meses = R$717,60</p>
            </div>
          </motion.div>

          {/* Program B */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-8">
            <div className="w-12 h-12 bg-terra-100 dark:bg-terra-900/30 rounded-xl flex items-center justify-center mb-4">
              <Home size={24} className="text-terra-600 dark:text-terra-400" />
            </div>
            <h3 className="font-heading font-bold text-xl text-sand-900 dark:text-sand-100 mb-2">Programa B2C</h3>
            <p className="text-sm text-sand-600 dark:text-sand-400 mb-4">Indique hóspedes que reservam na Duna</p>
            <ul className="space-y-3 text-sm text-sand-700 dark:text-sand-300">
              <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" /> 15% da taxa de serviço (6%) de cada reserva</li>
              <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" /> Comissão sobre a primeira reserva do hóspede</li>
              <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" /> Link e código de indicação exclusivos</li>
              <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" /> Rastreamento por cookie (15 dias)</li>
            </ul>
            <div className="mt-6 p-4 bg-terra-50 dark:bg-terra-900/20 rounded-xl">
              <p className="text-xs text-terra-600 dark:text-terra-400 font-medium">Exemplo: Hóspede reserva R$2.000 → Taxa Duna R$120 → Sua comissão: R$18,00</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-sand-100 dark:bg-sand-800/50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-heading font-bold text-2xl text-sand-900 dark:text-sand-100 text-center mb-10">Como funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Cadastre-se', desc: 'Crie sua conta de afiliado gratuitamente' },
              { step: '2', title: 'Compartilhe', desc: 'Use seu link ou código exclusivo' },
              { step: '3', title: 'Converta', desc: 'Indicados se cadastram ou reservam' },
              { step: '4', title: 'Receba', desc: 'Comissões acumuladas e sacáveis' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="text-center">
                <div className="w-12 h-12 bg-terra-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">{item.step}</span>
                </div>
                <h4 className="font-heading font-semibold text-sand-900 dark:text-sand-100 mb-1">{item.title}</h4>
                <p className="text-xs text-sand-500 dark:text-sand-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="max-w-xl mx-auto px-4 sm:px-6 py-16">
        {!registered ? (
          <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-8">
            {!showForm ? (
              <div className="text-center">
                <h2 className="font-heading font-bold text-xl text-sand-900 dark:text-sand-100 mb-4">Pronto para começar?</h2>
                <p className="text-sm text-sand-600 dark:text-sand-400 mb-6">Cadastre-se gratuitamente e comece a ganhar comissões hoje mesmo.</p>
                <button onClick={() => setShowForm(true)} className="px-8 py-3 bg-terra-500 hover:bg-terra-600 text-white font-semibold rounded-full transition-colors flex items-center gap-2 mx-auto">
                  Cadastrar como Afiliado <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div>
                <h2 className="font-heading font-bold text-xl text-sand-900 dark:text-sand-100 mb-6">Cadastro de Afiliado</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-sand-700 dark:text-sand-300 block mb-1">Nome completo</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sand-700 dark:text-sand-300 block mb-1">E-mail</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sand-700 dark:text-sand-300 block mb-3">Programas</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 bg-sand-50 dark:bg-sand-700 rounded-xl cursor-pointer">
                        <input type="checkbox" checked={programA} onChange={(e) => setProgramA(e.target.checked)} className="rounded text-terra-500 focus:ring-terra-500" />
                        <div>
                          <span className="text-sm font-medium text-sand-800 dark:text-sand-200">Programa B2B</span>
                          <p className="text-xs text-sand-500">Indicar imobiliárias (20% recorrente)</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 bg-sand-50 dark:bg-sand-700 rounded-xl cursor-pointer">
                        <input type="checkbox" checked={programB} onChange={(e) => setProgramB(e.target.checked)} className="rounded text-terra-500 focus:ring-terra-500" />
                        <div>
                          <span className="text-sm font-medium text-sand-800 dark:text-sand-200">Programa B2C</span>
                          <p className="text-xs text-sand-500">Indicar hóspedes (15% da taxa)</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  <button onClick={handleRegister} disabled={!name || !email} className="w-full py-3 bg-terra-500 hover:bg-terra-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors">
                    Criar conta de afiliado
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h2 className="font-heading font-bold text-xl text-sand-900 dark:text-sand-100">Cadastro realizado!</h2>
              <p className="text-sm text-sand-600 dark:text-sand-400 mt-2">Seu código de afiliado: <span className="font-mono font-bold text-terra-600">{referralCode}</span></p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-sand-50 dark:bg-sand-700 rounded-xl">
                <Link2 size={16} className="text-terra-500" />
                <span className="text-sm text-sand-700 dark:text-sand-300 flex-1 truncate">{window.location.origin}/parceiro/{referralCode}</span>
                <button onClick={() => copyLink('B')} className="p-1.5 hover:bg-sand-200 dark:hover:bg-sand-600 rounded-lg"><Copy size={14} /></button>
              </div>
            </div>
            <button onClick={() => navigate('/afiliados/painel')} className="w-full mt-6 py-3 bg-terra-500 hover:bg-terra-600 text-white font-semibold rounded-xl transition-colors">
              Acessar Painel do Afiliado
            </button>
          </motion.div>
        )}
      </section>
    </div>
  );
}
