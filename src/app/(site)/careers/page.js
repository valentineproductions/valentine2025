'use client';

import { PortableText } from "@portabletext/react";
import { useAppContext } from "@/app/components/AppContext";
import Link from "next/link";
import styles from "./page.module.css";
import PageFooter from "@/app/components/PageFooter";

export default function CareersPage() {
  const { allData } = useAppContext();
  const careers = allData?.careersPage || null;
  const jobs = allData?.jobs || [];
  const selectedJobs = careers?.selectedJobs || [];

  if (!careers) {
    return <div className={styles.container}><div className={styles.pageWrapper}>Careers Page Not Found</div></div>;
  }

  const jobsToShow = careers?.showAllJobs ? jobs : selectedJobs;

  const grouped = jobsToShow.reduce((acc, job) => {
    const code = job.location?.code || 'Unknown';
    const name = job.location?.name || 'Unknown';
    const key = `${name} (${code})`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(job);
    return acc;
  }, {});

  const groups = Object.entries(grouped);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.pageWrapper}>
          <section className={styles.leftPane}>
            <div className={styles.content}>
              {careers.title && <h1 className={styles.title}>{careers.title}</h1>}
              {careers.description && (
                <div className={styles.description}>
                  <PortableText value={careers.description} />
                </div>
              )}
            </div>
          </section>

          <section className={styles.rightPane}>
            <div className={styles.content}>
              {groups.length === 0 && (
                <p>no available openings</p>
              )}
              {groups.map(([locKey, jobs]) => (
                <div key={locKey}>
                  <h3 className={styles.groupTitle}>{locKey}</h3>
                  <hr className={styles.divider} />
                  <div className={styles.staggerList}>
                    {jobs.map(job => (
                      <Link
                        key={job._id}
                        className={styles.jobLink}
                        href={`/careers/${job.slug}`}
                      >
                        {job.positionTitle}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <PageFooter pageNote={allData?.pageNote} />
    </>
  );
}
