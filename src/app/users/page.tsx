'use client';

import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ShieldCheckIcon,
  UserIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { UserForm } from './UserForm';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'guard' | 'admin';
  organizationId: string;
  status: 'active' | 'inactive';
  phone?: string;
  address?: string;
  createdAt: Date;
  lastLogin?: Date;
}

interface Organization {
  id: string;
  name: string;
  displayName: string;
  address: string;
  city: string;
  state: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filterRole, setFilterRole] = useState<'all' | 'member' | 'guard' | 'admin'>('all');
  const [filterOrganization, setFilterOrganization] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Cargar usuarios y organizaciones reales desde Firebase
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Cargar organizaciones
      const orgResponse = await fetch('/api/organizations');
      if (orgResponse.ok) {
        const orgData = await orgResponse.json();
        setOrganizations(orgData);
      }

      // Cargar usuarios
      const usersResponse = await fetch('/api/users');
      if (usersResponse.ok) {
        const data = await usersResponse.json();
        // Convertir timestamps de Firestore a Date
        const usersWithDates = data.map((user: Record<string, unknown>) => ({
          ...user,
          createdAt: user.createdAt && typeof user.createdAt === 'object' && 'seconds' in user.createdAt 
            ? new Date((user.createdAt as { seconds: number }).seconds * 1000) 
            : new Date(),
          lastLogin: user.lastLogin && typeof user.lastLogin === 'object' && 'seconds' in user.lastLogin
            ? new Date((user.lastLogin as { seconds: number }).seconds * 1000)
            : undefined
        }));
        setUsers(usersWithDates);
      } else {
        console.error('Error cargando usuarios:', usersResponse.statusText);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesOrganization = filterOrganization === 'all' || user.organizationId === filterOrganization;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesOrganization && matchesSearch;
  });

  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setUsers(users.filter(user => user.id !== userId));
        } else {
          const errorData = await response.json();
          alert(`Error al eliminar usuario: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error eliminando usuario:', error);
        alert('Error al eliminar el usuario');
      }
    }
  };

  const handleSaveUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      if (editingUser) {
        // Actualizar usuario existente
        const response = await fetch(`/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        if (response.ok) {
          await response.json(); // Solo para verificar que la respuesta es válida
          setUsers(users.map(user => 
            user.id === editingUser.id 
              ? { ...user, ...userData, updatedAt: new Date() }
              : user
          ));
        } else {
          const errorData = await response.json();
          alert(`Error al actualizar usuario: ${errorData.error}`);
          return;
        }
      } else {
        // Crear nuevo usuario
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        if (response.ok) {
          const newUser = await response.json();
          setUsers([...users, {
            ...newUser,
            createdAt: new Date()
          }]);
        } else {
          const errorData = await response.json();
          alert(`Error al crear usuario: ${errorData.error}`);
          return;
        }
      }
      setShowForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error guardando usuario:', error);
      alert('Error al guardar el usuario');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'guard':
        return <ShieldCheckIcon className="h-5 w-5 text-blue-600" />;
      case 'admin':
        return <ShieldCheckIcon className="h-5 w-5 text-red-600" />;
      default:
        return <UserIcon className="h-5 w-5 text-green-600" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'member':
        return 'Residente';
      case 'guard':
        return 'Guardia';
      case 'admin':
        return 'Administrador';
      default:
        return role;
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === 'active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {status === 'active' ? 'Activo' : 'Inactivo'}
      </span>
    );
  };

  const getOrganizationName = (organizationId: string) => {
    const org = organizations.find(o => o.id === organizationId);
    return org ? org.displayName : 'Comunidad no encontrada';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Gestión de Usuarios</h1>
            <button
              onClick={handleAddUser}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Agregar Usuario
            </button>
          </div>

          {/* Filters and Search */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Búsqueda */}
              <div>
                <label htmlFor="search" className="sr-only">Buscar usuarios</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UsersIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Filtro por rol */}
              <div>
                <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  id="role-filter"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as string)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">Todos los roles</option>
                  <option value="member">Residentes</option>
                  <option value="guard">Guardias</option>
                  <option value="admin">Administradores</option>
                </select>
              </div>

              {/* Filtro por comunidad */}
              <div>
                <label htmlFor="org-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Comunidad
                </label>
                <select
                  id="org-filter"
                  value={filterOrganization}
                  onChange={(e) => setFilterOrganization(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">Todas las comunidades</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.displayName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Users List */}
          {users.length > 0 ? (
            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <li key={user.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getRoleIcon(user.role)}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <div className="ml-2 flex items-center space-x-2">
                              {getStatusBadge(user.status)}
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {getRoleLabel(user.role)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <span>{user.email}</span>
                            {user.phone && (
                              <>
                                <span className="mx-2">•</span>
                                <span>{user.phone}</span>
                              </>
                            )}
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <BuildingOfficeIcon className="h-4 w-4 mr-1 text-gray-400" />
                            <span className="text-blue-600 font-medium">
                              {getOrganizationName(user.organizationId)}
                            </span>
                          </div>
                          {user.address && (
                            <p className="mt-1 text-sm text-gray-500">{user.address}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Editar usuario"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-gray-400 hover:text-red-600"
                          title="Eliminar usuario"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            /* Empty State */
            <div className="mt-8 text-center">
              <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios registrados</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comienza agregando tu primer usuario para gestionar tu comunidad.
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Residentes</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {users.filter(u => u.role === 'member').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Guardias</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {users.filter(u => u.role === 'guard').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UsersIcon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Usuarios</dt>
                      <dd className="text-lg font-medium text-gray-900">{users.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Comunidades</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {new Set(users.map(u => u.organizationId)).size}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Form Modal */}
      {showForm && (
        <UserForm
          user={editingUser}
          organizations={organizations}
          onSave={handleSaveUser}
          onCancel={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
}
