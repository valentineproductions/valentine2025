'use client';

export default function PageFooter({ pageNote }) {
  if (!pageNote) return null;

  return (
    <footer>
      <div className="pageNote">
        <div className="leftSide">
          {pageNote.workTitle && (
            <div className="workSection">
              <h2 className="pageNoteTitle">{pageNote.workTitle}</h2>
              {pageNote.workDescription && (
                <p className="pageNoteText">{pageNote.workDescription}</p>
              )}
            </div>
          )}
          {pageNote.connectTitle && (
            <div className="connectSection">
              <h2 className="pageNoteTitle">{pageNote.connectTitle}</h2>
              {pageNote.connectLinks &&
                pageNote.connectLinks.map((link, index) => {
                  // Determine if the link is an email address
                  const isEmail = link.linkUrl && 
                                  link.linkUrl.includes('@') && 
                                  !link.linkUrl.startsWith('http://') && 
                                  !link.linkUrl.startsWith('https://');

                  // Construct the href based on whether it's an email or a regular URL
                  const href = isEmail ? `mailto:${link.linkUrl}` : link.linkUrl;

                  // Determine target and rel attributes (only for non-email links that open in a new tab)
                  const target = !isEmail && link.openNewTab ? "_blank" : undefined;
                  const rel = !isEmail && link.openNewTab ? "noopener noreferrer" : undefined;

                  return (
                    <a
                      key={index}
                      href={href}
                      className="contactLink"
                      target={target}
                      rel={rel}
                    >
                      {link.linkTitle}
                    </a>
                  );
                })}
            </div>
          )}
        </div>
        {pageNote.copyrightText && (
          <div className="copyRight">
            <p className="copyRightText"> 
              <b>{pageNote.copyrightBrandName}</b> {pageNote.copyrightText} {pageNote.copyrightYear} {pageNote.copyrightBrandName}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}
