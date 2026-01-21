'use client';

import { useAppContext } from "@/app/components/AppContext";
import { use } from 'react';
import Link from 'next/link';
import DirectorsList from "@/app/components/DirectorsList";
import DirectorsListv4 from "@/app/components/DirectorsListv4";
import DirectorsListOpt2v4 from "@/app/components/DirectorsListOpt2v4";
import PageFooter from "@/app/components/PageFooter";
import CategoryPageOpt3 from "@/app/components/CategoryPageOpt3";
import CategoryPageOpt4 from "@/app/components/CategoryPageOpt4";
import { categoryToSlug, slugToCategoryName } from "@/app/utils/categoryUtils";
import styles from './page.module.css';

export default function CategoryPage({ params }) {
  const { allData } = useAppContext();
  const resolvedParams = use(params);
  const categorySlug = resolvedParams.slug;

  // Get all team members from the talent page
  const talentPage = allData?.pages?.find(page => page.slug === 'talent');
  const allTeamMembers = talentPage?.teamMembers || [];

  // Filter directors by category
  const filteredDirectors = allTeamMembers.filter((member) => {
    if (!member.categories || member.categories.length === 0) return false;
    
    // Check if any category matches (convert to slug for comparison)
    return member.categories.some(category => 
      categoryToSlug(category) === categorySlug
    );
  });

  // Get category display name from slug
  const categoryName = slugToCategoryName(categorySlug);

  return (
    <div className={styles.categoryPage}>
      <div className={styles.container}>
        {/* Back Arrow */}
        <Link href="/talent" className={styles.backLink}>
          ← back to Talent Page
        </Link>

        {/* Category Header */}
        <CategoryPageOpt4 
          categoryName={categoryName}
          directorsCount={filteredDirectors.length}
          pageDescription={talentPage?.pageDescription}
        />
        
        {/* This is the v3 header */}
        {/* <CategoryPageOpt3 
          categoryName={categoryName}
          directorsCount={filteredDirectors.length}
          pageDescription={talentPage?.pageDescription}
        /> */}

        {/* Directors List */}
        {/* This is the v4 list */}
        {/* {filteredDirectors.length > 0 ? (
          <DirectorsListv4 directors={filteredDirectors} />
        ) : (
          <div className={styles.noResults}>
            <p>No directors found in this category.</p>
          </div>
        )} */}

        {/* This is the Opt2v4 list */}
        {filteredDirectors.length > 0 ? (
          <DirectorsListOpt2v4 directors={filteredDirectors} />
        ) : (
          <div className={styles.noResults}>
            <p>No directors found in this category.</p>
          </div>
        )}

        {/* This is the v3 list */}
        {/* {filteredDirectors.length > 0 ? (
          <DirectorsList directors={filteredDirectors} />
        ) : (
          <div className={styles.noResults}>
            <p>No directors found in this category.</p>
          </div>
        )} */}

        {/* Footer */}
        <PageFooter pageNote={allData?.pageNote} />
      </div>
    </div>
  );
}
