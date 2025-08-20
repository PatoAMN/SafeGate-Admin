import { NextRequest, NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// GET /api/organizations
export async function GET() {
  try {
    const organizationsRef = collection(db, 'organizations');
    const snapshot = await getDocs(organizationsRef);
    
    const organizations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(organizations);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      { error: 'Error al cargar organizaciones' },
      { status: 500 }
    );
  }
}

// POST /api/organizations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.displayName || !body.address) {
      return NextResponse.json(
        { error: 'Campos requeridos faltantes' },
        { status: 400 }
      );
    }

    // Add timestamps
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
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json(
      { error: 'Error al crear organización' },
      { status: 500 }
    );
  }
}
