import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { SharedData } from './index'; // Import SharedData from index.d.ts

declare module '@inertiajs/core' {
  interface PageProps extends InertiaPageProps {
    // Merge SharedData properties into Inertia's PageProps
    auth: SharedData['auth'];
    ziggy: SharedData['ziggy'];
    flash: SharedData['flash']; // Assuming flash messages are part of SharedData
    // Allow for additional properties specific to each page
    [key: string]: unknown; 
  }
}

export {};