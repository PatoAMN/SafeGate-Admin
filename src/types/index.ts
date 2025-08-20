export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'member' | 'guard' | 'admin' | 'super_admin';
  phone?: string;
  createdAt: Date;
  organizationId: string;
  isActive: boolean;
  profileImage?: string;
}

export interface Organization {
  id: string;
  name: string;
  displayName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  settings: {
    theme: {
      primaryColor: string;
      secondaryColor: string;
      logo?: string;
    };
    security: {
      qrCodeExpiryHours: number;
      requirePhotoForGuests: boolean;
      maxGuestsPerResident: number;
      communityCode: string;
    };
    notifications: {
      emailNotifications: boolean;
      pushNotifications: boolean;
      smsNotifications: boolean;
    };
  };
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  memberCount: number;
  guardCount: number;
  accessPointCount: number;
}

export interface Member extends User {
  userType: 'member';
  homeAddress: string;
  vehicleInfo?: string;
  emergencyContacts?: string[];
  accessLevel: 'resident' | 'guest' | 'restricted';
  qrCodeHash: string;
  qrCodeExpiry: Date;
  residentSince: Date;
  homeNumber?: string;
  familyMembers?: string[];
}

export interface Guard extends User {
  userType: 'guard';
  badgeNumber: string;
  shiftHours?: string;
  accessLevel: 'guard' | 'supervisor';
  assignedAccessPoints?: string[];
  currentShift?: {
    startTime: Date;
    endTime: Date;
    status: 'active' | 'break' | 'ended';
  };
}

export interface AccessPoint {
  id: string;
  organizationId: string;
  name: string;
  location: string;
  type: 'main_gate' | 'pedestrian_gate' | 'service_entrance' | 'emergency_exit';
  status: 'active' | 'inactive' | 'maintenance';
  assignedGuards: string[];
  features: {
    hasCamera: boolean;
    hasIntercom: boolean;
    hasCardReader: boolean;
    hasBiometric: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AccessLog {
  id: string;
  organizationId: string;
  memberId: string;
  guardId: string;
  accessPointId: string;
  timestamp: Date;
  accessGranted: boolean;
  location: string;
  notes?: string;
  qrCodeUsed: string;
  accessType: 'entry' | 'exit' | 'both';
  verificationMethod: 'qr_scan' | 'manual' | 'card' | 'biometric';
}

export interface Guest {
  id: string;
  organizationId: string;
  fullName: string;
  destination: string;
  idPhotoUrl: string;
  registeredBy: string;
  registeredAt: Date;
  status: 'active' | 'completed' | 'expired';
  notes?: string;
  hostMemberId: string;
  expectedDeparture?: Date;
  vehicleInfo?: string;
}

export interface DashboardStats {
  totalOrganizations: number;
  totalUsers: number;
  totalAccessPoints: number;
  activeGuards: number;
  recentAccessLogs: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  organizationId?: string;
}
