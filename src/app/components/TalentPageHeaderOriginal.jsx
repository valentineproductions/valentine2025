'use client';

import { PortableText } from "@portabletext/react";
import { defaultPortableTextComponents } from "@/app/lib/portableTextConfig";

// Original centered/vertical layout - kept as backup
export default function TalentPageHeaderOriginal({ pageTitle, pageDescription, contactInfo }) {
  return (
    <header className="talent-page">
      <h1 className="pageTitle">{pageTitle}</h1>
      <div className="pageDescription">
        <PortableText value={pageDescription} components={defaultPortableTextComponents} />
      </div>
      <div className="contactInfo">
        <PortableText value={contactInfo} components={defaultPortableTextComponents} />
      </div>
    </header>
  );
}



