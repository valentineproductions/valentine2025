'use client';

import Image from 'next/image';
import StickySidebar from '@/app/components/StickySidebar';
// import { getAboutPage } from "../../../../sanity/schemas/sanity-utils";
import { useAppContext } from '@/app/components/AppContext';
import AboutAnimations from '@/app/components/AboutAnimations';
import AboutInitAnimation from '@/app/components/AboutInitAnimation';
// import TypeAnimation from '@/app/components/TypeAnimation';

// Elements within AboutAnimations and with the attribute data-animate will get animated

// export const revalidate = 300; // Revalidate every 5 minutes

export default function About() {
    // const aboutPageData = await getAboutPage()
    const { allData } = useAppContext();
    const aboutPageData = allData?.aboutPage || null;
    //console.log("@AB------About Page Data:", aboutPageData); //is working

    if (!aboutPageData) {
        return <div>About Page Not Found</div>
    }
    return (
        <AboutAnimations>
        <div className="pageContent">
            <div className="aboutPage">
            <div className="aboutMain">
                
                {/* Philosophy Section */}
                <AboutInitAnimation>
                <section className="sectionContainer">
                    <div className="aboutContent">
                        <h2 className="aboutTitle" data-init-animate>{aboutPageData.philosophyTitle}</h2>
                            {aboutPageData.philosophyDescription1 && (
                                <p className="aboutText" data-init-animate>{aboutPageData.philosophyDescription1}</p>
                            )}
                    </div>
                    {aboutPageData.philosophyProjectData && (
                        <div className="aboutProject">
                            <div className="clientInfo" data-init-animate>
                                <h3 className="clientTitle">{aboutPageData.philosophyProjectData.clientName}</h3>
                                <h3 className="projectTitle">{aboutPageData.philosophyProjectData.name}</h3>
                                <h3 className="projectYear">{aboutPageData.philosophyProjectData.projectYear}</h3>
                            </div>
                            {aboutPageData.philosophyProjectData.projectImages && (
                            <div className="projectImages" data-init-animate>
                                {aboutPageData.philosophyProjectData.projectImages
                                .slice(0, aboutPageData.philosophyImageCount) // Limit the array
                                .map((image, index) => (
                                    image?.asset?.url && (
                                        <Image
                                        key={index}
                                        src={image.asset.url}
                                        alt={image.alt || aboutPageData.philosophyProjectData.name}
                                        className="aboutProductImage" // Keep your CSS class
                                        quality={80}
                                        loading="lazy"
                                        unoptimized={image?.asset?.url?.endsWith('.gif')} //  Important:  Handle GIFs correctly
                                        width={500}  //  Set Width and Height to 0
                                        height={1000}
                                        style={{ width: '90%', height: 'auto' }} //  Make image responsive
                                        />
                                    )
                                ))}
                            </div>
                            )}
                            <div className="projectIntro" data-animate>
                                {aboutPageData.philosophyDescription2 && (
                                <p className="projectDescription">{aboutPageData.philosophyDescription2}</p>
                                )}
                                {aboutPageData.philosophyFeaturedImage?.asset?.url && (
                                <div className='featureAnimated' data-animate>
                                    <Image
                                    src={aboutPageData.philosophyFeaturedImage.asset.url}
                                    alt={aboutPageData.philosophyFeaturedImage.alt || "Featured Image"}
                                    width={
                                    aboutPageData.philosophyFeaturedImageSize === 'tall' ? 405 : 528
                                    }
                                    height={
                                    aboutPageData.philosophyFeaturedImageSize === 'tall' ? 541 : 339
                                    }
                                    className={`featuredImage ${aboutPageData.philosophyFeaturedImageSize}FeaturedImage`}
                                />
                                </div>
                                )}
                            </div>
                        </div>
                    )}
                </section>
                </AboutInitAnimation>

                {/* Our Story Section */}
                <section className="sectionContainer">
                <div className="aboutContent">
                    <h2 className="aboutTitle" data-animate>{aboutPageData.storyTitle}</h2>
                    {aboutPageData.storyDescription1 && (
                    <p className="aboutText" data-animate>{aboutPageData.storyDescription1}</p>
                    )}
                </div>
                {aboutPageData.storyProjectData && (
                    <div className="aboutProject">
                        <div className="clientInfo" data-animate>
                            <h3 className="clientTitle">{aboutPageData.storyProjectData.clientName}</h3>
                            <h3 className="projectTitle">{aboutPageData.storyProjectData.name}</h3>
                            <h3 className="projectYear">{aboutPageData.storyProjectData.projectYear}</h3>
                        </div>
                        {aboutPageData.storyProjectData.projectImages && (
                            <div className="projectImages" data-animate>
                            {aboutPageData.storyProjectData.projectImages
                                .slice(0, aboutPageData.storyImageCount) // Limit the array
                                .map((image, index) => (
                                image?.asset?.url && (
                                    <img
                                    key={index}
                                    src={image.asset.url}
                                    alt={image.alt || aboutPageData.storyProjectData.name}
                                    className="aboutProductImage"
                                    />
                                )
                                ))}
                            </div>
                        )}
                        <div className="projectIntro">
                            {aboutPageData.storyDescription2 && (
                            <p className="projectDescription" data-animate>{aboutPageData.storyDescription2}</p>
                            )}
                            {aboutPageData.storyFeaturedImage?.asset?.url && (
                            <div className='featureAnimated' data-animate>
                                <Image
                                src={aboutPageData.storyFeaturedImage.asset.url}
                                alt={aboutPageData.storyFeaturedImage.alt || "Featured Image"}
                                width={
                                aboutPageData.storyFeaturedImageSize === 'tall' ? 405 : 528
                                }
                                height={
                                aboutPageData.storyFeaturedImageSize === 'tall' ? 541 : 339
                                }
                                className={`featuredImage ${aboutPageData.storyFeaturedImageSize}FeaturedImage`}/>
                            </div>
                            )}
                        </div>
                    </div>
                )}
                </section>

                {/* Who We Are Section */}
                <section className="sectionContainer lastSection">
                    <div className="aboutContent">
                        <h2 className="aboutTitle" data-animate>{aboutPageData.whoTitle}</h2>
                        {aboutPageData.whoDescription1 && (
                        <p className="aboutText"data-animate>{aboutPageData.whoDescription1}</p>
                        )}
                    </div>
                    {aboutPageData.whoProjectData && (
                        <div className="aboutProject">
                            <div className="clientInfo" data-animate>
                                <h3 className="clientTitle">{aboutPageData.whoProjectData.clientName}</h3>
                                <h3 className="projectTitle">{aboutPageData.whoProjectData.name}</h3>
                                <h3 className="projectYear">{aboutPageData.whoProjectData.projectYear}</h3>
                            </div>
                            {aboutPageData.whoProjectData.projectImages && (
                                <div className="projectImages" data-animate>
                                {aboutPageData.whoProjectData.projectImages
                                    .slice(0, aboutPageData.whoImageCount) // Limit the array
                                    .map((image, index) => (
                                    image?.asset?.url && (
                                        <img
                                        key={index}
                                        src={image.asset.url}
                                        alt={image.alt || aboutPageData.whoProjectData.name}
                                        className="aboutProductImage"
                                        />
                                    )
                                    ))}
                                </div>
                            )}
                            <div className="projectIntro">
                                {aboutPageData.whoDescription2 && (
                                <p className="projectDescription" data-animate>{aboutPageData.whoDescription2}</p>
                                )}
                                {aboutPageData.whoFeaturedImage?.asset?.url && (
                                <div className='featureAnimated' data-animate><Image
                                    src={aboutPageData.whoFeaturedImage.asset.url}
                                    alt={aboutPageData.whoFeaturedImage.alt || "Featured Image"}
                                    width={
                                    aboutPageData.whoFeaturedImageSize === 'tall' ? 405 : 528
                                    }
                                    height={
                                    aboutPageData.whoFeaturedImageSize === 'tall' ? 541 : 339
                                    }
                                    className={`featuredImage ${aboutPageData.whoFeaturedImageSize}FeaturedImage`}
                                /></div>
                                )}
                            </div>
                        </div>
                    )}
                </section>
            </div>


            <StickySidebar>
                {aboutPageData.pageNote && (
                <div className="pageNote">
                    {aboutPageData.pageNote.workTitle && (
                    <div className="workSection">
                        <h2 className="pageNoteTitle">{aboutPageData.pageNote.workTitle}</h2>
                        {aboutPageData.pageNote.workDescription && (
                        <p className="pageNoteText">{aboutPageData.pageNote.workDescription}</p>
                        )}
                    </div>
                    )}

                    {/* Connect Section */}
                    {aboutPageData.pageNote.connectTitle && (
                    <div className="connectSection">
                        <h2 className="pageNoteTitle">{aboutPageData.pageNote.connectTitle}</h2>
                        {aboutPageData.pageNote.connectLinks &&
                        aboutPageData.pageNote.connectLinks.map((link, index) => (
                            <a
                            key={index}
                            href={link.linkUrl}
                            className="contactLink"
                            target={link.openNewTab ? "_blank" : undefined}
                            rel={link.openNewTab ? "noopener noreferrer" : undefined}
                            >
                            {link.linkTitle}
                            </a>
                        ))}
                    </div>
                    )}

                    {/* Departments */}
                    {aboutPageData.pageNote.aboutDepartment1 && (
                    <div className="departmentsSection">
                        {aboutPageData.pageNote.aboutDepartment1 && (
                        <h2 className="pageNoteTitle">{aboutPageData.pageNote.aboutDepartment1}</h2>
                        )}
                        {aboutPageData.pageNote.aboutEmailD1 && (
                        <a href={`mailto:${aboutPageData.pageNote.aboutEmailD1}`}>{aboutPageData.pageNote.aboutEmailD1}</a>
                        )}
                        
                        {aboutPageData.pageNote.aboutDepartment2 && (
                        <h2 className="pageNoteTitle">{aboutPageData.pageNote.aboutDepartment2}</h2>
                        )}
                        {aboutPageData.pageNote.aboutEmailD2 && (
                        <a href={`mailto:${aboutPageData.pageNote.aboutEmailD2}`}>{aboutPageData.pageNote.aboutEmailD2}</a>
                        )}
                        
                        {aboutPageData.pageNote.aboutDepartment3 && (
                        <h2 className="pageNoteTitle">{aboutPageData.pageNote.aboutDepartment3}</h2>
                        )}
                        {aboutPageData.pageNote.aboutEmailD3 && (
                        <a href={`mailto:${aboutPageData.pageNote.aboutEmailD3}`}>{aboutPageData.pageNote.aboutEmailD3}</a>
                        )}
                    </div>
                    )}

                    {aboutPageData.pageNote.copyrightText && (
                    <div className="copyRight">
                        <p className="copyRightText"><b>{aboutPageData.pageNote.copyrightBrandName}</b> {aboutPageData.pageNote.copyrightText} {aboutPageData.pageNote.copyrightYear} {aboutPageData.pageNote.copyrightBrandName}</p>
                    </div>
                    )}
                </div>
                )}
            </StickySidebar>
            
        </div>
        <footer className="aboutFooter">
                    {aboutPageData?.pageNote && (
                        <div className="pageNote">
                            <div className="leftSide">
                            {aboutPageData.pageNote.workTitle && (
                                <div className="workSection">
                                <h2 className="pageNoteTitle">{aboutPageData.pageNote.workTitle}</h2>
                                {aboutPageData.pageNote.workDescription && (
                                    <p className="pageNoteText">{aboutPageData.pageNote.workDescription}</p>
                                )}
                                </div>
                            )}
                            {aboutPageData.pageNote.connectTitle && (
                                <div className="connectSection">
                                <h2 className="pageNoteTitle">{aboutPageData.pageNote.connectTitle}</h2>
                                {aboutPageData.pageNote.connectLinks &&
                                    aboutPageData.pageNote.connectLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.linkUrl}
                                        className="contactLink"
                                        target={link.openNewTab ? "_blank" : undefined}
                                        rel={link.openNewTab ? "noopener noreferrer" : undefined}
                                    >
                                        {link.linkTitle}
                                    </a>
                                    ))}
                                </div>
                            )}
                            </div>
                            {aboutPageData.pageNote.copyrightText && (
                            <div className="copyRight"><p className="copyRightText"> <b>{aboutPageData.pageNote.copyrightBrandName}</b> {aboutPageData.pageNote.copyrightText} {aboutPageData.pageNote.copyrightYear} {aboutPageData.pageNote.copyrightBrandName}</p>
                            </div>
                            )}
                        </div>
                    )}
                </footer>
        </div>
        </AboutAnimations>
        
        
    );
}