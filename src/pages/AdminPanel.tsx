import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, Home, Calendar, Users, DollarSign, CheckCircle, XCircle, Plus, Eye, EyeOff, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, parseISO, isAfter } from 'date-fns';
import { EmptyState } from '../components/EmptyState';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function AdminPanel() {
  const { properties, bookings, affiliates, withdrawals, updateWithdrawalStatus, updateProperty, login, currentUser } = useApp();
  const [tab, setTab] = useState<'dashboard' | 'properties' | 'bookings' | 'affiliates'>('dashboard');

  if (!currentUser || (currentUser.role !== 'realEstate' && currentUser.role !== 'admin')) {
    login('contato@costanorte.com', 'realEstate');
  }

  const isAdmin = currentUser?.role === 'admin';
  const myProperties = properties.filter(p => p.realEstateId === 're-1');
  const allBookings = isAdmin ? bookings : bookings.filter(b => myProperties.some(p => p.id === b.propertyId));

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const monthBookings = allBookings.filter(b => {
    const d = new Date(b.createdAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear && b.status !== 'cancelled';
  });
  const monthRevenue = monthBookings.reduce((s, b) => s + b.nightlyTotal, 0);
  const totalProperties = myProperties.length;
  const activeProperties = myProperties.filter(p => p.isActive).length;
  const occupancyRate = totalProperties > 0 ? Math.round((myProperties.filter(p => p.blockedDates.length > 0).length / totalProperties) * 100) : 0;

  const upcomingArrivals = allBookings.filter(b => b.status === 'confirmed' && isAfter(parseISO(b.checkIn), now)).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12 animate-fade-in">
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-sand-900 dark:text-sand-50">
          {isAdmin ? 'Painel Administrativo' : 'Painel da Imobiliária'}
        </h1>
        <p className="text-sand-500 mt-1">Temporada Duna — Gerencie seus imóveis e reservas</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-sand-200 dark:border-sand-800 mb-8 overflow-x-auto no-scrollbar">
        {[
          { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { key: 'properties', label: 'Imóveis', icon: Home },
          { key: 'bookings', label: 'Reservas', icon: Calendar },
          ...(isAdmin ? [{ key: 'affiliates', label: 'Afiliados', icon: Users }] : []),
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)} className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${tab === t.key ? 'border-sand-900 dark:border-sand-100 text-sand-900 dark:text-sand-100' : 'border-transparent text-sand-500 hover:text-sand-700 dark:hover:text-sand-300'}`}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {tab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Receita do mês', value: `R$ ${monthRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
              { label: 'Imóveis ativos', value: `${activeProperties}/${totalProperties}`, icon: Home, color: 'text-duna-500', bg: 'bg-duna-100 dark:bg-duna-900/30' },
              { label: 'Ocupação', value: `${occupancyRate}%`, icon: TrendingUp, color: 'text-terra-500', bg: 'bg-terra-100 dark:bg-terra-900/30' },
              { label: 'Reservas', value: monthBookings.length.toString(), icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
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

          {/* Revenue Chart */}
          <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 card-shadow">
            <h3 className="font-heading font-bold text-sand-900 dark:text-sand-100 mb-4">Receita semanal</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Array.from({ length: 7 }, (_, i) => ({ day: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i], revenue: Math.round(Math.random() * 2000 + 500) }))}>
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9a7650" axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9a7650" axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#3d2b1c', border: 'none', borderRadius: '12px', color: '#f9f4ec', fontSize: '12px', padding: '8px 12px' }} />
                  <Bar dataKey="revenue" fill="#e8622a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Arrivals */}
          <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 card-shadow">
            <h3 className="font-heading font-bold text-sand-900 dark:text-sand-100 mb-4">Próximas chegadas</h3>
            {upcomingArrivals.length === 0 ? (
              <p className="text-sm text-sand-500 text-center py-6">Nenhuma chegada programada.</p>
            ) : (
              <div className="space-y-3">
                {upcomingArrivals.map(b => {
                  const prop = properties.find(p => p.id === b.propertyId);
                  return (
                    <div key={b.id} className="flex items-center justify-between p-4 bg-sand-50 dark:bg-sand-700 rounded-xl">
                      <div className="flex items-center gap-3">
                        <img src={prop?.photos[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-semibold text-sand-900 dark:text-sand-100">{prop?.title}</p>
                          <p className="text-xs text-sand-500">Check-in: {format(parseISO(b.checkIn), "dd/MM/yy")} · {b.guests} hóspede(s)</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">Confirmada</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Properties Tab */}
      {tab === 'properties' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-heading font-bold text-lg text-sand-900 dark:text-sand-100">Meus Imóveis na Duna</h2>
            <button className="px-5 py-2.5 bg-sand-900 dark:bg-sand-100 hover:bg-sand-800 dark:hover:bg-sand-200 text-white dark:text-sand-900 text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 btn-press">
              <Plus size={14} /> Publicar novo
            </button>
          </div>
          {myProperties.length === 0 ? (
            <EmptyState icon={Home} title="Nenhum imóvel publicado" description="Publique seu primeiro imóvel no marketplace Duna." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myProperties.map(p => (
                <div key={p.id} className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 overflow-hidden card-shadow">
                  <div className="flex">
                    <img src={p.photos[0]} alt={p.title} className="w-28 h-28 object-cover" />
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-semibold text-sand-900 dark:text-sand-100 line-clamp-1">{p.title}</h4>
                        <button onClick={() => updateProperty(p.id, { isActive: !p.isActive })} className={`p-1.5 rounded-lg transition-colors ${p.isActive ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-sand-400 hover:bg-sand-100 dark:hover:bg-sand-700'}`}>
                          {p.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                      </div>
                      <p className="text-xs text-sand-500 mt-1">{p.city} · R$ {p.pricePerNight}/noite</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-sand-100 text-sand-500 dark:bg-sand-700'}`}>
                          {p.isActive ? '● Ativo' : '○ Inativo'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {tab === 'bookings' && (
        <div className="space-y-6">
          <h2 className="font-heading font-bold text-lg text-sand-900 dark:text-sand-100">Reservas Recebidas</h2>
          {allBookings.length === 0 ? (
            <EmptyState icon={Calendar} title="Nenhuma reserva" description="Quando hóspedes reservarem seus imóveis, as reservas aparecerão aqui." />
          ) : (
            <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 overflow-hidden card-shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-sand-200 dark:border-sand-700 bg-sand-50 dark:bg-sand-700/50">
                      <th className="text-left py-3 px-5 text-xs font-bold uppercase tracking-wider text-sand-500">Imóvel</th>
                      <th className="text-left py-3 px-5 text-xs font-bold uppercase tracking-wider text-sand-500">Período</th>
                      <th className="text-left py-3 px-5 text-xs font-bold uppercase tracking-wider text-sand-500">Valor</th>
                      <th className="text-left py-3 px-5 text-xs font-bold uppercase tracking-wider text-sand-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBookings.map(b => {
                      const prop = properties.find(p => p.id === b.propertyId);
                      return (
                        <tr key={b.id} className="border-b border-sand-100 dark:border-sand-700/50">
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <img src={prop?.photos[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                              <span className="text-sand-800 dark:text-sand-200 font-medium max-w-[200px] truncate">{prop?.title}</span>
                            </div>
                          </td>
                          <td className="py-4 px-5 text-sand-600 dark:text-sand-400">{format(parseISO(b.checkIn), 'dd/MM')} - {format(parseISO(b.checkOut), 'dd/MM')}</td>
                          <td className="py-4 px-5 font-bold text-sand-900 dark:text-sand-100">R$ {b.totalPrice}</td>
                          <td className="py-4 px-5">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              b.status === 'confirmed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                              b.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                              b.status === 'completed' ? 'bg-duna-100 dark:bg-duna-900/30 text-duna-700 dark:text-duna-400' :
                              'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                            }`}>
                              {b.status === 'confirmed' ? 'Confirmada' : b.status === 'cancelled' ? 'Cancelada' : b.status === 'completed' ? 'Concluída' : 'Pendente'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Affiliates Tab */}
      {tab === 'affiliates' && isAdmin && (
        <div className="space-y-8">
          <h2 className="font-heading font-bold text-lg text-sand-900 dark:text-sand-100">Gestão de Afiliados</h2>

          {/* Withdrawal Requests */}
          <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 card-shadow">
            <h3 className="font-heading font-bold text-sand-900 dark:text-sand-100 mb-4">Solicitações de Saque</h3>
            {withdrawals.length === 0 ? (
              <p className="text-sm text-sand-500 text-center py-6">Nenhuma solicitação pendente.</p>
            ) : (
              <div className="space-y-3">
                {withdrawals.map(w => {
                  const aff = affiliates.find(a => a.id === w.affiliateId);
                  return (
                    <div key={w.id} className="flex items-center justify-between p-4 bg-sand-50 dark:bg-sand-700 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-sand-900 dark:text-sand-100">{aff?.name || 'Afiliado'}</p>
                        <p className="text-xs text-sand-500">R$ {w.amount.toFixed(2)} · {new Date(w.createdAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          w.status === 'requested' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          w.status === 'processing' ? 'bg-duna-100 text-duna-700 dark:bg-duna-900/30 dark:text-duna-400' :
                          w.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {w.status}
                        </span>
                        {w.status === 'requested' && (
                          <>
                            <button onClick={() => updateWithdrawalStatus(w.id, 'processing')} className="p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"><CheckCircle size={16} /></button>
                            <button onClick={() => updateWithdrawalStatus(w.id, 'rejected')} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><XCircle size={16} /></button>
                          </>
                        )}
                        {w.status === 'processing' && (
                          <button onClick={() => updateWithdrawalStatus(w.id, 'paid')} className="p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"><CheckCircle size={16} /></button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Affiliates List */}
          <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 card-shadow">
            <h3 className="font-heading font-bold text-sand-900 dark:text-sand-100 mb-4">Todos os Afiliados</h3>
            {affiliates.length === 0 ? (
              <p className="text-sm text-sand-500 text-center py-6">Nenhum afiliado cadastrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-sand-200 dark:border-sand-700">
                      <th className="text-left py-3 text-xs font-bold uppercase tracking-wider text-sand-500">Nome</th>
                      <th className="text-left py-3 text-xs font-bold uppercase tracking-wider text-sand-500">Código</th>
                      <th className="text-left py-3 text-xs font-bold uppercase tracking-wider text-sand-500">Programa</th>
                      <th className="text-left py-3 text-xs font-bold uppercase tracking-wider text-sand-500">Comissão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affiliates.map(a => (
                      <tr key={a.id} className="border-b border-sand-100 dark:border-sand-700/50">
                        <td className="py-3.5 text-sand-800 dark:text-sand-200 font-medium">{a.name}</td>
                        <td className="py-3.5 font-mono text-xs text-sand-600 dark:text-sand-400">{a.referralCode}</td>
                        <td className="py-3.5 text-sand-600 dark:text-sand-400">{a.programA && 'B2B '}{a.programB && 'B2C'}</td>
                        <td className="py-3.5 text-sand-600 dark:text-sand-400">{a.commissionA}% / {a.commissionB}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
