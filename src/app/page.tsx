'use client';

import React from 'react';
import { 
  BuildingOfficeIcon, 
  UsersIcon, 
  ShieldCheckIcon, 
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useData } from '@/contexts/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const recentActivity = [
  { id: 1, action: 'Nuevo acceso registrado', user: 'John Smith', time: 'Hace 30 min', organization: 'Privada San José' },
  { id: 2, action: 'Guardia inició turno', user: 'Carlos Rodríguez', time: 'Hace 1 hora', organization: 'Privada Los Pinos' },
  { id: 3, action: 'Nuevo residente registrado', user: 'María González', time: 'Hace 2 horas', organization: 'Privada San José' },
  { id: 4, action: 'Acceso denegado', user: 'Usuario no autorizado', time: 'Hace 3 horas', organization: 'Privada San José' },
];

const chartData = [
  { name: 'Lun', accesos: 45, denegados: 3 },
  { name: 'Mar', accesos: 52, denegados: 1 },
  { name: 'Mié', accesos: 48, denegados: 2 },
  { name: 'Jue', accesos: 61, denegados: 0 },
  { name: 'Vie', accesos: 55, denegados: 1 },
  { name: 'Sáb', accesos: 38, denegados: 2 },
  { name: 'Dom', accesos: 42, denegados: 1 },
];

export default function Dashboard() {
  const { 
    organizations, 
    dashboardStats, 
    loading, 
    error,
    refreshStats 
  } = useData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-32 w-32 text-red-500 mx-auto" />
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">Error al cargar datos</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button 
            onClick={refreshStats}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardStats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  const stats = [
    { name: 'Comunidades', value: dashboardStats.totalOrganizations, icon: BuildingOfficeIcon, change: '+0', changeType: 'neutral' },
    { name: 'Usuarios Totales', value: dashboardStats.totalUsers, icon: UsersIcon, change: '+0', changeType: 'neutral' },
    { name: 'Puntos de Acceso', value: dashboardStats.totalAccessPoints, icon: ShieldCheckIcon, change: '+0', changeType: 'neutral' },
    { name: 'Guardias Activos', value: dashboardStats.activeGuards, icon: ShieldCheckIcon, change: '+0', changeType: 'neutral' },
  ];

  const pieData = organizations.map(org => ({
    name: org.displayName,
    value: org.memberCount,
    color: org.settings.theme.primaryColor
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <button 
              onClick={refreshStats}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Actualizar
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="mt-8">
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.name}
                  className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
                >
                  <dt>
                    <div className="absolute rounded-md bg-blue-500 p-3">
                      <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                  </dt>
                  <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                    <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                    <p
                      className={`ml-2 flex items-baseline text-sm font-semibold ${
                        item.changeType === 'positive' ? 'text-green-600' : 
                        item.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                      }`}
                    >
                      {item.change}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Charts */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Access Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Accesos por Día</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="accesos" fill="#007AFF" name="Accesos" />
                  <Bar dataKey="denegados" fill="#ef4444" name="Denegados" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Organizations Distribution */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Distribución de Usuarios</h3>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  No hay datos disponibles
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity and Organizations */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <ChartBarIcon className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.user} • {activity.organization}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Organizations Status */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Estado de Comunidades</h3>
              {organizations.length > 0 ? (
                <div className="space-y-4">
                  {organizations.map((org) => (
                    <div key={org.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`h-3 w-3 rounded-full ${
                          org.status === 'active' ? 'bg-green-500' : 
                          org.status === 'inactive' ? 'bg-gray-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{org.displayName}</p>
                          <p className="text-xs text-gray-500">{org.city}, {org.state}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{org.memberCount} usuarios</p>
                        <p className="text-xs text-gray-500">{org.guardCount} guardias</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay comunidades registradas
                </div>
              )}
            </div>
          </div>

          {/* System Health */}
          <div className="mt-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Estado del Sistema</h3>
                <div className="flex items-center space-x-2">
                  {dashboardStats.systemHealth === 'excellent' ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    dashboardStats.systemHealth === 'excellent' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {dashboardStats.systemHealth === 'excellent' ? 'Excelente' : 'Advertencia'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-900">{dashboardStats.recentAccessLogs}</p>
                  <p className="text-sm text-gray-500">Accesos hoy</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-900">99.9%</p>
                  <p className="text-sm text-gray-500">Uptime del sistema</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-900">2.1.0</p>
                  <p className="text-sm text-gray-500">Versión actual</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
