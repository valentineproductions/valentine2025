import "./../globals.css";
import Script from "next/script";
import { headers } from "next/headers";
import { AppProvider } from "../components/AppContext";
import HeaderNavigation from "../components/HeaderNavigation";
import ContactOverlay from "../components/ContactOverlay";
import { WorkModeProvider } from "../components/WorkModeContext";
import HomeChecker from "../components/HomeChecker";
import { getAllPagesData, getHomeSEOData } from "../../../sanity/schemas/sanity-utils";
import { Analytics } from "@vercel/analytics/next"

const META_PIXEL_ID = "1250437307179904";

// Default fallback keywords
const DEFAULT_KEYWORDS = [
  "creative agency",
  "branding",
  "design",
  "valentine global"
];
const DEFAULT_TITLE = "Valentine Global";
const DEFAULT_DESCRIPTION = "Where Vision Meets Execution";

export async function generateMetadata() {
  const seoData = await getHomeSEOData();
  // console.log("SEO Data:", seoData);
  return {
    title: seoData.seoTitle || DEFAULT_TITLE,
    siteName: "Valentine Global",
    description: seoData.seoDescription || DEFAULT_DESCRIPTION,
    url: "https://valentine.global",
    locale: "en_US",
    type: "website",
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    keywords: seoData?.keywords?.length > 0 ? seoData.keywords : DEFAULT_KEYWORDS
  };
}

export const revalidate = 300; // Revalidate every 5 minutes

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");

  const allData = await getAllPagesData();
  // console.log("All Data:", allData); //  line to check the data structure
  const pages = allData?.pages || [];
  
  const homePageData = allData?.homepage || null;
  // console.log("Home @ Layout------:", homePageData); // Search for workTitle, had to add the PageNote in the query
  const aboutPageData = allData?.aboutPage || null;
  // console.log("ABT @ Layout------:", aboutPageData); // Is working
  const pagesData = allData?.pages || []; // Or adjust as needed for TALENT/WORK
  // console.log("PGs @ Layout------:", pagesData); // Check if there are 2 pages, yes, 0 Talent, 1 Work
  
  // Layout of the Pages //Except Studio - - - - - PAGES
  return (
    <html lang="en">
      <head>
        {!isLocalhost && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
      </head>
      <body>
      <AppProvider initialData={allData}>
        <WorkModeProvider>
          <HomeChecker />
          <HeaderNavigation pages={pages} />

          <main>{children}</main>
          <ContactOverlay />
        </WorkModeProvider>
        </AppProvider>
        <Analytics />
        {/* Meta Pixel - skip on localhost to avoid Madgicx 404 (third-party integration) */}
        {!isLocalhost && (
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${META_PIXEL_ID}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
