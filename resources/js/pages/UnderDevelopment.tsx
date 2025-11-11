import React from 'react';
import { Head } from '@inertiajs/react';
import UnderDevelopment from '@/components/UnderDevelopment';

interface UnderDevelopmentPageProps {
  role?: string;
  title?: string;
  message?: string;
}

const UnderDevelopmentPage: React.FC<UnderDevelopmentPageProps> = (props) => {
  return (
    <>
      <Head title="Halaman Dalam Pengembangan" />
      <UnderDevelopment {...props} />
    </>
  );
};

export default UnderDevelopmentPage;