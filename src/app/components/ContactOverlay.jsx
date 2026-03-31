'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useAppContext } from './AppContext';
import { useWorkPageChrome } from './WorkModeContext';
import styles from './ContactOverlay.module.css';

function formatMailto(email) {
  if (!email || !String(email).trim()) return null;
  const e = String(email).trim();
  if (e.startsWith('mailto:')) return e;
  return `mailto:${e}`;
}

export default function ContactOverlay() {
  const { allData } = useAppContext();
  const pathname = usePathname();
  const workChrome = useWorkPageChrome();
  const pageNote = allData?.pageNote;

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const isStudio = pathname?.startsWith?.('/studio');
  const isDirectorsPage =
    pathname === '/directors' || pathname?.startsWith?.('/directors/');
  const isWorkPage = pathname === '/work';
  const workContactChrome =
    isWorkPage && workChrome?.mode === 'stills'
      ? styles.contactBarWorkStills
      : isWorkPage && workChrome?.mode === 'motion'
        ? styles.contactBarWorkMotion
        : '';

  const handleClose = useCallback(() => setClosing(true), []);

  useEffect(() => {
    if (!open && !closing) return;
    const onEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, closing, handleClose]);

  const handleAnimationEnd = (e) => {
    if (closing && e.target === e.currentTarget) {
      setOpen(false);
      setClosing(false);
    }
  };

  if (isStudio || !pageNote) return null;

  const hasIntro =
    (pageNote.copyrightBrandName && pageNote.copyrightBrandName.trim()) ||
    (pageNote.copyrightText && pageNote.copyrightText.trim());

  const hasDept1 =
    (pageNote.aboutDepartment1 && pageNote.aboutDepartment1.trim()) ||
    (pageNote.aboutEmailD1 && pageNote.aboutEmailD1.trim());

  const hasDept2 =
    (pageNote.aboutDepartment2 && pageNote.aboutDepartment2.trim()) ||
    (pageNote.aboutEmailD2 && pageNote.aboutEmailD2.trim());

  const cities = Array.isArray(pageNote.cities) ? pageNote.cities : [];
  const hasCities = cities.some((c) => c?.cityTitle?.trim());

  const links = Array.isArray(pageNote.connectLinks) ? pageNote.connectLinks : [];
  const hasLinks = links.length > 0;

  const hasOverlayContent =
    hasIntro || hasDept1 || hasDept2 || hasCities || hasLinks;

  if (!hasOverlayContent) return null;

  return (
    <>
      <div
        className={`${styles.contactBar} ${styles.contactBarEnter}${isDirectorsPage ? ` ${styles.contactBarLight}` : ''}${workContactChrome ? ` ${workContactChrome}` : ''}`}
      >
        <button
          type="button"
          className={styles.contactTrigger}
          data-contact-trigger
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open || closing}
        >
          CONTACT
        </button>
      </div>

      {(open || closing) && (
        <div
          className={`${styles.overlay} ${closing ? styles.overlayClosing : styles.overlayEnter}`}
          role="dialog"
          aria-modal="true"
          aria-label="Contact"
          onAnimationEnd={handleAnimationEnd}
        >
          <div className={styles.backdrop} onClick={handleClose} aria-hidden />
          <div className={styles.inner} onClick={(e) => e.stopPropagation()}>
            <div className={styles.panel}>
              {hasIntro && (
                <p className={styles.introLine}>
                  {pageNote.copyrightBrandName?.trim() && (
                    <span className={styles.brandInline}>
                      {pageNote.copyrightBrandName.trim()}
                    </span>
                  )}
                  {pageNote.copyrightBrandName?.trim() && pageNote.copyrightText?.trim()
                    ? ' '
                    : null}
                  {pageNote.copyrightText?.trim() && pageNote.copyrightText.trim()}
                </p>
              )}

              {(hasDept1 || hasDept2) && (
                <div className={styles.departments}>
                  {hasDept1 && (
                    <div className={styles.deptRow}>
                      {pageNote.aboutDepartment1?.trim() && (
                        <span className={styles.deptLabel}>{pageNote.aboutDepartment1.trim()}</span>
                      )}
                      {pageNote.aboutEmailD1?.trim() && (
                        <a href={formatMailto(pageNote.aboutEmailD1)} className={styles.email}>
                          {pageNote.aboutEmailD1.trim()}
                        </a>
                      )}
                    </div>
                  )}
                  {hasDept2 && (
                    <div className={styles.deptRow}>
                      {pageNote.aboutDepartment2?.trim() && (
                        <span className={styles.deptLabel}>{pageNote.aboutDepartment2.trim()}</span>
                      )}
                      {pageNote.aboutEmailD2?.trim() && (
                        <a href={formatMailto(pageNote.aboutEmailD2)} className={styles.email}>
                          {pageNote.aboutEmailD2.trim()}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {hasCities && (
                <p className={styles.cities}>
                  {cities
                    .map((c) => (c?.cityTitle || '').trim())
                    .filter(Boolean)
                    .join(' / ')}
                </p>
              )}

              {hasLinks && (
                <div className={styles.connect}>
                  <p className={styles.connectLine}>
                    {links.map((link, index) => {
                      const isEmail =
                        link.linkUrl &&
                        link.linkUrl.includes('@') &&
                        !link.linkUrl.startsWith('http://') &&
                        !link.linkUrl.startsWith('https://');
                      const href = isEmail ? `mailto:${link.linkUrl}` : link.linkUrl;
                      const target = !isEmail && link.openNewTab ? '_blank' : undefined;
                      const rel = !isEmail && link.openNewTab ? 'noopener noreferrer' : undefined;
                      const key = link._key || `${link.linkUrl}-${link.linkTitle}-${index}`;
                      return (
                        <span key={key}>
                          {index > 0 && ' / '}
                          <a href={href} className={styles.socialLink} target={target} rel={rel}>
                            {link.linkTitle}
                          </a>
                        </span>
                      );
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
