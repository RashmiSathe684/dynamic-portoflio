import { motion } from 'framer-motion';

export default function SectionTitle({ title, subtitle }) {
  return (
    <motion.div
      className="text-center mb-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="font-display text-4xl font-bold gradient-text mb-3">{title}</h2>
      <div className="w-16 h-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary mx-auto mb-4" />
      {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
    </motion.div>
  );
}
