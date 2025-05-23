import "./../globals.css";
import { AppProvider } from "../components/AppContext";
import HeaderNavigation from "../components/HeaderNavigation";
import HomeChecker from "../components/HomeChecker";
import { getAllPagesData, getHomeSEOData } from "../../../sanity/schemas/sanity-utils";

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
  //get all Pages Changes except About
  // const data = await getPages(); // The getPages function now returns an object
  // const pages = data?.pages || []; // Access the 'pages' array

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
      </head>
      <body>
      <AppProvider initialData={allData}>
        <HomeChecker />
        {/* Add homeNavBar if not a homepage (check with slug)... */}
        <HeaderNavigation pages={pages} />
        
        <main>{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
