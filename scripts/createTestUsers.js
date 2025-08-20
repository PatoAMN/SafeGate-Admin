// Script para crear usuarios de prueba en Firebase
// Ejecuta este script después de configurar Firebase

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Usuarios de prueba
const testUsers = [
  {
    email: 'admin@privadasanjose.com',
    password: 'admin123',
    userData: {
      name: 'Administrador',
      userType: 'admin',
      phone: '+52-81-1234-5678',
      organizationId: 'PclA7cVwK7PSkHan8Mlg', // ID de la organización creada anteriormente
      isActive: true,
      role: 'community_admin'
    }
  },
  {
    email: 'guard@privadasanjose.com',
    password: 'guard123',
    userData: {
      name: 'Guardia de Seguridad',
      userType: 'guard',
      phone: '+52-81-1234-5679',
      organizationId: 'PclA7cVwK7PSkHan8Mlg',
      isActive: true,
      role: 'security_guard',
      badgeNumber: 'G001',
      shiftHours: '6 AM - 6 PM'
    }
  },
  {
    email: 'resident@privadasanjose.com',
    password: 'resident123',
    userData: {
      name: 'Residente Ejemplo',
      userType: 'member',
      phone: '+52-81-1234-5680',
      organizationId: 'PclA7cVwK7PSkHan8Mlg',
      isActive: true,
      role: 'resident',
      homeAddress: '123 Oak Street',
      homeNumber: 'A1',
      residentSince: new Date('2023-01-01')
    }
  }
];

// Función para crear usuarios de prueba
async function createTestUsers() {
  try {
    console.log('🚀 Creando usuarios de prueba en Firebase...');
    console.log('📱 Proyecto: SafeGate System');
    
    for (const user of testUsers) {
      try {
        console.log(`\n👤 Creando usuario: ${user.email}`);
        
        // Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          user.email, 
          user.password
        );
        
        console.log(`✅ Usuario creado en Auth con UID: ${userCredential.user.uid}`);
        
        // Crear documento de usuario en Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          ...user.userData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log(`✅ Documento de usuario creado en Firestore`);
        
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`⚠️  Usuario ${user.email} ya existe, saltando...`);
        } else {
          console.error(`❌ Error creando usuario ${user.email}:`, error.message);
        }
      }
    }
    
    console.log('\n🎉 Usuarios de prueba creados exitosamente!');
    console.log('\n📱 Credenciales de acceso:');
    console.log('👑 Admin: admin@privadasanjose.com / admin123');
    console.log('🛡️  Guardia: guard@privadasanjose.com / guard123');
    console.log('🏠 Residente: resident@privadasanjose.com / resident123');
    console.log('\n🌐 Ahora puedes usar estas credenciales en la app móvil');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la creación de usuarios
createTestUsers();
