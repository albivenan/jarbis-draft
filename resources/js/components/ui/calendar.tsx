"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { id } from "date-fns/locale";
import { addMonths, format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [selected, setSelected] = React.useState<Date | undefined>(undefined);


  return (
    <div className={cn("p-3, flex", className)}>
      
      <DayPicker
      animate
      mode="single"
      footer={
        selected && `Waktu Terpilih: ${selected.toLocaleDateString()}`
      }
      {...props}
    />
    </div>
  );
}


