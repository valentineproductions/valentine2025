'use client';

import HomeVideo from "../components/HomeVideo";
import { useAppContext } from "../components/AppContext";
import BackgroundImage from "../components/BackgroundImage";
import H2Animation from "../components/H2Animator";
import SloganSection from "../components/SloganSection";
import ServicesSection from "../components/ServicesSection";
import ProcessAccordion from "../components/ProcessAccordion";
import ApproachSection from "../components/ApproachSection";
import PageNoteFooter from "../components/PageNoteFooter";
import HomeFooter from "../components/HomeFooter";


// export const revalidate = 300; // Revalidate every 5 minutes

export default function Home() {
  // const homePageData = await getHomePage()
  const { allData } = useAppContext();
  const homePageData = allData?.homepage || null;
  //console.log("@H------Home Page Data:", aboutPageData); //is working

  if (!homePageData) {
    return <div>Home Page Not Found</div>;
  }

  return (
    <div className="homePage">
      <div className="container">

        <BackgroundImage 
          src={homePageData.homeFrame.asset.url} 
          alt={homePageData.homeFrame.alt || "Background"} 
        />
        <HomeVideo homePageData={homePageData} />

        <SloganSection homePageData={homePageData} />

        <ServicesSection homePageData={homePageData} />
        
        {homePageData?.showProcess !== false && (
          <section className="processSection four">
            <div className="processContainer">
              <H2Animation>
                {homePageData?.processTitle || "Our Process"}
              </H2Animation>
              <ProcessAccordion
                steps={[
                  { title: homePageData?.opTitle1, text: homePageData?.opText1 },
                  { title: homePageData?.opTitle2, text: homePageData?.opText2 },
                  { title: homePageData?.opTitle3, text: homePageData?.opText3 },
                  { title: homePageData?.opTitle4, text: homePageData?.opText4 },
                ]}
              />
            </div>
            <HomeFooter homePageData={homePageData} />
          </section>
        )}
        
        <ApproachSection homePageData={homePageData} />
        <PageNoteFooter pageNote={homePageData.pageNote} />
        
      </div>
    </div>
  );
}
