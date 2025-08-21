import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';

// PATCH /api/organizations/[id]/status
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: 'Estado requerido' },
        { status: 400 }
      );
    }

    const organizationRef = doc(db, 'organizations', id);
    await updateDoc(organizationRef, { status, updatedAt: new Date() });

    return NextResponse.json({ message: 'Estado de organización actualizado' });
  } catch (error) {
    console.error('Error updating organization status:', error);
    return NextResponse.json(
      { error: 'Error al actualizar estado de organización' },
      { status: 500 }
    );
  }
}
