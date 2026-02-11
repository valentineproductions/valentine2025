'use client';
const PageNoteFooter = ({ pageNote }) => {
  if (!pageNote) return null;
  return (
    <div className="homeLastVideoFooter">
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
                  const isEmail =
                    link.linkUrl &&
                    link.linkUrl.includes('@') &&
                    !link.linkUrl.startsWith('http://') &&
                    !link.linkUrl.startsWith('https://');
                  const href = isEmail ? `mailto:${link.linkUrl}` : link.linkUrl;
                  const target = !isEmail && link.openNewTab ? '_blank' : undefined;
                  const rel = !isEmail && link.openNewTab ? 'noopener noreferrer' : undefined;
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
              <b>{pageNote.copyrightBrandName}</b> {pageNote.copyrightText}{' '}
              {pageNote.copyrightYear} {pageNote.copyrightBrandName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageNoteFooter;
