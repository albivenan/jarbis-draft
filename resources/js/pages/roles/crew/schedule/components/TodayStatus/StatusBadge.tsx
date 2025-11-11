import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";
  let text = status;

  switch (status.toLowerCase()) {
    case "hadir":
      variant = "default";
      text = "Hadir";
      break;
    case "izin":
      variant = "secondary";
      text = "Izin";
      break;
    case "sakit":
      variant = "destructive";
      text = "Sakit";
      break;
    case "libur":
      variant = "outline";
      text = "Libur";
      break;
    default:
      variant = "default";
      break;
  }

  return <Badge variant={variant}>{text}</Badge>;
};