'use client';

import { PortableText } from "@portabletext/react";
import { useAppContext } from "@/app/components/AppContext";
import { use } from 'react';
import VideoGridV2 from "@/app/components/VideoGridV2";
import PageFooter from "@/app/components/PageFooter";
import styles from './page.module.css';

export default function TeamMemberPage({ params }) {
  const { allData } = useAppContext();
  const resolvedParams = use(params);
  
  // Format name to title case (first letter of each word uppercase, rest lowercase)
  const formatName = (name) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Find the team member from the existing data
  const member = allData?.pages
    ?.find(page => page.slug === 'talent')
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
      <div className={styles.pageContainer}>
        <header className={styles.header}>
          <h1 className={styles.memberName}>{formatName(member.fullName)}</h1>
          {member.bio && member.bio.length > 0 && (
            <div className={styles.bio}>
              <PortableText value={member.bio} />
            </div>
          )}
        </header>

        <div className={styles.content}>
          {member.videos && member.videos.length > 0 && (
            <VideoGridV2 videos={member.videos} />
          )}
        </div>

        {/* Footer / Page Note */}
        <PageFooter pageNote={allData?.pageNote} />
      </div>
    </div>
  );
}

