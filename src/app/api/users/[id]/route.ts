import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

// PUT /api/users/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.role) {
      return NextResponse.json(
        { error: 'Campos requeridos faltantes' },
        { status: 400 }
      );
    }

    // Update user data
    const userRef = doc(db, 'users', id);
    const updateData = {
      ...body,
      updatedAt: serverTimestamp()
    };

    await updateDoc(userRef, updateData);

    return NextResponse.json({ 
      id, 
      ...updateData,
      message: 'Usuario actualizado exitosamente' 
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Delete user
    const userRef = doc(db, 'users', id);
    await deleteDoc(userRef);

    return NextResponse.json({ 
      message: 'Usuario eliminado exitosamente',
      id 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Error al eliminar usuario' },
      { status: 500 }
    );
  }
}
