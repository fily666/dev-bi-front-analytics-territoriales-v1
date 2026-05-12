'use client';

import { cn } from '@/shared/ui/utils/cn';
import { Download, ExternalLink, X } from 'lucide-react';
import { useEffect } from 'react';

export interface PreviewPdfModalProps {
  open: boolean;
  url: string | null;
  titulo: string;
  subtitulo?: string;
  /** Nombre sugerido del archivo al descargar. */
  filename?: string;
  onClose: () => void;
}

export function PreviewPdfModal({
  open,
  url,
  titulo,
  subtitulo,
  filename,
  onClose,
}: PreviewPdfModalProps) {
  // Cerrar con Escape — coherente con el patrón de overlay del sidebar móvil.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Bloquea scroll del body mientras el modal está abierto.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !url) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6',
        'bg-foreground/50 backdrop-blur-sm animate-fade-in',
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-pdf-titulo"
      onClick={onClose}
    >
      <div
        className="relative flex h-full max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0">
            <h2
              id="preview-pdf-titulo"
              className="truncate text-sm font-semibold tracking-tight text-foreground"
            >
              {titulo}
            </h2>
            {subtitulo && (
              <p className="mt-0.5 truncate text-xs text-foreground-muted">{subtitulo}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 text-xs font-medium text-foreground-muted transition-colors hover:border-brand/40 hover:bg-surface-elevated hover:text-foreground"
              aria-label="Abrir en nueva pestaña"
            >
              <ExternalLink size={13} />
              <span className="hidden sm:inline">Abrir</span>
            </a>
            <a
              href={url}
              download={filename}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-brand bg-brand px-2.5 text-xs font-semibold text-brand-foreground shadow-soft transition-colors hover:opacity-90"
              aria-label="Descargar PDF"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Descargar</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-surface-sunken">
          <iframe
            src={url}
            title={titulo}
            className="h-full w-full border-0"
            // Algunos navegadores (Firefox móvil) sirven el PDF como descarga
            // automática si no se le indica un sandbox permisivo. Lo dejamos
            // sin sandbox para no romper el visor nativo.
          />
        </div>
      </div>
    </div>
  );
}
