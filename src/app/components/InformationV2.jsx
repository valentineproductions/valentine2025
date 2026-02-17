'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { useAppContext } from './AppContext';
import styles from './InformationV2.module.css';
import PageFooter from './PageFooter';

function autoLinkChildren(children) {
  const emailRegex = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
  const linkify = (text) => {
    const parts = text.split(emailRegex);
    return parts.map((part, i) => {
      if (emailRegex.test(part)) {
        return <a key={`e-${i}`} href={`mailto:${part}`}>{part}</a>;
      }
      return part;
    });
  };
  return React.Children.map(children, (child) => {
    if (typeof child === 'string') return linkify(child);
    return child;
  });
}

const richComponents = {
  block: {
    normal: ({ children }) => (
      <p className={styles.richItem}>{autoLinkChildren(children)}</p>
    ),
  },
};

export default function InformationV2() {
  const { allData } = useAppContext();
  const info = allData?.aboutPageV2 || null;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth <= 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!info) {
    return <div className={styles.container}><div className={styles.pageWrapper}>Information Page Not Found</div></div>;
  }

  const bgOpacity = typeof info.backgroundOpacity === 'number' ? info.backgroundOpacity : 0.2;
  const partners = Array.isArray(info.partners) ? info.partners : [];
  const partnerNames = partners.map(p => p?.name).filter(Boolean);

  return (
    <div className={styles.container}>
      {/* Background V overlay */}
      {info.backgroundImage?.asset?.url && (
        <div className={styles.background} style={{ opacity: bgOpacity }}>
          <Image
            src={info.backgroundImage.asset.url}
            alt={info.backgroundImage.alt || 'Background'}
            fill
            style={{ objectFit: 'contain', pointerEvents: 'none' }}
            priority
          />
        </div>
      )}

      <div className={styles.pageWrapper}>
        {/* Title */}
        {info.title && (
          <h1 className={styles.pageTitle}>{info.title}</h1>
        )}

        {/* Description */}
        {info.pageDescription && (
          <div className={styles.pageDescription}>
            {isMobile ? (
              (() => {
                const blocks = Array.isArray(info.pageDescription) ? info.pageDescription : [];
                const result = [];
                let acc = [];
                blocks.forEach((b) => {
                  const text =
                    Array.isArray(b?.children)
                      ? b.children.map((ch) => ch?.text || '').join('')
                      : '';
                  const empty = text.trim() === '';
                  if (empty) {
                    if (acc.length > 0) {
                      result.push(acc.join(' '));
                      acc = [];
                    }
                    result.push(null);
                  } else {
                    acc.push(text);
                  }
                });
                if (acc.length > 0) result.push(acc.join(' '));
                return result.map((val, idx) =>
                  val === null ? <p key={idx} className={styles.break}></p> : <p key={idx}>{val}</p>
                );
              })()
            ) : (
              <PortableText
                value={info.pageDescription}
                components={{
                  block: {
                    normal: ({ children, value }) => {
                      const empty =
                        Array.isArray(value?.children) &&
                        value.children.every(
                          (ch) => typeof ch.text !== 'string' || ch.text.trim() === ''
                        );
                      return empty ? (
                        <p className={styles.break}></p>
                      ) : (
                        <p>{children}</p>
                      );
                    },
                  },
                }}
              />
            )}
          </div>
        )}

        {/* Partners */}
        {(info.partnersTitle || partnerNames.length > 0) && (
          <section className={styles.section}>
            {info.partnersTitle && (
              <h2 className={styles.sectionTitle}>{info.partnersTitle}</h2>
            )}
            {partnerNames.length > 0 && (
              <div className={styles.partnerLine}>
                {partners.map((p, idx) => {
                  const showLogo = !!p?.logoImage?.asset?.url;
                  const isLast = idx === partners.length - 1;
                  return (
                    <span
                      key={idx}
                      className={styles.partnerItem}
                      style={{ animationDelay: `${idx * 0.7}s` }}
                    >
                      {showLogo && (
                        <img
                          src={p.logoImage.asset.url}
                          alt={p.logoImage.alt || p.name || 'Logo'}
                          className={styles.partnerLogo}
                        />
                      )}
                      <span className={styles.partnerName}>{p?.name}</span>
                      {!isLast && <span className={styles.separator}> / </span>}
                    </span>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Contact Info */}
        {(info.contactInfoTitle || info.contactInfoItems) && (
          <section className={styles.section}>
            {info.contactInfoTitle && (
              <h2 className={styles.sectionTitle}>{info.contactInfoTitle}</h2>
            )}
            {info.contactInfoItems && (
              <div className={styles.richList}>
                <PortableText value={info.contactInfoItems} components={richComponents} />
              </div>
            )}
          </section>
        )}

        {/* More Info */}
        {(info.moreInfoTitle || info.moreInfoItems) && (
          <section className={styles.section}>
            {info.moreInfoTitle && (
              <h2 className={styles.sectionTitle}>{info.moreInfoTitle}</h2>
            )}
            {info.moreInfoItems && (
              <div className={styles.richList}>
                <PortableText value={info.moreInfoItems} components={richComponents} />
              </div>
            )}
          </section>
        )}

        {/* Global Section */}
        {(info.globalSectionTitle || (Array.isArray(info.globalSectionLocations) && info.globalSectionLocations.length > 0)) && (
          <section className={styles.section}>
            {info.globalSectionTitle && (
              <h2 className={styles.sectionTitle}>{info.globalSectionTitle}</h2>
            )}
            {Array.isArray(info.globalSectionLocations) && info.globalSectionLocations.length > 0 && (
              <div className={styles.globalLine}>
                <span className={styles.globalNames}>
                  {info.globalSectionLocations.map((loc, idx) => (
                    <span
                      key={`g-${idx}`}
                      className={styles.globalItem}
                      style={{ animationDelay: `${idx * 0.7}s` }}
                    >
                      {loc}
                    </span>
                  ))}
                </span>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Footer at the end */}
      <PageFooter pageNote={allData?.pageNote || allData?.homepage?.pageNote || allData?.aboutPage?.pageNote} />
    </div>
  );
}
