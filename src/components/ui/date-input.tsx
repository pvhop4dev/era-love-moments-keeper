import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * DateInput component that handles dd/mm/yyyy format
 */
const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, value = '', onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState('');

    React.useEffect(() => {
      // Convert ISO date or yyyy-mm-dd to dd/mm/yyyy for display
      if (value) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          setDisplayValue(`${day}/${month}/${year}`);
        } else {
          setDisplayValue(value);
        }
      } else {
        setDisplayValue('');
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let input = e.target.value.replace(/\D/g, ''); // Remove non-digits
      
      // Format as dd/mm/yyyy
      if (input.length >= 2) {
        input = input.slice(0, 2) + '/' + input.slice(2);
      }
      if (input.length >= 5) {
        input = input.slice(0, 5) + '/' + input.slice(5, 9);
      }
      
      setDisplayValue(input);
      
      // If complete date (dd/mm/yyyy), convert to ISO format for parent
      if (input.length === 10) {
        const parts = input.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        
        // Validate date
        const date = new Date(year, month, day);
        if (
          date.getDate() === day &&
          date.getMonth() === month &&
          date.getFullYear() === year
        ) {
          // Convert to yyyy-mm-dd format for API
          const isoDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          onChange?.(isoDate);
        }
      } else if (input.length === 0) {
        onChange?.('');
      }
    };

    return (
      <Input
        ref={ref}
        type="text"
        placeholder="dd/mm/yyyy"
        value={displayValue}
        onChange={handleChange}
        maxLength={10}
        className={cn(className)}
        {...props}
      />
    );
  }
);

DateInput.displayName = "DateInput";

export { DateInput };
