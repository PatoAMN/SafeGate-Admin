// Script para configurar la base de datos inicial de Firebase
// Configurado con las credenciales reales de SafeGate System

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, doc, setDoc } = require('firebase/firestore');

// Configuración de Firebase - credenciales reales
const firebaseConfig = {
  apiKey: "AIzaSyC0GH4ijTwOns7Gxv5LrP3MxaJoc7jkRk8",
  authDomain: "safegate-system.firebaseapp.com",
  projectId: "safegate-system",
  storageBucket: "safegate-system.firebasestorage.app",
  messagingSenderId: "530344581834",
  appId: "1:530344581834:web:0c8875d5677f9665b7f233",
  measurementId: "G-3ECN4HQG98"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Datos de ejemplo para la primera organización
const sampleOrganization = {
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
      logo: null
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
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'super_admin_1',
  memberCount: 45,
  guardCount: 8,
  accessPointCount: 3
};

// Función para configurar la base de datos
async function setupDatabase() {
  try {
    console.log('🚀 Configurando base de datos de Firebase...');
    console.log('📱 Proyecto: SafeGate System');
    
    // Crear la primera organización
    const orgRef = await addDoc(collection(db, 'organizations'), sampleOrganization);
    console.log('✅ Organización creada con ID:', orgRef.id);
    
    // Crear algunos logs de acceso de ejemplo
    const sampleAccessLogs = [
      {
        organizationId: orgRef.id,
        memberId: 'member_1',
        guardId: 'guard_1',
        accessPointId: 'ap_1',
        timestamp: new Date(),
        accessGranted: true,
        location: 'Portería Principal',
        qrCodeUsed: 'org_' + orgRef.id + '_member_john_123_oak_street_2024',
        accessType: 'entry',
        verificationMethod: 'qr_scan'
      },
      {
        organizationId: orgRef.id,
        memberId: 'member_2',
        guardId: 'guard_1',
        accessPointId: 'ap_1',
        timestamp: new Date(Date.now() - 3600000), // 1 hora atrás
        accessGranted: true,
        location: 'Portería Principal',
        qrCodeUsed: 'org_' + orgRef.id + '_member_maria_456_pine_street_2024',
        accessType: 'entry',
        verificationMethod: 'qr_scan'
      }
    ];
    
    for (const log of sampleAccessLogs) {
      await addDoc(collection(db, 'accessLogs'), log);
    }
    console.log('✅ Logs de acceso de ejemplo creados');
    
    // Crear notificaciones de ejemplo
    const sampleNotifications = [
      {
        type: 'info',
        title: 'Sistema en funcionamiento',
        message: 'El sistema SafeGate está funcionando correctamente',
        timestamp: new Date(),
        read: false
      },
      {
        type: 'success',
        title: 'Nueva comunidad registrada',
        message: 'Privada San José ha sido registrada exitosamente',
        timestamp: new Date(),
        read: false
      }
    ];
    
    for (const notification of sampleNotifications) {
      await addDoc(collection(db, 'notifications'), notification);
    }
    console.log('✅ Notificaciones de ejemplo creadas');
    
    console.log('🎉 Base de datos configurada exitosamente!');
    console.log('📱 Ahora puedes usar la aplicación web y móvil');
    console.log('🌐 Ve a http://localhost:3000 para ver el panel admin');
    
  } catch (error) {
    console.error('❌ Error configurando la base de datos:', error);
    console.error('💡 Asegúrate de que:');
    console.error('   1. Firestore esté habilitado en Firebase Console');
    console.error('   2. Las reglas estén en modo de prueba');
    console.error('   3. El proyecto esté activo');
  }
}

// Ejecutar la configuración
setupDatabase();
