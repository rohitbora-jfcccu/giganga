import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface MotionSectionHeaderProps {
  kicker?: string;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
  layout?: 'split' | 'stacked';
  borderBottom?: boolean;
  champagneSweep?: boolean;
}

export const MotionSectionHeader: React.FC<MotionSectionHeaderProps> = ({
  kicker,
  title,
  description,
  rightContent,
  className = '',
  layout = 'split',
  borderBottom = false,
  champagneSweep = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: shouldReduceMotion ? 0 : 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20,
      rotateX: shouldReduceMotion ? 0 : 1.5,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.65,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const viewportConfig = {
    once: true,
    amount: 0.1,
    margin: '0px 0px -20px 0px',
  };

  if (layout === 'stacked') {
    return (
      <motion.div
        className={`max-w-3xl mb-16 ${borderBottom ? 'pb-8 border-b border-[var(--border-subtle)]' : ''} ${className}`}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={containerVariants}
        style={{ perspective: 1000 }}
      >
        {kicker && (
          <motion.div variants={itemVariants} className="mb-2.5">
            <span className="text-xs uppercase tracking-widest text-[var(--accent-champagne)] font-mono-code font-semibold block">
              {kicker}
            </span>
          </motion.div>
        )}

        <motion.h2
          variants={itemVariants}
          className={`text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-heading)] mb-4 [text-wrap:balance] ${
            champagneSweep ? 'text-champagne-sweep' : ''
          }`}
        >
          {title}
        </motion.h2>

        {description && (
          <motion.div variants={itemVariants}>
            {typeof description === 'string' ? (
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                {description}
              </p>
            ) : (
              description
            )}
          </motion.div>
        )}

        {rightContent && (
          <motion.div variants={itemVariants} className="pt-4">
            {rightContent}
          </motion.div>
        )}
      </motion.div>
    );
  }

  // Default 'split' layout (e.g. FeaturedWork, SkillsEducation)
  return (
    <motion.div
      className={`flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 ${
        borderBottom ? 'pb-8 border-b border-[var(--border-subtle)]' : ''
      } ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      variants={containerVariants}
      style={{ perspective: 1000 }}
    >
      <div className="max-w-2xl">
        {kicker && (
          <motion.div variants={itemVariants} className="mb-2.5">
            <span className="text-xs uppercase tracking-widest text-[var(--accent-champagne)] font-mono-code font-semibold block">
              {kicker}
            </span>
          </motion.div>
        )}

        <motion.h2
          variants={itemVariants}
          className={`text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-heading)] [text-wrap:balance] ${
            champagneSweep ? 'text-champagne-sweep' : ''
          }`}
        >
          {title}
        </motion.h2>
      </div>

      {(description || rightContent) && (
        <motion.div variants={itemVariants} className="max-w-md shrink-0">
          {description && (
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {description}
            </p>
          )}
          {rightContent && <div className="mt-3 md:mt-0">{rightContent}</div>}
        </motion.div>
      )}
    </motion.div>
  );
};
