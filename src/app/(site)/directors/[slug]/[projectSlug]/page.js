'use client';

import { use } from 'react';
import { useAppContext } from '@/app/components/AppContext';
import DirectorProjectVideoPlayer from '@/app/components/DirectorProjectVideoPlayer';
import styles from './page.module.css';

export default function DirectorProjectVideoPage({ params }) {
  const { allData } = useAppContext();
  const resolvedParams = use(params);
  const directorSlug = resolvedParams?.slug;
  const projectSlug = resolvedParams?.projectSlug;

  const member = allData?.pages
    ?.find((page) => page.slug === 'directors')
    ?.teamMembers?.find((m) => m.slug === directorSlug);

  const slugKey = String(projectSlug || '')
    .toLowerCase()
    .trim();
  const project =
    member?.profileProjects?.find(
      (p) => String(p?.slug || '').toLowerCase().trim() === slugKey
    ) || null;

  if (!member) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Director not found.</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Project not found.</div>
      </div>
    );
  }

  const directorProfileHref = `/directors/${directorSlug}`;
  const pages = allData?.pages || [];
  const logo = pages[0]?.pageCompanyLogoWhite || pages[0]?.pageCompanyLogo;

  return (
    <div className={styles.container}>
      <DirectorProjectVideoPlayer
        simianSource={project.simianProxyFile ?? ''}
        uploadedClipUrl={project.profileClip?.asset?.url || ''}
        directorProfileHref={directorProfileHref}
        directorName={member.fullName}
        projectName={project.name}
        logoUrl={logo?.url || null}
        logoAlt={logo?.alt || 'Valentine'}
      />
    </div>
  );
}
