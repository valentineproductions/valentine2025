'use client';

import "./../globals.css";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import MenuAnimation from './MenuAnimation';
import { useAppContext } from './AppContext';

export default function HeaderNavigation() { // Default empty array
    
    const pathname = usePathname();
    // console.log("Current PATH :", pathname); // To check the current page
    const isHomePage = pathname === '/';
    const headerClasses = `navBar ${isHomePage ? 'homeNavBar' : ''}`;
    const [isMobile, setIsMobile] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { allData } = useAppContext();
    const pages = allData?.pages || []; // Access the 'pages' array
    // console.log("K------NAV WORKS Page Data:", pages); // Is working

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 575);
            const handleResize = () => setIsMobile(window.innerWidth <= 575);
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Safely get logo data with fallbacks
    const logoData = (isHomePage 
        ? pages[0]?.pageCompanyLogoWhite 
        : pages[0]?.pageCompanyLogo) || {};

    const handleLogoClick = () => {
        if (menuOpen) setMenuOpen(false);
    };

    return (
        <header className={headerClasses}>
            <Link href="/" className="homeNavLink" onClick={handleLogoClick}>
                <Image
                    src={logoData?.url || "/glove.svg"}
                    alt={logoData?.alt || "Valentine Logo"} 
                    width={77}
                    height={18}
                    priority
                />
            </Link>
            {isMobile && menuOpen && (
                <div
                    className={`menuOverlay ${isHomePage ? 'homeOverlay' : 'pageOverlay'} visible`}
                    onClick={() => setMenuOpen(false)}
                />
            )}
            {isMobile ? (
                <div className="mobileNavContainer">
                    <span 
                        className={`menu-trigger ${menuOpen ? 'menu-open' : ''}`} 
                        onClick={toggleMenu}
                    >
                        {menuOpen ? 'MENU' : 'MENU'}
                    </span>
                    
                    {/* Menu content that toggles */}
                    {menuOpen && (
                        <MenuAnimation isOpen={menuOpen}>
                            <div className="mobileNavLinks">
                                {[ 'work', 'talent' ].map((slug) => {
                                    const page = pages.find(p => p.slug === slug);
                                    return page ? (
                                        <Link key={page._id} href={`/${page.slug}`} onClick={toggleMenu}>
                                            {pathname === `/${page.slug}` ? <b>{page.navTitle}</b> : page.navTitle}
                                        </Link>
                                    ) : null;
                                })}
                                <Link href="/about" className="homeNavLink" onClick={toggleMenu}>
                                    {pathname === "/about" ? <b>About</b> : "About"}
                                </Link>
                                <Link href="/careers" className="homeNavLink" onClick={toggleMenu}>
                                    {pathname === "/careers" ? <b>Careers</b> : "Careers"}
                                </Link>
                            </div>
                        </MenuAnimation>
                    )}
                </div>
            ) : (
                <div className="homeNavLinksContainer">
                    {[ 'work', 'talent' ].map((slug) => {
                        const page = pages.find(p => p.slug === slug);
                        return page ? (
                            <Link key={page._id} href={`/${page.slug}`}>
                                {pathname === `/${page.slug}` ? <b>{page.navTitle}</b> : page.navTitle}
                            </Link>
                        ) : null;
                    })}
                    <Link href="/about" className="homeNavLink">
                        {pathname === "/about" ? <b>About</b> : "About"}
                    </Link>
                    <Link href="/careers" className="homeNavLink">
                        {pathname === "/careers" ? <b>Careers</b> : "Careers"}
                    </Link>
                </div>
            )}
        </header>
    );
}
