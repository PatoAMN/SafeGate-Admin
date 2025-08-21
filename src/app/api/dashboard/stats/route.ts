import { NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

// GET /api/dashboard/stats
export async function GET() {
  try {
    // Get organizations count
    const organizationsRef = collection(db, 'organizations');
    const organizationsSnapshot = await getDocs(organizationsRef);
    const totalOrganizations = organizationsSnapshot.size;

    // Get active organizations
    const activeOrganizationsQuery = query(organizationsRef, where('status', '==', 'active'));
    const activeOrganizationsSnapshot = await getDocs(activeOrganizationsQuery);
    const activeOrganizations = activeOrganizationsSnapshot.size;

    // Get total users (members + guards)
    let totalUsers = 0;
    let totalAccessPoints = 0;
    let activeGuards = 0;

    // Calculate totals from organizations
    organizationsSnapshot.forEach(doc => {
      const data = doc.data();
      totalUsers += (data.memberCount || 0) + (data.guardCount || 0);
      totalAccessPoints += data.accessPointCount || 0;
      if (data.status === 'active') {
        activeGuards += data.guardCount || 0;
      }
    });

    // Get recent access logs (last 24 hours)
    const accessLogsRef = collection(db, 'accessLogs');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const recentLogsQuery = query(accessLogsRef, where('timestamp', '>=', yesterday));
    const recentLogsSnapshot = await getDocs(recentLogsQuery);
    const recentAccessLogs = recentLogsSnapshot.size;

    // Determine system health
    let systemHealth: 'excellent' | 'good' | 'warning' | 'critical' = 'excellent';
    
    if (activeOrganizations === 0) {
      systemHealth = 'critical';
    } else if (activeOrganizations < totalOrganizations * 0.8) {
      systemHealth = 'warning';
    } else if (activeOrganizations < totalOrganizations) {
      systemHealth = 'good';
    }

    const stats = {
      totalOrganizations,
      totalUsers,
      totalAccessPoints,
      activeGuards,
      recentAccessLogs,
      systemHealth,
      activeOrganizations,
      inactiveOrganizations: totalOrganizations - activeOrganizations
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Error al cargar estadísticas' },
      { status: 500 }
    );
  }
}
