'use client';

import { useAppContext } from "@/app/components/AppContext";
import { use } from 'react';
import DirectorPageVideoV3 from "@/app/components/DirectorPageVideoV3";
import styles from './page.module.css';

export default function TeamMemberPage({ params }) {
  const { allData } = useAppContext();
  const resolvedParams = use(params);
  
  const member = allData?.pages
    ?.find(page => page.slug === 'directors')
    ?.teamMembers
    ?.find(m => m.slug === resolvedParams.slug);

  if (!member) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Team member not found</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <DirectorPageVideoV3 member={member} />
    </div>
  );
}
