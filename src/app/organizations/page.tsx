'use client';

import React, { useState } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { useData } from '@/contexts/DataContext';
import { Organization } from '@/types';
import OrganizationForm from '@/components/Forms/OrganizationForm';

export default function OrganizationsPage() {
  const { 
    organizations, 
    loading, 
    error, 
    createOrganization,
    updateOrganization,
    deleteOrganization, 
    toggleOrganizationStatus 
  } = useData();
  
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleCreateOrganization = async (orgData: Partial<Organization>) => {
    try {
      await createOrganization(orgData);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating organization:', error);
    }
  };

  const handleUpdateOrganization = async (orgData: Partial<Organization>) => {
    if (!selectedOrg) return;
    
    try {
      await updateOrganization(selectedOrg.id, orgData);
      setShowForm(false);
      setSelectedOrg(null);
    } catch (error) {
      console.error('Error updating organization:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedOrg) return;
    
    try {
      setDeleteLoading(true);
      await deleteOrganization(selectedOrg.id);
      setShowDeleteModal(false);
      setSelectedOrg(null);
    } catch (error) {
      console.error('Error deleting organization:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusToggle = async (org: Organization) => {
    try {
      const newStatus = org.status === 'active' ? 'inactive' : 'active';
      await toggleOrganizationStatus(org.id, newStatus);
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const openCreateForm = () => {
    setFormMode('create');
    setSelectedOrg(null);
    setShowForm(true);
  };

  const openEditForm = (org: Organization) => {
    setFormMode('edit');
    setSelectedOrg(org);
    setShowForm(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Activa
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircleIcon className="h-3 w-3 mr-1" />
            Inactiva
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
            Suspendida
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Cargando organizaciones...</p>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Comunidades</h1>
            <button 
              onClick={openCreateForm}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Nueva Comunidad
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-8">
            {organizations.length > 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {organizations.map((org) => (
                    <li key={org.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div 
                                className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-semibold"
                                style={{ backgroundColor: org.settings.theme.primaryColor }}
                              >
                                {org.displayName.charAt(0)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center">
                                <h3 className="text-lg font-medium text-gray-900">{org.displayName}</h3>
                                <div className="ml-2">
                                  {getStatusBadge(org.status)}
                                </div>
                              </div>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <span>{org.address}, {org.city}, {org.state}</span>
                                <span className="mx-2">•</span>
                                <span>Código: {org.settings.security.communityCode}</span>
                              </div>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <span>{org.memberCount} residentes</span>
                                <span className="mx-2">•</span>
                                <span>{org.guardCount} guardias</span>
                                <span className="mx-2">•</span>
                                <span>{org.accessPointCount} puntos de acceso</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedOrg(org);
                                setShowDetailsModal(true);
                              }}
                              className="p-2 text-gray-400 hover:text-gray-600"
                              title="Ver detalles"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleStatusToggle(org)}
                              className={`px-3 py-1 text-xs font-medium rounded-md ${
                                org.status === 'active'
                                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }`}
                            >
                              {org.status === 'active' ? 'Desactivar' : 'Activar'}
                            </button>
                            <button
                              onClick={() => openEditForm(org)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                              title="Editar"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOrg(org);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 text-red-400 hover:text-red-600"
                              title="Eliminar"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <BuildingOfficeIcon className="h-12 w-12" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay comunidades</h3>
                <p className="mt-1 text-sm text-gray-500">Comienza creando tu primera comunidad de seguridad.</p>
                <div className="mt-6">
                  <button 
                    onClick={openCreateForm}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Nueva Comunidad
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Organization Form Modal */}
      <OrganizationForm
        organization={selectedOrg}
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedOrg(null);
        }}
        onSubmit={formMode === 'create' ? handleCreateOrganization : handleUpdateOrganization}
        mode={formMode}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedOrg && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Confirmar eliminación</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  ¿Estás seguro de que quieres eliminar la comunidad "{selectedOrg.displayName}"? 
                  Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  disabled={deleteLoading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Organization Details Modal */}
      {showDetailsModal && selectedOrg && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Detalles de la Comunidad</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Información General</h4>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-gray-500">Nombre:</dt>
                      <dd className="text-gray-900">{selectedOrg.displayName}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Código:</dt>
                      <dd className="text-gray-900">{selectedOrg.settings.security.communityCode}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Estado:</dt>
                      <dd>{getStatusBadge(selectedOrg.status)}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Dirección:</dt>
                      <dd className="text-gray-900">{selectedOrg.address}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Ciudad:</dt>
                      <dd className="text-gray-900">{selectedOrg.city}, {selectedOrg.state}</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Estadísticas</h4>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-gray-500">Residentes:</dt>
                      <dd className="text-gray-900">{selectedOrg.memberCount}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Guardias:</dt>
                      <dd className="text-gray-900">{selectedOrg.guardCount}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Puntos de Acceso:</dt>
                      <dd className="text-gray-900">{selectedOrg.accessPointCount}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Creada:</dt>
                      <dd className="text-gray-900">{selectedOrg.createdAt.toLocaleDateString()}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cerrar
                </button>
                <button 
                  onClick={() => {
                    setShowDetailsModal(false);
                    openEditForm(selectedOrg);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
