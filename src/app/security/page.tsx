'use client';

import React, { useState, useEffect } from 'react';

interface SecuritySettings {
  qrCodeExpiryHours: number;
  requirePhotoForGuests: boolean;
  maxGuestsPerResident: number;
  requireApprovalForGuests: boolean;
  accessLogRetentionDays: number;
  failedLoginAttempts: number;
  lockoutDurationMinutes: number;
  twoFactorAuth: boolean;
  sessionTimeoutMinutes: number;
}

interface AccessLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed' | 'blocked';
  location: string;
}

export default function SecurityPage() {
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    qrCodeExpiryHours: 24,
    requirePhotoForGuests: false,
    maxGuestsPerResident: 5,
    requireApprovalForGuests: false,
    accessLogRetentionDays: 90,
    failedLoginAttempts: 5,
    lockoutDurationMinutes: 30,
    twoFactorAuth: false,
    sessionTimeoutMinutes: 60
  });

  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');

  // Mock access logs for demonstration
  useEffect(() => {
    const mockLogs: AccessLog[] = [
      {
        id: '1',
        userId: 'user1',
        userName: 'Juan Pérez',
        action: 'Login',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
        status: 'success',
        location: 'Monterrey, MX'
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'María García',
        action: 'QR Scan',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        ipAddress: '192.168.1.101',
        userAgent: 'SafeGate Mobile App',
        status: 'success',
        location: 'Monterrey, MX'
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Carlos López',
        action: 'Login',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        status: 'failed',
        location: 'CDMX, MX'
      }
    ];
    setAccessLogs(mockLogs);
  }, []);

  const handleSettingChange = (setting: keyof SecuritySettings, value: any) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Configuración de seguridad guardada exitosamente');
    } catch (error) {
      alert('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'blocked': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'Exitoso';
      case 'failed': return 'Fallido';
      case 'blocked': return 'Bloqueado';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Configuración de Seguridad
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Gestiona la seguridad del sistema SafeGate y monitorea el acceso
        </p>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Accesos Exitosos</p>
              <p className="text-2xl font-bold text-gray-900">
                {accessLogs.filter(log => log.status === 'success').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Accesos Fallidos</p>
              <p className="text-2xl font-bold text-gray-900">
                {accessLogs.filter(log => log.status === 'failed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Usuarios Bloqueados</p>
              <p className="text-2xl font-bold text-gray-900">
                {accessLogs.filter(log => log.status === 'blocked').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Actividad Hoy</p>
              <p className="text-2xl font-bold text-gray-900">
                {accessLogs.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'settings'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Configuración
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'monitoring'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monitoreo
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'logs'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Registros
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'settings' && (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración de Seguridad</h2>
          
          <div className="space-y-8">
            {/* QR Code Settings */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Códigos QR</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiración de QR (horas)
                  </label>
                  <input
                    type="number"
                    value={securitySettings.qrCodeExpiryHours}
                    onChange={(e) => handleSettingChange('qrCodeExpiryHours', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    min="1"
                    max="168"
                  />
                  <p className="text-sm text-gray-500 mt-1">Tiempo de validez de los códigos QR generados</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo invitados por residente
                  </label>
                  <input
                    type="number"
                    value={securitySettings.maxGuestsPerResident}
                    onChange={(e) => handleSettingChange('maxGuestsPerResident', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    min="1"
                    max="20"
                  />
                  <p className="text-sm text-gray-500 mt-1">Límite de invitados por miembro</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="requirePhoto"
                    checked={securitySettings.requirePhotoForGuests}
                    onChange={(e) => handleSettingChange('requirePhotoForGuests', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="requirePhoto" className="text-sm font-medium text-gray-700">
                    Requerir foto para invitados
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="requireApproval"
                    checked={securitySettings.requireApprovalForGuests}
                    onChange={(e) => handleSettingChange('requireApprovalForGuests', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="requireApproval" className="text-sm font-medium text-gray-700">
                    Requerir aprobación para invitados
                  </label>
                </div>
              </div>
            </div>

            {/* Access Control Settings */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Control de Acceso</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intentos de login fallidos
                  </label>
                  <input
                    type="number"
                    value={securitySettings.failedLoginAttempts}
                    onChange={(e) => handleSettingChange('failedLoginAttempts', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    min="1"
                    max="10"
                  />
                  <p className="text-sm text-gray-500 mt-1">Antes de bloquear la cuenta</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración del bloqueo (minutos)
                  </label>
                  <input
                    type="number"
                    value={securitySettings.lockoutDurationMinutes}
                    onChange={(e) => handleSettingChange('lockoutDurationMinutes', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    min="5"
                    max="1440"
                  />
                  <p className="text-sm text-gray-500 mt-1">Tiempo de bloqueo por intentos fallidos</p>
                </div>
              </div>
            </div>

            {/* Session Settings */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Sesión</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeout de sesión (minutos)
                  </label>
                  <input
                    type="number"
                    value={securitySettings.sessionTimeoutMinutes}
                    onChange={(e) => handleSettingChange('sessionTimeoutMinutes', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    min="15"
                    max="1440"
                  />
                  <p className="text-sm text-gray-500 mt-1">Tiempo de inactividad antes de cerrar sesión</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retención de logs (días)
                  </label>
                  <input
                    type="number"
                    value={securitySettings.accessLogRetentionDays}
                    onChange={(e) => handleSettingChange('accessLogRetentionDays', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    min="30"
                    max="365"
                  />
                  <p className="text-sm text-gray-500 mt-1">Días que se mantienen los registros de acceso</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="twoFactorAuth" className="text-sm font-medium text-gray-700">
                    Habilitar autenticación de dos factores (2FA)
                  </label>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                onClick={saveSettings}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Guardando...' : 'Guardar Configuración'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'monitoring' && (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Monitoreo de Seguridad</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Real-time Activity */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad en Tiempo Real</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700">Usuario activo</span>
                  </div>
                  <span className="text-xs text-gray-500">Hace 2 min</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700">QR escaneado</span>
                  </div>
                  <span className="text-xs text-gray-500">Hace 5 min</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700">Intento de acceso</span>
                  </div>
                  <span className="text-xs text-gray-500">Hace 8 min</span>
                </div>
              </div>
            </div>

            {/* Security Alerts */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas de Seguridad</h3>
              <div className="space-y-4">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-sm font-medium text-red-800">Múltiples intentos fallidos</span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">Usuario: carlos@demo.com</p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-sm font-medium text-yellow-800">Acceso desde nueva ubicación</span>
                  </div>
                  <p className="text-xs text-yellow-600 mt-1">IP: 203.0.113.1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Registros de Acceso</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accessLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                      <div className="text-sm text-gray-500">{log.userId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{log.action}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                        {getStatusText(log.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
