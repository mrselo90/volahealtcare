import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Results | Before & After Gallery',
  description: 'Browse our comprehensive before and after results showcasing real patient transformations.',
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 