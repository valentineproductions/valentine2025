'use client';

import { useAppContext } from "@/app/components/AppContext";
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import TeamMembersGallery from "@/app/components/TeamMembersGallery";
import WorkGalleryV2 from "@/app/components/WorkGalleryV2";
import TalentHorizontalHeader from "@/app/components/TalentHorizontalHeader";
// import TalentPageHeaderOriginal from "@/app/components/TalentPageHeaderOriginal"; // Backup - original centered layout
import WorkPageHeader from "@/app/components/WorkPageHeader";
import PageFooter from "@/app/components/PageFooter";
import PageErrorState from "@/app/components/PageErrorState";
// import WorkGallery from "@/app/components/WorkGallery"; // Kept for future use
// import SoonAnimation from "@/app/components/SoonAnimation";

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
    const isTalentPage = pathname === '/talent';
    const isWorkPage = pathname === '/work';

    // Error state
    if (missingPages.length > 0) {
        return <PageErrorState missingPages={missingPages} />;
    }

    return(
        // HEADERS
        <div className="pageContainer">
            {/* Dynamic Header based on current page */}
            {/* <TalentPageHeader Original - centered layout> */}
            {isTalentPage && (
                <TalentHorizontalHeader 
                    indexTitle={pageTalent.indexTitle}
                    pageTitle={pageTalent.pageTitle}
                    pageDescription={pageTalent.pageDescription}
                />
            )}
            {isWorkPage && (
                <WorkPageHeader 
                    pageTitle={pageWork.pageTitle}
                    pageDescription={pageWork.pageDescription}
                    contactInfo={pageWork.contactInfo}
                />
            )}

            

            {/* PAGE CONTENT */}
            <div className="pageContent">
                {/* Talent Page Content */}
                {/* {isTalentPage && (
                    <TeamMembersGallery teamMembers={pageTalent.teamMembers} />
                )} */}

                {/* SoonAnimation alternative:
                {isTalentPage && (
                    <div className="gallery">
                        <SoonAnimation>{currentPage.tbd}</SoonAnimation>
                    </div>
                )}
                */}

                {/* Work Page Content */}
                {isWorkPage && (
                    <WorkGalleryV2 projects={pageWork.projects} />
                )}

                {/* Footer / Page Note */}
                <PageFooter pageNote={allData?.pageNote} />
            </div>
        </div>
    )
}