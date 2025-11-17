import { PortableText } from "@portabletext/react";
import { getTeamMemberBySlug } from "../../../../../sanity/schemas/sanity-utils";
import VideoGrid from "@/app/components/VideoGrid";
import styles from './page.module.css';

export default async function TeamMemberPage({ params }) {
  const member = await getTeamMemberBySlug(params.slug);

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
          <h1 className={styles.memberName}>{member.fullName}</h1>
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
      </div>
    </div>
  );
}

