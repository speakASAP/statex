import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

interface PrototypeSubdomainHandlerProps {
  prototypeId: string;
  path: string;
}

export default async function PrototypeSubdomainHandler({ 
  prototypeId, 
  path 
}: PrototypeSubdomainHandlerProps) {
  console.log(`[PROTOTYPE-HANDLER] Processing prototype: ${prototypeId}, path: ${path}`);
  
  // For testing, return a simple response instead of redirecting
  if (path === 'test-middleware') {
    return new Response('Middleware is working! (via Prototype Handler)', { status: 200 });
  }
  
  // Redirect to prototype-results system
  let redirectUrl = '';
  if (path === '') {
    redirectUrl = `/prototype-results/${prototypeId}`;
  } else if (path === 'plan') {
    redirectUrl = `/prototype-results/${prototypeId}/plan`;
  } else if (path === 'offer') {
    redirectUrl = `/prototype-results/${prototypeId}/offer`;
  } else {
    redirectUrl = `/prototype-results/${prototypeId}/${path}`;
  }
  
  console.log(`[PROTOTYPE-HANDLER] Redirecting to ${redirectUrl}`);
  redirect(redirectUrl);
}
