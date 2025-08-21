import { NextRequest, NextResponse } from 'next/server';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

// GET /api/users
export async function GET() {
  try {
    const usersRef = collection(db, 'users');
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

    // Add timestamps
    const userData = {
      ...body,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: body.status || 'active'
    };

    const docRef = await addDoc(collection(db, 'users'), userData);

    const newUser = {
      id: docRef.id,
      ...userData
    };

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Error al crear usuario' },
      { status: 500 }
    );
  }
}
