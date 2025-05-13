import React from 'react';

const CartSkeleton = ({ idx }) => {
    return (
        <div className='hidden md:flex w-full py-4  gap-5 items-start'>
            <div className='w-16 h-16 rounded-full bg-gray-200 animate-pulse'></div>
            <div className='flex ml-5 flex-col max-w-[300px] min-w-[400px]'>
                <div className='h-4 bg-gray-200 rounded animate-pulse mt-2'></div>
                <div className='w-[150px] h-4 bg-gray-200 rounded animate-pulse mt-2'></div>
                <div className='w-[150px] h-4 bg-gray-200 rounded animate-pulse mt-2'></div>
            </div>
            <div className='w-1/6 h-4 flex gap-2 mt-2 ml-auto'>
            <div className='w-[150px] h-4 bg-gray-200 rounded animate-pulse mt-2'></div>
            <div className='w-[150px] h-4 bg-gray-200 rounded animate-pulse mt-2'></div>
            <div className='w-[150px] h-4 bg-gray-200 rounded animate-pulse mt-2'></div>
            </div>
        </div>
    );
};

export default CartSkeleton;
