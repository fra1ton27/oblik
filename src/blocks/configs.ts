import type { Block, Field } from 'payload'
import { accentOptions, routeField } from '@/fields'

/**
 * Блоки посадочных и главной (раздел 12.1 ТЗ). Структура общая для всех языков,
 * тексты внутри локализованы (fallback на русский). React-компонент на блок — в src/blocks/<Name>.
 */

const L = { localized: true } as const

const heading: Field = { name: 'heading', type: 'text', ...L, label: { ru: 'Заголовок', en: 'Heading' } }
const lead: Field = { name: 'lead', type: 'textarea', ...L, label: { ru: 'Лид', en: 'Lead' } }

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: { ru: 'Hero', en: 'Hero' }, plural: { ru: 'Hero', en: 'Hero' } },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'home',
      options: [
        { label: { ru: 'Главная', en: 'Home' }, value: 'home' },
        { label: { ru: 'Коллекция', en: 'Collection' }, value: 'collection' },
        { label: { ru: 'Страница', en: 'Page' }, value: 'page' },
      ],
    },
    { name: 'chip', type: 'text', ...L, label: { ru: 'Чип над лидом', en: 'Chip' } },
    {
      name: 'lines',
      type: 'array',
      label: { ru: 'Строки огромного слова', en: 'Display lines' },
      fields: [{ name: 'text', type: 'text', required: true, ...L }],
    },
    lead,
    { name: 'media', type: 'upload', relationTo: 'media', label: { ru: 'Фото', en: 'Image' } },
    { name: 'video', type: 'upload', relationTo: 'media', label: { ru: 'Видео (до 3 МБ)', en: 'Video (≤ 3 MB)' } },
    { name: 'ctaLabel', type: 'text', ...L, label: { ru: 'Текст кнопки', en: 'Button label' } },
    routeField('ctaRoute'),
  ],
}

export const StackedCardsBlock: Block = {
  slug: 'stackedCards',
  interfaceName: 'StackedCardsBlock',
  labels: { singular: { ru: 'Стопка карточек', en: 'Stacked cards' }, plural: { ru: 'Стопки карточек', en: 'Stacked cards' } },
  fields: [
    heading,
    lead,
    {
      name: 'source',
      type: 'select',
      defaultValue: 'categories',
      options: [
        { label: { ru: 'Категории каталога', en: 'Catalogue categories' }, value: 'categories' },
        { label: { ru: 'Вручную', en: 'Manual' }, value: 'manual' },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      admin: { condition: (_, s) => s?.source === 'manual' },
      fields: [
        { name: 'title', type: 'text', required: true, ...L },
        { name: 'text', type: 'textarea', ...L },
        { name: 'chips', type: 'array', fields: [{ name: 'label', type: 'text', ...L }] },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'color', type: 'select', defaultValue: 'lavender', options: [...accentOptions, { label: { ru: 'Слива', en: 'Plum' }, value: 'plum' }] },
        routeField('route'),
      ],
    },
  ],
}

export const ShowcaseBlock: Block = {
  slug: 'showcase',
  interfaceName: 'ShowcaseBlock',
  labels: { singular: { ru: 'Витрина', en: 'Showcase' }, plural: { ru: 'Витрины', en: 'Showcases' } },
  fields: [
    heading,
    lead,
    {
      name: 'source',
      type: 'select',
      defaultValue: 'bundles',
      options: [
        { label: { ru: 'Комплекты', en: 'Bundles' }, value: 'bundles' },
        { label: { ru: 'Избранные товары', en: 'Featured products' }, value: 'featured' },
        { label: { ru: 'Товары коллекции', en: 'Collection products' }, value: 'collection' },
      ],
    },
    { name: 'collection', type: 'relationship', relationTo: 'collections', admin: { condition: (_, s) => s?.source === 'collection' } },
  ],
}

export const ProductCarouselBlock: Block = {
  slug: 'productCarousel',
  interfaceName: 'ProductCarouselBlock',
  labels: { singular: { ru: 'Карусель товаров', en: 'Product carousel' }, plural: { ru: 'Карусели товаров', en: 'Product carousels' } },
  fields: [
    heading,
    {
      name: 'source',
      type: 'select',
      defaultValue: 'featured',
      options: [
        { label: { ru: 'Хиты и новинки', en: 'Bestsellers & new' }, value: 'featured' },
        { label: { ru: 'Похожие (та же категория)', en: 'Similar (same category)' }, value: 'similar' },
        { label: { ru: 'Из той же коллекции', en: 'Same collection' }, value: 'sameCollection' },
        { label: { ru: 'Категория', en: 'Category' }, value: 'category' },
        { label: { ru: 'Популярные', en: 'Popular' }, value: 'popular' },
      ],
    },
    { name: 'category', type: 'relationship', relationTo: 'categories', admin: { condition: (_, s) => s?.source === 'category' } },
    { name: 'showFilters', type: 'checkbox', defaultValue: true, label: { ru: 'Фильтр-чипы «Все / Новинки / В наличии»', en: 'Filter chips' } },
    { name: 'limit', type: 'number', defaultValue: 12 },
  ],
}

export const StoryBlock: Block = {
  slug: 'story',
  interfaceName: 'StoryBlock',
  labels: { singular: { ru: 'История', en: 'Story' }, plural: { ru: 'Истории', en: 'Stories' } },
  fields: [
    heading,
    { name: 'text', type: 'textarea', ...L },
    { name: 'quote', type: 'textarea', ...L, label: { ru: 'Цитата дизайнера', en: 'Designer quote' } },
    { name: 'quoteAuthor', type: 'text', label: { ru: 'Автор цитаты', en: 'Quote author' } },
    { name: 'images', type: 'upload', relationTo: 'media', hasMany: true, label: { ru: 'Фото (наклонены)', en: 'Images (tilted)' } },
  ],
}

export const MaterialsBlock: Block = {
  slug: 'materials',
  interfaceName: 'MaterialsBlock',
  labels: { singular: { ru: 'Материалы', en: 'Materials' }, plural: { ru: 'Материалы', en: 'Materials' } },
  fields: [heading, lead],
}

export const DimensionsBlock: Block = {
  slug: 'dimensions',
  interfaceName: 'DimensionsBlock',
  labels: { singular: { ru: 'Размеры', en: 'Dimensions' }, plural: { ru: 'Размеры', en: 'Dimensions' } },
  fields: [heading, { name: 'note', type: 'textarea', ...L }],
}

export const BundleBuilderBlock: Block = {
  slug: 'bundleBuilder',
  interfaceName: 'BundleBuilderBlock',
  labels: { singular: { ru: 'Соберите комплект', en: 'Bundle builder' }, plural: { ru: 'Сборщики комплектов', en: 'Bundle builders' } },
  fields: [heading, lead],
}

export const FAQBlock: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  labels: { singular: { ru: 'Вопросы и ответы', en: 'FAQ' }, plural: { ru: 'Вопросы и ответы', en: 'FAQ' } },
  fields: [
    heading,
    {
      name: 'items',
      type: 'array',
      admin: { description: { ru: 'Пусто — берутся вопросы товара или из настроек сайта', en: 'Empty — product or site FAQ is used' } },
      fields: [
        { name: 'question', type: 'text', required: true, ...L },
        { name: 'answer', type: 'textarea', required: true, ...L },
      ],
    },
  ],
}

export const ReviewsBlock: Block = {
  slug: 'reviews',
  interfaceName: 'ReviewsBlock',
  labels: { singular: { ru: 'Отзывы', en: 'Reviews' }, plural: { ru: 'Отзывы', en: 'Reviews' } },
  fields: [heading, { name: 'limit', type: 'number', defaultValue: 6 }],
}

export const DragCanvasBlock: Block = {
  slug: 'dragCanvas',
  interfaceName: 'DragCanvasBlock',
  labels: { singular: { ru: 'Полотно интерьеров', en: 'Interiors canvas' }, plural: { ru: 'Полотна интерьеров', en: 'Interiors canvases' } },
  fields: [
    heading,
    lead,
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'caption', type: 'text', ...L },
        { name: 'review', type: 'relationship', relationTo: 'reviews' },
      ],
    },
  ],
}

export const CTABlock: Block = {
  slug: 'cta',
  interfaceName: 'CTABlock',
  labels: { singular: { ru: 'Призыв к действию', en: 'Call to action' }, plural: { ru: 'Призывы', en: 'Calls to action' } },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'blush',
      options: [
        { label: { ru: 'Blush — «под ваш размер»', en: 'Blush — custom size' }, value: 'blush' },
        { label: { ru: 'Pistachio — на заказ с формой', en: 'Pistachio — custom with form' }, value: 'pistachio' },
        { label: { ru: 'Plum — контакты с формой', en: 'Plum — contact with form' }, value: 'plum' },
        { label: { ru: 'Lavender', en: 'Lavender' }, value: 'lavender' },
      ],
    },
    heading,
    { name: 'text', type: 'textarea', ...L },
    { name: 'buttonLabel', type: 'text', ...L },
    {
      name: 'action',
      type: 'select',
      defaultValue: 'link',
      options: [
        { label: { ru: 'Ссылка', en: 'Link' }, value: 'link' },
        { label: { ru: 'Форма индивидуального заказа', en: 'Custom order form' }, value: 'customForm' },
        { label: { ru: 'Форма обратной связи', en: 'Contact form' }, value: 'contactForm' },
        { label: { ru: 'Модалка «на заказ»', en: 'Custom order modal' }, value: 'customModal' },
      ],
    },
    routeField('route'),
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  labels: { singular: { ru: 'Текст', en: 'Rich text' }, plural: { ru: 'Тексты', en: 'Rich texts' } },
  fields: [{ name: 'content', type: 'richText', ...L }],
}

export const GalleryBlock: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: { singular: { ru: 'Галерея', en: 'Gallery' }, plural: { ru: 'Галереи', en: 'Galleries' } },
  fields: [heading, { name: 'images', type: 'upload', relationTo: 'media', hasMany: true }],
}

export const StatsBlock: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: { singular: { ru: 'Факты с цифрами', en: 'Stats' }, plural: { ru: 'Факты', en: 'Stats' } },
  fields: [
    heading,
    lead,
    {
      name: 'items',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'value', type: 'number', required: true },
        { name: 'suffix', type: 'text', ...L },
        { name: 'label', type: 'text', required: true, ...L },
      ],
    },
    { name: 'linkLabel', type: 'text', ...L },
    routeField('route'),
  ],
}

export const allBlocks: Block[] = [
  HeroBlock,
  StackedCardsBlock,
  ShowcaseBlock,
  ProductCarouselBlock,
  StoryBlock,
  MaterialsBlock,
  DimensionsBlock,
  BundleBuilderBlock,
  FAQBlock,
  ReviewsBlock,
  DragCanvasBlock,
  CTABlock,
  RichTextBlock,
  GalleryBlock,
  StatsBlock,
]

export function layoutField(blocks: Block[] = allBlocks): Field {
  return {
    name: 'layout',
    type: 'blocks',
    label: { ru: 'Блоки страницы', en: 'Page blocks' },
    blocks,
  }
}
