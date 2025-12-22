'use client';

import { useAppContext } from "@/app/components/AppContext";
import { use } from 'react';
import Link from 'next/link';
import DirectorsList from "@/app/components/DirectorsList";
import PageFooter from "@/app/components/PageFooter";
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

        {/* Category Title and Subtitle */}
        <header className={styles.header}>
          <h1 className={styles.categoryTitle}>{categoryName}</h1>
          <p className={styles.categorySubtitle}>
            #{filteredDirectors.length} director{filteredDirectors.length !== 1 ? 's' : ''} in this category
          </p>
        </header>

        {/* Directors List */}
        {filteredDirectors.length > 0 ? (
          <DirectorsList directors={filteredDirectors} />
        ) : (
          <div className={styles.noResults}>
            <p>No directors found in this category.</p>
          </div>
        )}

        {/* Footer */}
        <PageFooter pageNote={allData?.pageNote} />
      </div>
    </div>
  );
}
