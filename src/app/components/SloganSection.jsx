'use client';
import Image from 'next/image';
import H2Animation from './H2Animator';

const SloganSection = ({ homePageData }) => {
  const hasLogo = !!homePageData?.logoSlogan;
  const showLogoToggle = homePageData?.showLogoSlogan;
  const showSloganToggle = homePageData?.showSlogan;
  const showLogo = showLogoToggle && hasLogo;
  const defaultToSlogan = showLogoToggle === undefined && showSloganToggle === undefined;
  const showText = (showSloganToggle || defaultToSlogan) && !showLogo;
  const logoAlt = homePageData?.logoSloganAlt || homePageData?.companyName || 'Logo slogan';

  return (
    <section className="sloganVideo two">
      <div className="SloganContainerVideo">
        <h1>{homePageData?.companyName || 'Valentine'}</h1>
        {showLogo ? (
          <Image
            src={homePageData.logoSlogan}
            alt={logoAlt}
            width={700}
            height={140}
            quality={100}
            className="logo-slogan-image"
          />
        ) : (
          showText && (
            <H2Animation>
              {homePageData?.slogan || 'Where Vision Meets Execution'}
            </H2Animation>
          )
        )}
        <div className="locationsNemail2">
          <div className="locationsCodes">
            <p>{homePageData.locations}</p>
          </div>
          <div className="homeEmail">
            <a href={`mailto:${homePageData.email}`}>{homePageData.email}</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SloganSection;
