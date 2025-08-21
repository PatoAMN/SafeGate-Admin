'use client';

import React, { useState, useEffect } from 'react';
import OrganizationForm from '../../components/Forms/OrganizationForm';

interface Organization {
  id: string;
  displayName: string;
  name: string;
  city: string;
  state: string;
  country: string;
  memberCount: number;
  guardCount: number;
  status: string;
  settings: {
    security: {
      communityCode: string;
    };
  };
  contactInfo: {
    email: string;
    phone: string;
  };
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/organizations');
      if (!response.ok) {
        throw new Error('Error al cargar organizaciones');
      }
      const data = await response.json();
      setOrganizations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganization = async (formData: any) => {
    try {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al crear organización');
      }

      await fetchOrganizations();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating organization:', error);
      alert('Error al crear organización');
    }
  };

  const handleEditOrganization = async (formData: any) => {
    if (!selectedOrganization) return;

    try {
      const response = await fetch(`/api/organizations/${selectedOrganization.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar organización');
      }

      await fetchOrganizations();
      setShowForm(false);
      setSelectedOrganization(null);
    } catch (error) {
      console.error('Error updating organization:', error);
      alert('Error al actualizar organización');
    }
  };

  const handleDeleteOrganization = async () => {
    if (!selectedOrganization) return;

    try {
      setDeleteLoading(true);
      const response = await fetch(`/api/organizations/${selectedOrganization.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar organización');
      }

      await fetchOrganizations();
      setShowDeleteModal(false);
      setSelectedOrganization(null);
    } catch (error) {
      console.error('Error deleting organization:', error);
      alert('Error al eliminar organización');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openCreateForm = () => {
    setFormMode('create');
    setSelectedOrganization(null);
    setShowForm(true);
  };

  const openEditForm = (org: Organization) => {
    setFormMode('edit');
    setSelectedOrganization(org);
    setShowForm(true);
  };

  const openDeleteModal = (org: Organization) => {
    setSelectedOrganization(org);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cargando organizaciones</h2>
          <p className="text-gray-600">Obteniendo datos de Firebase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchOrganizations}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Gestión de Organizaciones
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Administra todas las comunidades del sistema SafeGate de seguridad
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Organizaciones</p>
              <p className="text-2xl font-bold text-gray-900">{organizations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Miembros</p>
              <p className="text-2xl font-bold text-gray-900">
                {organizations.reduce((sum, org) => sum + org.memberCount, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Guardias</p>
              <p className="text-2xl font-bold text-gray-900">
                {organizations.reduce((sum, org) => sum + org.guardCount, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activas</p>
              <p className="text-2xl font-bold text-gray-900">
                {organizations.filter(org => org.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Lista de Organizaciones</h2>
            <button 
              onClick={openCreateForm}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              + Nueva Organización
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Organización
                </th>
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Miembros
                </th>
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Guardias
                </th>
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200/50">
              {organizations.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-sm">
                          {org.displayName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {org.displayName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {org.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {org.city}, {org.state}
                    </div>
                    <div className="text-sm text-gray-500">
                      {org.country}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {org.memberCount} miembros
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      {org.guardCount} guardias
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <code className="text-sm bg-gray-100 px-3 py-1 rounded-lg font-mono">
                      {org.settings?.security?.communityCode || 'N/A'}
                    </code>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      org.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {org.status === 'active' ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openEditForm(org)}
                        className="text-green-600 hover:text-green-900 px-3 py-1 rounded-lg hover:bg-green-50 transition-colors duration-200"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => openDeleteModal(org)}
                        className="text-red-600 hover:text-red-900 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors duration-200"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Organization Form Modal */}
      <OrganizationForm
        organization={selectedOrganization}
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedOrganization(null);
        }}
        onSubmit={formMode === 'create' ? handleCreateOrganization : handleEditOrganization}
        mode={formMode}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedOrganization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Eliminación</h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que quieres eliminar la organización <strong>"{selectedOrganization.displayName}"</strong>? 
                Esta acción no se puede deshacer.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteOrganization}
                  disabled={deleteLoading}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleteLoading ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
