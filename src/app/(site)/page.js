'use client';

// import { PortableText } from "next-sanity"; //test with the next-sanity
import { PortableText } from "@portabletext/react";
// import { getHomePage } from "../../../sanity/schemas/sanity-utils";
import H2Animation from "../components/H2Animator";
import HomeVideo from "../components/HomeVideo";
import Image from 'next/image';
import LocationsAndEmailAnimator from "../components/LocationsAndEmailAnimator";
import DivsAnimator from "../components/DivsAnimator";
import { useAppContext } from "../components/AppContext";
import BackgroundImage from "../components/BackgroundImage";


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

        
        {/* Video */}
        <HomeVideo homePageData={homePageData} />

        {/* Home Slogan */}
        <section className="sloganVideo two">
            <div className="SloganContainerVideo">
            <h1>{homePageData?.companyName || "Valentine"}</h1>
              <H2Animation>
                {homePageData?.slogan || "Where Vision Meets Execution"}
              </H2Animation>
              {/* <LocationsAndEmailAnimator
            locations={homePageData.locations}
            email={homePageData.email}
          /> */}
          <div className="locationsNemail2">
            <div className="locationsCodes">
              <p>{homePageData.locations}</p>
            </div>
            <div className="homeEmail">
              <a href={`mailto:${homePageData.email}`}>{homePageData.email}</a>
            </div>
          </div>
            </div>
            
          
        </section>

        {/* Our Services 2 */}
        <section className="servicesSection three">
          <div className="servicesContainer">
              <H2Animation>
                {homePageData?.servicesTitle || "Our Services"}
              </H2Animation>  

              <div className="servicesDescription">
                {/* <p><span>{homePageData?.osDescription || "FULL-SERVICE PRODUCTION AND POST-PRODUCTION, FROM SINGLE ASSETS TO COMPLETE CAMPAIGNS.TECHNICAL EXCELLENCE AND RELIABLE EXECUTION, EVERY TIME."}</span></p> */}
                <span><PortableText value ={homePageData?.osDescription || "FULL-SERVICE PRODUCTION"}/></span>
              </div>
            
          </div>

          <div className="servicesLists">
            <DivsAnimator>
              {homePageData?.servicesList?.map((service, index) => (
                  <div className={`serviceList${index + 1}`} key={index}>
                    <h3>{service?.osTitle}</h3>
                    <ul>
                      {service?.osItems?.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </DivsAnimator>
            </div>
          
            {/* <LocationsAndEmailAnimator
            locations={homePageData.locations}
            email={homePageData.email}
          />  */}
          
          <div className="locationsNemail">
            <div className="locationsCodes">
              <p>{homePageData.locations}</p>
            </div>
            <div className="homeEmail">
              <a href={`mailto:${homePageData.email}`}>{homePageData.email}</a>
            </div>
          </div>
          
        </section>
        
        {/* Our Process 3 */}
        <section className="processSection four">
        <BackgroundImage 
          src={homePageData.homeFrame.asset.url} 
          alt="Background" 
        />
          <div className="processContainer">
            <H2Animation>
              {homePageData?.processTitle || "Our Process"}
            </H2Animation>
            <div className="processDescription">
              <DivsAnimator>
                <div className="vprocess processList1">
                  <h3>
                    <span>{homePageData?.opTitle1?.slice(0, 2) || ""}</span>{" "}
                    {homePageData?.opTitle1?.slice(2) || "Discovery"}
                  </h3>
                  <p>{homePageData?.opText1 || "TBD"}</p>
                </div>
                <div className="vprocess processList2">
                  <h3>
                    <span>{homePageData?.opTitle2?.slice(0, 2) || ""}</span>{" "}
                    {homePageData?.opTitle2?.slice(2) || "Development"}
                  </h3>
                  <p>{homePageData?.opText2 || "TBD"}</p>
                </div>
                <div className="vprocess processList3">
                  <h3>
                    <span>{homePageData?.opTitle3?.slice(0, 2) || ""}</span>{" "}
                    {homePageData?.opTitle3?.slice(2) || "Production"}
                  </h3>
                  <p>{homePageData?.opText3 || "TBD"}</p>
                </div>
                <div className="vprocess processList4">
                  <h3>
                    <span>{homePageData?.opTitle4?.slice(0, 2) || ""}</span>{" "}
                    {homePageData?.opTitle4?.slice(2) || "Delivery"}
                  </h3>
                  <p>{homePageData?.opText4 || "TBD"}</p>
                </div>
              </DivsAnimator>
            </div>
          </div>

          {/* <LocationsAndEmailAnimator
            locations={homePageData.locations}
            email={homePageData.email}
          /> */}
          <div className="locationsNemail">
            <div className="locationsCodes">
              <p>{homePageData.locations}</p>
            </div>
            <div className="homeEmail">
              <a href={`mailto:${homePageData.email}`}>{homePageData.email}</a>
            </div>
          </div>
        </section>
        
        {/* Approach 5 */}
        <section className="approachSection five">
          <div className="approachContainer">
            <H2Animation>{homePageData?.approachTitle || "Approach"}</H2Animation>
              <div className="approachDescription">
                {/* <p><span>{homePageData?.aDescription || "We listen. We learn. We adapt. We execute. We finish what we start."}</span></p> */}
                <span><PortableText value ={homePageData?.aDescription || "We listen."}/></span>
              </div>
          </div>
            
          {/* Home Page Note / Footer  */}
            <div className="homeLastVideoFooter">
              <div className="pageNote">
                <div className="leftSide">
                  {homePageData.pageNote.workTitle && (
                    <div className="workSection">
                      <h2 className="pageNoteTitle">{homePageData.pageNote.workTitle}</h2>
                      {homePageData.pageNote.workDescription && (
                        <p className="pageNoteText">{homePageData.pageNote.workDescription}</p>
                      )}
                    </div>
                  )}
                  {homePageData.pageNote.connectTitle && (
                    <div className="connectSection"> {/* NO WRAPPER HERE FOR LARGE SCREENS */}
                      <h2 className="pageNoteTitle">{homePageData.pageNote.connectTitle}</h2>
                      {homePageData.pageNote.connectLinks &&
                        homePageData.pageNote.connectLinks.map((link, index) => (
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
                {homePageData.pageNote.copyrightText && (
                  <div className="copyRight">
                    <p className="copyRightText"><b>{homePageData.pageNote.copyrightBrandName}</b> {homePageData.pageNote.copyrightText} {homePageData.pageNote.copyrightYear} {homePageData.pageNote.copyrightBrandName}</p>
                  </div>
                )}
              </div>
            </div>
            {/* END Page Note */}
        </section>
        
      </div>
    </div>
  );
}