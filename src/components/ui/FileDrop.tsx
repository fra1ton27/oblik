'use client'

import { FileText, ImageIcon, Paperclip, X } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useFormat } from '@/components/motion/useFormat'
import { cn } from '@/lib/cn'

export const FILE_LIMITS = {
  maxFiles: 5,
  maxSize: 10 * 1024 * 1024,
  accept: ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'application/pdf'],
  extensions: ['.jpg', '.jpeg', '.png', '.heic', '.heif', '.pdf'],
}

type Props = {
  files: File[]
  onChange: (files: File[]) => void
  error?: string
  id?: string
  disabled?: boolean
  'aria-describedby'?: string
}

/** Загрузка файлов перетаскиванием или выбором: до 5 шт., до 10 МБ, jpg/png/heic/pdf */
export function FileDrop({ files, onChange, error, id: idProp, disabled, ...aria }: Props) {
  const t = useTranslations('forms')
  const f = useFormat()
  const autoId = useId()
  const id = idProp ?? autoId
  const inputRef = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const [rejected, setRejected] = useState<string | null>(null)

  function add(list: FileList | File[]) {
    const incoming = Array.from(list)
    const ok: File[] = []
    let reason: string | null = null
    for (const file of incoming) {
      const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
      if (!FILE_LIMITS.accept.includes(file.type) && !FILE_LIMITS.extensions.includes(ext)) {
        reason = t('fileTypeError', { name: file.name })
        continue
      }
      if (file.size > FILE_LIMITS.maxSize) {
        reason = t('fileSizeError', { name: file.name })
        continue
      }
      ok.push(file)
    }
    const next = [...files, ...ok]
    if (next.length > FILE_LIMITS.maxFiles) reason = t('fileCountError', { max: FILE_LIMITS.maxFiles })
    setRejected(reason)
    onChange(next.slice(0, FILE_LIMITS.maxFiles))
  }

  const sizeLabel = (bytes: number) =>
    bytes > 1024 * 1024
      ? f.number(bytes / 1024 / 1024, { style: 'unit', unit: 'megabyte', maximumFractionDigits: 1 })
      : f.number(Math.max(1, Math.round(bytes / 1024)), { style: 'unit', unit: 'kilobyte' })

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          if (!disabled) add(e.dataTransfer.files)
        }}
        className={cn(
          'relative flex flex-col items-center gap-2 rounded-card border border-dashed px-4 py-8 text-center transition-colors duration-200',
          over ? 'border-lavender-600 bg-lavender/30' : 'border-ink-soft/50 bg-paper',
          error && 'border-error',
          disabled && 'opacity-50',
        )}
      >
        <Paperclip aria-hidden className="size-6 text-ink-soft" strokeWidth={1.5} />
        <p className="t-small">
          {t('fileDropTitle')}{' '}
          <label htmlFor={id} className="cursor-pointer font-semibold text-lavender-600 underline underline-offset-4">
            {t('fileDropChoose')}
          </label>
        </p>
        <p className="text-[13px] text-ink-soft">{t('fileDropHint', { max: FILE_LIMITS.maxFiles })}</p>
        <input
          ref={inputRef}
          id={id}
          type="file"
          multiple
          disabled={disabled || files.length >= FILE_LIMITS.maxFiles}
          accept={[...FILE_LIMITS.accept, ...FILE_LIMITS.extensions].join(',')}
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) add(e.target.files)
            e.target.value = ''
          }}
          aria-invalid={error ? true : undefined}
          {...aria}
        />
      </div>
      {files.length > 0 && (
        <ul className="flex flex-col gap-2" aria-live="polite">
          {files.map((file, i) => (
            <li key={`${file.name}-${i}`} className="flex items-center gap-3 rounded-field border border-line bg-paper py-1.5 pr-1.5 pl-3">
              {file.type === 'application/pdf' ? (
                <FileText aria-hidden className="size-5 shrink-0 text-ink-soft" strokeWidth={1.5} />
              ) : (
                <ImageIcon aria-hidden className="size-5 shrink-0 text-ink-soft" strokeWidth={1.5} />
              )}
              <span className="t-small min-w-0 flex-1 truncate">{file.name}</span>
              <span className="text-[13px] text-ink-soft tabular-nums">{sizeLabel(file.size)}</span>
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-pill hover:bg-sand"
                aria-label={t('fileRemove', { name: file.name })}
                onClick={() => onChange(files.filter((_, j) => j !== i))}
              >
                <X aria-hidden className="size-4" strokeWidth={1.5} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {(rejected || error) && (
        <p role="alert" className="text-[13px] font-medium text-error">
          {rejected ?? error}
        </p>
      )}
    </div>
  )
}
