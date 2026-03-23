import React from 'react';

const SkeletonLoader = ({ className = "" }) => {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`}></div>
  );
};

export const CardSkeleton = () => (
    <div className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm space-y-4">
        <SkeletonLoader className="h-10 w-10 rounded-xl" />
        <div className="space-y-2">
            <SkeletonLoader className="h-4 w-1/2" />
            <SkeletonLoader className="h-8 w-3/4" />
        </div>
    </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
    <div className="w-full space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border-b border-slate-50">
                <SkeletonLoader className="h-4 w-1/4" />
                <SkeletonLoader className="h-4 w-1/4" />
                <SkeletonLoader className="h-4 w-1/4" />
                <SkeletonLoader className="h-4 w-1/4" />
            </div>
        ))}
    </div>
);

export default SkeletonLoader;
