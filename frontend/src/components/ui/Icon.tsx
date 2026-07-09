import type { ComponentType, SVGProps } from "react";
import {
  Globe,
  Map,
  MapPin,
  Home,
  CalendarDays,
  Users,
  BarChart3,
  Calendar,
  Database,
  LayoutDashboard,
  Settings,
  Building2,
  Hospital,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  User,
  Lock,
  LogOut,
  X,
  Check,
  MoreHorizontal,
  FileText,
  Layers,
  Search,
  Plus,
  Edit,
  Trash2,
  ClipboardList,
  Pencil,
} from "lucide-react";

export const AppIcon = {
  Countries: Globe,
  Provinces: Map,
  Districts: MapPin,
  LocalLevels: Home,
  NepaliMonths: CalendarDays,
  Genders: Users,
  FiscalYears: BarChart3,
  Years: Calendar,
  HealthFacilitiesMap: Map,
  PrimaryMaster: Database,
  Map: Map,
  Data: Layers,
  Dashboard: LayoutDashboard,
  Settings: Settings,
  HealthFacilities: Hospital,
  Building: Building2,
  Bell,
  MapPin,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  User,
  Lock,
  LogOut,
  X,
  Check,
  MoreHorizontal,
  FileText,
  Layers,
  Search,
  Plus,
  Edit,
  Trash2,
  ClipboardList,
  Pencil,
  Diamond: MoreHorizontal,
} as const;

export type IconName = keyof typeof AppIcon;

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
} & Omit<SVGProps<SVGSVGElement>, "className">;

export default function Icon({ name, size = 16, className, ...props }: IconProps) {
  const IconComponent = AppIcon[name] as ComponentType<SVGProps<SVGSVGElement>>;
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} {...props} />;
}
