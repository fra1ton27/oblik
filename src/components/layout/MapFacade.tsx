'use client'

import Image from 'next/image'
import { ExternalLink, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import type { ImageDTO } from '@/lib/media'
import { Button } from '@/components/ui/Button'

/**
 * Карта шоурума (раздел 6.2 ТЗ): статичная картинка со ссылкой на карты, iframe OpenStreetMap
 * загружается только по клику — до этого сторонний сервис не получает запросов от посетителя.
 */
export function MapFacade({ lat, lng, image, address }: { lat: number; lng: number; image: ImageDTO | null; address: string }) {
  const t = useTranslations('pages')
  const [loaded, setLoaded] = useState(false)
  const bbox = [lng - 0.006, lat - 0.003, lng + 0.006, lat + 0.003].map((n) => n.toFixed(5)).join(',')
  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`
  const external = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-sand md:aspect-[16/10]">
        {loaded ? (
          <iframe title={t('mapTitle', { address })} src={embed} className="absolute inset-0 size-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        ) : (
          <>
            {image && <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 40vw, 92vw" placeholder="blur" blurDataURL={image.blur} className="object-cover" />}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/10 p-4 text-center">
              <Button onClick={() => setLoaded(true)}>
                <MapPin aria-hidden className="size-5" strokeWidth={1.5} />
                {t('showMap')}
              </Button>
              <p className="max-w-[32ch] rounded-pill bg-paper/90 px-3 py-1 text-[12px] font-semibold">{t('mapNotice')}</p>
            </div>
          </>
        )}
      </div>
      <a href={external} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 self-start text-[14px] font-semibold underline-offset-4 hover:underline">
        <ExternalLink aria-hidden className="size-4" strokeWidth={1.5} />
        {t('openInMaps')}
      </a>
    </div>
  )
}
