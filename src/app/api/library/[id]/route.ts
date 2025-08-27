import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db } from '../../../../lib/firebase';

// GET /api/library/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔍 [API] Consultando documento ${params.id} en Firestore...`);
    const docRef = doc(db, 'library', params.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    const document = {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate?.() || docSnap.data().createdAt,
      updatedAt: docSnap.data().updatedAt?.toDate?.() || docSnap.data().updatedAt
    };

    console.log('✅ [API] Documento obtenido exitosamente');
    return NextResponse.json(document);
  } catch (error: any) {
    console.error('❌ [API] Error al obtener documento:', error);
    return NextResponse.json(
      { error: 'Error al obtener documento', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/library/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    console.log(`🔄 [API] Actualizando documento ${params.id} en Firestore...`);

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const organizationId = formData.get('organizationId') as string;
    const status = formData.get('status') as string;
    const file = formData.get('file') as File;

    if (!title || !description || !organizationId) {
      return NextResponse.json(
        { error: 'Campos requeridos faltantes' },
        { status: 400 }
      );
    }

    const docRef = doc(db, 'library', params.id);
    
    // Check if document exists
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    const currentDoc = docSnap.data();
    let fileUrl = currentDoc.fileUrl;
    let fileName = currentDoc.fileName;
    let fileSize = currentDoc.fileSize;
    let fileType = currentDoc.fileType;
    let storagePath = currentDoc.storagePath;

    // Si se subió un nuevo archivo, procesarlo
    if (file) {
      console.log('📤 [API] Procesando nuevo archivo...');
      const storage = getStorage();
      
      // Eliminar archivo anterior si existe
      if (currentDoc.storagePath) {
        try {
          const oldFileRef = ref(storage, currentDoc.storagePath);
          await deleteObject(oldFileRef);
          console.log('🗑️ [API] Archivo anterior eliminado');
        } catch (error) {
          console.log('⚠️ [API] No se pudo eliminar archivo anterior:', error);
        }
      }
      
      // Subir nuevo archivo
      const timestamp = Date.now();
      const newFileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `library/${organizationId}/${newFileName}`);
      
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const uploadResult = await uploadBytes(storageRef, buffer, {
        contentType: file.type
      });
      
      fileUrl = await getDownloadURL(uploadResult.ref);
      fileName = file.name;
      fileSize = file.size;
      fileType = file.type;
      storagePath = `library/${organizationId}/${newFileName}`;
      
      console.log('✅ [API] Nuevo archivo subido exitosamente');
    }

    const updateData = {
      title,
      description,
      category,
      organizationId,
      fileUrl,
      fileName,
      fileSize,
      fileType,
      storagePath,
      status,
      updatedAt: new Date()
    };

    await updateDoc(docRef, updateData);

    console.log('✅ [API] Documento actualizado exitosamente');
    return NextResponse.json({ 
      id: params.id,
      ...updateData,
      message: 'Documento actualizado correctamente' 
    });
  } catch (error: any) {
    console.error('❌ [API] Error al actualizar documento:', error);
    return NextResponse.json(
      { error: 'Error al actualizar documento', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/library/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🗑️ [API] Eliminando documento ${params.id} de Firestore...`);
    const docRef = doc(db, 'library', params.id);
    
    // Check if document exists
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar archivo de Storage si existe
    const docData = docSnap.data();
    if (docData.storagePath) {
      try {
        const storage = getStorage();
        const fileRef = ref(storage, docData.storagePath);
        await deleteObject(fileRef);
        console.log('🗑️ [API] Archivo eliminado de Storage');
      } catch (error) {
        console.log('⚠️ [API] No se pudo eliminar archivo de Storage:', error);
      }
    }

    await deleteDoc(docRef);

    console.log('✅ [API] Documento eliminado exitosamente');
    return NextResponse.json({ 
      message: 'Documento eliminado correctamente',
      id: params.id
    });
  } catch (error: any) {
    console.error('❌ [API] Error al eliminar documento:', error);
    return NextResponse.json(
      { error: 'Error al eliminar documento', details: error.message },
      { status: 500 }
    );
  }
}
