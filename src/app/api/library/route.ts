import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../../lib/firebase';

// GET /api/library
export async function GET() {
  try {
    console.log('🔍 [API] Consultando documentos de la biblioteca en Firestore...');
    const libraryRef = collection(db, 'library');
    const snapshot = await getDocs(libraryRef);
    const documents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
    }));
    console.log(`📊 [API] Encontrados ${documents.length} documentos`);
    return NextResponse.json(documents);
  } catch (error: any) {
    console.error('❌ [API] Error al cargar documentos:', error);
    return NextResponse.json(
      { error: 'Error al cargar documentos', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/library
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const organizationId = formData.get('organizationId') as string;
    const status = formData.get('status') as string;
    const file = formData.get('file') as File;

    if (!title || !description || !organizationId || !file) {
      return NextResponse.json(
        { error: 'Campos requeridos faltantes' },
        { status: 400 }
      );
    }

    // Get organization name for display
    const orgRef = collection(db, 'organizations');
    const orgQuery = query(orgRef, where('__name__', '==', organizationId));
    const orgSnapshot = await getDocs(orgQuery);
    let organizationName = 'Organización desconocida';
    
    if (!orgSnapshot.empty) {
      const orgDoc = orgSnapshot.docs[0];
      organizationName = orgDoc.data().displayName || orgDoc.data().name || 'Organización desconocida';
    }

    // Subir archivo a Firebase Storage
    console.log('📤 [API] Subiendo archivo a Firebase Storage...');
    const storage = getStorage();
    
    // Crear nombre único para el archivo
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `library/${organizationId}/${fileName}`);
    
    // Convertir File a Buffer para Firebase Storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Subir archivo
    const uploadResult = await uploadBytes(storageRef, buffer, {
      contentType: file.type
    });
    
    // Obtener URL de descarga
    const downloadURL = await getDownloadURL(uploadResult.ref);
    
    console.log('✅ [API] Archivo subido exitosamente a Firebase Storage');

    // Guardar información del documento en Firestore
    const documentData = {
      title,
      description,
      category,
      organizationId,
      organizationName,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileUrl: downloadURL, // URL de descarga desde Firebase Storage
      storagePath: `library/${organizationId}/${fileName}`, // Ruta en Storage para futuras operaciones
      createdAt: new Date(),
      updatedAt: new Date(),
      status: status || 'active'
    };

    const docRef = await addDoc(collection(db, 'library'), documentData);
    const newDocument = {
      id: docRef.id,
      ...documentData
    };

    console.log('✅ [API] Documento creado exitosamente:', newDocument.id);
    return NextResponse.json(newDocument, { status: 201 });
  } catch (error: any) {
    console.error('❌ [API] Error al crear documento:', error);
    return NextResponse.json(
      { error: 'Error al crear documento', details: error.message },
      { status: 500 }
    );
  }
}
