const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where } = require('firebase/firestore');

// Firebase configuration
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

// Sample documents for the library
const sampleDocuments = [
  {
    title: "Reglamento de la Comunidad",
    description: "Reglamento interno que establece las normas de convivencia y uso de las áreas comunes de la comunidad.",
    category: "reglamentos",
    organizationId: "", // Will be filled with actual org ID
    fileUrl: "https://example.com/reglamento-comunidad.pdf",
    fileName: "reglamento-comunidad.pdf",
    fileSize: 2.5 * 1024 * 1024, // 2.5 MB
    fileType: "PDF",
    tags: ["convivencia", "normas", "áreas comunes"],
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Manual de Seguridad",
    description: "Manual que detalla los procedimientos de seguridad, protocolos de emergencia y contactos importantes.",
    category: "manuales",
    organizationId: "", // Will be filled with actual org ID
    fileUrl: "https://example.com/manual-seguridad.pdf",
    fileName: "manual-seguridad.pdf",
    fileSize: 1.8 * 1024 * 1024, // 1.8 MB
    fileType: "PDF",
    tags: ["seguridad", "emergencias", "protocolos"],
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Formulario de Reporte de Incidentes",
    description: "Formulario oficial para reportar incidentes de seguridad o problemas en la comunidad.",
    category: "formularios",
    organizationId: "", // Will be filled with actual org ID
    fileUrl: "https://example.com/formulario-incidentes.pdf",
    fileName: "formulario-incidentes.pdf",
    fileSize: 0.5 * 1024 * 1024, // 0.5 MB
    fileType: "PDF",
    tags: ["reportes", "incidentes", "formularios"],
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Aviso de Mantenimiento Programado",
    description: "Aviso sobre el próximo mantenimiento programado de las áreas comunes y servicios de la comunidad.",
    category: "avisos",
    organizationId: "", // Will be filled with actual org ID
    fileUrl: "https://example.com/aviso-mantenimiento.pdf",
    fileName: "aviso-mantenimiento.pdf",
    fileSize: 0.3 * 1024 * 1024, // 0.3 MB
    fileType: "PDF",
    tags: ["mantenimiento", "programado", "áreas comunes"],
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Guía de Reciclaje",
    description: "Guía completa sobre el programa de reciclaje de la comunidad, incluyendo horarios y materiales aceptados.",
    category: "manuales",
    organizationId: "", // Will be filled with actual org ID
    fileUrl: "https://example.com/guia-reciclaje.pdf",
    fileName: "guia-reciclaje.pdf",
    fileSize: 1.2 * 1024 * 1024, // 1.2 MB
    fileType: "PDF",
    tags: ["reciclaje", "medio ambiente", "sostenibilidad"],
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function setupLibrary() {
  try {
    console.log('🚀 Configurando colección de biblioteca...');

    // Get the first organization to use as default
    const orgsRef = collection(db, 'organizations');
    const orgsSnapshot = await getDocs(orgsRef);
    
    if (orgsSnapshot.empty) {
      console.log('⚠️ No se encontraron organizaciones. Creando documentos con organizationId vacío...');
    } else {
      const firstOrg = orgsSnapshot.docs[0];
      const orgId = firstOrg.id;
      console.log(`✅ Usando organización: ${firstOrg.data().displayName} (${orgId})`);
      
      // Update sample documents with actual organization ID
      sampleDocuments.forEach(doc => {
        doc.organizationId = orgId;
        doc.organizationName = firstOrg.data().displayName || firstOrg.data().name;
      });
    }

    // Check if library collection already has documents
    const libraryRef = collection(db, 'library');
    const librarySnapshot = await getDocs(libraryRef);
    
    if (!librarySnapshot.empty) {
      console.log(`📚 La colección de biblioteca ya tiene ${librarySnapshot.size} documentos.`);
      console.log('¿Deseas continuar y agregar más documentos? (y/n)');
      return;
    }

    // Add sample documents
    console.log('📝 Agregando documentos de ejemplo...');
    const addedDocs = [];
    
    for (const doc of sampleDocuments) {
      try {
        const docRef = await addDoc(libraryRef, doc);
        addedDocs.push({
          id: docRef.id,
          title: doc.title,
          category: doc.category
        });
        console.log(`✅ Documento agregado: ${doc.title}`);
      } catch (error) {
        console.error(`❌ Error al agregar documento ${doc.title}:`, error.message);
      }
    }

    console.log('\n🎉 Configuración de biblioteca completada!');
    console.log(`📊 Documentos agregados: ${addedDocs.length}`);
    
    if (addedDocs.length > 0) {
      console.log('\n📋 Documentos agregados:');
      addedDocs.forEach((doc, index) => {
        console.log(`${index + 1}. ${doc.title} (${doc.category})`);
      });
    }

  } catch (error) {
    console.error('❌ Error durante la configuración de la biblioteca:', error);
  }
}

// Run the setup
setupLibrary()
  .then(() => {
    console.log('\n✨ Proceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
