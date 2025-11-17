'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './TeamMemberCard.module.css';

export default function TeamMemberCard({ member }) {
  if (!member || !member.slug) return null;

  const memberUrl = `/talent/${member.slug}`;

  // Format name to title case (first letter of each word uppercase, rest lowercase)
  const formatName = (name) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Link href={memberUrl} className={styles.cardLink}>
      <div className={styles.panel} data-team-panel>
        <div className={styles.panelContent}>
          <div className={styles.memberTitle}>
            <span>
              {member.talentPosition} <i>{member.city}</i>
            </span>
          </div>
          {member.image?.asset?.url && (
            <div className={styles.imageWrapper}>
              <Image
                src={member.image.asset.url}
                alt={member.image.alt || member.fullName}
                width={393}
                height={537}
                className={styles.memberImage}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                quality={80}
                loading="lazy"
                unoptimized={member.image?.asset?.url?.endsWith('.gif')}
              />
            </div>
          )}
        <div className={styles.textInfo}>
          <div className={styles.fullname}>{formatName(member.fullName)}</div>
        </div>
        </div>
      </div>
    </Link>
  );
}

