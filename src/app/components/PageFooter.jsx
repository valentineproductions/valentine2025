'use client';

import styles from './PageFooter.module.css';
import { useState } from 'react';

export default function PageFooter({ pageNote }) {
  if (!pageNote) return null;
  const [showPolicy, setShowPolicy] = useState(false);
  const [connectClicks, setConnectClicks] = useState(0);
  const onConnectTitleClick = () => {
    const next = connectClicks + 1;
    setConnectClicks(next);
    if (next >= 3) setShowPolicy(true);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.pageNote}>
        <div className={styles.leftSide}>
          {pageNote.workTitle && (
            <div className={styles.workSection}>
              <h2 className={styles.pageNoteTitle}>{pageNote.workTitle}</h2>
              {pageNote.workDescription && (
                <p className={styles.pageNoteText}>{pageNote.workDescription}</p>
              )}
            </div>
          )}
          {pageNote.connectTitle && (
            <div className={styles.connectSection}>
              <h2 className={styles.pageNoteTitle} onClick={onConnectTitleClick}>{pageNote.connectTitle}</h2>
              {pageNote.connectLinks && (() => {
                const filteredLinks = showPolicy
                  ? pageNote.connectLinks
                  : pageNote.connectLinks.filter(l => {
                      const url = (l.linkUrl || '').toLowerCase();
                      const isPolicyPath =
                        url === '/policy' ||
                        url.endsWith('/policy') ||
                        url.includes('/policy?') ||
                        url.includes('/policy#');
                      return !isPolicyPath;
                    });
                return filteredLinks.map((link, index) => {
                  // Determine if the link is an email address
                  const isEmail = link.linkUrl && 
                                  link.linkUrl.includes('@') && 
                                  !link.linkUrl.startsWith('http://') && 
                                  !link.linkUrl.startsWith('https://');

                  // Construct the href based on whether it's an email or a regular URL
                  const href = isEmail ? `mailto:${link.linkUrl}` : link.linkUrl;

                  // Determine target and rel attributes (only for non-email links that open in a new tab)
                  const target = !isEmail && link.openNewTab ? "_blank" : undefined;
                  const rel = !isEmail && link.openNewTab ? "noopener noreferrer" : undefined;

                  return (
                    <a
                      key={index}
                      href={href}
                      className={styles.contactLink}
                      target={target}
                      rel={rel}
                    >
                      {link.linkTitle}
                    </a>
                  );
                });
              })()}
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
    </footer>
  );
}
