'use client';

import React from 'react';

interface LastUpdatedProps {
  data: Array<{ created_at: string }>;
}

const LastUpdated: React.FC<LastUpdatedProps> = ({ data }) => {
  const formatDate = (date: Date) => {
    const hours = date.getHours();
    return `${date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour12: false
    })}, ${String(hours === 24 ? '00' : hours.toString().padStart(2, '0'))}:${String(date.getMinutes()).padStart(2, '0')} UTC`;
  };

  const latestTimestamp = data.length > 0 ? data[0].created_at : null;

  if (!latestTimestamp) return null;

  const date = new Date(latestTimestamp);

  return (
    <div className="text-sm text-gray-500 mb-4">
      Last updated: {formatDate(date)}
    </div>
  );
};

export default LastUpdated;