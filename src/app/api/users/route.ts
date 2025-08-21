import { NextRequest, NextResponse } from 'next/server';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';

// GET /api/users
export async function GET() {
  try {
    const usersRef = collection(adminDb, 'users');
    const snapshot = await getDocs(usersRef);

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(users);
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
      // Create Firebase Auth user account using Admin SDK
      console.log('🔥 Creando cuenta de Firebase Auth para:', body.email);
      const userRecord = await adminAuth.createUser({
        email: body.email,
        password: body.password,
        displayName: body.name
      });
      
      console.log('✅ Usuario de Firebase Auth creado:', userRecord.uid);

      // Prepare user data for Firestore (without password)
      const { password, ...userDataWithoutPassword } = body;
      const userData = {
        ...userDataWithoutPassword,
        firebaseUid: userRecord.uid, // Link with Firebase Auth
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: body.status || 'active'
      };

      // Save user data to Firestore using Admin SDK
      const docRef = await addDoc(collection(adminDb, 'users'), userData);

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
