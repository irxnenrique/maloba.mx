import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import m, { caseStudy } from '@i18n/messages';

type ImageLightboxProps = {
  images: string[];
  activeIndex: number | null;
  projectName: string;
  onChange: (index: number) => void;
  onClose: () => void;
};

export function ImageLightbox({
  images,
  activeIndex,
  projectName,
  onChange,
  onClose,
}: ImageLightboxProps) {
  const reduce = useReducedMotion();
  const closeButton = useRef<HTMLButtonElement>(null);
  const isOpen = activeIndex !== null;

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') {
        onChange(((activeIndex ?? 0) - 1 + images.length) % images.length);
      }
      if (event.key === 'ArrowRight') {
        onChange(((activeIndex ?? 0) + 1) % images.length);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, images.length, isOpen, onChange, onClose]);

  return (
    <AnimatePresence>
      {activeIndex !== null && images[activeIndex] && (
        <motion.div
          className="image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={m(caseStudy, 'expandedGallery', { project: projectName })}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? {} : { opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <button
            ref={closeButton}
            className="lightbox-close"
            type="button"
            onClick={onClose}
            aria-label={m(caseStudy, 'closeImage')}
          >
            <X />
          </button>

          <motion.img
            key={images[activeIndex]}
            src={images[activeIndex]}
            alt={m(caseStudy, 'imageAlt', {
              project: projectName,
              current: activeIndex + 1,
              total: images.length,
            })}
            initial={reduce ? false : { opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
          />

          <div className="lightbox-controls">
            <button
              type="button"
              onClick={() => onChange((activeIndex - 1 + images.length) % images.length)}
              aria-label={m(caseStudy, 'previousImage')}
            >
              <ArrowLeft />
            </button>
            <span aria-live="polite">
              {String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={() => onChange((activeIndex + 1) % images.length)}
              aria-label={m(caseStudy, 'nextImage')}
            >
              <ArrowRight />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
