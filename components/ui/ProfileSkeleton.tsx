"use client";

import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm animate-pulse flex flex-col h-full">
      {/* Image Skeleton */}
      <div className="relative h-80 bg-muted">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        {/* Floating Tag Skeleton */}
        <div className="absolute bottom-6 left-6 w-24 h-6 bg-muted-foreground/20 rounded-lg"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Title and Badge */}
          <div className="flex items-center gap-3">
             <div className="w-40 h-8 bg-muted rounded-xl"></div>
             <div className="w-12 h-6 bg-primary/20 rounded-lg shrink-0"></div>
          </div>
          
          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-4">
             <div className="w-20 h-4 bg-muted rounded-full"></div>
             <div className="w-24 h-4 bg-muted rounded-full"></div>
          </div>

          <hr className="border-border/30" />

          {/* Location Block */}
          <div className="flex items-center gap-2">
             <div className="w-4 h-4 bg-muted rounded-full"></div>
             <div className="w-32 h-4 bg-muted rounded-full"></div>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full h-14 bg-muted rounded-2xl mt-4"></div>
      </div>
    </div>
  );
};

export const ProfileGridSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
      {Array.from({ length: count }).map((_, i) => (
        <ProfileSkeleton key={i} />
      ))}
    </div>
  );
};

export default ProfileSkeleton;
