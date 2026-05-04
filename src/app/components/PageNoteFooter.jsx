'use client';
import styles from './PageFooter.module.css';
import footerStyles from './HomeVideoFooter.module.css';
import LocationsAndEmail from './LocationsAndEmail';

const PageNoteFooter = ({ pageNote, locations, email }) => {
  // When no pageNote, fall back to locations + email if either exists
  const hasFallbackContent = !pageNote && (locations?.trim() || email?.trim());
  if (!pageNote && !hasFallbackContent) return null;

  const wrapperClass = `homeLastVideoFooter ${footerStyles.wrapper}`;

  // Fallback: display locations & email when pageNote is not selected
  if (hasFallbackContent) {
    return (
      <div className={wrapperClass}>
        <LocationsAndEmail locations={locations} email={email} />
      </div>
    );
  }

  const hasWork = (pageNote.workTitle && pageNote.workTitle.trim() !== '') || (pageNote.workDescription && pageNote.workDescription.trim() !== '');
  const hasConnect = Array.isArray(pageNote.connectLinks) && pageNote.connectLinks.length > 0;
  const tokens = (pageNote.workDescription || '')
    .split(/[,\n/]+/)
    .map(s => s.trim())
    .filter(Boolean);
  return (
    <div className={wrapperClass}>
      <div className={styles.pageNote}>
        <div className={styles.leftSide}>
          {hasWork && (
            <div className={styles.workSection}>
              {pageNote.workTitle && (
                <h2 className={styles.pageNoteTitle}>{pageNote.workTitle}</h2>
              )}
              {pageNote.workDescription && (
                <p className={styles.workInline}>
                  {tokens.length > 0
                    ? tokens.map((t, idx) => (
                        <span key={`${t}-${idx}`} className={styles.centerItem}>
                          {t}
                        </span>
                      ))
                    : pageNote.workDescription}
                </p>
              )}
            </div>
          )}
        </div>
        <div className={styles.centerSide}>
          {hasConnect && (
            <div className={styles.connectSection}>
              {pageNote.connectTitle && (
                <h2 className={styles.pageNoteTitle}>{pageNote.connectTitle}</h2>
              )}
              <p className={styles.connectInline}>
                {pageNote.connectLinks.map((link, index) => {
                  const isEmail =
                    link.linkUrl &&
                    link.linkUrl.includes('@') &&
                    !link.linkUrl.startsWith('http://') &&
                    !link.linkUrl.startsWith('https://');
                  const href = isEmail ? `mailto:${link.linkUrl}` : link.linkUrl;
                  const target = !isEmail && link.openNewTab ? '_blank' : undefined;
                  const rel = !isEmail && link.openNewTab ? 'noopener noreferrer' : undefined;
                  const key = link._key || `${link.linkUrl || ''}-${link.linkTitle || ''}-${index}`;
                  return (
                    <span key={key} className={styles.contactItem}>
                      <a
                        href={href}
                        className={styles.contactLink}
                        target={target}
                        rel={rel}
                      >
                        {link.linkTitle}
                      </a>
                    </span>
                  );
                })}
              </p>
            </div>
          )}
        </div>
        {pageNote.copyrightText && (
          <div className={styles.copyRight}>
            <p className={styles.copyRightText}>
              <b>{pageNote.copyrightBrandName}</b> {pageNote.copyrightText} {pageNote.copyrightYear} {pageNote.copyrightBrandName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageNoteFooter;
