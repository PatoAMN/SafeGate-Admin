# Biblioteca y Reglamentos - SafeGate System

## Descripción

La funcionalidad de Biblioteca y Reglamentos permite a los administradores gestionar documentos importantes de la comunidad que los miembros pueden consultar desde la aplicación móvil.

## Características

### Para Administradores (Web Admin)
- ✅ **Gestión de Documentos**: Crear, editar y eliminar documentos
- ✅ **Categorización**: Organizar documentos por categorías (Reglamentos, Manuales, Formularios, Avisos, Otros)
- ✅ **Asignación a Organizaciones**: Vincular documentos a comunidades específicas
- ✅ **Metadatos**: Información detallada de archivos (tamaño, tipo, etiquetas)
- ✅ **Estado de Documentos**: Activar/desactivar documentos
- ✅ **Búsqueda y Filtros**: Encontrar documentos rápidamente

### Para Miembros (App Móvil)
- ✅ **Vista de Biblioteca**: Lista organizada de documentos disponibles
- ✅ **Filtros por Categoría**: Navegar documentos por tipo
- ✅ **Búsqueda**: Encontrar documentos específicos
- ✅ **Visualización**: Información detallada de cada documento
- ✅ **Acceso Directo**: Abrir documentos en el navegador o aplicación correspondiente

## Estructura de Datos

### Colección: `library`

```typescript
interface Document {
  id: string;
  title: string;                    // Título del documento
  description: string;              // Descripción breve
  category: string;                 // Categoría (reglamentos, manuales, etc.)
  organizationId: string;           // ID de la organización
  organizationName: string;         // Nombre de la organización
  fileUrl: string;                  // URL del archivo
  fileName: string;                 // Nombre del archivo
  fileSize: number;                 // Tamaño en bytes
  fileType: string;                 // Tipo de archivo (PDF, DOC, etc.)
  createdAt: Date;                  // Fecha de creación
  updatedAt: Date;                  // Fecha de última modificación
  status: 'active' | 'inactive';    // Estado del documento
  tags: string[];                   // Etiquetas para búsqueda
}
```

## Categorías Disponibles

1. **Reglamentos** - Normas y reglas de la comunidad
2. **Manuales** - Guías y procedimientos
3. **Formularios** - Documentos para llenar
4. **Avisos** - Comunicados importantes
5. **Otros** - Documentos misceláneos

## Instalación y Configuración

### 1. Configurar la Base de Datos

Ejecutar el script de configuración:

```bash
cd safegate-web-admin
node scripts/setup-library.js
```

Este script:
- Crea la colección `library` en Firestore
- Agrega documentos de ejemplo
- Vincula documentos a organizaciones existentes

### 2. Verificar la Configuración

1. Ir a la página web admin: `/library`
2. Verificar que aparezcan los documentos de ejemplo
3. Probar la creación de un nuevo documento

### 3. Configurar la App Móvil

La funcionalidad ya está integrada en la app móvil. Los miembros pueden:
1. Ir a la pantalla principal
2. Tocar "BIBLIOTECA Y REGLAMENTOS"
3. Navegar por los documentos disponibles

## Uso

### Crear un Nuevo Documento

1. **Acceder a la Biblioteca**: Navegar a `/library` en la web admin
2. **Crear Documento**: Hacer clic en "+ Nuevo Documento"
3. **Completar Información**:
   - Título y descripción
   - Categoría y organización
   - URL del archivo
   - Metadatos adicionales
   - Etiquetas
4. **Guardar**: Hacer clic en "Crear Documento"

### Editar un Documento Existente

1. **Seleccionar Documento**: Hacer clic en "Editar" en la lista
2. **Modificar Campos**: Cambiar la información necesaria
3. **Guardar Cambios**: Hacer clic en "Actualizar Documento"

### Eliminar un Documento

1. **Seleccionar Documento**: Hacer clic en "Eliminar" en la lista
2. **Confirmar**: Confirmar la eliminación en el modal
3. **Eliminar**: Hacer clic en "Eliminar"

## API Endpoints

### GET `/api/library`
Obtiene todos los documentos de la biblioteca.

### POST `/api/library`
Crea un nuevo documento.

### GET `/api/library/[id]`
Obtiene un documento específico.

### PUT `/api/library/[id]`
Actualiza un documento existente.

### DELETE `/api/library/[id]`
Elimina un documento.

## Consideraciones de Seguridad

- Solo los administradores pueden gestionar documentos
- Los miembros solo pueden ver documentos activos
- Los documentos se filtran por organización
- Se valida la URL del archivo antes de guardar

## Personalización

### Agregar Nuevas Categorías

1. Modificar el array `categories` en `DocumentForm.tsx`
2. Actualizar los filtros en `LibraryScreen.tsx`
3. Agregar colores personalizados en `getCategoryColor()`

### Modificar Campos

1. Actualizar la interfaz `DocumentFormData`
2. Modificar el formulario en `DocumentForm.tsx`
3. Actualizar la API en `route.ts`

## Solución de Problemas

### Documentos No Aparecen
- Verificar que el estado sea "active"
- Confirmar que la organizaciónId sea correcta
- Revisar la consola del navegador para errores

### Error al Abrir Archivos
- Verificar que la URL sea válida y accesible
- Confirmar que el tipo de archivo sea compatible
- Revisar permisos de acceso al archivo

### Problemas de Rendimiento
- Implementar paginación para grandes cantidades de documentos
- Agregar índices en Firestore para consultas frecuentes
- Optimizar las consultas de la API

## Próximas Mejoras

- [ ] **Subida de Archivos**: Integración con Firebase Storage
- [ ] **Versiones de Documentos**: Historial de cambios
- [ ] **Notificaciones**: Alertas cuando se agregan nuevos documentos
- [ ] **Analytics**: Estadísticas de visualización de documentos
- [ ] **Comentarios**: Sistema de feedback de los miembros
- [ ] **Favoritos**: Documentos marcados por los miembros

## Soporte

Para soporte técnico o preguntas sobre la funcionalidad de biblioteca:
- Revisar los logs de la consola del navegador
- Verificar la configuración de Firebase
- Consultar la documentación de Firestore
