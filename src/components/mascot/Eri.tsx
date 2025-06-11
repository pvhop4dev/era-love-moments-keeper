
import React from 'react';
import { Card } from "@/components/ui/card";

interface EriProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  showMessage?: boolean;
  className?: string;
}

const Eri = ({ message, size = 'medium', showMessage = true, className = "" }: EriProps) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16', 
    large: 'w-24 h-24'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <img 
          src="/lovable-uploads/18684914-a401-48a9-a658-a9fd7b4be946.png"
          alt="Eri - Love Messenger"
          className="w-full h-full object-contain rounded-full"
        />
      </div>
      {showMessage && message && (
        <Card className="p-3 bg-love-50 border-love-200 relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-love-200"></div>
          <p className="text-sm text-love-700 leading-relaxed">{message}</p>
        </Card>
      )}
    </div>
  );
};

export default Eri;
