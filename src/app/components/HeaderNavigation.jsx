'use client';

import "./../globals.css";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import MenuAnimation from './MenuAnimation';
import { useAppContext } from './AppContext';
import { useWorkPageChrome } from './WorkModeContext';
import workPageNav from './WorkPageNav.module.css';

export default function HeaderNavigation() { // Default empty array
    
    const pathname = usePathname();
    const workChrome = useWorkPageChrome();
    // console.log("Current PATH :", pathname); // To check the current page
    const isHomePage = pathname === '/';
    const isDirectorsPage = pathname === '/directors' || pathname?.startsWith?.('/directors/');
    const isWorkPage = pathname === '/work';
    const headerClasses = [
        'navBar',
        isHomePage ? 'homeNavBar' : '',
        isDirectorsPage ? 'directorsNavBar' : '',
        isWorkPage ? 'workNavBar' : '',
        isWorkPage && workChrome?.workNavHidden ? 'workNavHidden' : '',
        isWorkPage && workChrome?.workNavStillsLight ? 'workNavStillsLight' : '',
    ].filter(Boolean).join(' ');
    const [isMobile, setIsMobile] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { allData } = useAppContext();
    const pages = allData?.pages || []; // Access the 'pages' array
    const showCareersInNav = allData?.careersPage?.showInNav !== false;
    const showInformationInNav = allData?.aboutPageV2?.showInNav !== false;
    // console.log("K------NAV WORKS Page Data:", pages); // Is working

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 575);
            const handleResize = () => setIsMobile(window.innerWidth <= 575);
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    useEffect(() => {
        const handleEscape = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
        if (menuOpen) {
            window.addEventListener('keydown', handleEscape);
            return () => window.removeEventListener('keydown', handleEscape);
        }
    }, [menuOpen]);

    const isDirectorProjectVideoPage = /^\/directors\/(?!category\/)[^/]+\/[^/]+$/.test(pathname || '');
    if (isDirectorProjectVideoPage) return null;

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Normalize href to prevent hydration mismatch (server /work vs client /work/)
    const toHref = (slug) => {
        const clean = String(slug || '').replace(/\/$/, '');
        return clean ? `/${clean}` : '/';
    };
    const pathNorm = (p) => (String(p || '').replace(/\/$/, '') || '/');

    // Safely get logo data with fallbacks (use white logo on Work page)
    const logoData =
        (isWorkPage || isHomePage ? pages[0]?.pageCompanyLogoWhite : pages[0]?.pageCompanyLogo) || {};

    const workLogoChromeClass =
        isWorkPage ? '' : (workChrome && !workChrome?.workNavStillsLight ? 'workNavLogoInvert' : '');

    const handleLogoClick = () => {
        if (menuOpen) setMenuOpen(false);
    };

    const slugLinks = isWorkPage ? ['directors'] : ['work', 'directors'];

    const WorkModeToggle = ({ mobile }) => {
        if (!workChrome) return null;
        const theme = workChrome.workNavStillsLight
            ? workPageNav.themeStills
            : workPageNav.themeMotion;
        return (
            <div
                className={[
                    workPageNav.workModeToggle,
                    mobile ? workPageNav.workModeToggleMobile : '',
                    theme,
                ].filter(Boolean).join(' ')}
                role="group"
                aria-label="Work view mode"
            >
                <button
                    type="button"
                    className={[
                        workPageNav.workModeOpt,
                        workChrome.mode === 'motion'
                            ? workPageNav.workModeOptActive
                            : workPageNav.workModeOptMuted,
                    ].join(' ')}
                    onClick={() => { workChrome.setMode('motion'); if (mobile) setMenuOpen(false); }}
                >
                    Motion
                </button>
                <span className={workPageNav.workModeSep} aria-hidden>
                    /
                </span>
                <button
                    type="button"
                    className={[
                        workPageNav.workModeOpt,
                        workChrome.mode === 'stills'
                            ? workPageNav.workModeOptActive
                            : workPageNav.workModeOptMuted,
                    ].join(' ')}
                    onClick={() => { workChrome.setMode('stills'); if (mobile) setMenuOpen(false); }}
                >
                    Stills
                </button>
            </div>
        );
    };

    const openContact = (onItemClick) => () => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('valentine-open-contact'));
        }
        onItemClick?.();
    };

    const renderPageLinks = (onItemClick) => (
        <>
            {slugLinks.map((slug) => {
                const page = pages.find((p) => p.slug === slug);
                return page ? (
                    <Link key={page._id} href={toHref(page.slug)} onClick={onItemClick}>
                        {pathNorm(pathname) === toHref(page.slug) ? <b>{page.navTitle}</b> : page.navTitle}
                    </Link>
                ) : null;
            })}
            <button type="button" className="homeNavLink" onClick={openContact(onItemClick)}>
                CONTACT
            </button>
            {showInformationInNav && (
                <Link href="/information" className="homeNavLink" onClick={onItemClick}>
                    {pathname === '/information' ? <b>Information</b> : 'Information'}
                </Link>
            )}
            {showCareersInNav && (
                <Link href="/careers" className="homeNavLink" onClick={onItemClick}>
                    {pathname === '/careers' ? <b>Careers</b> : 'Careers'}
                </Link>
            )}
        </>
    );

    const overlayClass =
        isHomePage ? 'homeOverlay'
            : isDirectorsPage || (isWorkPage && workChrome?.mode === 'motion') ? 'directorsOverlay'
                : 'pageOverlay';

    const logo = (
        <Image
            src={logoData?.url || '/glove.svg'}
            alt={logoData?.alt || 'Valentine Logo'}
            width={77}
            height={18}
            priority
            className={workLogoChromeClass}
        />
    );

    return (
        <header className={headerClasses}>
            {isMobile ? (
                <Link href="/" className="homeNavLink" onClick={handleLogoClick}>
                    {logo}
                </Link>
            ) : isWorkPage ? (
                <div className={workPageNav.workNavRow}>
                    <Link href="/" className={`homeNavLink ${workPageNav.workNavLogoLink}`} onClick={handleLogoClick}>
                        {logo}
                    </Link>
                    <div className={workPageNav.workNavCenter}>
                        <WorkModeToggle mobile={false} />
                    </div>
                    <div className={`${workPageNav.workNavRight} homeNavLinksContainer`}>
                        {renderPageLinks()}
                    </div>
                </div>
            ) : (
                <>
                    <Link href="/" className="homeNavLink" onClick={handleLogoClick}>
                        {logo}
                    </Link>
                    <div className="homeNavLinksContainer">
                        {renderPageLinks()}
                    </div>
                </>
            )}
            {isMobile && menuOpen && (
                <div
                    className={`menuOverlay ${overlayClass} visible`}
                    onClick={() => setMenuOpen(false)}
                />
            )}
            {isMobile ? (
                <div className="mobileNavContainer">
                    <span
                        className={`menu-trigger ${menuOpen ? 'menu-open' : ''}`}
                        role="button"
                        tabIndex={0}
                        onClick={toggleMenu}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); } }}
                    >
                        {menuOpen ? 'MENU' : 'MENU'}
                    </span>

                    {menuOpen && (
                        <MenuAnimation isOpen={menuOpen}>
                            <div className="mobileNavLinks">
                                {isWorkPage && <WorkModeToggle mobile />}
                                {renderPageLinks(toggleMenu)}
                            </div>
                        </MenuAnimation>
                    )}
                </div>
            ) : null}
        </header>
    );
}
