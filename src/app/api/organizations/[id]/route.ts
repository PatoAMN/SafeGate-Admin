import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

// GET /api/organizations/[id]
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    
    const organizationRef = doc(db, 'organizations', id);
    const organizationSnap = await getDoc(organizationRef);
    
    if (!organizationSnap.exists()) {
      return NextResponse.json(
        { error: 'Organización no encontrada' },
        { status: 404 }
      );
    }
    
    const organization = {
      id: organizationSnap.id,
      ...organizationSnap.data()
    };
    
    return NextResponse.json(organization);
  } catch (error) {
    console.error('Error fetching organization:', error);
    return NextResponse.json(
      { error: 'Error al obtener organización' },
      { status: 500 }
    );
  }
}

// PUT /api/organizations/[id]
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    const body = await request.json();
    
    const organizationRef = doc(db, 'organizations', id);
    await updateDoc(organizationRef, {
      ...body,
      updatedAt: new Date()
    });
    
    return NextResponse.json({ message: 'Organización actualizada' });
  } catch (error) {
    console.error('Error updating organization:', error);
    return NextResponse.json(
      { error: 'Error al actualizar organización' },
      { status: 500 }
    );
  }
}

// DELETE /api/organizations/[id]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    
    const organizationRef = doc(db, 'organizations', id);
    await deleteDoc(organizationRef);
    
    return NextResponse.json({ message: 'Organización eliminada' });
  } catch (error) {
    console.error('Error deleting organization:', error);
    return NextResponse.json(
      { error: 'Error al eliminar organización' },
      { status: 500 }
    );
  }
}
