import { useApp } from '../context/AppContext';
import { Award, Star, TrendingUp, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

export function Loyalty() {
  const { loyalty, currentUser } = useApp();

  const getLevelInfo = (level: string) => {
    switch (level) {
      case 'bronze':
        return { color: 'from-amber-600 to-amber-800', icon: '🥉', nextLevel: 'silver', nextThreshold: 500 };
      case 'silver':
        return { color: 'from-gray-400 to-gray-600', icon: '🥈', nextLevel: 'gold', nextThreshold: 2000 };
      case 'gold':
        return { color: 'from-yellow-400 to-yellow-600', icon: '🥇', nextLevel: 'platinum', nextThreshold: 5000 };
      case 'platinum':
        return { color: 'from-purple-400 to-purple-600', icon: '💎', nextLevel: null, nextThreshold: null };
      default:
        return { color: 'from-amber-600 to-amber-800', icon: '🥉', nextLevel: 'silver', nextThreshold: 500 };
    }
  };

  const levelInfo = loyalty ? getLevelInfo(loyalty.level) : getLevelInfo('bronze');
  const progress = loyalty && levelInfo.nextThreshold 
    ? Math.min((loyalty.points / levelInfo.nextThreshold) * 100, 100)
    : 100;

  const benefits = {
    bronze: ['Reservas prioritárias', 'Suporte básico'],
    silver: ['Tudo do Bronze', 'Desconto de 5%', 'Check-in antecipado'],
    gold: ['Tudo do Prata', 'Desconto de 10%', 'Upgrade grátis', 'Late check-out'],
    platinum: ['Tudo do Ouro', 'Desconto de 15%', 'Reserva exclusiva', 'Concierge 24h', 'Acesso a eventos'],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-sand-900 dark:text-sand-50">Programa de Fidelidade</h1>
        <p className="text-sand-500 mt-1">Ganhe pontos e desbloqueie benefícios exclusivos</p>
      </div>

      {!loyalty ? (
        <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-8 text-center card-shadow">
          <Award size={48} className="mx-auto text-terra-500 mb-4" />
          <h2 className="font-display text-2xl font-bold text-sand-900 dark:text-sand-100 mb-2">
            Você ainda não faz parte
          </h2>
          <p className="text-sand-600 dark:text-sand-400 mb-6">
            Faça sua primeira reserva para começar a acumular pontos e desbloquear benefícios!
          </p>
          <div className="bg-sand-50 dark:bg-sand-700 rounded-xl p-6 text-left">
            <h3 className="font-heading font-bold text-sand-900 dark:text-sand-100 mb-3">Como funciona:</h3>
            <ul className="space-y-2 text-sm text-sand-600 dark:text-sand-400">
              <li className="flex items-start gap-2">
                <Star size={16} className="text-terra-500 mt-0.5 flex-shrink-0" />
                <span>Ganhe <strong>10 pontos</strong> a cada R$ 1 gasto</span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp size={16} className="text-terra-500 mt-0.5 flex-shrink-0" />
                <span>Suba de nível conforme acumula pontos</span>
              </li>
              <li className="flex items-start gap-2">
                <Gift size={16} className="text-terra-500 mt-0.5 flex-shrink-0" />
                <span>Desbloqueie descontos e benefícios exclusivos</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Level Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${levelInfo.color} rounded-2xl p-8 text-white shadow-xl`}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm opacity-90 mb-1">Seu nível</p>
                <h2 className="font-display text-3xl font-bold capitalize">{loyalty.level}</h2>
                <p className="text-sm opacity-90 mt-2">
                  Membro desde {new Date(loyalty.joinedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="text-6xl">{levelInfo.icon}</div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="opacity-90">{loyalty.points} pontos</span>
                  {levelInfo.nextThreshold && (
                    <span className="opacity-90">{levelInfo.nextThreshold - loyalty.points} para {levelInfo.nextLevel}</span>
                  )}
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                <div>
                  <p className="text-xs opacity-75">Total de reservas</p>
                  <p className="text-2xl font-bold">{loyalty.totalBookings}</p>
                </div>
                <div>
                  <p className="text-xs opacity-75">Total gasto</p>
                  <p className="text-2xl font-bold">R$ {loyalty.totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Benefits */}
          <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 card-shadow">
            <h3 className="font-heading font-bold text-lg text-sand-900 dark:text-sand-100 mb-4">
              Seus benefícios
            </h3>
            <ul className="space-y-3">
              {benefits[loyalty.level as keyof typeof benefits].map((benefit, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 bg-terra-100 dark:bg-terra-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star size={12} className="text-terra-500 fill-terra-500" />
                  </div>
                  <span className="text-sand-700 dark:text-sand-300">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* How to earn */}
          <div className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 card-shadow">
            <h3 className="font-heading font-bold text-lg text-sand-900 dark:text-sand-100 mb-4">
              Como ganhar mais pontos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-sand-50 dark:bg-sand-700 rounded-xl p-4">
                <p className="text-sm font-semibold text-sand-900 dark:text-sand-100 mb-1">Reservas</p>
                <p className="text-xs text-sand-500">10 pontos por R$ 1 gasto</p>
              </div>
              <div className="bg-sand-50 dark:bg-sand-700 rounded-xl p-4">
                <p className="text-sm font-semibold text-sand-900 dark:text-sand-100 mb-1">Avaliações</p>
                <p className="text-xs text-sand-500">50 pontos por avaliação</p>
              </div>
              <div className="bg-sand-50 dark:bg-sand-700 rounded-xl p-4">
                <p className="text-sm font-semibold text-sand-900 dark:text-sand-100 mb-1">Indicações</p>
                <p className="text-xs text-sand-500">200 pontos por indicação</p>
              </div>
              <div className="bg-sand-50 dark:bg-sand-700 rounded-xl p-4">
                <p className="text-sm font-semibold text-sand-900 dark:text-sand-100 mb-1">Aniversário</p>
                <p className="text-xs text-sand-500">500 pontos bônus</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
