'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Organization } from '@/types';

interface OrganizationFormProps {
  organization?: Organization | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Organization>) => Promise<void>;
  mode: 'create' | 'edit';
}

export default function OrganizationForm({ 
  organization, 
  isOpen, 
  onClose, 
  onSubmit, 
  mode 
}: OrganizationFormProps) {
  const [formData, setFormData] = useState<Partial<Organization>>({
    name: '',
    displayName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'México',
    contactInfo: {
      phone: '',
      email: '',
      website: ''
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
        communityCode: ''
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false
      }
    }
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (organization && mode === 'edit') {
      setFormData(organization);
    }
  }, [organization, mode]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Organization] as Record<string, unknown> || {}),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleNestedChange = (parent: string, child: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof Organization] as Record<string, unknown> || {}),
        [child]: value
      }
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!formData.displayName?.trim()) {
      newErrors.displayName = 'El nombre de visualización es requerido';
    }
    if (!formData.address?.trim()) {
      newErrors.address = 'La dirección es requerida';
    }
    if (!formData.city?.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }
    if (!formData.state?.trim()) {
      newErrors.state = 'El estado es requerido';
    }
    if (!formData.contactInfo?.email?.trim()) {
      newErrors.email = 'El email es requerido';
    }
    if (!formData.settings?.security?.communityCode?.trim()) {
      newErrors.communityCode = 'El código de comunidad es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCommunityCode = () => {
    const city = formData.city?.substring(0, 2).toUpperCase() || 'XX';
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const code = `${city}${year}${random}`;
    
    handleNestedChange('settings', 'security', {
      ...formData.settings?.security,
      communityCode: code
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Nueva Comunidad' : 'Editar Comunidad'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Sistema *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="privada_san_jose"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de Visualización *
              </label>
              <input
                type="text"
                value={formData.displayName || ''}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.displayName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Privada San José"
              />
              {errors.displayName && <p className="mt-1 text-sm text-red-600">{errors.displayName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección *
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Calle San José 123"
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad *
              </label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Monterrey"
              />
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <input
                type="text"
                value={formData.state || ''}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nuevo León"
              />
              {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código Postal
              </label>
              <input
                type="text"
                value={formData.zipCode || ''}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="64000"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.contactInfo?.phone || ''}
                  onChange={(e) => handleNestedChange('contactInfo', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="+52-81-1234-5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.contactInfo?.email || ''}
                  onChange={(e) => handleNestedChange('contactInfo', 'email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="admin@privada.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sitio Web
                </label>
                <input
                  type="url"
                  value={formData.contactInfo?.website || ''}
                  onChange={(e) => handleNestedChange('contactInfo', 'website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="www.privada.com"
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Seguridad</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Comunidad *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.settings?.security?.communityCode || ''}
                    onChange={(e) => handleNestedChange('settings', 'security', {
                      ...formData.settings?.security,
                      communityCode: e.target.value
                    })}
                    className={`flex-1 px-3 py-2 border rounded-md ${
                      errors.communityCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="SJ2024"
                  />
                  <button
                    type="button"
                    onClick={generateCommunityCode}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Generar
                  </button>
                </div>
                {errors.communityCode && <p className="mt-1 text-sm text-red-600">{errors.communityCode}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiración de QR (horas)
                </label>
                <input
                  type="number"
                  value={formData.settings?.security?.qrCodeExpiryHours || 24}
                  onChange={(e) => handleNestedChange('settings', 'security', {
                    ...formData.settings?.security,
                    qrCodeExpiryHours: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="1"
                  max="168"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de Huéspedes por Residente
                </label>
                <input
                  type="number"
                  value={formData.settings?.security?.maxGuestsPerResident || 5}
                  onChange={(e) => handleNestedChange('settings', 'security', {
                    ...formData.settings?.security,
                    maxGuestsPerResident: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="1"
                  max="20"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requirePhoto"
                  checked={formData.settings?.security?.requirePhotoForGuests || false}
                  onChange={(e) => handleNestedChange('settings', 'security', {
                    ...formData.settings?.security,
                    requirePhotoForGuests: e.target.checked
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="requirePhoto" className="text-sm font-medium text-gray-700">
                  Requerir foto para huéspedes
                </label>
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tema y Colores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Principal
                </label>
                <input
                  type="color"
                  value={formData.settings?.theme?.primaryColor || '#007AFF'}
                  onChange={(e) => handleNestedChange('settings', 'theme', {
                    ...formData.settings?.theme,
                    primaryColor: e.target.value
                  })}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Secundario
                </label>
                <input
                  type="color"
                  value={formData.settings?.theme?.secondaryColor || '#10b981'}
                  onChange={(e) => handleNestedChange('settings', 'theme', {
                    ...formData.settings?.theme,
                    secondaryColor: e.target.value
                  })}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
            >
              {loading ? 'Guardando...' : mode === 'create' ? 'Crear Comunidad' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
