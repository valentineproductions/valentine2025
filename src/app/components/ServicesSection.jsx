'use client';
import { PortableText } from '@portabletext/react';
import { defaultPortableTextComponents } from '@/app/lib/portableTextConfig';
import H2Animation from './H2Animator';
import DivsAnimator from './DivsAnimator';
import styles from './ServicesSection.module.css';

const ServicesSection = ({ homePageData }) => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {homePageData?.servicesTitle && (
          <H2Animation>
            {homePageData.servicesTitle}
          </H2Animation>
        )}
        <div className={styles.description}>
          {homePageData?.osDescription && (
            <span>
              <PortableText value={homePageData.osDescription} components={defaultPortableTextComponents} />
            </span>
          )}
        </div>
      </div>
      {/* Services list intentionally removed when empty */}
      <div className="locationsNemail">
        <div className="locationsCodes">
          <p>{homePageData.locations}</p>
        </div>
        <div className="homeEmail">
          <a href={`mailto:${homePageData.email}`}>{homePageData.email}</a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
