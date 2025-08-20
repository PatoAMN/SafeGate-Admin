// Script simple para crear usuarios de prueba en Firestore
// Este script crea usuarios directamente en Firestore sin Firebase Auth

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC0GH4ijTwOns7Gxv5LrP3MxaJoc7jkRk8",
  authDomain: "safegate-system.firebaseapp.com",
  projectId: "safegate-system",
  storageBucket: "safegate-system.firebasestorage.app",
  messagingSenderId: "530344581834",
  appId: "1:530344581834:web:0c8875d5677f9665b7f233",
  measurementId: "G-3ECN4HQG98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Usuarios de prueba (solo en Firestore por ahora)
const testUsers = [
  {
    email: 'admin@privadasanjose.com',
    password: 'admin123', // En producción esto debería estar hasheado
    name: 'Administrador',
    userType: 'admin',
    phone: '+52-81-1234-5678',
    organizationId: 'lQUxne2jReUE7fH64Li0',
    isActive: true,
    role: 'community_admin'
  },
  {
    email: 'guard@privadasanjose.com',
    password: 'guard123',
    name: 'Guardia de Seguridad',
    userType: 'guard',
    phone: '+52-81-1234-5679',
    organizationId: 'lQUxne2jReUE7fH64Li0',
    isActive: true,
    role: 'security_guard',
    badgeNumber: 'G001',
    shiftHours: '6 AM - 6 PM'
  },
  {
    email: 'resident@privadasanjose.com',
    password: 'resident123',
    name: 'Residente Ejemplo',
    userType: 'member',
    phone: '+52-81-1234-5680',
    organizationId: 'lQUxne2jReUE7fH64Li0',
    isActive: true,
    role: 'resident',
    homeAddress: '123 Oak Street',
    homeNumber: 'A1',
    residentSince: new Date('2023-01-01')
  }
];

// Función para crear usuarios de prueba
async function createTestUsers() {
  try {
    console.log('🚀 Creando usuarios de prueba en Firestore...');
    console.log('📱 Proyecto: SafeGate System');
    
    for (const user of testUsers) {
      try {
        console.log(`\n👤 Creando usuario: ${user.email}`);
        
        // Crear documento de usuario en Firestore
        const docRef = await addDoc(collection(db, 'users'), {
          ...user,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log(`✅ Usuario creado con ID: ${docRef.id}`);
        
      } catch (error) {
        console.error(`❌ Error creando usuario ${user.email}:`, error.message);
      }
    }
    
    console.log('\n🎉 Usuarios de prueba creados exitosamente!');
    console.log('\n📱 Credenciales de acceso:');
    console.log('👑 Admin: admin@privadasanjose.com / admin123');
    console.log('🛡️  Guardia: guard@privadasanjose.com / guard123');
    console.log('🏠 Residente: resident@privadasanjose.com / resident123');
    console.log('\n🌐 Ahora puedes usar estas credenciales en la app móvil');
    console.log('\n⚠️  Nota: Por ahora solo están en Firestore, no en Firebase Auth');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la creación de usuarios
createTestUsers();
