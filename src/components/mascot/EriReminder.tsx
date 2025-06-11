
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Gift, Calendar } from "lucide-react";
import Eri from "./Eri";

interface EriReminderProps {
  type: 'anniversary' | 'birthday' | 'event' | 'gift';
  message: string;
  daysUntil?: number;
  onAction?: () => void;
  actionText?: string;
}

const EriReminder = ({ type, message, daysUntil, onAction, actionText }: EriReminderProps) => {
  const getIcon = () => {
    switch (type) {
      case 'anniversary':
        return <Calendar className="h-4 w-4 text-love-500" />;
      case 'birthday':
        return <Gift className="h-4 w-4 text-couple" />;
      case 'event':
        return <Bell className="h-4 w-4 text-amber-500" />;
      case 'gift':
        return <Gift className="h-4 w-4 text-love-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'anniversary':
        return 'bg-love-50 border-love-200';
      case 'birthday':
        return 'bg-couple-light border-couple';
      case 'event':
        return 'bg-amber-50 border-amber-200';
      case 'gift':
        return 'bg-love-100 border-love-300';
      default:
        return 'bg-muted border-muted';
    }
  };

  return (
    <Card className={`p-4 ${getBgColor()}`}>
      <div className="flex items-start gap-3">
        <Eri size="small" showMessage={false} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getIcon()}
            {daysUntil !== undefined && (
              <span className="text-xs font-medium px-2 py-1 bg-white rounded-full">
                {daysUntil === 0 ? 'Today!' : `${daysUntil} days`}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 mb-3">{message}</p>
          {onAction && actionText && (
            <Button size="sm" onClick={onAction} className="love-button">
              {actionText}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EriReminder;
