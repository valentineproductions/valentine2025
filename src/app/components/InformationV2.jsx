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

const isNonEmptyText = (val) => typeof val === 'string' && val.trim() !== '';
const hasNonEmptyPortableText = (blocks) =>
  Array.isArray(blocks) &&
  blocks.some(
    (b) =>
      Array.isArray(b?.children) &&
      b.children.some((ch) => typeof ch?.text === 'string' && ch.text.trim() !== '')
  );

export default function InformationV2() {
  const { allData } = useAppContext();
  const info = allData?.aboutPageV2 || null;
  const [isMobile, setIsMobile] = useState(false);
  const resolveInfoLink = (url) => {
    if (!url || typeof url !== 'string') return null;
    if (url.startsWith('/')) return `https://valentine.global${url}`;
    return url;
  };

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
  const hasContactTitle = isNonEmptyText(info.contactInfoTitle);
  const hasContactItems = hasNonEmptyPortableText(info.contactInfoItems);
  const showContactSection = hasContactTitle || hasContactItems;
  const hasMoreTitle = isNonEmptyText(info.moreInfoTitle);
  const hasMoreItems = hasNonEmptyPortableText(info.moreInfoItems);
  const showMoreSection = hasMoreTitle || hasMoreItems;

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
          <h1 className={styles.pageTitle}>
            {info.title.split('\n').map((line, idx) => (
              <span key={idx}>
                {line}
                {idx < info.title.split('\n').length - 1 && <br />}
              </span>
            ))}
          </h1>
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
              <h2 className={styles.partnersSectionTitle}>{info.partnersTitle}</h2>
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
                      style={{ animationDelay: `${idx * 0.1}s`, animationDuration: '0.1s' }}
                    >
                      {showLogo && (
                        <img
                          src={p.logoImage.asset.url}
                          alt={p.logoImage.alt || p.name || 'Logo'}
                          className={styles.partnerLogo}
                        />
                      )}
                      <span className={styles.partnerName}>{p?.name}</span>
                    </span>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Contact Info */}
        {showContactSection && (
          <section className={styles.section}>
            {hasContactTitle && (
              <h2 className={styles.sectionTitle}>{info.contactInfoTitle}</h2>
            )}
            {hasContactItems && (
              <div className={styles.richList}>
                <PortableText value={info.contactInfoItems} components={richComponents} />
              </div>
            )}
          </section>
        )}

        {/* More Info */}
        {showMoreSection && (
          <section className={styles.section}>
            {hasMoreTitle && (
              <h2 className={styles.sectionTitle}>{info.moreInfoTitle}</h2>
            )}
            {hasMoreItems && (
              <div className={styles.richList}>
                <PortableText value={info.moreInfoItems} components={richComponents} />
              </div>
            )}
          </section>
        )}

        {/* Information Page Footer */}
        {(
          (Array.isArray(info.globalSectionUSLocations) && info.globalSectionUSLocations.length > 0) ||
          (Array.isArray(info.globalSectionInternationalLocations) && info.globalSectionInternationalLocations.length > 0) ||
          (Array.isArray(info.infoFooterLinks) && info.infoFooterLinks.length > 0)
        ) && (
          <footer className={styles.infoFooter}>
            <div className={styles.infoFooterGrid}>
              <div className={styles.footerLeft}>
                {(
                  (Array.isArray(info.globalSectionUSLocations) && info.globalSectionUSLocations.length > 0) ||
                  (Array.isArray(info.globalSectionInternationalLocations) && info.globalSectionInternationalLocations.length > 0)
                ) && (
                  <>
                    {info.globalSectionTitle && (
                      <h2 className={styles.footerTitle}>{info.globalSectionTitle}</h2>
                    )}
                    {Array.isArray(info.globalSectionUSLocations) && info.globalSectionUSLocations.length > 0 && (
                      <div className={styles.footerCities}>
                        {info.globalSectionUSLocations.map((loc, idx) => (
                          <span key={`city-us-${idx}`} className={styles.footerCityItem}>
                            {loc}
                          </span>
                        ))}
                      </div>
                    )}
                    {Array.isArray(info.globalSectionInternationalLocations) && info.globalSectionInternationalLocations.length > 0 && (
                      <div className={styles.footerCities}>
                        {info.globalSectionInternationalLocations.map((loc, idx) => (
                          <span key={`city-intl-${idx}`} className={styles.footerCityItem}>
                            {loc}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className={styles.footerRight}>
                {Array.isArray(info.infoFooterLinks) && info.infoFooterLinks.length > 0 && (
                  <div className={styles.footerLinks}>
                    {info.infoFooterLinks.map((item, idx) => {
                      const href = resolveInfoLink(item?.linkUrl);
                      const hasLink = !!href;
                      const label = item?.labelText || '';
                      const target = item?.openNewTab ? '_blank' : '_self';
                      const rel = item?.openNewTab ? 'noopener noreferrer' : undefined;
                      return (
                        <span key={`f-${idx}`} className={styles.footerLinkItem}>
                          {hasLink ? (
                            <a href={href} target={target} rel={rel}>
                              {label}
                            </a>
                          ) : (
                            label
                          )}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
