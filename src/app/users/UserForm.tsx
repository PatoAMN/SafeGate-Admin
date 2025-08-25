'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

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
  password?: string; // Para creación de usuarios
}

interface Organization {
  id: string;
  name: string;
  displayName: string;
  address: string;
  city: string;
  state: string;
}

interface UserFormProps {
  user?: User | null;
  organizations: Organization[];
  onSave: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function UserForm({ user, organizations, onSave, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'member' as 'member' | 'guard' | 'admin',
    status: 'active' as 'active' | 'inactive',
    phone: '',
    address: '',
    organizationId: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // No mostrar contraseña al editar
        confirmPassword: '',
        role: user.role,
        status: user.status,
        phone: user.phone || '',
        address: user.address || '',
        organizationId: user.organizationId
      });
    } else if (organizations.length > 0) {
      // Si es un usuario nuevo, seleccionar la primera organización por defecto
      setFormData(prev => ({
        ...prev,
        organizationId: organizations[0].id
      }));
    }
  }, [user, organizations]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    // Validar contraseña solo para usuarios nuevos
    if (!user) {
      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma la contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    if (!formData.organizationId) {
      newErrors.organizationId = 'Debes seleccionar una comunidad';
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'El teléfono no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSave({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password, // Solo para usuarios nuevos
          role: formData.role,
          status: formData.status,
          phone: formData.phone.trim() || undefined,
          address: formData.address.trim() || undefined,
          organizationId: formData.organizationId
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getSelectedOrganization = () => {
    return organizations.find(org => org.id === formData.organizationId);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {user ? 'Editar Usuario' : 'Agregar Usuario'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
              disabled={isSubmitting}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre completo *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Juan Pérez"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="juan@example.com"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Contraseña - Solo para usuarios nuevos */}
            {!user && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-blue-800">
                      🔐 Cuenta de Acceso
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    Se creará una cuenta de usuario con email y contraseña para que pueda acceder a la app móvil.
                  </p>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Mínimo 6 caracteres"
                    disabled={isSubmitting}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    La contraseña debe tener al menos 6 caracteres
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmar Contraseña *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Repite la contraseña"
                    disabled={isSubmitting}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </>
            )}

            {/* Comunidad */}
            <div>
              <label htmlFor="organizationId" className="block text-sm font-medium text-gray-700">
                Comunidad *
              </label>
              <select
                id="organizationId"
                value={formData.organizationId}
                onChange={(e) => handleChange('organizationId', e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white ${
                  errors.organizationId ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              >
                <option value="">Selecciona una comunidad</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.displayName} - {org.city}, {org.state}
                  </option>
                ))}
              </select>
              {errors.organizationId && (
                <p className="mt-1 text-sm text-red-600">{errors.organizationId}</p>
              )}
              {formData.organizationId && getSelectedOrganization() && (
                <div className="mt-2 p-2 bg-blue-50 rounded-md">
                  <div className="flex items-center text-sm text-blue-700">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                    <span className="font-medium">
                      {getSelectedOrganization()?.displayName}
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    {getSelectedOrganization()?.address}
                  </p>
                </div>
              )}
            </div>

            {/* Rol */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Rol *
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                disabled={isSubmitting}
              >
                <option value="member">Residente</option>
                <option value="guard">Guardia</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Estado *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                disabled={isSubmitting}
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="+52 55 1234 5678"
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Dirección */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Dirección
              </label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                placeholder="Calle San José 123, Casa 45"
                disabled={isSubmitting}
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : (user ? 'Actualizar' : 'Crear')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
