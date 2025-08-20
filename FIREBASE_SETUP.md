# 🔥 Configuración de Firebase - SafeGate System

## 📋 Pasos para configurar Firebase

### 1. Crear proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Crear un proyecto"**
3. Nombre del proyecto: `SafeGate System`
4. Puedes desactivar Google Analytics si quieres
5. Haz clic en **"Crear proyecto"**

### 2. Habilitar Firestore Database

1. En el menú lateral, haz clic en **"Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Comenzar en modo de prueba"** (por ahora)
4. Elige ubicación: **us-central1** o **us-east1** (más cercano a México)
5. Haz clic en **"Listo"**

### 3. Obtener credenciales de la app web

1. En la consola, haz clic en el ícono de configuración (⚙️) junto a "Vista general del proyecto"
2. Selecciona **"Configuración del proyecto"**
3. Ve a la pestaña **"General"**
4. Baja hasta **"Tus apps"** y haz clic en **"Agregar app"**
5. Selecciona el ícono de web (</>)
6. Nombre de la app: `SafeGate Admin`
7. **NO marques** "También configurar Firebase Hosting"
8. Haz clic en **"Registrar app"**
9. **Copia todas las credenciales** que aparecen

### 4. Configurar las credenciales en el código

1. Abre el archivo `src/config/firebaseConfig.ts`
2. Reemplaza `"TU_API_KEY_AQUI"` con tu API Key real
3. Reemplaza `"TU_PROYECTO.firebaseapp.com"` con tu Auth Domain real
4. Reemplaza `"TU_PROYECTO_ID"` con tu Project ID real
5. Reemplaza `"TU_PROYECTO.appspot.com"` con tu Storage Bucket real
6. Reemplaza `"123456789"` con tu Messaging Sender ID real
7. Reemplaza `"1:123456789:web:abcdef123456"` con tu App ID real

### 5. Ejecutar el script de configuración inicial

1. Abre el archivo `scripts/setupFirebase.js`
2. Reemplaza las credenciales ahí también
3. Ejecuta el script:
   ```bash
   node scripts/setupFirebase.js
   ```

### 6. Probar la aplicación

1. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
2. Abre http://localhost:3000
3. Ve a la página de organizaciones
4. Deberías ver la organización de ejemplo creada

## 🔐 Reglas de seguridad de Firestore

Por ahora, las reglas están en modo de prueba. Para producción, deberías configurar reglas más estrictas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acceso solo a usuarios autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚨 Solución de problemas comunes

### Error: "Firebase: Error (auth/invalid-api-key)"
- Verifica que tu API Key esté correctamente copiada
- Asegúrate de que no haya espacios extra

### Error: "Firebase: Error (auth/unauthorized-domain)"
- En Firebase Console, ve a Authentication > Settings > Authorized domains
- Agrega `localhost` para desarrollo local

### Error: "Firebase: Error (firestore/permission-denied)"
- Verifica que Firestore esté habilitado
- Asegúrate de que las reglas estén en modo de prueba

## 📱 Siguiente paso: Conectar con la app móvil

Una vez que Firebase esté funcionando en el panel web, podrás:
1. Sincronizar datos entre web y móvil
2. Implementar autenticación
3. Crear notificaciones push
4. Implementar sincronización en tiempo real

## 🆘 ¿Necesitas ayuda?

Si tienes problemas:
1. Verifica que todas las credenciales estén correctas
2. Asegúrate de que Firestore esté habilitado
3. Revisa la consola del navegador para errores
4. Verifica que el proyecto esté activo en Firebase Console
