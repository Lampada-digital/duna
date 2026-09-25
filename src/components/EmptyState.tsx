import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-sand-100 dark:bg-sand-800 rounded-full flex items-center justify-center mb-6">
        <Icon size={32} className="text-sand-400 dark:text-sand-500" />
      </div>
      <h3 className="font-heading font-semibold text-lg text-sand-800 dark:text-sand-200 mb-2">{title}</h3>
      <p className="text-sm text-sand-500 dark:text-sand-400 max-w-sm mb-6">{description}</p>
      {action && (
        <button onClick={action.onClick} className="px-6 py-2.5 bg-terra-500 hover:bg-terra-600 text-white text-sm font-medium rounded-full transition-colors">
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
