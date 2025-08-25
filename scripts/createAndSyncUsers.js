// Script para crear usuarios en Firebase Auth y sincronizarlos con Firestore
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } = require('firebase/firestore');

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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Usuarios de prueba para crear
const testUsers = [
  {
    email: 'admin@demo.com',
    password: 'demo123',
    userData: {
      name: 'Administrador Demo',
      role: 'admin',
      organizationId: 'PclA7cVwK7PSkHan8Mlg', // ID de organización existente
      status: 'active',
      phone: '+52 55 1234 5678',
      address: 'Calle Demo 123'
    }
  },
  {
    email: 'guardia@demo.com',
    password: 'demo123',
    userData: {
      name: 'Guardia Demo',
      role: 'guard',
      organizationId: 'PclA7cVwK7PSkHan8Mlg',
      status: 'active',
      phone: '+52 55 8765 4321',
      badge: 'GD-001',
      shift: 'Tiempo Completo'
    }
  },
  {
    email: 'residente@demo.com',
    password: 'demo123',
    userData: {
      name: 'Residente Demo',
      role: 'member',
      organizationId: 'PclA7cVwK7PSkHan8Mlg',
      status: 'active',
      phone: '+52 55 1111 2222',
      address: 'Casa A1',
      homeNumber: 'A1'
    }
  }
];

async function createAndSyncUsers() {
  try {
    console.log('🚀 Creando y sincronizando usuarios de prueba...');
    console.log('📱 Proyecto: SafeGate System');
    
    for (const user of testUsers) {
      try {
        console.log(`\n👤 Procesando usuario: ${user.email}`);
        
        // Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          user.email, 
          user.password
        );
        
        console.log(`✅ Usuario creado en Auth con UID: ${userCredential.user.uid}`);
        
        // Crear documento en Firestore con sincronización completa
        const userDoc = {
          ...user.userData,
          firebaseUid: userCredential.user.uid,
          email: user.email,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLogin: null
        };
        
        const docRef = await addDoc(collection(db, 'users'), userDoc);
        
        console.log(`✅ Usuario sincronizado en Firestore con ID: ${docRef.id}`);
        console.log(`🔗 Firebase UID: ${userCredential.user.uid}`);
        console.log(`🏘️  Organización: ${user.userData.organizationId}`);
        
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`⚠️  Usuario ${user.email} ya existe en Auth`);
          
          // Intentar sincronizar solo en Firestore si ya existe en Auth
          try {
            // Buscar si ya existe en Firestore
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', user.email));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
              console.log(`🔄 Usuario no existe en Firestore, creando documento...`);
              
              // Crear documento en Firestore
              const userDoc = {
                ...user.userData,
                email: user.email,
                firebaseUid: '', // Se debe obtener manualmente
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                lastLogin: null
              };
              
              const docRef = await addDoc(collection(db, 'users'), userDoc);
              console.log(`✅ Documento creado en Firestore: ${docRef.id}`);
              console.log(`⚠️  IMPORTANTE: Asignar manualmente el firebaseUid`);
              
            } else {
              console.log(`✅ Usuario ya existe en Firestore`);
            }
          } catch (firestoreError) {
            console.error(`❌ Error sincronizando en Firestore:`, firestoreError.message);
          }
        } else {
          console.error(`❌ Error creando usuario ${user.email}:`, error.message);
        }
      }
    }
    
    console.log('\n🎉 Proceso completado!');
    console.log('\n📱 Credenciales de acceso:');
    console.log('👑 Admin: admin@demo.com / demo123');
    console.log('🛡️  Guardia: guardia@demo.com / demo123');
    console.log('🏠 Residente: residente@demo.com / demo123');
    console.log('\n🌐 Ahora puedes usar estas credenciales en la app móvil y web');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la creación y sincronización
createAndSyncUsers().catch(console.error);
