'use client';
import { PortableText } from '@portabletext/react';
import H2Animation from './H2Animator';
import Image from 'next/image';

const ApproachSection = ({ homePageData }) => {
  return (
    <section className="approachSection five">
      <div className="approachContainer">
        <H2Animation>{homePageData?.approachTitle || 'Approach'}</H2Animation>
        <div className="approachDescription">
          <span>
            <PortableText value={homePageData?.aDescription || 'We listen.'} />
          </span>
          {homePageData?.logosImageDesktop && homePageData?.logosImageMobile && (
            <div className="logos-image-container">
              <Image
                src={homePageData.logosImageDesktop}
                alt={`${homePageData.approachTitle} logos`}
                width={1000}
                height={60}
                quality={100}
                className="logos-image desktop-logos"
              />
              <Image
                src={homePageData.logosImageMobile}
                alt={`${homePageData.approachTitle} logos`}
                width={500}
                height={30}
                quality={100}
                className="logos-image mobile-logos"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ApproachSection;
