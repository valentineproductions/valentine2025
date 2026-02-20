'use client';

import InformationV2 from '@/app/components/InformationV2';
import About from '../about/page';
import { useAppContext } from '@/app/components/AppContext';

export default function InformationPage() {
  const { allData } = useAppContext();
  const info = allData?.aboutPageV2 || null;
  if (!info) {
    return <About />;
  }
  return <InformationV2 />;
}
