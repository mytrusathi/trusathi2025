"use client";

import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-slate-100 rounded-2xl ${className}`} />
  );
}

export function ProfileCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 space-y-4">
      <div className="flex gap-4 items-center">
        <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 flex-1 rounded-xl" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 h-32 flex flex-col justify-between">
      <Skeleton className="w-12 h-12 rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-2 w-16" />
        <Skeleton className="h-6 w-10" />
      </div>
    </div>
  );
}

export function MatchGridSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-2 w-16" />
          </div>
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="bg-white p-4 rounded-[2rem] border border-slate-100 space-y-4">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="space-y-2 px-2">
               <Skeleton className="h-4 w-2/3" />
               <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
