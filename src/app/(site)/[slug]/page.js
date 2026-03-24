'use client';

import { useAppContext } from "@/app/components/AppContext";
import { usePathname } from 'next/navigation';
import { useMemo, useEffect, useState } from 'react';
import WorkGalleryV2 from "@/app/components/WorkGalleryV2";
import DirectorsPageFullBleed from "@/app/components/DirectorsPageFullBleed";
import WorkPageHeader from "@/app/components/WorkPageHeader";
import PageErrorState from "@/app/components/PageErrorState";
import LegalContent from "@/app/components/LegalContent";
import { getLegalBySlug } from "../../../../sanity/schemas/sanity-utils";
import { PortableText } from "@portabletext/react";
import { defaultPortableTextComponents } from "@/app/lib/portableTextConfig";

export default function Page() {
    const pathname = usePathname();
    const { allData } = useAppContext();
    const pagesData = allData?.pages || [];

    // Memoize page lookups for better performance
    const { pageTalent, pageWork, missingPages } = useMemo(() => {
        const talent = pagesData.find(page => page.slug === 'directors');
        const work = pagesData.find(page => page.slug === 'work');
        const missing = [];
        if (!talent) missing.push('Directors');
        if (!work) missing.push('Work');
        return { pageTalent: talent, pageWork: work, missingPages: missing };
    }, [pagesData]);

    // Determine current page type based on pathname
    const slug = useMemo(() => pathname?.split('/').filter(Boolean)[0] || '', [pathname]);
    const isTalentPage = pathname === '/directors';
    const isWorkPage = pathname === '/work';
    const isLegalPage = !isTalentPage && !isWorkPage && !!slug;

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
                            <PortableText value={legal.titleDescription} components={defaultPortableTextComponents} />
                        </div>
                    )}
                    {(!legalLoading && legal?.moreInfo) && (
                        <div className="contactInfo">
                            <PortableText value={legal.moreInfo} components={defaultPortableTextComponents} />
                        </div>
                    )}
                </header>
            )}
            

            {/* PAGE CONTENT */}
            <div className="pageContent">
                {/* Directors Page - full-bleed video, names (directors with directorsPageClip only) */}
                {isTalentPage && (
                    <DirectorsPageFullBleed directors={pageTalent.teamMembers} />
                )}

                {isWorkPage && (
                    <WorkGalleryV2 projects={pageWork.projects} />
                )}

                {isLegalPage && (!legalLoading) && (legal?.content ? <LegalContent value={legal.content} /> : <PageErrorState missingPages={['Legal']} />)}
            </div>
        </div>
    )
}
