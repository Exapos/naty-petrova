import React from 'react';
import { sanitizeText } from '@/lib/sanitize';

interface SafeTextProps {
  children: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Komponenta pro bezpečné zobrazení textu bez XSS rizik
 */
export function SafeText({ children, className, as = 'span' }: SafeTextProps) {
  const sanitizedText = sanitizeText(children || '');
  const Component = as;
  
  return React.createElement(Component, {
    className,
    dangerouslySetInnerHTML: { __html: sanitizedText }
  });
}

interface SafeTitleProps {
  title: string;
  className?: string;
}

/**
 * Komponenta pro bezpečné zobrazení nadpisů
 */
export function SafeTitle({ title, className }: SafeTitleProps) {
  return (
    <SafeText as="h1" className={className}>
      {title}
    </SafeText>
  );
}

interface SafeDescriptionProps {
  description: string;
  className?: string;
}

/**
 * Komponenta pro bezpečné zobrazení popisů
 */
export function SafeDescription({ description, className }: SafeDescriptionProps) {
  return (
    <SafeText as="p" className={className}>
      {description}
    </SafeText>
  );
}