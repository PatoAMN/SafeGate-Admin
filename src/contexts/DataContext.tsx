'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Organization, DashboardStats, Notification, AccessLog } from '@/types';

interface DataContextType {
  // Organizations
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  
  // Actions
  createOrganization: (orgData: Partial<Organization>) => Promise<Organization>;
  updateOrganization: (id: string, updates: Partial<Organization>) => Promise<Organization>;
  deleteOrganization: (id: string) => Promise<void>;
  toggleOrganizationStatus: (id: string, status: 'active' | 'inactive' | 'suspended') => Promise<void>;
  
  // Dashboard
  dashboardStats: DashboardStats | null;
  refreshStats: () => Promise<void>;
  
  // Notifications
  notifications: Notification[];
  markNotificationAsRead: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  
  // Access Logs
  accessLogs: AccessLog[];
  refreshAccessLogs: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load organizations
      const orgs = await fetchOrganizations();
      setOrganizations(orgs);
      
      // Load dashboard stats
      const stats = await fetchDashboardStats();
      setDashboardStats(stats);
      
      // Load notifications
      const notifs = await fetchNotifications();
      setNotifications(notifs);
      
      // Load access logs
      const logs = await fetchAccessLogs();
      setAccessLogs(logs);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  // API Functions
  const fetchOrganizations = async (): Promise<Organization[]> => {
    try {
      // TODO: Replace with real API call
      const response = await fetch('/api/organizations');
      if (!response.ok) throw new Error('Error al cargar organizaciones');
      return await response.json();
    } catch (error) {
      // Fallback to mock data for now
      console.warn('Using mock data for organizations');
      return getMockOrganizations();
    }
  };

  const fetchDashboardStats = async (): Promise<DashboardStats> => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) throw new Error('Error al cargar estadísticas');
      return await response.json();
    } catch (error) {
      console.warn('Using mock data for dashboard stats');
      return getMockDashboardStats();
    }
  };

  const fetchNotifications = async (): Promise<Notification[]> => {
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) throw new Error('Error al cargar notificaciones');
      return await response.json();
    } catch (error) {
      console.warn('Using mock data for notifications');
      return getMockNotifications();
    }
  };

  const fetchAccessLogs = async (): Promise<AccessLog[]> => {
    try {
      const response = await fetch('/api/access-logs');
      if (!response.ok) throw new Error('Error al cargar logs de acceso');
      return await response.json();
    } catch (error) {
      console.warn('Using mock data for access logs');
      return getMockAccessLogs();
    }
  };

  // Organization Actions
  const createOrganization = async (orgData: Partial<Organization>): Promise<Organization> => {
    try {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orgData),
      });
      
      if (!response.ok) throw new Error('Error al crear organización');
      
      const newOrg = await response.json();
      setOrganizations(prev => [...prev, newOrg]);
      
      // Refresh stats
      await refreshStats();
      
      return newOrg;
    } catch (error) {
      throw new Error('Error al crear organización');
    }
  };

  const updateOrganization = async (id: string, updates: Partial<Organization>): Promise<Organization> => {
    try {
      const response = await fetch(`/api/organizations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) throw new Error('Error al actualizar organización');
      
      const updatedOrg = await response.json();
      setOrganizations(prev => prev.map(org => org.id === id ? updatedOrg : org));
      
      return updatedOrg;
    } catch (error) {
      throw new Error('Error al actualizar organización');
    }
  };

  const deleteOrganization = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/organizations/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Error al eliminar organización');
      
      setOrganizations(prev => prev.filter(org => org.id !== id));
      
      // Refresh stats
      await refreshStats();
    } catch (error) {
      throw new Error('Error al eliminar organización');
    }
  };

  const toggleOrganizationStatus = async (id: string, status: 'active' | 'inactive' | 'suspended'): Promise<void> => {
    try {
      const response = await fetch(`/api/organizations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) throw new Error('Error al cambiar estado');
      
      setOrganizations(prev => prev.map(org => 
        org.id === id ? { ...org, status } : org
      ));
      
      // Refresh stats
      await refreshStats();
    } catch (error) {
      throw new Error('Error al cambiar estado de la organización');
    }
  };

  // Dashboard Actions
  const refreshStats = async (): Promise<void> => {
    try {
      const stats = await fetchDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  };

  // Notification Actions
  const markNotificationAsRead = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
      });
      
      if (!response.ok) throw new Error('Error al marcar notificación');
      
      setNotifications(prev => prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const clearAllNotifications = async (): Promise<void> => {
    try {
      const response = await fetch('/api/notifications/clear', {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Error al limpiar notificaciones');
      
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  // Access Logs Actions
  const refreshAccessLogs = async (): Promise<void> => {
    try {
      const logs = await fetchAccessLogs();
      setAccessLogs(logs);
    } catch (error) {
      console.error('Error refreshing access logs:', error);
    }
  };

  const value: DataContextType = {
    organizations,
    loading,
    error,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    toggleOrganizationStatus,
    dashboardStats,
    refreshStats,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    accessLogs,
    refreshAccessLogs,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Mock data functions (temporary until API is ready)
const getMockOrganizations = (): Organization[] => [
  {
    id: 'org_1',
    name: 'privada_san_jose',
    displayName: 'Privada San José',
    address: 'Calle San José 123',
    city: 'Monterrey',
    state: 'Nuevo León',
    zipCode: '64000',
    country: 'México',
    contactInfo: {
      phone: '+52-81-1234-5678',
      email: 'admin@privadasanjose.com',
      website: 'www.privadasanjose.com'
    },
    settings: {
      theme: {
        primaryColor: '#007AFF',
        secondaryColor: '#10b981',
        logo: undefined
      },
      security: {
        qrCodeExpiryHours: 24,
        requirePhotoForGuests: true,
        maxGuestsPerResident: 5,
        communityCode: 'SJ2024'
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false
      }
    },
    status: 'active',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date(),
    createdBy: 'super_admin_1',
    memberCount: 45,
    guardCount: 8,
    accessPointCount: 3
  }
];

const getMockDashboardStats = (): DashboardStats => ({
  totalOrganizations: 1,
  totalUsers: 53,
  totalAccessPoints: 3,
  activeGuards: 8,
  recentAccessLogs: 156,
  systemHealth: 'excellent'
});

const getMockNotifications = (): Notification[] => [
  {
    id: '1',
    type: 'info',
    title: 'Sistema en funcionamiento',
    message: 'El sistema SafeGate está funcionando correctamente',
    timestamp: new Date(),
    read: false
  }
];

const getMockAccessLogs = (): AccessLog[] => [
  {
    id: '1',
    organizationId: 'org_1',
    memberId: 'member_1',
    guardId: 'guard_1',
    accessPointId: 'ap_1',
    timestamp: new Date(),
    accessGranted: true,
    location: 'Portería Principal',
    qrCodeUsed: 'org_org_1_member_john_123_oak_street_2024',
    accessType: 'entry',
    verificationMethod: 'qr_scan'
  }
];
