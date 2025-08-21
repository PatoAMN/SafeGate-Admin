// Firebase Admin SDK configuration for SafeGate System
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Firebase Admin SDK configuration
// Credenciales reales del proyecto SafeGate System
const firebaseAdminConfig = {
  credential: cert({
    projectId: "safegate-system",
    clientEmail: "firebase-adminsdk-fbsvc@safegate-system.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDWWxdE3IAjVnyW\nXEcDIcLGP0k1iovrv0adsLZBzngrlgtUfnRLQO92/XSmqzoHRNdGkX+LFFelQaH9\n6sufx6YX5AsHeIn2cTA2p1uqztSmGYJeyEDZ61Kae2QsIwLVLppT0jcKyGwhaEgJ\neCnq599W1F0wx2+CrEmv3utTHw4YXO8sYQrtpITaXzvcZKz0QpR5duQrsaCbSWob\nTWJSQkGahjNzyw9xTlX2CIA+cPPODitIamF0+4irQQudOEyr2GT8Gpb1imk6ACIZ\n6E4UB1VQjV2UvTK8uzpOelHvKlkFEYQb6cirgEZrv6QJw7FybHZMGkj/+HG9W/3P\nNgH1ZZD1AgMBAAECggEABU5aTQMS2JLofg6GKO9qAd8x5hhkVEmCpYddS5lbb0DF\nTh5n8xg0rI5dxmWtwfTZ1YiKICg4qV7XXOIqYRw8s3qDW74TS3eXcaorbehYO8HL\niBa9dmd+BJo1JZXSGSFh61Fv/y7J/ECgTmr5VTQVcgkQ/R5lnT670PLEsQfGlXRO\nCxe1Zv/A5T5L2y2GHjGy3RbNYi52pDEKuUu9kumnaEuRbZ74iJ2urOyZTuJOgYSG\nC4QlAzVK4AWJ+xBAImmthiD/CEY7F0qhfK6WSRjKzyYaq4Vb10G9SaA7YxRV3NWc\nzmGaD7BBH1P5vnPlu21iIM4V7rob1QPtq/1Udqi2lQKBgQD06icXDioz/bXVUW0u\nopHt/CoSBMAK8evoLzY2uKLQvfR3EMD6TZu9KhHGXk0aQ7SZuukObivA9xYvsqJs\nwcn5qfVgM5qetuT7ukEgk9YkVaxf0o1rUTvgLcBh6wMSS1J4R7EgLFOfpVeryRFb\n9S/hm/tEc1d6EhG3HgI3VbMjHwKBgQDgDtmvrSSEJgY7B3E6VgXP3g66yRMq02e/\n17QiKG1z6TKJvsZf+YezOfAl0qiO5gO8NfOpojbQAOFsOcQmytrxOdj/htkYhyqx\nTlN2Bn/KzfKB3tD0LpR0cAxPEKnnTKwYRIqlZTOq7fEh6rxu0Mv6unHvQteQtFKe\nCsbkomi9awKBgDZfven6dRgx3arMdycBZNCnSVfSwigr6aoUwT6I42zgn2PHznBD\nxq3Kp0OZMBkCqxfuTUus3f3rXXuddz4aEBNjzlxbWJqgFFpm0YrAB6ztcGWdw1Pu\nJxLwVWPn3ziyjE6z6/kunio1dS9oZng6CTVXggOCcAtj85bqDKfoWOsVAoGATR1P\nVuNkmgbsRgy9r7JDtdNbhnYGHss7/g8jdE4tvaMZPcdnR0j+p3TdbmcelHAeAP0g\nq9Wkv9pNu432MNPInxWl1ex3c7Wxv+yRVSHPgeF4AbLKgAA4IAsgcWXu1CjTYlbU\n0TAPpFjYkS/VQt6iFd1tsUd0Id2uQa673Zz4J5kCgYEAsC9wbeB6poA3GCpnMv4Y\n83iQ4a41z+vCbS0jFet0/uE4kkG0Lr1HM5dh11ItGWon/ax6kTUVOFDoZRy8ekGG\nF7+sTpN1Ba/XFUe9e//Ox6a09SW5OYjg+F2PxXGl/yW1Tysn0oOqAiDKKvxmPeBi\n/BXqWhvfBN6UNrQeXuGzo7Q=\n-----END PRIVATE KEY-----\n",
  }),
  databaseURL: "https://safegate-system.firebaseio.com"
};

// Initialize Firebase Admin
let adminApp;
if (!getApps().length) {
  adminApp = initializeApp(firebaseAdminConfig);
  console.log('🔧 Inicializando Firebase Admin SDK...');
} else {
  adminApp = getApps()[0];
}

// Initialize Admin services
const adminAuth = getAuth(adminApp);
const adminDb = getFirestore(adminApp);

console.log('✅ Firebase Admin SDK inicializado correctamente');
console.log('🔥 Servicios de Admin listos');

export { adminAuth, adminDb };
