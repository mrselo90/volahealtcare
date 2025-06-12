'use client';

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log('Page Load Time:', navEntry.loadEventEnd - navEntry.fetchStart);
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
        
        if (entry.entryType === 'first-input') {
          console.log('FID:', entry.processingStart - entry.startTime);
        }
        
        if (entry.entryType === 'layout-shift') {
          console.log('CLS:', entry.value);
        }
      }
    });

    // Observe different performance metrics
    try {
      observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }

    // Monitor image loading performance
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.complete) {
        const startTime = performance.now();
        img.addEventListener('load', () => {
          const loadTime = performance.now() - startTime;
          if (loadTime > 1000) {
            console.warn(`Slow image load: ${img.src} took ${loadTime.toFixed(2)}ms`);
          }
        });
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
} 