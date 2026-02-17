'use client';

import { useAppContext } from "@/app/components/AppContext";
import { use } from 'react';
import Link from 'next/link';
import DirectorsList from "@/app/components/DirectorsList";
import DirectorsListv4 from "@/app/components/DirectorsListv4";
import DirectorsListOpt5 from "@/app/components/DirectorsListOpt5";
import PageFooter from "@/app/components/PageFooter";
import CategoryPageOpt3 from "@/app/components/CategoryPageOpt3";
import CategoryPageOpt4 from "@/app/components/CategoryPageOpt4";
import { categoryToSlug, slugToCategoryName } from "@/app/utils/categoryUtils";
import styles from './page.module.css';

export default function CategoryPage({ params }) {
  const { allData } = useAppContext();
  const resolvedParams = use(params);
  const categorySlug = resolvedParams.slug;

  const directorsPage = allData?.pages?.find(page => page.slug === 'directors');
  const allTeamMembers = directorsPage?.teamMembers || [];

  const filteredDirectors = allTeamMembers.filter((member) => {
    if (!member.categories || member.categories.length === 0) return false;
    return member.categories.some(category => categoryToSlug(category) === categorySlug);
  });

  const categoryName = slugToCategoryName(categorySlug);

  return (
    <div className={styles.categoryPage}>
      <div className={styles.container}>
        <Link href="/directors" className={styles.backLink}>
          ← back to Directors Page
        </Link>

        <CategoryPageOpt4 
          categoryName={categoryName}
          directorsCount={filteredDirectors.length}
          pageDescription={directorsPage?.pageDescription}
        />
        
        {filteredDirectors.length > 0 ? (
          <DirectorsListOpt5 directors={filteredDirectors} />
        ) : (
          <div className={styles.noResults}>
            <p>No directors found in this category.</p>
          </div>
        )}

        <PageFooter pageNote={allData?.pageNote || allData?.homepage?.pageNote || allData?.aboutPage?.pageNote} />
      </div>
    </div>
  );
}
