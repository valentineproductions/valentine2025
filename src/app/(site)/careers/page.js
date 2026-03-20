'use client';

import { PortableText } from "@portabletext/react";
import { defaultPortableTextComponents } from "@/app/lib/portableTextConfig";
import { useAppContext } from "@/app/components/AppContext";
import Link from "next/link";
import styles from "./page.module.css";
import PageFooter from "@/app/components/PageFooter";

export default function CareersPage() {
  const { allData } = useAppContext();
  const careers = allData?.careersPage || null;
  const jobs = Array.isArray(allData?.jobs) ? allData.jobs : [];

  if (!careers) {
    return <div className={styles.container}><div className={styles.pageWrapper}>Careers Page Not Found</div></div>;
  }

  const jobsToShow = jobs.filter(j => j?.Listed !== false);

  const locationOrder = Array.isArray(careers?.locations) ? careers.locations.map(l => l.code) : [];
  const remoteCode = 'REMOTE';

  const groupedByCode = jobsToShow.reduce((acc, job) => {
    const code = job?.location?.code || 'Unknown';
    if (!acc[code]) acc[code] = [];
    acc[code].push(job);
    return acc;
  }, {});

  const orderWithRemoteLast = locationOrder.filter(c => c !== remoteCode).concat(
    locationOrder.includes(remoteCode) ? [remoteCode] : []
  );

  const groups = Object.keys(groupedByCode)
    .sort((a, b) => {
      const ia = orderWithRemoteLast.indexOf(a);
      const ib = orderWithRemoteLast.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    })
    .map(code => {
      const locMeta = (careers?.locations || []).find(l => l.code === code);
      const label = locMeta ? `${locMeta.name} (${locMeta.code})` : code;
      const jobsSorted = groupedByCode[code].slice().sort((j1, j2) => {
        const d1 = j1?.postedAt ? new Date(j1.postedAt).getTime() : 0;
        const d2 = j2?.postedAt ? new Date(j2.postedAt).getTime() : 0;
        return d2 - d1;
      });
      return [label, jobsSorted];
    });

  return (
    <>
      <div className={styles.container}>
        <div className={styles.pageWrapper}>
          <section className={styles.leftPane}>
            <div className={styles.content}>
              {careers.title && <h1 className={styles.title}>{careers.title}</h1>}
              {careers.description && (
                <div className={styles.description}>
                  <PortableText value={careers.description} components={defaultPortableTextComponents} />
                </div>
              )}
            </div>
          </section>

          <section className={styles.rightPane}>
            <div className={styles.content}>
              {groups.length === 0 && (
                <p>There are no listed opportunities at the moment.</p>
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
      <PageFooter pageNote={allData?.pageNote || allData?.homepage?.pageNote || allData?.aboutPage?.pageNote} />
    </>
  );
}
