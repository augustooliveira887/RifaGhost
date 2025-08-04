import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ScarcityAlertProps {
  totalNumbers: number;
  soldNumbers: number;
}

export const ScarcityAlert: React.FC<ScarcityAlertProps> = ({ totalNumbers, soldNumbers }) => {
  const remainingNumbers = totalNumbers - soldNumbers;
  const percentageRemaining = (remainingNumbers / totalNumbers) * 100;
  
};
