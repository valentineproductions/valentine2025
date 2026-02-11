'use client';
import { useState } from 'react';
import DivsAnimator from './DivsAnimator';
import styles from './ProcessAccordion.module.css';

const ProcessAccordion = ({ steps }) => {
  const [openIndex, setOpenIndex] = useState(() => (steps && steps.length > 0 ? 0 : null));
  const [hoverIndex, setHoverIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(index);
  };

  return (
    <div className="processDescription">
      <DivsAnimator>
        {steps.map((step, index) => {
          const title = step.title || '';
          const prefix = title.slice(0, 2);
          const rest = title.slice(2) || '';
          const isOpen = openIndex === index;
          return (
            <div
              className={`vprocess processList${index + 1} ${styles.step} ${isOpen ? styles.open : ''}`}
              key={index}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              style={{ maxHeight: isOpen ? '1000px' : hoverIndex === index ? '200px' : '90px' }}
            >
              <h3 onClick={() => toggle(index)} className={styles.title}>
                <span>{prefix}</span> {rest}
              </h3>
              <p>{step.text || ''}</p>
            </div>
          );
        })}
      </DivsAnimator>
    </div>
  );
};

export default ProcessAccordion;
