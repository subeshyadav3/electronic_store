import React from 'react';

export default function ManageOrderSkeleton() {
    return (
        <tr className="animate-pulse">
        <td className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded "></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded "></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </td>
      </tr>
    );
}
