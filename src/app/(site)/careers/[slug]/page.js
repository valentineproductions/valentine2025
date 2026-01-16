'use client';

import { PortableText } from "@portabletext/react";
import { useAppContext } from "@/app/components/AppContext";
import Link from "next/link";
import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export default function CareerJobPage({ params }) {
  const { allData } = useAppContext();
  const resolvedParams = use(params);
  const router = useRouter();

  const careers = allData?.careersPage || null;
  const jobs = allData?.jobs || [];

  const fullSlug = resolvedParams.slug;
  const job = jobs.find(j => j.slug === fullSlug);

  const [showForm, setShowForm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const successRef = useRef(null);
  const [resumeName, setResumeName] = useState('Choose File');
  const [coverName, setCoverName] = useState('Choose File');
  const [exiting, setExiting] = useState(false);
  const [entered, setEntered] = useState(false);
  const [submitDots, setSubmitDots] = useState('...');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setEntered(true);
    if (successVisible && successRef.current) {
      successRef.current.focus();
      const timer = setTimeout(() => {
        setSuccessVisible(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [successVisible]);

  useEffect(() => {
    if (!submitting) {
      setSubmitDots('...');
      return;
    }
    const seq = ['...', '..', '.', '..'];
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % seq.length;
      setSubmitDots(seq[i]);
    }, 1000);
    return () => clearInterval(id);
  }, [submitting]);

  if (!job) {
    return (
      <div className={styles.container}>
        <div className={styles.pageWrapper}>
          <div className={styles.leftPane}>
            <div className={styles.content}>
              <p>Job not found.</p>
              <Link className={styles.backLink} href="/careers">
                {careers?.allOpeningsTitle || 'All Openings'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const validateFiles = (file, name, { required = true } = {}) => {
    const missing = !file || file.size === 0 || !file.name;
    if (missing) return required ? `${name} is required.` : null;
    if (file.size > MAX_FILE_SIZE) return `${name} exceeds 10MB.`;
    const typeOk = ACCEPT_TYPES.includes(file.type);
    const extOk = /\.(pdf|docx?)$/i.test(file.name || '');
    if (!typeOk && !extOk) return `${name} must be PDF/DOC/DOCX.`;
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    let workLink = formData.get('workLink');
    const resume = formData.get('resume');
    const cover = formData.get('cover');

    const nextFieldErrors = {};
    if (!name) nextFieldErrors.name = 'Required';
    if (!email) nextFieldErrors.email = 'Required';
    const resumeErr = validateFiles(resume, 'Resume', { required: true });
    if (resumeErr) nextFieldErrors.resume = resumeErr;
    const coverErr = validateFiles(cover, 'Cover Letter', { required: false });
    if (coverErr) nextFieldErrors.cover = coverErr;

    if (Object.keys(nextFieldErrors).length) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setSubmitting(true);

    try {
      if (typeof workLink === 'string') {
        const trimmed = workLink.trim();
        if (trimmed && !/^https?:\/\//i.test(trimmed)) {
          workLink = `https://${trimmed}`;
          formData.set('workLink', workLink);
        }
      }
      formData.append('jobSlug', job.slug);
      formData.append('locationCode', job.location?.code || '');
      const res = await fetch('/api/apply', { method: 'POST', body: formData });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Submission failed');
      }
      setSubmitted(true);
      setShowForm(false);
      setSuccessVisible(true);
    } catch (err) {
      setSubmitError(err?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`${styles.container} ${entered ? styles.pageEnter : ''} ${exiting ? styles.pageExit : ''}`}>
      <div className={styles.pageWrapper}>
        <section className={styles.leftPane}>
          <div className={styles.content}>
            <a
              className={styles.backLink}
              href="/careers"
              onClick={(e) => {
                e.preventDefault();
                setExiting(true);
                setTimeout(() => router.push("/careers"), 300);
              }}
            >
              {careers?.allOpeningsTitle || 'All Openings'}
            </a>
            <h1 className={styles.title}>{job.positionTitle}</h1>
            <div className={styles.metaRow}>
              <span>{job.location?.name}</span>
              <span>{job.commitment}</span>
            </div>
            <hr className={styles.divider} />
            <div aria-live="polite">
              {!submitted && (
                <div className={showForm ? '' : styles.applyButton}>
                  {!showForm ? (
                    <button
                      type="button"
                      className={styles.button}
                      onClick={() => setShowForm(true)}
                      aria-expanded={showForm}
                    >
                      {job.applyCtaLabel || 'Apply'}
                    </button>
                  ) : null}
                </div>
              )}

            {!submitted && showForm && (
                <form className={`${styles.form} ${styles.formStagger}`} onSubmit={onSubmit}>
                  <div>
                    <input id="name" name="name" type="text" placeholder="Name *" className={styles.input} required />
                    {fieldErrors.name && <div className={styles.fieldError}>{fieldErrors.name}</div>}
                  </div>
                  <div>
                    <input id="email" name="email" type="email" placeholder="Email Address *" className={styles.input} required />
                    {fieldErrors.email && <div className={styles.fieldError}>{fieldErrors.email}</div>}
                  </div>
                  <div>
                    <input id="workLink" name="workLink" type="text" placeholder="Link to work" className={`${styles.input} ${styles.optionalInput}`} />
                    {fieldErrors.workLink && <div className={styles.fieldError}>{fieldErrors.workLink}</div>}
                  </div>
                  <div className={styles.fileRow}>
                    <span className={styles.filePlaceholder}>Resume *</span>
                    <input
                      id="resume"
                      name="resume"
                      type="file"
                      className={styles.fileInput}
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      required
                      onChange={(e) => {
                        const f = e.target.files && e.target.files[0];
                        setResumeName(f ? f.name : 'Choose File');
                      }}
                    />
                    <span className={styles.fileName}>{resumeName}</span>
                  </div>
                  {fieldErrors.resume && <div className={styles.fieldError}>{fieldErrors.resume}</div>}
                  <div className={styles.fileRow}>
                    <span className={styles.filePlaceholder}>Cover Letter</span>
                    <input
                      id="cover"
                      name="cover"
                      type="file"
                      className={styles.fileInput}
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => {
                        const f = e.target.files && e.target.files[0];
                        setCoverName(f ? f.name : 'Choose File');
                      }}
                    />
                    <span className={styles.fileName}>{coverName}</span>
                  </div>
                  {fieldErrors.cover && <div className={styles.fieldError}>{fieldErrors.cover}</div>}
                  <div className={styles.buttonsRow}>
                    <button type="submit" className={`${styles.button} ${styles.submitButton}`} disabled={submitting}>
                      {submitting ? `Submitting${submitDots}` : 'Submit'}
                    </button>
                  </div>
                  {submitError && <div className={styles.fieldError}>{submitError}</div>}
                  <div className={styles.cancelRow}>
                    <button type="button" className={styles.button} onClick={() => setShowForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {submitted && (
                <>
                  <div className={styles.fadeOutUp} aria-hidden="true" />
                  {careers?.successMessage && (
                    <div
                      className={styles.successMessage}
                      role="status"
                      tabIndex={-1}
                      ref={successRef}
                    >
                      {careers.successMessage}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        <section className={styles.rightPane}>
          <div className={styles.content}>
            {job.description && (
              <div className={styles.portableText} style={{ marginTop: 12 }}>
                <PortableText value={job.description} />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
