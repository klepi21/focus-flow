import { useMemo } from 'react';

const QUOTES = [
  'ADHD brains need to see wins. Every task counts, no matter how small.',
  'Done is better than perfect. You proved it today.',
  'Your brain works differently. Not worse. Differently.',
  'You showed up today. That took more effort than they will ever know.',
  'Rest is not the enemy of productivity. It is the foundation.',
  'Every task you completed today rewired your brain a little.',
  'Progress, not perfection. Always.',
  'The hardest part is starting. You already did that.',
];

export function useMotivationalQuote(): string {
  const dayIndex = useMemo(() => {
    const day = new Date().getDate();
    return day % QUOTES.length;
  }, []);
  return QUOTES[dayIndex];
}
