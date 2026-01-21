'use client';

import { PortableText } from "@portabletext/react";

export default function WorkPageHeader({ pageTitle, pageDescription, contactInfo }) {
  return (
    <header>
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
