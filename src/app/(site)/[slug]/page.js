'use client';

import { PortableText } from "@portabletext/react";
import Image from 'next/image';
import { useAppContext } from "@/app/components/AppContext";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import ImagesAnimation from "@/app/components/ImagesAnimation";
import TeamMembersGallery from "@/app/components/TeamMembersGallery";
// import SoonAnimation from "@/app/components/SoonAnimation";

export default function Page() {
    const pathname = usePathname();

    const { allData } = useAppContext();
    const pagesData = allData?.pages || [];  

    const pageTalent = pagesData.find(page => page.slug === 'talent');
    const pageWork = pagesData.find(page => page.slug === 'work');

        // State for shuffled images to ensure consistency between server and client
        const [shuffledImages, setShuffledImages] = useState([]);

        useEffect(() => {
            if (pageWork?.projects) {
              const allProjectImages = [];
              pageWork.projects.forEach((project) => {
                const images = [project.mainImage, ...(project.projectImages || [])].filter(Boolean);
                allProjectImages.push(...images);
              });
              
              // Don't slice here - pass full array to animation component
              const shuffled = [...allProjectImages].sort(() => Math.random() - 0.5);
              setShuffledImages(shuffled); // Remove .slice(0, 16)
            }
          }, [pageWork]);


    if (!pageTalent || !pageWork) {
        return (
            <div>
                <h1>Error loading content</h1>
                {!pageTalent && <p>Could not find the "Talent" page.</p>}
                {!pageWork && <p>Could not find the "Work" page.</p>}
            </div>
        );
    }

    // Determine current page type based on pathname
    const isTalentPage = pathname === '/talent';
    const isWorkPage = pathname === '/work';
    const currentPage = isTalentPage ? pageTalent : pageWork;

    return(
        <div className="pageContainer">
            {/* Dynamic Header based on current page */}
            <header className={isTalentPage ? "talent-page" : ""}>
                <h1 className="pageTitle">{currentPage.pageTitle}</h1>
                <div className="pageDescription">
                    <PortableText value={currentPage.pageDescription}/>
                </div>
                <div className="contactInfo">
                    <PortableText value={currentPage.contactInfo}/>
                </div>
            </header>
            
            <div className="pageContent">
                {/* Talent Page Content */}
                {isTalentPage && (
                    <TeamMembersGallery teamMembers={pageTalent.teamMembers} />
                )}
                {/* SoonAnimation alternative:
                {isTalentPage && (
                    <div className="gallery">
                        <SoonAnimation>{currentPage.tbd}</SoonAnimation>
                    </div>
                )}
                */}

                {/* Work Page  Content*/}
                
                {/* IF CURRENT PATH == /work do this */}
                {isWorkPage && pageWork.projects && pageWork.projects.length > 0 && (
                <ImagesAnimation 
                    allImages={shuffledImages} // Pass FULL array here
                    visibleCount={16}
                    intervalTime={4000}
                    fadeDuration={1000}
                >
                    {(visibleImages, fadingOut) => (
                    <div className="workImages">
                        {visibleImages.map((image, index) => (
                        <div 
                            key={`${image?.asset?.url}-${index}`}
                            className={`image-container ${fadingOut.includes(index) ? 'fade-out' : 'fade-in'}`}
                        >
                            <Image
                            src={image?.asset?.url || ''}
                            alt={image?.alt || 'Valentine Work Content'}
                            width={500}
                            height={500}
                            className="workProductImage"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                position: 'relative'
                            }}
                            quality={80}
                            loading="lazy"
                            unoptimized={image?.asset?.url?.endsWith('.gif')}
                            placeholder={image?.asset?.metadata?.lqip ? 'blur' : 'empty'}
                            blurDataURL={image?.asset?.metadata?.lqip || ''}
                            />
                        </div>
                        ))}
                    </div>
                    )}
                </ImagesAnimation>
                )}

                {/* Footer / Page Note */}

                <footer>
    {allData?.pageNote && (
        <div className="pageNote">
            <div className="leftSide">
                {allData.pageNote.workTitle && (
                    <div className="workSection">
                        <h2 className="pageNoteTitle">{allData.pageNote.workTitle}</h2>
                        {allData.pageNote.workDescription && (
                            <p className="pageNoteText">{allData.pageNote.workDescription}</p>
                        )}
                    </div>
                )}
                {allData.pageNote.connectTitle && (
                    <div className="connectSection">
                        <h2 className="pageNoteTitle">{allData.pageNote.connectTitle}</h2>
                        {allData.pageNote.connectLinks &&
                            allData.pageNote.connectLinks.map((link, index) => {
                                // Determine if the link is an email address
                                // Check for '@' AND ensure it doesn't start with 'http://' or 'https://'
                                const isEmail = link.linkUrl && 
                                                link.linkUrl.includes('@') && 
                                                !link.linkUrl.startsWith('http://') && 
                                                !link.linkUrl.startsWith('https://');
                                
                                console.log("IS IT?", isEmail, link.linkUrl); // Keep this for debugging

                                // Construct the href based on whether it's an email or a regular URL
                                const href = isEmail ? `mailto:${link.linkUrl}` : link.linkUrl;

                                // Determine target and rel attributes (only for non-email links that open in a new tab)
                                // Only apply target/rel if it's not an email AND openNewTab is true
                                const target = !isEmail && link.openNewTab ? "_blank" : undefined;
                                const rel = !isEmail && link.openNewTab ? "noopener noreferrer" : undefined;

                                return (
                                    <a
                                        key={index}
                                        href={href}
                                        className="contactLink"
                                        target={target}
                                        rel={rel}
                                    >
                                        {link.linkTitle}
                                    </a>
                                );
                            })}
                    </div>
                )}
            </div>
            {allData.pageNote.copyrightText && (
                <div className="copyRight">
                    <p className="copyRightText"> 
                        <b>{allData.pageNote.copyrightBrandName}</b> {allData.pageNote.copyrightText} {allData.pageNote.copyrightYear} {allData.pageNote.copyrightBrandName}
                    </p>
                </div>
            )}
        </div>
    )}
</footer>
            </div>

        </div>
    )
}