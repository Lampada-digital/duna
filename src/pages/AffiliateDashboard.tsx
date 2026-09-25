import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Link2, Copy, TrendingUp, DollarSign, Users, MousePointer, CheckCircle, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function AffiliateDashboard() {
  const { affiliates, currentUser, affiliateClicks, affiliateConversions, withdrawals, requestWithdrawal, login } = useApp();
  const navigate = useNavigate();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  let affiliate = affiliates.find(a => a.email === currentUser?.email);
  if (!affiliate && currentUser) {
    login(currentUser.email, 'affiliate');
  }
  affiliate = affiliates.find(a => a.email === currentUser?.email);

  if (!affiliate) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-sand-900 dark:text-sand-100 mb-4">Acesso restrito</h1>
        <p className="text-sand-500 mb-6">Você precisa ser um afiliado cadastrado para acessar o painel.</p>
        <button onClick={() => navigate('/afiliados')} className="px-6 py-3 bg-terra-500 text-white rounded-xl font-semibold">Cadastrar como Afiliado</button>
      </div>
    );
  }

  const myClicks = affiliateClicks.filter(c => c.affiliateId === affiliate.id);
  const myConversions = affiliateConversions.filter(c => c.affiliateId === affiliate.id);
  const myWithdrawals = withdrawals.filter(w => w.affiliateId === affiliate.id);

  const pendingAmount = myConversions.filter(c => c.status === 'pending').reduce((s, c) => s + c.amount, 0);
  const releasedAmount = myConversions.filter(c => c.status === 'released').reduce((s, c) => s + c.amount, 0);
  const paidAmount = myConversions.filter(c => c.status === 'paid').reduce((s, c) => s + c.amount, 0);

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const dayClicks = myClicks.filter(c => c.timestamp.startsWith(dateStr)).length;
    const dayConversions = myConversions.filter(c => c.createdAt.startsWith(dateStr)).reduce((s, c) => s + c.amount, 0);
    return { day: date.toLocaleDateString('pt-BR', { weekday: 'short' }), clicks: dayClicks, revenue: dayConversions };
  });

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= releasedAmount) {
      requestWithdrawal(affiliate.id, amount);
      setShowWithdrawModal(false);
      setWithdrawAmount('');
    }
  };

  const referralLink = `${window.location.origin}/#/parceiro/${affiliate.referralCode}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-sand-900 dark:text-sand-50">Painel do Afiliado</h1>
          <p className="text-sand-500 mt-1">Olá, {affiliate.name} 👋</p>
        </div>
        <button onClick={() => setShowWithdrawModal(true)} disabled={releasedAmount <= 0} className="px-6 py-3 bg-sand-900 dark:bg-sand-100 hover:bg-sand-800 dark:hover:bg-sand-200 disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-sand-900 font-semibold rounded-xl transition-colors flex items-center gap-2 btn-press">
          <DollarSign size={16} /> Solicitar Saque
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: MousePointer, label: 'Cliques', value: myClicks.length, color: 'text-duna-500', bg: 'bg-duna-100 dark:bg-duna-900/30' },
          { icon: Users, label: 'Conversões', value: myConversions.length, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
          { icon: Clock, label: 'Pendente', value: `R$ ${pendingAmount.toFixed(0)}`, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
          { icon: DollarSign, label: 'Disponível', value: `R$ ${releasedAmount.toFixed(0)}`, color: 'text-terra-500', bg: 'bg-terra-100 dark:bg-terra-900/30' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-5 card-shadow">
            <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="text-xs font-medium text-sand-500">{stat.label}</p>
            <p className="text-2xl font-bold text-sand-900 dark:text-sand-100 mt-0.5">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Referral Link */}
      <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 mb-8 card-shadow">
        <h3 className="font-heading font-bold text-sand-900 dark:text-sand-100 mb-3 flex items-center gap-2">
          <Link2 size={18} className="text-terra-500" /> Seu link de indicação
        </h3>
        <div className="flex items-center gap-2 p-3 bg-sand-50 dark:bg-sand-700 rounded-xl border border-sand-200 dark:border-sand-600">
          <span className="text-sm text-sand-700 dark:text-sand-300 flex-1 truncate font-mono">{referralLink}</span>
          <button onClick={() => navigator.clipboard.writeText(referralLink)} className="p-2.5 hover:bg-sand-200 dark:hover:bg-sand-600 rounded-lg transition-colors">
            <Copy size={16} className="text-sand-500" />
          </button>
        </div>
        <p className="text-xs text-sand-500 mt-3">Compartilhe este link. Quando alguém acessar e se cadastrar/reservar, você ganha comissão!</p>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 mb-8 card-shadow">
        <h3 className="font-heading font-bold text-sand-900 dark:text-sand-100 mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-terra-500" /> Desempenho (últimos 7 dias)
        </h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e8622a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e8622a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9a7650" axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} stroke="#9a7650" axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#3d2b1c', border: 'none', borderRadius: '12px', color: '#f9f4ec', fontSize: '12px', padding: '8px 12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#e8622a" fill="url(#colorRevenue)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversions */}
      <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 mb-8 card-shadow">
        <h3 className="font-heading font-bold text-sand-900 dark:text-sand-100 mb-4">Conversões recentes</h3>
        {myConversions.length === 0 ? (
          <p className="text-sm text-sand-500 text-center py-8">Nenhuma conversão ainda. Compartilhe seu link para começar!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sand-200 dark:border-sand-700">
                  <th className="text-left py-3 text-xs font-bold uppercase tracking-wider text-sand-500">Data</th>
                  <th className="text-left py-3 text-xs font-bold uppercase tracking-wider text-sand-500">Tipo</th>
                  <th className="text-left py-3 text-xs font-bold uppercase tracking-wider text-sand-500">Valor</th>
                  <th className="text-left py-3 text-xs font-bold uppercase tracking-wider text-sand-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {myConversions.map(c => (
                  <tr key={c.id} className="border-b border-sand-100 dark:border-sand-700/50">
                    <td className="py-3.5 text-sand-700 dark:text-sand-300">{new Date(c.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3.5 text-sand-700 dark:text-sand-300">{c.type === 'realEstate_signup' ? 'Imobiliária' : 'Reserva'}</td>
                    <td className="py-3.5 font-bold text-sand-900 dark:text-sand-100">R$ {c.amount.toFixed(2)}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        c.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                        c.status === 'released' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        'bg-duna-100 dark:bg-duna-900/30 text-duna-700 dark:text-duna-400'
                      }`}>
                        {c.status === 'pending' ? 'Pendente' : c.status === 'released' ? 'Liberado' : 'Pago'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Withdrawals */}
      <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 card-shadow">
        <h3 className="font-heading font-bold text-sand-900 dark:text-sand-100 mb-4">Histórico de Saques</h3>
        {myWithdrawals.length === 0 ? (
          <p className="text-sm text-sand-500 text-center py-6">Nenhum saque solicitado ainda.</p>
        ) : (
          <div className="space-y-3">
            {myWithdrawals.map(w => (
              <div key={w.id} className="flex items-center justify-between p-4 bg-sand-50 dark:bg-sand-700 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-sand-900 dark:text-sand-100">R$ {w.amount.toFixed(2)}</p>
                  <p className="text-xs text-sand-500">{new Date(w.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  w.status === 'requested' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                  w.status === 'processing' ? 'bg-duna-100 text-duna-700 dark:bg-duna-900/30 dark:text-duna-400' :
                  w.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {w.status === 'requested' ? 'Solicitado' : w.status === 'processing' ? 'Processando' : w.status === 'paid' ? 'Pago' : 'Rejeitado'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowWithdrawModal(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-sand-800 rounded-2xl p-6 md:p-8 w-full max-w-md card-shadow" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl font-bold text-sand-900 dark:text-sand-100 mb-5">Solicitar Saque</h3>
            <div className="bg-gradient-to-br from-terra-50 to-sand-100 dark:from-terra-900/20 dark:to-sand-700 rounded-xl p-5 mb-5 border border-terra-200 dark:border-terra-800">
              <p className="text-xs font-bold uppercase tracking-wider text-sand-500">Disponível para saque</p>
              <p className="text-3xl font-bold text-terra-600 dark:text-terra-400 mt-1">R$ {releasedAmount.toFixed(2)}</p>
            </div>
            <div className="mb-5">
              <label className="text-xs font-bold uppercase tracking-wider text-sand-500 block mb-2">Valor do saque</label>
              <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} max={releasedAmount} step="0.01" placeholder="0,00" className="w-full px-4 py-3 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200" />
            </div>
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl mb-5 border border-amber-200 dark:border-amber-800">
              <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400">O pagamento será processado em até 5 dias úteis após aprovação.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowWithdrawModal(false)} className="flex-1 py-3 border border-sand-300 dark:border-sand-600 text-sand-700 dark:text-sand-300 font-semibold rounded-xl hover:bg-sand-50 dark:hover:bg-sand-700 transition-colors">Cancelar</button>
              <button onClick={handleWithdraw} disabled={!withdrawAmount || parseFloat(withdrawAmount) > releasedAmount} className="flex-1 py-3 bg-terra-500 hover:bg-terra-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors btn-press">Confirmar saque</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
