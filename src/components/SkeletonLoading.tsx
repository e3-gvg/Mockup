'use client';

import React from 'react';

interface SkeletonChartProps {
  height?: string;
  className?: string;
}

interface SkeletonProps {
  className?: string;
}

export function SkeletonChart({ height = '300px', className = '' }: SkeletonChartProps) {
  return (
    <div className={`glass-card ${className}`}>
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="skeleton h-6 w-48 rounded"></div>
        <div className="skeleton h-4 w-16 rounded"></div>
      </div>
      
      {/* Chart Area Skeleton */}
      <div className={`skeleton rounded-xl`} style={{ height }}>
        {/* Simulated Chart Elements */}
        <div className="flex items-end justify-between h-full p-4 opacity-30">
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i}
              className="bg-white/20 rounded-t"
              style={{ 
                height: `${Math.random() * 60 + 20}%`,
                width: '8%'
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Legend Skeleton */}
      <div className="flex items-center justify-center mt-4 space-x-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="skeleton h-3 w-3 rounded-full"></div>
            <div className="skeleton h-4 w-16 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonCard({ className = '' }: SkeletonProps) {
  return (
    <div className={`glass-card ${className}`}>
      {/* Icon and Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="skeleton h-10 w-10 rounded-xl"></div>
          <div>
            <div className="skeleton h-4 w-24 rounded mb-1"></div>
            <div className="skeleton h-3 w-16 rounded"></div>
          </div>
        </div>
        <div className="skeleton h-6 w-12 rounded"></div>
      </div>
      
      {/* Main Value */}
      <div className="skeleton h-8 w-20 rounded mb-2"></div>
      
      {/* Progress Bar */}
      <div className="skeleton h-2 w-full rounded-full"></div>
    </div>
  );
}

export function SkeletonTable({ className = '' }: SkeletonProps) {
  return (
    <div className={`glass-card ${className}`}>
      {/* Table Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="skeleton h-6 w-32 rounded"></div>
        <div className="skeleton h-8 w-24 rounded"></div>
      </div>
      
      {/* Table Rows */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <div className="skeleton h-8 w-8 rounded-full"></div>
              <div>
                <div className="skeleton h-4 w-24 rounded mb-1"></div>
                <div className="skeleton h-3 w-16 rounded"></div>
              </div>
            </div>
            <div className="skeleton h-6 w-16 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonList({ className = '' }: SkeletonProps) {
  return (
    <div className={`glass-card ${className}`}>
      {/* Header */}
      <div className="skeleton h-6 w-40 rounded mb-4"></div>
      
      {/* List Items */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start space-x-3">
            <div className="skeleton h-4 w-4 rounded-full mt-1"></div>
            <div className="flex-1">
              <div className="skeleton h-4 w-full rounded mb-2"></div>
              <div className="skeleton h-3 w-3/4 rounded"></div>
            </div>
            <div className="skeleton h-6 w-12 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Loading Spinner Component
export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };
  
  return (
    <div className={`loading-spinner ${sizeClasses[size]} ${className}`}></div>
  );
}

// Pulse Loading for Real-time Data
export function PulseLoader({ type = 'success', children }: { type?: 'success' | 'warning' | 'error', children: React.ReactNode }) {
  const pulseClass = `pulse-${type}`;
  
  return (
    <div className={pulseClass}>
      {children}
    </div>
  );
}

const SkeletonLoading = {
  Chart: SkeletonChart,
  Card: SkeletonCard,
  Table: SkeletonTable,
  List: SkeletonList,
  Spinner: LoadingSpinner,
  Pulse: PulseLoader
};

export default SkeletonLoading;