import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, Home, Calendar, Users, DollarSign, CheckCircle, XCircle, Clock, Plus, Eye, EyeOff, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, parseISO, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EmptyState } from '../components/EmptyState';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function AdminPanel() {
  const { properties, bookings, affiliates, withdrawals, updateWithdrawalStatus, updateProperty, login, currentUser, realEstates, affiliateConversions } = useApp();
  const [tab, setTab] = useState<'dashboard' | 'properties' | 'bookings' | 'affiliates'>('dashboard');
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  // Auto-login as real estate or admin
  if (!currentUser || (currentUser.role !== 'realEstate' && currentUser.role !== 'admin')) {
    login('contato@costanorte.com', 'realEstate');
  }

  const isAdmin = currentUser?.role === 'admin';
  const myProperties = properties.filter(p => p.realEstateId === 're-1'); // Simulated for demo
  const myBookings = bookings.filter(b => myProperties.some(p => p.id === b.propertyId));
  const allBookings = isAdmin ? bookings : myBookings;

  // Dashboard stats
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading font-bold text-2xl text-sand-900 dark:text-sand-100">
            {isAdmin ? 'Painel Administrativo' : 'Painel da Imobiliária'}
          </h1>
          <p className="text-sm text-sand-500">Temporada Duna — Gerencie seus imóveis e reservas</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-sand-100 dark:bg-sand-800 rounded-xl p-1 mb-8 overflow-x-auto">
        {[
          { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { key: 'properties', label: 'Imóveis', icon: Home },
          { key: 'bookings', label: 'Reservas', icon: Calendar },
          ...(isAdmin ? [{ key: 'affiliates', label: 'Afiliados', icon: Users }] : []),
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${tab === t.key ? 'bg-white dark:bg-sand-700 text-sand-900 dark:text-sand-100 shadow-sm' : 'text-sand-500 hover:text-sand-700 dark:hover:text-sand-300'}`}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {tab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Receita do mês', value: `R$ ${monthRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
              { label: 'Imóveis ativos', value: `${activeProperties}/${totalProperties}`, icon: Home, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
              { label: 'Taxa de ocupação', value: `${occupancyRate}%`, icon: TrendingUp, color: 'text-terra-500', bg: 'bg-terra-100 dark:bg-terra-900/30' },
              { label: 'Reservas do mês', value: monthBookings.length.toString(), icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white dark:bg-sand-800 rounded-xl border border-sand-200 dark:border-sand-700 p-4">
                <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                  <stat.icon size={18} className={stat.color} />
                </div>
                <p className="text-xs text-sand-500">{stat.label}</p>
                <p className="text-xl font-bold text-sand-900 dark:text-sand-100">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6">
            <h3 className="font-heading font-semibold text-sand-900 dark:text-sand-100 mb-4">Receita semanal</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Array.from({ length: 7 }, (_, i) => ({ day: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i], revenue: Math.random() * 2000 + 500 }))}>
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9a7d5e" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9a7d5e" />
                  <Tooltip contentStyle={{ background: '#2d1f14', border: 'none', borderRadius: '8px', color: '#f5efe8', fontSize: '12px' }} />
                  <Bar dataKey="revenue" fill="#c2703e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Arrivals */}
          <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6">
            <h3 className="font-heading font-semibold text-sand-900 dark:text-sand-100 mb-4">Próximas chegadas</h3>
            {upcomingArrivals.length === 0 ? (
              <p className="text-sm text-sand-500 text-center py-4">Nenhuma chegada programada.</p>
            ) : (
              <div className="space-y-3">
                {upcomingArrivals.map(b => {
                  const prop = properties.find(p => p.id === b.propertyId);
                  return (
                    <div key={b.id} className="flex items-center justify-between p-3 bg-sand-50 dark:bg-sand-700 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-sand-800 dark:text-sand-200">{prop?.title}</p>
                        <p className="text-xs text-sand-500">Check-in: {format(parseISO(b.checkIn), "dd/MM/yy")} — {b.guests} hóspede(s)</p>
                      </div>
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">Confirmada</span>
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
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-heading font-semibold text-lg text-sand-900 dark:text-sand-100">Meus Imóveis na Duna</h2>
            <button className="px-4 py-2 bg-terra-500 hover:bg-terra-600 text-white text-sm font-medium rounded-full transition-colors flex items-center gap-2">
              <Plus size={14} /> Publicar novo
            </button>
          </div>
          {myProperties.length === 0 ? (
            <EmptyState icon={Home} title="Nenhum imóvel publicado" description="Publique seu primeiro imóvel no marketplace Duna." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myProperties.map(p => (
                <div key={p.id} className="bg-white dark:bg-sand-800 rounded-xl border border-sand-200 dark:border-sand-700 overflow-hidden">
                  <div className="flex">
                    <img src={p.photos[0]} alt={p.title} className="w-24 h-24 object-cover" />
                    <div className="flex-1 p-3">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-medium text-sand-800 dark:text-sand-200 line-clamp-1">{p.title}</h4>
                        <button onClick={() => updateProperty(p.id, { isActive: !p.isActive })} className={`p-1 rounded ${p.isActive ? 'text-green-500' : 'text-sand-400'}`}>
                          {p.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                      </div>
                      <p className="text-xs text-sand-500 mt-0.5">{p.city} • R$ {p.pricePerNight}/noite</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${p.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-sand-100 text-sand-500 dark:bg-sand-700'}`}>
                          {p.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                        <span className="text-[10px] text-sand-400">{p.blockedDates.length} datas bloqueadas</span>
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
        <div className="space-y-4">
          <h2 className="font-heading font-semibold text-lg text-sand-900 dark:text-sand-100">Reservas Recebidas</h2>
          {allBookings.length === 0 ? (
            <EmptyState icon={Calendar} title="Nenhuma reserva" description="Quando hóspedes reservarem seus imóveis, as reservas aparecerão aqui." />
          ) : (
            <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-sand-200 dark:border-sand-700 bg-sand-50 dark:bg-sand-700/50">
                      <th className="text-left py-3 px-4 text-sand-500 font-medium">Imóvel</th>
                      <th className="text-left py-3 px-4 text-sand-500 font-medium">Hóspede</th>
                      <th className="text-left py-3 px-4 text-sand-500 font-medium">Período</th>
                      <th className="text-left py-3 px-4 text-sand-500 font-medium">Valor</th>
                      <th className="text-left py-3 px-4 text-sand-500 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBookings.map(b => {
                      const prop = properties.find(p => p.id === b.propertyId);
                      return (
                        <tr key={b.id} className="border-b border-sand-100 dark:border-sand-700/50">
                          <td className="py-3 px-4 text-sand-700 dark:text-sand-300 max-w-[200px] truncate">{prop?.title}</td>
                          <td className="py-3 px-4 text-sand-700 dark:text-sand-300">{b.guestId}</td>
                          <td className="py-3 px-4 text-sand-700 dark:text-sand-300">{format(parseISO(b.checkIn), 'dd/MM')} - {format(parseISO(b.checkOut), 'dd/MM')}</td>
                          <td className="py-3 px-4 font-medium text-sand-800 dark:text-sand-200">R$ {b.totalPrice}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              b.status === 'confirmed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                              b.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                              b.status === 'completed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
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

      {/* Affiliates Tab (Admin only) */}
      {tab === 'affiliates' && isAdmin && (
        <div className="space-y-6">
          <h2 className="font-heading font-semibold text-lg text-sand-900 dark:text-sand-100">Gestão de Afiliados</h2>
          
          {/* Withdrawal Requests */}
          <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6">
            <h3 className="font-heading font-semibold text-sand-900 dark:text-sand-100 mb-4">Solicitações de Saque</h3>
            {withdrawals.length === 0 ? (
              <p className="text-sm text-sand-500 text-center py-4">Nenhuma solicitação pendente.</p>
            ) : (
              <div className="space-y-3">
                {withdrawals.map(w => {
                  const aff = affiliates.find(a => a.id === w.affiliateId);
                  return (
                    <div key={w.id} className="flex items-center justify-between p-3 bg-sand-50 dark:bg-sand-700 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-sand-800 dark:text-sand-200">{aff?.name || 'Afiliado'}</p>
                        <p className="text-xs text-sand-500">R$ {w.amount.toFixed(2)} • {new Date(w.createdAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          w.status === 'requested' ? 'bg-amber-100 text-amber-700' :
                          w.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                          w.status === 'paid' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {w.status}
                        </span>
                        {w.status === 'requested' && (
                          <>
                            <button onClick={() => updateWithdrawalStatus(w.id, 'processing')} className="p-1 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"><CheckCircle size={14} /></button>
                            <button onClick={() => updateWithdrawalStatus(w.id, 'rejected')} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><XCircle size={14} /></button>
                          </>
                        )}
                        {w.status === 'processing' && (
                          <button onClick={() => updateWithdrawalStatus(w.id, 'paid')} className="p-1 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"><CheckCircle size={14} /></button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Affiliates List */}
          <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6">
            <h3 className="font-heading font-semibold text-sand-900 dark:text-sand-100 mb-4">Todos os Afiliados</h3>
            {affiliates.length === 0 ? (
              <p className="text-sm text-sand-500 text-center py-4">Nenhum afiliado cadastrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-sand-200 dark:border-sand-700">
                      <th className="text-left py-2 text-sand-500 font-medium">Nome</th>
                      <th className="text-left py-2 text-sand-500 font-medium">Código</th>
                      <th className="text-left py-2 text-sand-500 font-medium">Programa</th>
                      <th className="text-left py-2 text-sand-500 font-medium">Comissão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affiliates.map(a => (
                      <tr key={a.id} className="border-b border-sand-100 dark:border-sand-700/50">
                        <td className="py-3 text-sand-700 dark:text-sand-300">{a.name}</td>
                        <td className="py-3 font-mono text-xs text-sand-600 dark:text-sand-400">{a.referralCode}</td>
                        <td className="py-3 text-sand-600 dark:text-sand-400">{a.programA && 'B2B '}{a.programB && 'B2C'}</td>
                        <td className="py-3 text-sand-600 dark:text-sand-400">{a.commissionA}% / {a.commissionB}%</td>
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
