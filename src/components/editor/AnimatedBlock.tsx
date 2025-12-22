'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedBlockProps {
  children: React.ReactNode;
  animation?: string;
  animationDuration?: string;
  animationDelay?: string;
  hoverEffect?: string;
  className?: string;
  style?: React.CSSProperties;
}

interface AnimationVariant {
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  transition?: Record<string, any>;
}

interface HoverVariant {
  hover?: Record<string, any>;
  transition?: Record<string, any>;
}

const animationVariants: Record<string, AnimationVariant> = {
  none: {},
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideInUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
  },
  slideInDown: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
  },
  zoomIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  },
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 0.6,
        stiffness: 100
      }
    },
  },
  flipInX: {
    initial: { opacity: 0, rotateX: -90 },
    animate: { opacity: 1, rotateX: 0 },
  },
  flipInY: {
    initial: { opacity: 0, rotateY: -90 },
    animate: { opacity: 1, rotateY: 0 },
  },
};

const hoverVariants: Record<string, HoverVariant> = {
  none: {},
  scale: {
    hover: { scale: 1.05 },
    transition: { duration: 0.2 }
  },
  lift: {
    hover: { y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" },
    transition: { duration: 0.2 }
  },
  glow: {
    hover: { 
      boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
      scale: 1.02
    },
    transition: { duration: 0.2 }
  },
  shrink: {
    hover: { scale: 0.95 },
    transition: { duration: 0.2 }
  },
  rotate: {
    hover: { rotate: 5 },
    transition: { duration: 0.2 }
  },
};

export function AnimatedBlock({ 
  children, 
  animation = 'none',
  animationDuration = '0.5s',
  animationDelay = '0s',
  hoverEffect = 'none',
  className = '',
  style = {}
}: AnimatedBlockProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const animationConfig = animationVariants[animation as keyof typeof animationVariants] || animationVariants.none;
  const hoverConfig = hoverVariants[hoverEffect as keyof typeof hoverVariants] || hoverVariants.none;

  const motionProps = {
    initial: animationConfig.initial || {},
    animate: isVisible ? (animationConfig.animate || {}) : (animationConfig.initial || {}),
    whileHover: hoverConfig.hover || {},
    transition: {
      duration: parseFloat(animationDuration.replace('s', '')),
      delay: parseFloat(animationDelay.replace('s', '')),
      ...hoverConfig.transition
    },
    style: {
      ...style,
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

