'use client';

import TeamMemberCard from './TeamMemberCard';
import styles from './TeamMembersGallery.module.css';

export default function TeamMembersGallery({ teamMembers }) {
  if (!teamMembers || teamMembers.length === 0) {
    return null;
  }

  return (
    <div className={styles.gallery} data-team-gallery>
      {teamMembers.map((member) => (
        <TeamMemberCard key={member._id} member={member} />
      ))}
    </div>
  );
}

