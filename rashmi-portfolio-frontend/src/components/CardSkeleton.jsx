import React from 'react';

export default function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto p-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div 
          key={idx} 
          className="glass-card p-6 rounded-2xl border border-brand-border/40 space-y-4 animate-pulse select-none"
        >
          {/* Image Placeholder */}
          <div className="w-full h-48 rounded-xl bg-brand-border/30"></div>
          
          {/* Title Placeholder */}
          <div className="h-6 rounded bg-brand-border/30 w-3/4"></div>
          
          {/* Tags Placeholder */}
          <div className="flex gap-2">
            <div className="h-4 rounded bg-brand-border/30 w-16"></div>
            <div className="h-4 rounded bg-brand-border/30 w-20"></div>
            <div className="h-4 rounded bg-brand-border/30 w-12"></div>
          </div>
          
          {/* Description Placeholder */}
          <div className="space-y-2">
            <div className="h-4 rounded bg-brand-border/30 w-full"></div>
            <div className="h-4 rounded bg-brand-border/30 w-5/6"></div>
          </div>
          
          {/* Footer Buttons */}
          <div className="flex justify-between items-center pt-2">
            <div className="h-9 rounded bg-brand-border/30 w-24"></div>
            <div className="h-9 rounded bg-brand-border/30 w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
