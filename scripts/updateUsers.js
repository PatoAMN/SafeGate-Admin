// Script para actualizar los organizationId de usuarios existentes
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');

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

// Nuevo ID de organización
const newOrganizationId = 'PclA7cVwK7PSkHan8Mlg';

async function updateUsers() {
  try {
    console.log('🔄 Actualizando organizationId de usuarios...');
    console.log(`📱 Nueva organización ID: ${newOrganizationId}`);
    
    // Obtener todos los usuarios
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    if (usersSnapshot.empty) {
      console.log('❌ No hay usuarios para actualizar');
      return;
    }
    
    let updatedCount = 0;
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      if (userData.organizationId !== newOrganizationId) {
        console.log(`🔄 Actualizando usuario: ${userData.email}`);
        
        await updateDoc(doc(db, 'users', userDoc.id), {
          organizationId: newOrganizationId,
          updatedAt: new Date()
        });
        
        updatedCount++;
        console.log(`✅ Usuario ${userData.email} actualizado`);
      } else {
        console.log(`✅ Usuario ${userData.email} ya tiene el organizationId correcto`);
      }
    }
    
    console.log(`\n🎉 Actualización completada! ${updatedCount} usuarios actualizados`);
    
  } catch (error) {
    console.error('❌ Error actualizando usuarios:', error);
  }
}

// Ejecutar la actualización
updateUsers();
