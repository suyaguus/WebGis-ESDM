import type { ComponentProps } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowTrendDown,
  faArrowsRotate,
  faBell,
  faBookOpen,
  faBuilding,
  faChartColumn,
  faChartLine,
  faCheck,
  faChevronDown,
  faChevronRight,
  faChevronUp,
  faCircleCheck,
  faCircleInfo,
  faCircleXmark,
  faClipboardList,
  faClock,
  faDownload,
  faEllipsis,
  faEye,
  faEyeSlash,
  faFileLines,
  faFilter,
  faGear,
  faGlobe,
  faHelmetSafety,
  faLayerGroup,
  faMap,
  faMapPin,
  faMagnifyingGlass,
  faPhone,
  faPlus,
  faScroll,
  faShield,
  faServer,
  faSquareCheck,
  faTowerBroadcast,
  faTriangleExclamation,
  faUpDown,
  faUsers,
  faWifi,
  faXmark,
  faDatabase,
} from '@fortawesome/free-solid-svg-icons';

type IconProps = Omit<ComponentProps<typeof FontAwesomeIcon>, 'icon' | 'style'> & {
  size?: number;
  color?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  style?: ComponentProps<typeof FontAwesomeIcon>['style'];
};

function createIcon(icon: IconDefinition) {
  return function Icon({ size = 16, color, style, ...rest }: IconProps) {
    return <FontAwesomeIcon icon={icon} style={{ fontSize: size, color, ...(style ?? {}) }} {...rest} />;
  };
}

export const Activity = createIcon(faChartLine);
export const AlertTriangle = createIcon(faTriangleExclamation);
export const ArrowUpDown = createIcon(faUpDown);
export const BarChart3 = createIcon(faChartColumn);
export const Bell = createIcon(faBell);
export const BookOpen = createIcon(faBookOpen);
export const Building2 = createIcon(faBuilding);
export const Check = createIcon(faCheck);
export const CheckCircle = createIcon(faCircleCheck);
export const CheckSquare = createIcon(faSquareCheck);
export const ChevronDown = createIcon(faChevronDown);
export const ChevronRight = createIcon(faChevronRight);
export const ChevronUp = createIcon(faChevronUp);
export const Clock = createIcon(faClock);
export const ClipboardList = createIcon(faClipboardList);
export const Construction = createIcon(faHelmetSafety);
export const Database = createIcon(faDatabase);
export const Download = createIcon(faDownload);
export const Eye = createIcon(faEye);
export const EyeOff = createIcon(faEyeSlash);
export const FileText = createIcon(faFileLines);
export const Filter = createIcon(faFilter);
export const Globe = createIcon(faGlobe);
export const Info = createIcon(faCircleInfo);
export const Layers = createIcon(faLayerGroup);
export const Map = createIcon(faMap);
export const MapPin = createIcon(faMapPin);
export const MoreHorizontal = createIcon(faEllipsis);
export const Phone = createIcon(faPhone);
export const Plus = createIcon(faPlus);
export const Radio = createIcon(faTowerBroadcast);
export const RefreshCw = createIcon(faArrowsRotate);
export const ScrollText = createIcon(faScroll);
export const Search = createIcon(faMagnifyingGlass);
export const Server = createIcon(faServer);
export const Shield = createIcon(faShield);
export const Settings2 = createIcon(faGear);
export const TrendingDown = createIcon(faArrowTrendDown);
export const Users = createIcon(faUsers);
export const Wifi = createIcon(faWifi);
export function WifiOff({ size = 16, color, style, ...rest }: IconProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        position: 'relative',
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
        ...(style ?? {}),
      }}
      {...rest}
    >
      <FontAwesomeIcon icon={faWifi} style={{ fontSize: size, color }} />
      <FontAwesomeIcon icon={faXmark} style={{ position: 'absolute', fontSize: size * 0.8, color }} />
    </span>
  );
}
export const X = createIcon(faXmark);
export const XCircle = createIcon(faCircleXmark);
import type { ComponentProps } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowTrendDown,
  faArrowsRotate,
  faBell,
  faBookOpen,
  faBuilding,
  faChartColumn,
  faChartLine,
  faCheck,
  faChevronDown,
  faChevronRight,
  faChevronUp,
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faCircleQuestion,
  faCircleXmark,
  faClipboardList,
  faClock,
  faDownload,
  faEllipsis,
  faEye,
  faEyeSlash,
  faFile,
  faFileLines,
  faFilter,
  faGear,
  faGlobe,
  faHelmetSafety,
  faLayerGroup,
  faLocationCrosshairs,
  faLocationDot,
  faMap,
  faMagnifyingGlass,
  faPhone,
  faPlus,
  faScroll,
  faShield,
  faSatellite,
  faServer,
  faSlash,
  faSquareCheck,
  faTowerBroadcast,
  faTriangleExclamation,
  faUpDown,
  faUsers,
  faWater,
  faWifi,
  faXmark,
  faChevronLeft,
  faCircleUser,
  faHouse,
} from '@fortawesome/free-solid-svg-icons';

type IconProps = Omit<ComponentProps<typeof FontAwesomeIcon>, 'icon' | 'size' | 'style'> & {
  size?: number;
  color?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  style?: ComponentProps<typeof FontAwesomeIcon>['style'];
};

function createIcon(icon: IconDefinition) {
  return function Icon({ size = 16, color, style, strokeWidth, absoluteStrokeWidth, ...rest }: IconProps) {
    void strokeWidth;
    void absoluteStrokeWidth;
    return <FontAwesomeIcon icon={icon} style={{ fontSize: size, color, ...style }} {...rest} />;
  };
}

export const Bell = createIcon(faBell);
export const BookOpen = createIcon(faBookOpen);
export const Building2 = createIcon(faBuilding);
export const ChevronDown = createIcon(faChevronDown);
export const ChevronLeft = createIcon(faChevronLeft);
export const ChevronRight = createIcon(faChevronRight);
export const ChevronUp = createIcon(faChevronUp);
export const Check = createIcon(faCheck);
export const CheckCircle = createIcon(faCircleCheck);
export const CheckSquare = createIcon(faSquareCheck);
export const Clock = createIcon(faClock);
export const ClipboardList = createIcon(faClipboardList);
export const Download = createIcon(faDownload);
export const FileText = createIcon(faFileLines);
export const Filter = createIcon(faFilter);
export const Globe = createIcon(faGlobe);
export const Construction = createIcon(faHelmetSafety);
export const Info = createIcon(faCircleInfo);
export const Layers = createIcon(faLayerGroup);
export const Map = createIcon(faMap);
export const MoreHorizontal = createIcon(faEllipsis);
export const Phone = createIcon(faPhone);
export const Plus = createIcon(faPlus);
export const Radio = createIcon(faTowerBroadcast);
export const RefreshCw = createIcon(faArrowsRotate);
export const ScrollText = createIcon(faScroll);
export const Search = createIcon(faMagnifyingGlass);
export const Server = createIcon(faServer);
export const Shield = createIcon(faShield);
export const SquareCheck = createIcon(faSquareCheck);
export const AlertTriangle = createIcon(faTriangleExclamation);
export const ArrowUpDown = createIcon(faUpDown);
export const Activity = createIcon(faChartLine);
export const BarChart3 = createIcon(faChartColumn);
export const Database = createIcon(faDatabase);
export const Eye = createIcon(faEye);
export const EyeOff = createIcon(faEyeSlash);
export const File = createIcon(faFile);
export const MapPin = createIcon(faLocationDot);
export const MapPinOff = createIcon(faLocationCrosshairs);
export const Settings2 = createIcon(faGear);
export const TrendingDown = createIcon(faArrowTrendDown);
export const Users = createIcon(faUsers);
export const Wifi = createIcon(faWifi);
export const X = createIcon(faXmark);
export const XCircle = createIcon(faCircleXmark);
export const Chevron = createIcon(faChevronRight);
export const CircleQuestion = createIcon(faCircleQuestion);
export const CircleExclamation = createIcon(faCircleExclamation);
export const CircleInfo = createIcon(faCircleInfo);
export const CircleCheck = createIcon(faCircleCheck);
export const CircleUser = createIcon(faCircleUser);
export const Home = createIcon(faHouse);

export function WifiOff({ size = 16, color, style, ...rest }: IconProps) {
  return (
    <span
      style={{ display: 'inline-flex', position: 'relative', width: size, height: size, alignItems: 'center', justifyContent: 'center', ...style }}
      {...rest}
    >
      <FontAwesomeIcon icon={faWifi} style={{ fontSize: size, color }} />
      <FontAwesomeIcon icon={faSlash} style={{ position: 'absolute', fontSize: size * 0.95, color }} />
    </span>
  );
}
