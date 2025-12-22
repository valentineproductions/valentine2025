'use client';

import { PortableText } from "@portabletext/react";

// Original centered/vertical layout - kept as backup
export default function TalentPageHeaderOriginal({ pageTitle, pageDescription, contactInfo }) {
  return (
    <header className="talent-page">
      <h1 className="pageTitle">{pageTitle}</h1>
      <div className="pageDescription">
        <PortableText value={pageDescription}/>
      </div>
      <div className="contactInfo">
        <PortableText value={contactInfo}/>
      </div>
    </header>
  );
}
