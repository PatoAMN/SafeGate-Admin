import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

// GET /api/organizations
export async function GET() {
  try {
    console.log('🔍 [API] Consultando organizaciones en Firestore...');
    const organizationsRef = collection(db, 'organizations');
    const snapshot = await getDocs(organizationsRef);
    const organizations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`📊 [API] Encontrados ${organizations.length} documentos`);
    console.log('✅ [API] Organizaciones obtenidas:', organizations.map(org => org.id));
    return NextResponse.json(organizations);
  } catch (error: any) {
    console.error('❌ [API] Error al cargar organizaciones:', error);
    return NextResponse.json(
      { error: 'Error al cargar organizaciones', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/organizations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.displayName || !body.address) {
      return NextResponse.json(
        { error: 'Campos requeridos faltantes' },
        { status: 400 }
      );
    }
    const organizationData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      memberCount: 0,
      guardCount: 0,
      accessPointCount: 0
    };
    const docRef = await addDoc(collection(db, 'organizations'), organizationData);
    const newOrganization = {
      id: docRef.id,
      ...organizationData
    };
    return NextResponse.json(newOrganization, { status: 201 });
  } catch (error: any) {
    console.error('❌ [API] Error al crear organización:', error);
    return NextResponse.json(
      { error: 'Error al crear organización', details: error.message },
      { status: 500 }
    );
  }
}