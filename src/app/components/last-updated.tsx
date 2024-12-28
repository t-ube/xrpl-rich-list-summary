'use client';

import React from 'react';

interface LastUpdatedProps {
  data: Array<{ created_at: string }>;
}

const LastUpdated: React.FC<LastUpdatedProps> = ({ data }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    }).format(date) + ' UTC';
  };

  const latestTimestamp = data.length > 0 ? data[0].created_at : null;

  if (!latestTimestamp) return null;

  const date = new Date(latestTimestamp);

  return (
    <div className="text-sm text-gray-500 mb-2 mr-2 text-right">
      Last updated: {formatDate(date)}
    </div>
  );
};

export default LastUpdated;