'use client';

import { PortableText } from "@portabletext/react";
import { getTeamMemberBySlug } from "../../../../../sanity/schemas/sanity-utils";
import { useAppContext } from "@/app/components/AppContext";
import { useEffect, useState, use } from 'react';
import VideoGrid from "@/app/components/VideoGrid";
import styles from './page.module.css';

export default function TeamMemberPage({ params }) {
  const { allData } = useAppContext();
  const resolvedParams = use(params);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  // Format name to title case (first letter of each word uppercase, rest lowercase)
  const formatName = (name) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    async function fetchMember() {
      try {
        const memberData = await getTeamMemberBySlug(resolvedParams.slug);
        setMember(memberData);
      } catch (error) {
        console.error('Error fetching team member:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMember();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

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
            <VideoGrid videos={member.videos} />
          )}
        </div>

        {/* Footer / Page Note */}
        <footer>
          {allData?.pageNote && (
            <div className="pageNote">
              <div className="leftSide">
                {allData.pageNote.workTitle && (
                  <div className="workSection">
                    <h2 className="pageNoteTitle">{allData.pageNote.workTitle}</h2>
                    {allData.pageNote.workDescription && (
                      <p className="pageNoteText">{allData.pageNote.workDescription}</p>
                    )}
                  </div>
                )}
                {allData.pageNote.connectTitle && (
                  <div className="connectSection">
                    <h2 className="pageNoteTitle">{allData.pageNote.connectTitle}</h2>
                    {allData.pageNote.connectLinks &&
                      allData.pageNote.connectLinks.map((link, index) => {
                        const isEmail = link.linkUrl && 
                                        link.linkUrl.includes('@') && 
                                        !link.linkUrl.startsWith('http://') && 
                                        !link.linkUrl.startsWith('https://');
                        
                        const href = isEmail ? `mailto:${link.linkUrl}` : link.linkUrl;
                        const target = !isEmail && link.openNewTab ? "_blank" : undefined;
                        const rel = !isEmail && link.openNewTab ? "noopener noreferrer" : undefined;

                        return (
                          <a
                            key={index}
                            href={href}
                            className="contactLink"
                            target={target}
                            rel={rel}
                          >
                            {link.linkTitle}
                          </a>
                        );
                      })}
                  </div>
                )}
              </div>
              {allData.pageNote.copyrightText && (
                <div className="copyRight">
                  <p className="copyRightText"> 
                    <b>{allData.pageNote.copyrightBrandName}</b> {allData.pageNote.copyrightText} {allData.pageNote.copyrightYear} {allData.pageNote.copyrightBrandName}
                  </p>
                </div>
              )}
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}

