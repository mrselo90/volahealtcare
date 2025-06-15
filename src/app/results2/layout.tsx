import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Results2 | Before & After Gallery',
  description: 'Browse our comprehensive before and after results2 showcasing real patient transformations.',
};

export default function Results2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 