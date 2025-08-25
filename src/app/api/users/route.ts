import { NextRequest, NextResponse } from 'next/server';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, listUsers } from 'firebase/auth';
import { db, auth } from '../../../lib/firebase';

// GET /api/users
export async function GET() {
  try {
    // Obtener usuarios de Firestore
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);

    const firestoreUsers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Obtener usuarios de Firebase Auth (solo en desarrollo)
    let authUsers = [];
    try {
      // Nota: listUsers solo está disponible en Firebase Admin SDK
      // Para el cliente, necesitamos usar un enfoque diferente
      // Por ahora, solo retornamos usuarios de Firestore
      console.log('📊 Cargando usuarios desde Firestore:', firestoreUsers.length);
    } catch (authError) {
      console.log('⚠️ No se pueden listar usuarios de Auth desde el cliente');
    }

    // Combinar usuarios de Firestore con información de Auth
    const allUsers = firestoreUsers.map(user => ({
      ...user,
      source: 'firestore',
      // Asegurar que los campos requeridos estén presentes
      role: user.role || 'member',
      status: user.status || 'active',
      organizationId: user.organizationId || '',
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt || new Date()
    }));

    console.log(`✅ Total de usuarios cargados: ${allUsers.length}`);
    return NextResponse.json(allUsers);
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Error al cargar usuarios' },
      { status: 500 }
    );
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.role || !body.organizationId) {
      return NextResponse.json(
        { error: 'Campos requeridos faltantes' },
        { status: 400 }
      );
    }

    // Validate password for new users
    if (!body.password) {
      return NextResponse.json(
        { error: 'La contraseña es requerida para nuevos usuarios' },
        { status: 400 }
      );
    }

    if (body.password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    try {
      // Create Firebase Auth user account
      console.log('🔥 Creando cuenta de Firebase Auth para:', body.email);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        body.email,
        body.password
      );
      
      console.log('✅ Usuario de Firebase Auth creado:', userCredential.user.uid);

      // Prepare user data for Firestore (without password)
      const { password, ...userDataWithoutPassword } = body;
      const userData = {
        ...userDataWithoutPassword,
        firebaseUid: userCredential.user.uid, // Link with Firebase Auth
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: body.status || 'active'
      };

      // Save user data to Firestore
      const docRef = await addDoc(collection(db, 'users'), userData);

      const newUser = {
        id: docRef.id,
        ...userData
      };

      console.log('✅ Usuario creado exitosamente en Firestore:', docRef.id);
      return NextResponse.json(newUser, { status: 201 });

    } catch (authError: any) {
      console.error('❌ Error en Firebase Auth:', authError);
      
      // Handle specific Firebase Auth errors
      if (authError.code === 'auth/email-already-in-use') {
        return NextResponse.json(
          { error: 'El email ya está registrado en el sistema' },
          { status: 409 }
        );
      } else if (authError.code === 'auth/invalid-email') {
        return NextResponse.json(
          { error: 'El formato del email no es válido' },
          { status: 400 }
        );
      } else if (authError.code === 'auth/weak-password') {
        return NextResponse.json(
          { error: 'La contraseña es demasiado débil' },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { error: `Error de autenticación: ${authError.message}` },
          { status: 500 }
        );
      }
    }

  } catch (error) {
    console.error('❌ Error general al crear usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
