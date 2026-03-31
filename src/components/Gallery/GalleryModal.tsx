import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { galleryImages } from "../../data/gallery";
import "./GalleryModal.css";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function GalleryModal({ open, onClose }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const goPrev = useCallback(() => {
    setActiveIndex((i) =>
      i === null ? null : i > 0 ? i - 1 : galleryImages.length - 1,
    );
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((i) =>
      i === null ? null : i < galleryImages.length - 1 ? i + 1 : 0,
    );
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeIndex !== null) setActiveIndex(null);
        else onClose();
      }
      if (activeIndex !== null) {
        if (e.key === "ArrowLeft") goPrev();
        if (e.key === "ArrowRight") goNext();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, activeIndex, onClose, goPrev, goNext]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const active = activeIndex !== null ? galleryImages[activeIndex] : null;

  return createPortal(
    <div className="gallery-overlay" onClick={onClose}>
      <div className="gallery-panel" onClick={(e) => e.stopPropagation()}>
        <div className="gallery-header">
          <h2 className="gallery-title">Real Arrangements</h2>
          <button className="gallery-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="gallery-grid">
          {galleryImages.map((img, i) => (
            <div
              key={img.id}
              className="gallery-thumb"
              role="button"
              tabIndex={0}
              onClick={() => setActiveIndex(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setActiveIndex(i);
              }}
            >
              <img
                src={img.thumb}
                alt={img.caption}
                className="gallery-thumb-img"
                loading="lazy"
              />
              <div className="gallery-thumb-caption">{img.caption}</div>
            </div>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="gallery-lightbox"
          onClick={() => setActiveIndex(null)}
        >
          <button
            className="gallery-lb-nav gallery-lb-prev"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
          >
            <ChevronLeft size={28} />
          </button>

          <div
            className="gallery-lb-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={active.src} alt={active.caption} />
            <p className="gallery-lb-caption">{active.caption}</p>
            <span className="gallery-lb-counter">
              {activeIndex! + 1} / {galleryImages.length}
            </span>
          </div>

          <button
            className="gallery-lb-nav gallery-lb-next"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
          >
            <ChevronRight size={28} />
          </button>

          <button
            className="gallery-lb-close"
            onClick={() => setActiveIndex(null)}
          >
            <X size={22} />
          </button>
        </div>
      )}
    </div>,
    document.body,
  );
}
