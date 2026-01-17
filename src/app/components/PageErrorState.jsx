'use client';

export default function PageErrorState({ missingPages = [] }) {
  if (missingPages.length === 0) return null;

  return (
    <div>
      <h1>Error loading content</h1>
      {missingPages.map((pageName) => (
        <p key={pageName}>Could not find the "{pageName}" page.</p>
      ))}
    </div>
  );
}
