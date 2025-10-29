import React from 'react'

interface SkeletonProps {
  type?: 'card' | 'text' | 'avatar' | 'button' | 'table'
  count?: number
  className?: string
}

const LoadingSkeleton: React.FC<SkeletonProps> = ({ 
  type = 'card', 
  count = 1,
  className = '' 
}) => {
  const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
      </div>
    </div>
  )

  const SkeletonText = () => (
    <div className="animate-pulse space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/5" />
    </div>
  )

  const SkeletonAvatar = () => (
    <div className="animate-pulse flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      </div>
    </div>
  )

  const SkeletonButton = () => (
    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 animate-pulse" />
  )

  const SkeletonTable = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden animate-pulse">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6" />
          </div>
        </div>
      ))}
    </div>
  )

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return <SkeletonCard />
      case 'text':
        return <SkeletonText />
      case 'avatar':
        return <SkeletonAvatar />
      case 'button':
        return <SkeletonButton />
      case 'table':
        return <SkeletonTable />
      default:
        return <SkeletonCard />
    }
  }

  return (
    <div className={className}>
      {count === 1 ? renderSkeleton() : [...Array(count)].map((_, i) => (
        <div key={i} className={i < count - 1 ? 'mb-4' : ''}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  )
}

export default LoadingSkeleton

