import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

interface PrototypeSubdomainPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function PrototypeSubdomainPage({ searchParams }: PrototypeSubdomainPageProps) {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  
  console.log(`[PROTOTYPE-SUBDOMAIN] Processing request - Host: ${host}`);
  
  // Check if this is a prototype subdomain
  const prototypeMatch = host.match(/^project-([a-zA-Z0-9_-]+)\.localhost(:\d+)?$/);
  
  if (!prototypeMatch) {
    // Not a prototype subdomain, redirect to main site
    redirect('/');
  }
  
  const prototypeId = prototypeMatch[1];
  const path = searchParams.path as string || '';
  
  console.log(`[PROTOTYPE-SUBDOMAIN] Found prototype subdomain: ${prototypeId}, path: ${path}`);
  
  // Handle different paths
  if (path === 'plan') {
    console.log(`[PROTOTYPE-SUBDOMAIN] Redirecting to /prototype-results/${prototypeId}/plan`);
    redirect(`/prototype-results/${prototypeId}/plan`);
  } else if (path === 'offer') {
    console.log(`[PROTOTYPE-SUBDOMAIN] Redirecting to /prototype-results/${prototypeId}/offer`);
    redirect(`/prototype-results/${prototypeId}/offer`);
  } else {
    console.log(`[PROTOTYPE-SUBDOMAIN] Redirecting to /prototype-results/${prototypeId}`);
    redirect(`/prototype-results/${prototypeId}`);
  }
}

