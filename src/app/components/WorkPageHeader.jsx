'use client';

import { PortableText } from "@portabletext/react";
import { defaultPortableTextComponents } from "@/app/lib/portableTextConfig";

export default function WorkPageHeader({ pageTitle, pageDescription, contactInfo }) {
  return (
    <header>
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
