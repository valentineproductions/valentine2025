'use client';

import { useAppContext } from "@/app/components/AppContext";
import { usePathname } from 'next/navigation';
import { useMemo, useEffect, useState } from 'react';
import TeamMembersGallery from "@/app/components/TeamMembersGallery";
import WorkGalleryV2 from "@/app/components/WorkGalleryV2";
import TalentHorizontalHeader from "@/app/components/TalentHorizontalHeader";
import DirectorsList from "@/app/components/DirectorsList";
import DirectorsListv4 from "@/app/components/DirectorsListv4";
import DirectorsListOpt2v4 from "@/app/components/DirectorsListOpt2v4";
import TalentPageHeaderOriginal from "@/app/components/TalentPageHeaderOriginal"; // Backup - original centered layout
import WorkPageHeader from "@/app/components/WorkPageHeader";
import PageFooter from "@/app/components/PageFooter";
import PageErrorState from "@/app/components/PageErrorState";
import TalentPageHeader from "@/app/components/TalentPageHeader";
import WorkGallery from "@/app/components/WorkGallery"; // Kept for future use
import SoonAnimation from "@/app/components/SoonAnimation";
import LegalContent from "@/app/components/LegalContent";
import { getLegalBySlug } from "../../../../sanity/schemas/sanity-utils";
import { PortableText } from "@portabletext/react";

export default function Page() {
    const pathname = usePathname();
    const { allData } = useAppContext();
    const pagesData = allData?.pages || [];

    // Memoize page lookups for better performance
    const { pageTalent, pageWork, missingPages } = useMemo(() => {
        const talent = pagesData.find(page => page.slug === 'talent');
        const work = pagesData.find(page => page.slug === 'work');
        const missing = [];
        if (!talent) missing.push('Talent');
        if (!work) missing.push('Work');
        return { pageTalent: talent, pageWork: work, missingPages: missing };
    }, [pagesData]);

    // Determine current page type based on pathname
    const slug = useMemo(() => pathname?.split('/').filter(Boolean)[0] || '', [pathname]);
    const isTalentPage = pathname === '/talent';
    const isWorkPage = pathname === '/work';
    const isLegalPage = !isTalentPage && !isWorkPage && !!slug;
    const currentPage = isTalentPage ? pageTalent : pageWork;

    // Legal data state
    const [legal, setLegal] = useState(null);
    const [legalLoading, setLegalLoading] = useState(false);

    useEffect(() => {
        let active = true;
        const fetchLegal = async () => {
            if (!isLegalPage) return;
            setLegalLoading(true);
            try {
                const doc = await getLegalBySlug(slug);
                if (active) setLegal(doc || null);
            } finally {
                if (active) setLegalLoading(false);
            }
        };
        fetchLegal();
        return () => { active = false; };
    }, [isLegalPage, slug]);

    // Error state
    if (missingPages.length > 0) {
        return <PageErrorState missingPages={missingPages} />;
    }

    return(
        // HEADERS
        <div className="pageContainer">
            {/* Dynamic Header based on current page */}
            
            {isTalentPage && (
                <TalentPageHeader 
                    pageTitle={pageTalent.pageTitle}
                    pageDescription={pageTalent.pageDescription}
                    contactInfo={pageTalent.contactInfo}
                />
            )}
            
            {/* {isTalentPage && (
                <TalentHorizontalHeader 
                    indexTitle={pageTalent.indexTitle}
                    pageTitle={pageTalent.pageTitle}
                    pageDescription={pageTalent.pageDescription}
                />
            )} */}
            
            {isWorkPage && (
                <WorkPageHeader 
                    pageTitle={pageWork.pageTitle}
                    pageDescription={pageWork.pageDescription}
                    contactInfo={pageWork.contactInfo}
                />
            )}

            {isLegalPage && (
                <header>
                    <h1 className="pageTitle">{legal?.title || (legalLoading ? '' : 'Page Not Found')}</h1>
                    {(!legalLoading && legal?.titleDescription) && (
                        <div className="pageDescription">
                            <PortableText value={legal.titleDescription} />
                        </div>
                    )}
                    {(!legalLoading && legal?.moreInfo) && (
                        <div className="contactInfo">
                            <PortableText value={legal.moreInfo} />
                        </div>
                    )}
                </header>
            )}
            

            {/* PAGE CONTENT */}
            <div className="pageContent">
                {/* Talent Page Content */}
                
                {/* MEMBERS SECTION v4 / this one will be a grid of 3 columns, each column will have a team member */}
                {/* {isTalentPage && (
                    <DirectorsListv4 directors={pageTalent.teamMembers} />
                )} */}

                {/* MEMBERS SECTION Opt2v4 / 30/70 split with updated styling 2026*/}
                {/* {isTalentPage && (
                    <DirectorsListOpt2v4 directors={pageTalent.teamMembers} />
                )} */}

                {/* MEMBERS SECTION v3 / under "DIRECTORY" */}
                {/* {isTalentPage && (
                    <DirectorsList directors={pageTalent.teamMembers} />
                )} */}
                
                {/* {isTalentPage && (
                    <TeamMembersGallery teamMembers={pageTalent.teamMembers} />
                )} */}

                {/* SoonAnimation alternative: */}
                {isTalentPage && (
                    <div className="gallery">
                        <SoonAnimation>{currentPage.tbd}</SoonAnimation>
                    </div>
                )}
               

                {/* Work Page Content */}
                {/* {isWorkPage && (
                    <WorkGalleryV2 projects={pageWork.projects} />
                )} */}
                {isWorkPage && (
                    <WorkGallery projects={pageWork.projects} />
                )}

                {isLegalPage && (!legalLoading) && (legal?.content ? <LegalContent value={legal.content} /> : <PageErrorState missingPages={['Legal']} />)}

                {/* Footer / Page Note */}
                <PageFooter pageNote={allData?.pageNote || allData?.homepage?.pageNote || allData?.aboutPage?.pageNote} />
            </div>
        </div>
    )
}
