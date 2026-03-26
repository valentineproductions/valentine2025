'use client';

import WorkStillsBackgroundMark from './WorkStillsBackgroundMark';
import WorkStillsSloganLayer from './WorkStillsSloganLayer';
import WorkStillsBlock from './WorkStillsBlock';
import { resolveStillsImages } from './workStillsUtils';
import styles from './WorkStills.module.css';

export default function WorkStillsView({ stills, backgroundLogo, fallbackLogo, pageCompanyLogo }) {
  const list = Array.isArray(stills)
    ? stills.filter((s) => resolveStillsImages(s).length > 0)
    : [];

  if (list.length === 0) {
    return (
      <div className={styles.root}>
        <WorkStillsBackgroundMark logo={backgroundLogo} fallbackLogo={fallbackLogo} />
        <WorkStillsSloganLayer pageCompanyLogo={pageCompanyLogo} />
        <div className={styles.heroSpacer} aria-hidden />
        <div className={styles.empty}>
          <p>Add Stills in Sanity (Work page → Stills). Choose a layout, then add images.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <WorkStillsBackgroundMark logo={backgroundLogo} fallbackLogo={fallbackLogo} />
      <WorkStillsSloganLayer pageCompanyLogo={pageCompanyLogo} />
      <div className={styles.heroSpacer} aria-hidden />
      <div className={styles.feed}>
        {list.map((item, index) => (
          <WorkStillsBlock key={`${item.title}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}
