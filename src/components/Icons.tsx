import {
  Briefcase, ConciergeBell, Eye, Facebook, Instagram, Lock, Luggage, Monitor, Shirt,
  ShowerHead, SprayCan, Tag, Thermometer, UserRound, Wifi, Youtube, type LucideProps,
} from "lucide-react";

/** Amenity icons. The original uses the Themify + a licensed Flaticon set; these are open-source equivalents. */
const amenityIcons: Record<string, React.ComponentType<LucideProps>> = {
  wifi: Wifi, toiletries: SprayCan, laundry: Shirt, locker: Lock, reception: ConciergeBell,
  luggage: Luggage, shower: ShowerHead, workspace: Briefcase, temperature: Thermometer,
  security: Eye, pc: Monitor, concierge: UserRound,
};

export function AmenityIcon({ name, ...rest }: { name: string } & LucideProps) {
  const C = amenityIcons[name] ?? Tag;
  return <C aria-hidden="true" strokeWidth={1.25} {...rest} />;
}

export { Facebook, Instagram, Youtube, Tag };
