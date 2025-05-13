import React from 'react';

export default function ManageUserSkeleton() {
    return (<tr>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div className="flex gap-4">
                <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
        </td>
    </tr>
    )

}
