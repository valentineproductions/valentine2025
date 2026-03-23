'use client';
import { PortableText } from '@portabletext/react';
import { defaultPortableTextComponents } from '@/app/lib/portableTextConfig';
import H2Animation from './H2Animator';
import styles from './ServicesSection.module.css';
import LocationsAndEmail from './LocationsAndEmail';

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
      <LocationsAndEmail locations={homePageData?.locations} email={homePageData?.email} />
    </section>
  );
};

export default ServicesSection;
