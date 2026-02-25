import { createClient, groq } from "next-sanity"
import clientConfig from "./../config/client-config"

export async function getHomePage() {
  return createClient(clientConfig).fetch(
    groq`*[_type == "homepage"][0]{
      companyLogo{
        asset->{
          _id,
          url
        },
        alt
      },
      companyName,
      companyIcon{
        asset->{
          _id,
          url
        }
      },
      locations,
      email,
      pageNote->{
        ...
      },
      homeFrame{
        asset->{
          _id,
          url
        },
        alt
      },
      slogan,
      showSlogan,
      showLogoSlogan,
      logoSlogan{
        asset->{
          _id,
          url
        },
        alt
      },
      backgroundColor,
      homeVideo1{
        asset->{
          _id,
          url
        }
      },
      videoAlt1,
      videoDescription1,
      showServices,
      servicesTitle,
      osDescription,
      servicesList[]{
        osTitle,
        osItems
      },
      processTitle,
      showProcess,
      opTitle1,
      opText1,
      opTitle2,
      opText2,
      opTitle3,
      opText3,
      opTitle4,
      opText4,
      approachTitle,
      aDescription,
      seoTitle,
      seoDescription,
      keywords
    }`
  );
}

export async function getProjects() {

    return createClient(clientConfig).fetch(
        groq`*[_type == "project"]{
            _id,
            _createdAt,
            name,
            "slug": slug.current,
            "image": image.asset->url,
            url,
            projectDescription,
          }`
    )
}

export async function getProject(slug) {
  
    return createClient(clientConfig).fetch(
      groq`*[_type == "project" && slug.current == $slug][0]{
        _id,
        _createdAt,
        name,
        "slug": slug.current,
        "image": image.asset->url,
        url,
        projectDescription,
      }`,
      { slug }
    )
  }

  export async function getPages() {
    return createClient(clientConfig).fetch(
      groq`{
        "pages": *[_type == "page"]{
          _id,
          _createdAt,
          navTitle,
          "slug": slug.current,
          pageCompanyLogo{
            alt,
            "url": asset->url
          },
          pageCompanyLogoWhite{
            alt,
            "url": asset->url
          },
        },
        "pageNote": *[_type == "pageNote"][0] { 
          ...
        }
      }`
    );
  }
  
  export async function getPage(slug){

    return createClient(clientConfig).fetch(
      groq`*[_type == "page" && slug.current == $slug][0]{
            _id,
            _createdAt,
            pageTitle,
            "slug": slug.current,
            pageDescription
          }`, 
          {slug}
    )
  }

  export async function getAboutPage() {
    return createClient(clientConfig).fetch(
      groq`*[_type == "aboutPage" && status == true][0]{
        title,
        pageNote->{...},
        philosophyTitle,
        philosophyDescription1,
        philosophyImageCount,
        "philosophyProjectData": philosophyProject->{
          name,
          clientName,
          projectYear,
          projectImages[]{ // Fetch all images
            asset->{
              _id,
              url
            },
            alt
          },
          _id
        },
        philosophyDescription2,
        philosophyFeaturedImage{
          asset->{
            _id,
            url
          },
          alt
        },
        philosophyFeaturedImageSize,
        storyTitle,
        storyDescription1,
        storyImageCount,
        "storyProjectData": storyProject->{
          name,
          clientName,
          projectYear,
          projectImages[]{ // Fetch all images
            asset->{
              _id,
              url
            },
            alt
          },
          _id
        },
        storyDescription2,
        storyFeaturedImage{
          asset->{
            _id,
            url
          },
          alt
        },
        storyFeaturedImageSize,
        whoTitle,
        whoDescription1,
        whoImageCount,
        "whoProjectData": whoProject->{
          name,
          clientName,
          projectYear,
          projectImages[]{ // Fetch all images
            asset->{
              _id,
              url
            },
            alt
          },
          _id
        },
        whoDescription2,
        whoFeaturedImage{
          asset->{
            _id,
            url
          },
          alt
        },
        whoFeaturedImageSize
      }`
    );
  }

  export async function getPageData(slug) {
    return createClient(clientConfig).fetch(
      groq`*[_type == "page" && slug.current == $slug][0]{
        _id,
        _createdAt,
        indexTitle,
        pageTitle,
        "slug": slug.current,
        pageDescription,
        contactInfo,
        teamMembers[]->{
          _id,
          fullName,
          "slug": slug.current,
          talentPosition,
          city,
          image{
            asset->{ _id, url },
            alt
          },
          bio,
          categories,
          videos[]{
            embedCode,
            videoName
          },
        },
        projects[]->{
          _id,
          name,
          projectImages[]{ // Fetch the array of project images
            asset->{ 
              _id, 
              url,
              metadata {
                lqip  // ← And this
              }
            },
            alt
          },
          videos[]{
            embedCode,
            videoName,
            coverImage{
              asset->{
                _id,
                url
              },
              alt
            },
            logo{
              asset->{
                _id,
                url
              },
              alt
            }
          }
        },
        pageNote->{ 
          _id,
          _createdAt,
          workTitle,
          workDescription,
          connectTitle,
          connectLinks[]{
            _key,
            linkTitle,
            linkUrl,
            openNewTab
          },
          copyrightText,
          copyrightBrandName,
          copyrightYear
        }
      }`,
      { slug }
    );
  }

  
export async function getHomeSEOData() {
  return createClient(clientConfig).fetch(
    groq`*[_type == "homepage"][0] {
      keywords,
      seoTitle,
      seoDescription
    }`
  ).then(data => ({
    keywords: data?.keywords || [],
    seoTitle: data?.seoTitle || null,
    seoDescription: data?.seoDescription || null
  }));
}

export async function getTeamMemberBySlug(slug) {
  return createClient(clientConfig).fetch(
    groq`*[_type == "teamMember" && slug.current == $slug][0]{
      _id,
      fullName,
      "slug": slug.current,
      talentPosition,
      city,
      image{
        asset->{ _id, url },
        alt
      },
      bio,
      categories,
      videos[]{
        embedCode,
        videoName
      },
    }`,
    { slug }
  );
}

export async function getLegalBySlug(slug) {
  return createClient(clientConfig).fetch(
    groq`*[_type == "legal" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      titleDescription,
      moreInfo,
      content
    }`,
    { slug }
  );
}


  export async function getAllPagesData() {
    return createClient(clientConfig).fetch(
      groq`{
        "pages": *[_type == "page"]{
          _id,
          _createdAt,
          navTitle,
          indexTitle,
          pageTitle,
          "slug": slug.current,
          pageCompanyLogo{
            alt,
            "url": asset->url
          },
          pageCompanyLogoWhite{
            alt,
            "url": asset->url
          },
          pageDescription, // Added from getFullPagesData
          contactInfo,     // Added from getFullPagesData
          tbd,
          teamMembers[]->{  // Added from getFullPagesData
            _id,
            fullName,
            "slug": slug.current,
            talentPosition,
            city,
            image{
              asset->{ _id, url },
              alt
            },
            bio,
            categories,
            videos[]{
              embedCode,
              videoName
            },
          },
          projects[]->{   // Added from getFullPagesData
            _id,
            name,
            projectImages[]{
              asset->{
                _id,
                url,
                metadata {
                  lqip
                }
              },
              alt
            },
            videos[]{
              embedCode,
              videoName,
              coverImage{
                asset->{
                  _id,
                  url
                },
                alt
              },
              logo{
                asset->{
                  _id,
                  url
                },
                alt
              }
            }
          },
        },
        "careersPage": *[_type == "careersPage"][0]{
          title,
          description,
          locations,
          commitments,
          allOpeningsTitle,
          successMessage,
          showAllJobs,
          selectedJobs[]->{
            _id,
            positionTitle,
            "slug": slug.current,
            location,
            commitment,
            description,
            applyCtaLabel,
            Listed,
            postedAt
          }
        },
        "jobs": *[_type == "jobPosting"]{
          _id,
          positionTitle,
          "slug": slug.current,
          location,
          commitment,
          description,
          applyCtaLabel,
          Listed,
          postedAt
        },
        "homepage": *[_type == "homepage"][0]{
          companyLogo{
            asset->{
              _id,
              url
            },
            alt
          },
          pageNote->{...},
          companyName,
          companyIcon{
            asset->{
              _id,
              url
            }
          },
          locations,
          email,
          homeFrame{
            asset->{
              _id,
              url
            },
            alt
          },
          slogan,
          showSlogan,
          showLogoSlogan,
          "logoSlogan": logoSlogan.asset->url,
          "logoSloganAlt": logoSlogan.alt,
          backgroundColor,
          homeVideo1{
            asset->{
              _id,
              url
            }
          },
          videoAlt1,
          videoDescription1,
          showServices,
          servicesTitle,
          osDescription,
          servicesList[]{
            osTitle,
            osItems
          },
          processTitle,
          showProcess,
          opTitle1,
          opText1,
          opTitle2,
          opText2,
          opTitle3,
          opText3,
          opTitle4,
          opText4,
          approachTitle,
          aDescription,
          seoTitle,
          "logosImageDesktop": logosImageDesktop.asset->url,
"logosImageMobile": logosImageMobile.asset->url,
          seoDescription,
          keywords
        },
        "aboutPageV2": *[_type == "aboutPageV2"][0]{
          title,
          pageDescription,
          backgroundOpacity,
          backgroundImage{
            asset->{ _id, url },
            alt
          },
          partnersTitle,
          partners[]{
            name,
            logoImage{
              asset->{ _id, url },
              alt
            }
          },
          contactInfoTitle,
          contactInfoItems,
          moreInfoTitle,
          moreInfoItems,
          globalSectionTitle,
          globalSectionUSLocations,
          globalSectionInternationalLocations,
          infoFooterLinks[]{
            labelText,
            linkUrl,
            openNewTab
          }
        },
        "aboutPage": *[_type == "aboutPage" && status == true][0]{
          title,
          pageNote->{...},
          philosophyTitle,
          philosophyDescription1,
          philosophyImageCount,
          "philosophyProjectData": philosophyProject->{
            name,
            clientName,
            projectYear,
            projectImages[0..2]{
              asset->{
                _id,
                url
              },
              alt
            },
            _id
          },
          philosophyDescription2,
          philosophyFeaturedImage{
            asset->{
              _id,
              url
            },
            alt
          },
          philosophyFeaturedImageSize,
          storyTitle,
          storyDescription1,
          storyImageCount,
          "storyProjectData": storyProject->{
            name,
            clientName,
            projectYear,
            projectImages[0..2]{
              asset->{
                _id,
                url
              },
              alt
            },
            _id
          },
          storyDescription2,
          storyFeaturedImage{
            asset->{
              _id,
              url
            },
            alt
          },
          storyFeaturedImageSize,
          whoTitle,
          whoDescription1,
          whoImageCount,
          "whoProjectData": whoProject->{
            name,
            clientName,
            projectYear,
            projectImages[][0..2]{
              asset->{
                _id,
                url
              },
              alt
            },
            _id
          },
          whoDescription2,
          whoFeaturedImage{
            asset->{
              _id,
              url
            },
            alt
          },
          whoFeaturedImageSize,
        },
        "pageNote": *[_type == "pageNote"][0] { 
            ...
          }
      }`
    );
  }
