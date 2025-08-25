// Script para sincronizar usuarios de Firebase Auth con Firestore
const { initializeApp } = require('firebase/app');
const { getAuth, listUsers } = require('firebase-admin/auth');
const { getFirestore, collection, getDocs, doc, setDoc, query, where } = require('firebase-admin/firestore');
const admin = require('firebase-admin');

// Configuración de Firebase Admin SDK
const serviceAccount = require('../serviceAccountKey.json');

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'safegate-system'
});

const auth = admin.auth();
const db = admin.firestore();

async function syncAuthUsers() {
  try {
    console.log('🔄 Iniciando sincronización de usuarios de Firebase Auth con Firestore...');
    
    // Obtener todos los usuarios de Firebase Auth
    const listUsersResult = await auth.listUsers();
    console.log(`📱 Usuarios encontrados en Firebase Auth: ${listUsersResult.users.length}`);
    
    // Obtener usuarios existentes en Firestore
    const firestoreUsersSnapshot = await db.collection('users').get();
    const existingFirestoreUsers = new Map();
    
    firestoreUsersSnapshot.docs.forEach(doc => {
      const userData = doc.data();
      if (userData.firebaseUid) {
        existingFirestoreUsers.set(userData.firebaseUid, doc.id);
      }
    });
    
    console.log(`📊 Usuarios existentes en Firestore: ${existingFirestoreUsers.size}`);
    
    let createdCount = 0;
    let updatedCount = 0;
    
    for (const authUser of listUsersResult.users) {
      try {
        const userExists = existingFirestoreUsers.has(authUser.uid);
        
        if (!userExists) {
          // Crear nuevo usuario en Firestore
          const userData = {
            firebaseUid: authUser.uid,
            email: authUser.email,
            name: authUser.displayName || authUser.email.split('@')[0],
            role: 'member', // Rol por defecto
            organizationId: '', // Se debe asignar manualmente
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
            phone: authUser.phoneNumber || '',
            lastLogin: authUser.metadata.lastSignInTime ? new Date(authUser.metadata.lastSignInTime) : null
          };
          
          // Crear documento en Firestore
          await db.collection('users').add(userData);
          createdCount++;
          console.log(`✅ Usuario creado en Firestore: ${authUser.email}`);
          
        } else {
          // Actualizar usuario existente si es necesario
          const docId = existingFirestoreUsers.get(authUser.uid);
          const userRef = db.collection('users').doc(docId);
          
          await userRef.update({
            updatedAt: new Date(),
            lastLogin: authUser.metadata.lastSignInTime ? new Date(authUser.metadata.lastSignInTime) : null
          });
          
          updatedCount++;
          console.log(`🔄 Usuario actualizado en Firestore: ${authUser.email}`);
        }
        
      } catch (error) {
        console.error(`❌ Error procesando usuario ${authUser.email}:`, error.message);
      }
    }
    
    console.log('\n🎉 Sincronización completada!');
    console.log(`📊 Resumen:`);
    console.log(`   - Usuarios creados: ${createdCount}`);
    console.log(`   - Usuarios actualizados: ${updatedCount}`);
    console.log(`   - Total procesados: ${listUsersResult.users.length}`);
    
    if (createdCount > 0) {
      console.log('\n⚠️  IMPORTANTE: Los usuarios nuevos tienen organizationId vacío.');
      console.log('   Debes asignar manualmente la organización a cada usuario.');
    }
    
  } catch (error) {
    console.error('❌ Error en la sincronización:', error);
  }
}

// Ejecutar la sincronización
syncAuthUsers().catch(console.error);
