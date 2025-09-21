import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface AnalysisCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  borderColor: string;
  children: React.ReactNode;
  delay?: number;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({
  title,
  icon: Icon,
  iconColor,
  borderColor,
  children,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`bg-white rounded-xl shadow-sm border ${borderColor} p-6 hover:shadow-md transition-shadow duration-300`}
    >
      <div className="flex items-center space-x-3 mb-4">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
};