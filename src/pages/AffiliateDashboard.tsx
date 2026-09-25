import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Link2, Copy, TrendingUp, DollarSign, Users, MousePointer, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function AffiliateDashboard() {
  const { affiliates, currentUser, affiliateClicks, affiliateConversions, withdrawals, requestWithdrawal, login } = useApp();
  const navigate = useNavigate();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Find or create affiliate for current user
  let affiliate = affiliates.find(a => a.email === currentUser?.email);
  if (!affiliate && currentUser) {
    login(currentUser.email, 'affiliate');
  }
  affiliate = affiliates.find(a => a.email === currentUser?.email);

  if (!affiliate) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in">
        <h1 className="text-2xl font-bold text-sand-800 dark:text-sand-200 mb-4">Acesso restrito</h1>
        <p className="text-sand-500 mb-6">Você precisa ser um afiliado cadastrado para acessar o painel.</p>
        <button onClick={() => navigate('/afiliados')} className="px-6 py-2 bg-terra-500 text-white rounded-full">Cadastrar como Afiliado</button>
      </div>
    );
  }

  const myClicks = affiliateClicks.filter(c => c.affiliateId === affiliate.id);
  const myConversions = affiliateConversions.filter(c => c.affiliateId === affiliate.id);
  const myWithdrawals = withdrawals.filter(w => w.affiliateId === affiliate.id);

  const pendingAmount = myConversions.filter(c => c.status === 'pending').reduce((s, c) => s + c.amount, 0);
  const releasedAmount = myConversions.filter(c => c.status === 'released').reduce((s, c) => s + c.amount, 0);
  const paidAmount = myConversions.filter(c => c.status === 'paid').reduce((s, c) => s + c.amount, 0);
  const totalEarned = pendingAmount + releasedAmount + paidAmount;

  // Chart data (last 7 days)
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

  const referralLink = `${window.location.origin}/parceiro/${affiliate.referralCode}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading font-bold text-2xl text-sand-900 dark:text-sand-100">Painel do Afiliado</h1>
          <p className="text-sm text-sand-500">Olá, {affiliate.name}! Código: <span className="font-mono font-bold text-terra-600">{affiliate.referralCode}</span></p>
        </div>
        <button onClick={() => setShowWithdrawModal(true)} disabled={releasedAmount <= 0} className="px-6 py-2.5 bg-terra-500 hover:bg-terra-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-full transition-colors flex items-center gap-2">
          <DollarSign size={16} /> Solicitar Saque
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: MousePointer, label: 'Cliques', value: myClicks.length, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
          { icon: Users, label: 'Conversões', value: myConversions.length, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
          { icon: Clock, label: 'Pendente', value: `R$ ${pendingAmount.toFixed(2)}`, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
          { icon: DollarSign, label: 'Liberado', value: `R$ ${releasedAmount.toFixed(2)}`, color: 'text-terra-500', bg: 'bg-terra-100 dark:bg-terra-900/30' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white dark:bg-sand-800 rounded-xl border border-sand-200 dark:border-sand-700 p-4">
            <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <p className="text-xs text-sand-500 dark:text-sand-400">{stat.label}</p>
            <p className="text-lg font-bold text-sand-900 dark:text-sand-100">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Referral Link */}
      <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 mb-8">
        <h3 className="font-heading font-semibold text-sand-900 dark:text-sand-100 mb-3 flex items-center gap-2">
          <Link2 size={18} className="text-terra-500" /> Seu link de indicação
        </h3>
        <div className="flex items-center gap-2 p-3 bg-sand-50 dark:bg-sand-700 rounded-xl">
          <span className="text-sm text-sand-700 dark:text-sand-300 flex-1 truncate font-mono">{referralLink}</span>
          <button onClick={() => navigator.clipboard.writeText(referralLink)} className="p-2 hover:bg-sand-200 dark:hover:bg-sand-600 rounded-lg transition-colors">
            <Copy size={16} className="text-sand-500" />
          </button>
        </div>
        <p className="text-xs text-sand-500 mt-2">Compartilhe este link. Quando alguém acessar e se cadastrar/reservar, você ganha comissão!</p>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 mb-8">
        <h3 className="font-heading font-semibold text-sand-900 dark:text-sand-100 mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-terra-500" /> Desempenho (últimos 7 dias)
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c2703e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c2703e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9a7d5e" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9a7d5e" />
              <Tooltip contentStyle={{ background: '#2d1f14', border: 'none', borderRadius: '8px', color: '#f5efe8', fontSize: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#c2703e" fill="url(#colorRevenue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversions Table */}
      <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 mb-8">
        <h3 className="font-heading font-semibold text-sand-900 dark:text-sand-100 mb-4">Conversões</h3>
        {myConversions.length === 0 ? (
          <p className="text-sm text-sand-500 text-center py-8">Nenhuma conversão ainda. Compartilhe seu link para começar!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sand-200 dark:border-sand-700">
                  <th className="text-left py-2 text-sand-500 font-medium">Data</th>
                  <th className="text-left py-2 text-sand-500 font-medium">Tipo</th>
                  <th className="text-left py-2 text-sand-500 font-medium">Valor</th>
                  <th className="text-left py-2 text-sand-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {myConversions.map(c => (
                  <tr key={c.id} className="border-b border-sand-100 dark:border-sand-700/50">
                    <td className="py-3 text-sand-700 dark:text-sand-300">{new Date(c.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3 text-sand-700 dark:text-sand-300">{c.type === 'realEstate_signup' ? 'Imobiliária' : 'Reserva'}</td>
                    <td className="py-3 font-medium text-sand-800 dark:text-sand-200">R$ {c.amount.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        c.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                        c.status === 'released' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
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
      <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6">
        <h3 className="font-heading font-semibold text-sand-900 dark:text-sand-100 mb-4">Histórico de Saques</h3>
        {myWithdrawals.length === 0 ? (
          <p className="text-sm text-sand-500 text-center py-4">Nenhum saque solicitado ainda.</p>
        ) : (
          <div className="space-y-3">
            {myWithdrawals.map(w => (
              <div key={w.id} className="flex items-center justify-between p-3 bg-sand-50 dark:bg-sand-700 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-sand-800 dark:text-sand-200">R$ {w.amount.toFixed(2)}</p>
                  <p className="text-xs text-sand-500">{new Date(w.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  w.status === 'requested' ? 'bg-amber-100 text-amber-700' :
                  w.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                  w.status === 'paid' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowWithdrawModal(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-sand-800 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="font-heading font-semibold text-lg text-sand-900 dark:text-sand-100 mb-4">Solicitar Saque</h3>
            <div className="bg-sand-50 dark:bg-sand-700 rounded-xl p-4 mb-4">
              <p className="text-xs text-sand-500">Valor disponível para saque</p>
              <p className="text-2xl font-bold text-terra-600 dark:text-terra-400">R$ {releasedAmount.toFixed(2)}</p>
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-sand-700 dark:text-sand-300 block mb-1">Valor do saque</label>
              <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} max={releasedAmount} step="0.01" className="w-full px-4 py-2.5 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200" />
            </div>
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl mb-4">
              <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400">O pagamento será processado em até 5 dias úteis após aprovação.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowWithdrawModal(false)} className="flex-1 py-2 bg-sand-100 dark:bg-sand-700 text-sand-700 dark:text-sand-300 font-medium rounded-xl">Cancelar</button>
              <button onClick={handleWithdraw} disabled={!withdrawAmount || parseFloat(withdrawAmount) > releasedAmount} className="flex-1 py-2 bg-terra-500 hover:bg-terra-600 disabled:opacity-50 text-white font-medium rounded-xl transition-colors">Confirmar</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
