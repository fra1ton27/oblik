'use client'

import { ArrowRight, Heart, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { SegmentedPill } from '@/components/ui/SegmentedPill'
import { Field } from '@/components/ui/Field'
import { Input, PasswordInput, Select, Textarea } from '@/components/ui/Input'
import { Checkbox, Radio } from '@/components/ui/Checkbox'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { FileDrop } from '@/components/ui/FileDrop'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { Swatch } from '@/components/ui/Swatch'
import { Price } from '@/components/ui/Price'
import { Tabs } from '@/components/ui/Tabs'
import { Dialog } from '@/components/ui/Dialog'
import { toast } from '@/components/ui/Toast'
import { DotsPagination } from '@/components/ui/DotsPagination'

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-12 md:py-16">
      <h2 className="t-h2 mb-8">{title}</h2>
      {children}
    </section>
  )
}

export function UiKitInteractive() {
  const t = useTranslations('uiKit')
  const tc = useTranslations('common')
  const [chips, setChips] = useState<string[]>(['oak'])
  const [seg, setSeg] = useState('showcase')
  const [phone, setPhone] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [qty, setQty] = useState(2)
  const [swatch, setSwatch] = useState('linen')
  const [dialog, setDialog] = useState<null | 'drawer' | 'sheet' | 'modal'>(null)
  const [dot, setDot] = useState(1)

  return (
    <>
      <Block title={t('buttons')}>
        <div className="flex flex-col gap-6">
          {(['primary', 'secondary', 'soft', 'ghost'] as const).map((variant) => (
            <div key={variant} className="flex flex-wrap items-center gap-3">
              <Button variant={variant} iconRight={<ArrowRight aria-hidden className="size-4" strokeWidth={1.5} />}>
                {t(variant)}
              </Button>
              <Button variant={variant} size="sm">
                {t(variant)}
              </Button>
              <Button variant={variant} disabled>
                {t('disabled')}
              </Button>
              <Button variant={variant} loading loadingLabel={t('loadingState')}>
                {t(variant)}
              </Button>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="icon" aria-label={tc('open')}>
              <Heart aria-hidden className="size-5" strokeWidth={1.5} />
            </Button>
            <Button variant="icon" size="sm" aria-label={tc('open')}>
              <ShoppingBag aria-hidden className="size-4" strokeWidth={1.5} />
            </Button>
            <div className="rounded-pill bg-plum p-2">
              <Button variant="inverse">{t('primary')}</Button>
            </div>
          </div>
        </div>
      </Block>

      <Block title={t('chips')}>
        <div className="flex flex-wrap gap-2">
          {(['oak', 'walnut', 'ash'] as const).map((key) => (
            <Chip
              key={key}
              selected={chips.includes(key)}
              count={key === 'oak' ? 12 : key === 'walnut' ? 7 : 0}
              disabled={key === 'ash'}
              onClick={() => setChips((c) => (c.includes(key) ? c.filter((x) => x !== key) : [...c, key]))}
            >
              {t(key === 'oak' ? 'chipOak' : key === 'walnut' ? 'chipWalnut' : 'chipAsh')}
            </Chip>
          ))}
          <Chip removable removeLabel={`${tc('remove')}: ${t('chipOak')}`}>
            {t('chipOak')}
          </Chip>
        </div>
        <h3 className="t-h3 mt-10 mb-4">{t('segmented')}</h3>
        <div className="flex flex-wrap items-center gap-4">
          <div role="radiogroup" aria-label={t('segmented')}>
            <SegmentedPill
              activeKey={seg}
              size="md"
              items={(['showcase', 'grid', 'list'] as const).map((key) => ({
                key,
                render: (props) => (
                  <button {...props} type="button" role="radio" aria-checked={seg === key} onClick={() => setSeg(key)}>
                    {t(key === 'showcase' ? 'segShowcase' : key === 'grid' ? 'segGrid' : 'segList')}
                  </button>
                ),
              }))}
            />
          </div>
          <div className="rounded-pill bg-plum p-3">
            <SegmentedPill
              tone="dark"
              activeKey={seg}
              items={(['showcase', 'grid', 'list'] as const).map((key) => ({
                key,
                render: (props) => (
                  <button {...props} type="button" aria-pressed={seg === key} onClick={() => setSeg(key)}>
                    {t(key === 'showcase' ? 'segShowcase' : key === 'grid' ? 'segGrid' : 'segList')}
                  </button>
                ),
              }))}
            />
          </div>
        </div>
      </Block>

      <Block title={t('fields')}>
        <div className="grid gap-6 md:grid-cols-2">
          <Field label={t('fieldName')} required>
            {(p) => <Input {...p} placeholder={t('fieldNamePlaceholder')} autoComplete="name" />}
          </Field>
          <Field label={t('fieldEmail')} required error={t('fieldError')}>
            {(p) => <Input {...p} type="email" inputMode="email" defaultValue="hello.oblik.example" autoComplete="email" />}
          </Field>
          <Field label={t('fieldDisabled')}>{(p) => <Input {...p} disabled defaultValue={t('fieldDisabled')} />}</Field>
          <Field label={t('fieldSelect')} optional>
            {(p) => (
              <Select {...p}>
                <option>{t('fieldSelectOption1')}</option>
                <option>{t('fieldSelectOption2')}</option>
              </Select>
            )}
          </Field>
          <Field label={t('fieldPhone')} required>
            {(p) => <PhoneInput {...p} value={phone} onChange={setPhone} />}
          </Field>
          <Field label={t('fieldPassword')}>{(p) => <PasswordInput {...p} autoComplete="new-password" />}</Field>
          <Field label={t('fieldMessage')} className="md:col-span-2">
            {(p) => <Textarea {...p} />}
          </Field>
          <Field label={t('fieldFiles')} className="md:col-span-2">
            {(p) => <FileDrop id={p.id} files={files} onChange={setFiles} />}
          </Field>
          <div className="flex flex-col gap-2">
            <Checkbox label={t('checkboxAgree')} defaultChecked />
            <Checkbox label={t('checkboxAgree')} error={t('fieldError')} />
            <Checkbox label={t('fieldDisabled')} disabled />
          </div>
          <div className="flex flex-col gap-3" role="radiogroup" aria-label={t('radioCity')}>
            <Radio name="kit-delivery" label={t('radioCity')} description={t('radioCityHint')} aside={<Price amount={4000} size="sm" />} defaultChecked />
            <Radio name="kit-delivery" label={t('radioPickup')} aside={<Price amount={0} size="sm" />} />
            <Radio name="kit-delivery" label={t('fieldDisabled')} disabled />
          </div>
        </div>
      </Block>

      <Block title={t('stepperAndQty')}>
        <div className="flex flex-wrap items-center gap-8">
          <QuantityStepper value={qty} onChange={setQty} />
          <QuantityStepper value={qty} onChange={setQty} size="sm" disabled />
          <div role="radiogroup" aria-label={t('stepperAndQty')} className="flex gap-1">
            <Swatch name="kit-sw" value="linen" label={t('swatchLinen')} color="var(--color-sand)" selected={swatch === 'linen'} onSelect={() => setSwatch('linen')} />
            <Swatch name="kit-sw" value="wool" label={t('swatchWool')} color="var(--color-ink-soft)" selected={swatch === 'wool'} onSelect={() => setSwatch('wool')} />
            <Swatch name="kit-sw" value="velvet" label={t('swatchVelvet')} color="var(--color-lavender)" selected={swatch === 'velvet'} onSelect={() => setSwatch('velvet')} />
            <Swatch name="kit-sw" value="none" label={t('disabled')} color="var(--color-blush)" disabled />
          </div>
          <Price amount={129000 * qty} size="xl" rolling />
          <Price amount={89000} compareAt={109000} from size="lg" />
        </div>
      </Block>

      <Block title={t('overlays')}>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setDialog('drawer')}>
            {t('openDrawer')}
          </Button>
          <Button variant="secondary" onClick={() => setDialog('sheet')}>
            {t('openSheet')}
          </Button>
          <Button variant="secondary" onClick={() => setDialog('modal')}>
            {t('openModal')}
          </Button>
          <Button
            variant="soft"
            onClick={() => toast({ message: t('toastMessage'), actionLabel: tc('undo'), onAction: () => toast({ message: tc('copied'), tone: 'success' }) })}
          >
            {t('showToast')}
          </Button>
        </div>
        <div className="mt-10">
          <Tabs
            items={[
              { id: 'd', label: t('tab1'), content: <p>{t('tab1Content')}</p> },
              { id: 'm', label: t('tab2'), content: <p>{t('tab2Content')}</p> },
              { id: 'c', label: t('tab3'), content: <p>{t('tab3Content')}</p> },
            ]}
          />
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <span className="t-small">{t('dots')}</span>
          <DotsPagination count={5} active={dot} onSelect={setDot} />
          <div className="rounded-pill bg-plum p-2">
            <DotsPagination count={5} active={dot} onSelect={setDot} tone="dark" />
          </div>
        </div>
        <Dialog
          open={dialog === 'drawer'}
          onClose={() => setDialog(null)}
          title={t('drawerTitle')}
          footer={
            <Button fullWidth onClick={() => setDialog(null)}>
              {tc('close')}
            </Button>
          }
        >
          <p className="text-ink-soft">{t('drawerBody')}</p>
        </Dialog>
        <Dialog open={dialog === 'sheet'} onClose={() => setDialog(null)} title={t('sheetTitle')} variant="sheet">
          <div className="flex flex-col gap-3 pb-4">
            <Radio name="kit-sort" label={t('segShowcase')} defaultChecked />
            <Radio name="kit-sort" label={t('segGrid')} />
          </div>
        </Dialog>
        <Dialog open={dialog === 'modal'} onClose={() => setDialog(null)} title={t('modalTitle')} variant="modal">
          <p className="text-ink-soft">{t('modalBody')}</p>
          <div className="mt-6 flex gap-3">
            <Button onClick={() => setDialog(null)}>{tc('save')}</Button>
            <Button variant="secondary" onClick={() => setDialog(null)}>
              {tc('cancel')}
            </Button>
          </div>
        </Dialog>
      </Block>
    </>
  )
}
