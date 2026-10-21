import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('ru', 'en', 'sr');
  CREATE TYPE "public"."enum_products_blocks_hero_variant" AS ENUM('home', 'collection', 'page');
  CREATE TYPE "public"."enum_products_blocks_hero_cta_route" AS ENUM('/', '/catalog', '/collections', '/custom', '/about', '/contact', '/delivery', '/cart', '/checkout', '/thank-you', '/login', '/register', '/reset-password', '/account', '/account/orders', '/account/wishlist', '/account/inquiries', '/account/addresses', '/account/profile', '/wishlist', '/privacy', '/terms', '/ui-kit');
  CREATE TYPE "public"."enum_products_blocks_stacked_cards_cards_color" AS ENUM('lavender', 'pistachio', 'blush', 'mist', 'sand', 'plum');
  CREATE TYPE "public"."enum_products_blocks_stacked_cards_cards_route" AS ENUM('/', '/catalog', '/collections', '/custom', '/about', '/contact', '/delivery', '/cart', '/checkout', '/thank-you', '/login', '/register', '/reset-password', '/account', '/account/orders', '/account/wishlist', '/account/inquiries', '/account/addresses', '/account/profile', '/wishlist', '/privacy', '/terms', '/ui-kit');
  CREATE TYPE "public"."enum_products_blocks_stacked_cards_source" AS ENUM('categories', 'manual');
  CREATE TYPE "public"."enum_products_blocks_showcase_source" AS ENUM('bundles', 'featured', 'collection');
  CREATE TYPE "public"."enum_products_blocks_product_carousel_source" AS ENUM('featured', 'similar', 'sameCollection', 'category', 'popular');
  CREATE TYPE "public"."enum_products_blocks_cta_variant" AS ENUM('blush', 'pistachio', 'plum', 'lavender');
  CREATE TYPE "public"."enum_products_blocks_cta_action" AS ENUM('link', 'customForm', 'contactForm', 'customModal');
  CREATE TYPE "public"."enum_products_blocks_cta_route" AS ENUM('/', '/catalog', '/collections', '/custom', '/about', '/contact', '/delivery', '/cart', '/checkout', '/thank-you', '/login', '/register', '/reset-password', '/account', '/account/orders', '/account/wishlist', '/account/inquiries', '/account/addresses', '/account/profile', '/wishlist', '/privacy', '/terms', '/ui-kit');
  CREATE TYPE "public"."enum_products_blocks_stats_route" AS ENUM('/', '/catalog', '/collections', '/custom', '/about', '/contact', '/delivery', '/cart', '/checkout', '/thank-you', '/login', '/register', '/reset-password', '/account', '/account/orders', '/account/wishlist', '/account/inquiries', '/account/addresses', '/account/profile', '/wishlist', '/privacy', '/terms', '/ui-kit');
  CREATE TYPE "public"."enum_products_badges" AS ENUM('new', 'bestseller', 'sale');
  CREATE TYPE "public"."enum_products_colors" AS ENUM('milk', 'sand', 'oak', 'walnut', 'graphite', 'green', 'blue', 'terracotta', 'lavender');
  CREATE TYPE "public"."enum_products_missing_translations" AS ENUM('ru', 'en', 'sr');
  CREATE TYPE "public"."enum_products_podium_color" AS ENUM('lavender', 'pistachio', 'blush', 'mist', 'sand');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_categories_missing_translations" AS ENUM('ru', 'en', 'sr');
  CREATE TYPE "public"."enum_categories_color" AS ENUM('lavender', 'pistachio', 'blush', 'mist', 'sand');
  CREATE TYPE "public"."enum_collections_blocks_hero_variant" AS ENUM('home', 'collection', 'page');
  CREATE TYPE "public"."enum_collections_blocks_hero_cta_route" AS ENUM('/', '/catalog', '/collections', '/custom', '/about', '/contact', '/delivery', '/cart', '/checkout', '/thank-you', '/login', '/register', '/reset-password', '/account', '/account/orders', '/account/wishlist', '/account/inquiries', '/account/addresses', '/account/profile', '/wishlist', '/privacy', '/terms', '/ui-kit');
  CREATE TYPE "public"."enum_collections_blocks_stacked_cards_cards_color" AS ENUM('lavender', 'pistachio', 'blush', 'mist', 'sand', 'plum');
  CREATE TYPE "public"."enum_collections_blocks_stacked_cards_cards_route" AS ENUM('/', '/catalog', '/collections', '/custom', '/about', '/contact', '/delivery', '/cart', '/checkout', '/thank-you', '/login', '/register', '/reset-password', '/account', '/account/orders', '/account/wishlist', '/account/inquiries', '/account/addresses', '/account/profile', '/wishlist', '/privacy', '/terms', '/ui-kit');
  CREATE TYPE "public"."enum_collections_blocks_stacked_cards_source" AS ENUM('categories', 'manual');
  CREATE TYPE "public"."enum_collections_blocks_showcase_source" AS ENUM('bundles', 'featured', 'collection');
  CREATE TYPE "public"."enum_collections_blocks_product_carousel_source" AS ENUM('featured', 'similar', 'sameCollection', 'category', 'popular');
  CREATE TYPE "public"."enum_collections_blocks_cta_variant" AS ENUM('blush', 'pistachio', 'plum', 'lavender');
  CREATE TYPE "public"."enum_collections_blocks_cta_action" AS ENUM('link', 'customForm', 'contactForm', 'customModal');
  CREATE TYPE "public"."enum_collections_blocks_cta_route" AS ENUM('/', '/catalog', '/collections', '/custom', '/about', '/contact', '/delivery', '/cart', '/checkout', '/thank-you', '/login', '/register', '/reset-password', '/account', '/account/orders', '/account/wishlist', '/account/inquiries', '/account/addresses', '/account/profile', '/wishlist', '/privacy', '/terms', '/ui-kit');
  CREATE TYPE "public"."enum_collections_blocks_stats_route" AS ENUM('/', '/catalog', '/collections', '/custom', '/about', '/contact', '/delivery', '/cart', '/checkout', '/thank-you', '/login', '/register', '/reset-password', '/account', '/account/orders', '/account/wishlist', '/account/inquiries', '/account/addresses', '/account/profile', '/wishlist', '/privacy', '/terms', '/ui-kit');
  CREATE TYPE "public"."enum_collections_missing_translations" AS ENUM('ru', 'en', 'sr');
  CREATE TYPE "public"."enum_collections_podium_color" AS ENUM('lavender', 'pistachio', 'blush', 'mist', 'sand');
  CREATE TYPE "public"."enum_collections_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_materials_missing_translations" AS ENUM('ru', 'en', 'sr');
  CREATE TYPE "public"."enum_materials_type" AS ENUM('wood', 'fabric', 'metal', 'stone', 'other');
  CREATE TYPE "public"."enum_materials_color_family" AS ENUM('milk', 'sand', 'oak', 'walnut', 'graphite', 'green', 'blue', 'terracotta', 'lavender');
  CREATE TYPE "public"."enum_orders_status_history_status" AS ENUM('new', 'confirmed', 'production', 'ready', 'delivered', 'cancelled');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('new', 'confirmed', 'production', 'ready', 'delivered', 'cancelled');
  CREATE TYPE "public"."enum_orders_payment_status" AS ENUM('pending', 'paid', 'refunded');
  CREATE TYPE "public"."enum_orders_payment_method" AS ENUM('manual', 'card');
  CREATE TYPE "public"."enum_orders_delivery_method" AS ENUM('city', 'country', 'pickup');
  CREATE TYPE "public"."enum_orders_locale" AS ENUM('ru', 'en', 'sr');
  CREATE TYPE "public"."enum_inquiries_type" AS ENUM('contact', 'custom', 'question', 'newsletter');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'in_progress', 'offer_sent', 'closed');
  CREATE TYPE "public"."enum_inquiries_locale" AS ENUM('ru', 'en', 'sr');
  CREATE TYPE "public"."enum_customers_locale" AS ENUM('ru', 'en', 'sr');
  CREATE TYPE "public"."enum_promo_codes_kind" AS ENUM('percent', 'amount');
  CREATE TYPE "public"."enum_pages_blocks_hero_variant" AS ENUM('home', 'collection', 'page');
  CREATE TYPE "public"."enum_pages_blocks_hero_cta_route" AS ENUM('/', '/catalog', '/collections', '/custom', '/about', '/contact', '/delivery', '/cart', '/checkout', '/thank-you', '/login', '/register', '/reset-password', '/account', '/account/orders', '/account/wishlist', '/account/inquiries', '/account/addresses', '/account/profile', '/wishlist', '/privacy', '/terms', '/ui-kit');
  CREATE TYPE "public"."enum_pages_blocks_stacked_cards_cards_color" AS ENUM('lavender', 'pistachio', 'blush', 'mist', 'sand', 'plum');
  CREATE TYPE "public"."enum_pages_blocks_stacked_cards_cards_route" AS ENUM('/', '/catalog', '/collections', '/custom', '/about', '/contact', '/delivery', '/cart', '/checkout', '/thank-you', '/login', '/register', '/reset-password', '/account', '/account/orders', '/account/wishlist', '/account/inquiries', '/account/addresses', '/account/profile', '/wishlist', '/privacy', '/terms', '/ui-kit');
  CREATE TYPE "public"."enum_pages_blocks_stacked_cards_source" AS ENUM('categories', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_showcase_source" AS ENUM('bundles', 'featured', 'collection');
  CREATE TYPE "public"."enum_pages_blocks_product_carousel_source" AS ENUM('featured', 'similar', 'sameCollection', 'category', 'popular');
  CREATE TYPE "public"."enum_pages_blocks_cta_variant" AS ENUM('blush', 'pistachio', 'plum', 'lavender');
  CREATE TYPE "public"."enum_pages_blocks_cta_action" AS ENUM('link', 'customForm', 'contactForm', 'customModal');
  CREATE TYPE "public"."enum_pages_blocks_cta_route" AS ENUM('/', '/catalog', '/collections', '/custom', '/about', '/contact', '/delivery', '/cart', '/checkout', '/thank-you', '/login', '/register', '/reset-password', '/account', '/account/orders', '/account/wishlist', '/account/inquiries', '/account/addresses', '/account/profile', '/wishlist', '/privacy', '/terms', '/ui-kit');
  CREATE TYPE "public"."enum_pages_blocks_stats_route" AS ENUM('/', '/catalog', '/collections', '/custom', '/about', '/contact', '/delivery', '/cart', '/checkout', '/thank-you', '/login', '/register', '/reset-password', '/account', '/account/orders', '/account/wishlist', '/account/inquiries', '/account/addresses', '/account/profile', '/wishlist', '/privacy', '/terms', '/ui-kit');
  CREATE TYPE "public"."enum_pages_missing_translations" AS ENUM('ru', 'en', 'sr');
  CREATE TYPE "public"."enum_pages_key" AS ENUM('privacy', 'terms', 'delivery', 'about', 'custom', 'contact');
  CREATE TYPE "public"."enum_media_tone" AS ENUM('sand', 'lavender', 'pistachio', 'blush', 'mist');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'manager', 'content');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_header_items_route" AS ENUM('/', '/catalog', '/collections', '/custom', '/about', '/contact', '/delivery', '/cart', '/checkout', '/thank-you', '/login', '/register', '/reset-password', '/account', '/account/orders', '/account/wishlist', '/account/inquiries', '/account/addresses', '/account/profile', '/wishlist', '/privacy', '/terms', '/ui-kit');
  CREATE TYPE "public"."enum_footer_columns_links_route" AS ENUM('/', '/catalog', '/collections', '/custom', '/about', '/contact', '/delivery', '/cart', '/checkout', '/thank-you', '/login', '/register', '/reset-password', '/account', '/account/orders', '/account/wishlist', '/account/inquiries', '/account/addresses', '/account/profile', '/wishlist', '/privacy', '/terms', '/ui-kit');
  CREATE TYPE "public"."enum_homepage_blocks_hero_variant" AS ENUM('home', 'collection', 'page');
  CREATE TYPE "public"."enum_homepage_blocks_hero_cta_route" AS ENUM('/', '/catalog', '/collections', '/custom', '/about', '/contact', '/delivery', '/cart', '/checkout', '/thank-you', '/login', '/register', '/reset-password', '/account', '/account/orders', '/account/wishlist', '/account/inquiries', '/account/addresses', '/account/profile', '/wishlist', '/privacy', '/terms', '/ui-kit');
  CREATE TYPE "public"."enum_homepage_blocks_stacked_cards_cards_color" AS ENUM('lavender', 'pistachio', 'blush', 'mist', 'sand', 'plum');
  CREATE TYPE "public"."enum_homepage_blocks_stacked_cards_cards_route" AS ENUM('/', '/catalog', '/collections', '/custom', '/about', '/contact', '/delivery', '/cart', '/checkout', '/thank-you', '/login', '/register', '/reset-password', '/account', '/account/orders', '/account/wishlist', '/account/inquiries', '/account/addresses', '/account/profile', '/wishlist', '/privacy', '/terms', '/ui-kit');
  CREATE TYPE "public"."enum_homepage_blocks_stacked_cards_source" AS ENUM('categories', 'manual');
  CREATE TYPE "public"."enum_homepage_blocks_showcase_source" AS ENUM('bundles', 'featured', 'collection');
  CREATE TYPE "public"."enum_homepage_blocks_product_carousel_source" AS ENUM('featured', 'similar', 'sameCollection', 'category', 'popular');
  CREATE TYPE "public"."enum_homepage_blocks_cta_variant" AS ENUM('blush', 'pistachio', 'plum', 'lavender');
  CREATE TYPE "public"."enum_homepage_blocks_cta_action" AS ENUM('link', 'customForm', 'contactForm', 'customModal');
  CREATE TYPE "public"."enum_homepage_blocks_cta_route" AS ENUM('/', '/catalog', '/collections', '/custom', '/about', '/contact', '/delivery', '/cart', '/checkout', '/thank-you', '/login', '/register', '/reset-password', '/account', '/account/orders', '/account/wishlist', '/account/inquiries', '/account/addresses', '/account/profile', '/wishlist', '/privacy', '/terms', '/ui-kit');
  CREATE TYPE "public"."enum_homepage_blocks_stats_route" AS ENUM('/', '/catalog', '/collections', '/custom', '/about', '/contact', '/delivery', '/cart', '/checkout', '/thank-you', '/login', '/register', '/reset-password', '/account', '/account/orders', '/account/wishlist', '/account/inquiries', '/account/addresses', '/account/profile', '/wishlist', '/privacy', '/terms', '/ui-kit');
  CREATE TYPE "public"."enum_site_settings_delivery_zones_code" AS ENUM('city', 'country', 'pickup');
  CREATE TABLE "products_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "products_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"sku" varchar NOT NULL,
  	"fabric_id" integer,
  	"finish_id" integer,
  	"price" numeric,
  	"price_delta" numeric,
  	"stock" numeric DEFAULT 0,
  	"lead_time_min" numeric,
  	"lead_time_max" numeric,
  	"image_id" integer
  );
  
  CREATE TABLE "products_variants_locales" (
  	"size" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_hero_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_blocks_hero_lines_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_products_blocks_hero_variant" DEFAULT 'home',
  	"media_id" integer,
  	"video_id" integer,
  	"cta_route" "enum_products_blocks_hero_cta_route",
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_hero_locales" (
  	"chip" varchar,
  	"lead" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_stacked_cards_cards_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_blocks_stacked_cards_cards_chips_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_stacked_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"color" "enum_products_blocks_stacked_cards_cards_color" DEFAULT 'lavender',
  	"route" "enum_products_blocks_stacked_cards_cards_route"
  );
  
  CREATE TABLE "products_blocks_stacked_cards_cards_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_stacked_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_products_blocks_stacked_cards_source" DEFAULT 'categories',
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_stacked_cards_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_products_blocks_showcase_source" DEFAULT 'bundles',
  	"collection_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_showcase_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_product_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_products_blocks_product_carousel_source" DEFAULT 'featured',
  	"category_id" integer,
  	"show_filters" boolean DEFAULT true,
  	"limit" numeric DEFAULT 12,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_product_carousel_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote_author" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_story_locales" (
  	"heading" varchar,
  	"text" varchar,
  	"quote" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_materials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_materials_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_dimensions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_dimensions_locales" (
  	"heading" varchar,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_bundle_builder" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_bundle_builder_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_blocks_faq_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_faq_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_reviews" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_reviews_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_drag_canvas_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"review_id" integer
  );
  
  CREATE TABLE "products_blocks_drag_canvas_items_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_drag_canvas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_drag_canvas_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_products_blocks_cta_variant" DEFAULT 'blush',
  	"action" "enum_products_blocks_cta_action" DEFAULT 'link',
  	"route" "enum_products_blocks_cta_route",
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_cta_locales" (
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_rich_text_locales" (
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_gallery_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric NOT NULL
  );
  
  CREATE TABLE "products_blocks_stats_items_locales" (
  	"suffix" varchar,
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"route" "enum_products_blocks_stats_route",
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_stats_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_faq_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_badges" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_products_badges",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_colors" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_products_colors",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_missing_translations" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_products_missing_translations",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"sku" varchar NOT NULL,
  	"price" numeric NOT NULL,
  	"compare_at_price" numeric,
  	"category_id" integer NOT NULL,
  	"collection_id" integer,
  	"designer_id" integer,
  	"dimensions_width" numeric,
  	"dimensions_depth" numeric,
  	"dimensions_height" numeric,
  	"dimensions_seat_height" numeric,
  	"dimensions_weight" numeric,
  	"cutout_id" integer,
  	"podium_color" "enum_products_podium_color" DEFAULT 'lavender',
  	"variant_required" boolean DEFAULT true,
  	"stock" numeric DEFAULT 0,
  	"lead_time_weeks_min" numeric DEFAULT 4,
  	"lead_time_weeks_max" numeric DEFAULT 6,
  	"status" "enum_products_status" DEFAULT 'published',
  	"featured" boolean DEFAULT false,
  	"popularity" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_locales" (
  	"title" varchar NOT NULL,
  	"short_description" varchar,
  	"description" jsonb,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"materials_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "categories_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "categories_chips_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "categories_missing_translations" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_categories_missing_translations",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"color" "enum_categories_color" DEFAULT 'lavender',
  	"parent_id" integer,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"description" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "collections_blocks_hero_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "collections_blocks_hero_lines_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "collections_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_collections_blocks_hero_variant" DEFAULT 'home',
  	"media_id" integer,
  	"video_id" integer,
  	"cta_route" "enum_collections_blocks_hero_cta_route",
  	"block_name" varchar
  );
  
  CREATE TABLE "collections_blocks_hero_locales" (
  	"chip" varchar,
  	"lead" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "collections_blocks_stacked_cards_cards_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "collections_blocks_stacked_cards_cards_chips_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "collections_blocks_stacked_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"color" "enum_collections_blocks_stacked_cards_cards_color" DEFAULT 'lavender',
  	"route" "enum_collections_blocks_stacked_cards_cards_route"
  );
  
  CREATE TABLE "collections_blocks_stacked_cards_cards_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "collections_blocks_stacked_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_collections_blocks_stacked_cards_source" DEFAULT 'categories',
  	"block_name" varchar
  );
  
  CREATE TABLE "collections_blocks_stacked_cards_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "collections_blocks_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_collections_blocks_showcase_source" DEFAULT 'bundles',
  	"collection_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "collections_blocks_showcase_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "collections_blocks_product_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_collections_blocks_product_carousel_source" DEFAULT 'featured',
  	"category_id" integer,
  	"show_filters" boolean DEFAULT true,
  	"limit" numeric DEFAULT 12,
  	"block_name" varchar
  );
  
  CREATE TABLE "collections_blocks_product_carousel_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "collections_blocks_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote_author" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "collections_blocks_story_locales" (
  	"heading" varchar,
  	"text" varchar,
  	"quote" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "collections_blocks_materials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "collections_blocks_materials_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "collections_blocks_dimensions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "collections_blocks_dimensions_locales" (
  	"heading" varchar,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "collections_blocks_bundle_builder" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "collections_blocks_bundle_builder_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "collections_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "collections_blocks_faq_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "collections_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "collections_blocks_faq_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "collections_blocks_reviews" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "collections_blocks_reviews_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "collections_blocks_drag_canvas_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"review_id" integer
  );
  
  CREATE TABLE "collections_blocks_drag_canvas_items_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "collections_blocks_drag_canvas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "collections_blocks_drag_canvas_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "collections_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_collections_blocks_cta_variant" DEFAULT 'blush',
  	"action" "enum_collections_blocks_cta_action" DEFAULT 'link',
  	"route" "enum_collections_blocks_cta_route",
  	"block_name" varchar
  );
  
  CREATE TABLE "collections_blocks_cta_locales" (
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "collections_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "collections_blocks_rich_text_locales" (
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "collections_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "collections_blocks_gallery_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "collections_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric NOT NULL
  );
  
  CREATE TABLE "collections_blocks_stats_items_locales" (
  	"suffix" varchar,
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "collections_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"route" "enum_collections_blocks_stats_route",
  	"block_name" varchar
  );
  
  CREATE TABLE "collections_blocks_stats_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "collections_missing_translations" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_collections_missing_translations",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "collections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_id" integer,
  	"cutout_id" integer,
  	"podium_color" "enum_collections_podium_color" DEFAULT 'blush',
  	"is_bundle" boolean DEFAULT false,
  	"bundle_discount" numeric DEFAULT 0,
  	"status" "enum_collections_status" DEFAULT 'published',
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "collections_locales" (
  	"title" varchar NOT NULL,
  	"tagline" varchar,
  	"room" varchar,
  	"story" varchar,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "collections_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "materials_missing_translations" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_materials_missing_translations",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "materials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"type" "enum_materials_type" NOT NULL,
  	"swatch_color" varchar,
  	"color_family" "enum_materials_color_family",
  	"swatch_id" integer,
  	"macro_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "materials_locales" (
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"origin" varchar,
  	"description" varchar,
  	"care" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "designers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"key" varchar,
  	"photo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "designers_locales" (
  	"role" varchar,
  	"bio" varchar,
  	"quote" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"author" varchar NOT NULL,
  	"rating" numeric DEFAULT 5 NOT NULL,
  	"approved" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "reviews_locales" (
  	"city" varchar,
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "reviews_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"title" varchar NOT NULL,
  	"variant_sku" varchar,
  	"variant_label" varchar,
  	"qty" numeric NOT NULL,
  	"unit_price" numeric NOT NULL,
  	"line_total" numeric NOT NULL,
  	"reserved" numeric DEFAULT 0,
  	"image" varchar,
  	"slug" varchar,
  	"lead_time" varchar
  );
  
  CREATE TABLE "orders_status_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"status" "enum_orders_status_history_status",
  	"at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"status" "enum_orders_status" DEFAULT 'new' NOT NULL,
  	"payment_status" "enum_orders_payment_status" DEFAULT 'pending',
  	"payment_method" "enum_orders_payment_method" DEFAULT 'manual',
  	"customer_id" integer,
  	"contact_name" varchar NOT NULL,
  	"contact_phone" varchar NOT NULL,
  	"contact_email" varchar NOT NULL,
  	"totals_subtotal" numeric DEFAULT 0,
  	"totals_bundle_discount" numeric DEFAULT 0,
  	"totals_promo_discount" numeric DEFAULT 0,
  	"totals_delivery" numeric DEFAULT 0,
  	"totals_services" numeric DEFAULT 0,
  	"totals_total" numeric DEFAULT 0,
  	"totals_currency" varchar DEFAULT 'EUR',
  	"promo_code" varchar,
  	"delivery_method" "enum_orders_delivery_method",
  	"delivery_city" varchar,
  	"delivery_postal_code" varchar,
  	"delivery_street" varchar,
  	"delivery_apartment" varchar,
  	"delivery_floor" numeric,
  	"delivery_elevator" boolean,
  	"delivery_lift" boolean,
  	"delivery_assembly" boolean,
  	"delivery_date" timestamp(3) with time zone,
  	"comment" varchar,
  	"newsletter" boolean DEFAULT false,
  	"locale" "enum_orders_locale" DEFAULT 'ru',
  	"utm" jsonb,
  	"access_token" varchar,
  	"idempotency_key" varchar,
  	"manager_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"type" "enum_inquiries_type" NOT NULL,
  	"status" "enum_inquiries_status" DEFAULT 'new',
  	"name" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"product_id" integer,
  	"data" jsonb,
  	"customer_id" integer,
  	"manager_note" varchar,
  	"locale" "enum_inquiries_locale" DEFAULT 'ru',
  	"source_page" varchar,
  	"utm" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inquiries_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"files_id" integer
  );
  
  CREATE TABLE "customers_addresses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"city" varchar NOT NULL,
  	"postal_code" varchar,
  	"street" varchar NOT NULL,
  	"apartment" varchar,
  	"floor" numeric,
  	"elevator" boolean,
  	"is_default" boolean
  );
  
  CREATE TABLE "customers_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "customers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar,
  	"locale" "enum_customers_locale" DEFAULT 'ru',
  	"newsletter" boolean DEFAULT false,
  	"pending_email" varchar,
  	"pending_email_token" varchar,
  	"pending_email_expires_at" timestamp(3) with time zone,
  	"deletion_requested_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"_verified" boolean,
  	"_verificationtoken" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "customers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "carts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_id" integer NOT NULL,
  	"items" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "promo_codes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"kind" "enum_promo_codes_kind" DEFAULT 'percent' NOT NULL,
  	"value" numeric NOT NULL,
  	"min_total" numeric,
  	"valid_from" timestamp(3) with time zone,
  	"valid_to" timestamp(3) with time zone,
  	"active" boolean DEFAULT true,
  	"usage_limit" numeric,
  	"used_count" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero_lines_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_hero_variant" DEFAULT 'home',
  	"media_id" integer,
  	"video_id" integer,
  	"cta_route" "enum_pages_blocks_hero_cta_route",
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_locales" (
  	"chip" varchar,
  	"lead" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stacked_cards_cards_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stacked_cards_cards_chips_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stacked_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"color" "enum_pages_blocks_stacked_cards_cards_color" DEFAULT 'lavender',
  	"route" "enum_pages_blocks_stacked_cards_cards_route"
  );
  
  CREATE TABLE "pages_blocks_stacked_cards_cards_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stacked_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_pages_blocks_stacked_cards_source" DEFAULT 'categories',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stacked_cards_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_pages_blocks_showcase_source" DEFAULT 'bundles',
  	"collection_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_showcase_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_product_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_pages_blocks_product_carousel_source" DEFAULT 'featured',
  	"category_id" integer,
  	"show_filters" boolean DEFAULT true,
  	"limit" numeric DEFAULT 12,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_product_carousel_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote_author" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_story_locales" (
  	"heading" varchar,
  	"text" varchar,
  	"quote" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_materials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_materials_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_dimensions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_dimensions_locales" (
  	"heading" varchar,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_bundle_builder" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_bundle_builder_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_reviews" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_reviews_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_drag_canvas_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"review_id" integer
  );
  
  CREATE TABLE "pages_blocks_drag_canvas_items_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_drag_canvas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_drag_canvas_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_cta_variant" DEFAULT 'blush',
  	"action" "enum_pages_blocks_cta_action" DEFAULT 'link',
  	"route" "enum_pages_blocks_cta_route",
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_locales" (
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text_locales" (
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stats_items_locales" (
  	"suffix" varchar,
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"route" "enum_pages_blocks_stats_route",
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_missing_translations" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_pages_missing_translations",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" "enum_pages_key" NOT NULL,
  	"hero_image_id" integer,
  	"needs_legal_review" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"content" jsonb,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tone" "enum_media_tone" DEFAULT 'sand',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_full_url" varchar,
  	"sizes_full_width" numeric,
  	"sizes_full_height" numeric,
  	"sizes_full_mime_type" varchar,
  	"sizes_full_filesize" numeric,
  	"sizes_full_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"owner_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'manager' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"categories_id" integer,
  	"collections_id" integer,
  	"pages_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"categories_id" integer,
  	"collections_id" integer,
  	"materials_id" integer,
  	"designers_id" integer,
  	"reviews_id" integer,
  	"orders_id" integer,
  	"inquiries_id" integer,
  	"customers_id" integer,
  	"carts_id" integer,
  	"promo_codes_id" integer,
  	"pages_id" integer,
  	"media_id" integer,
  	"files_id" integer,
  	"users_id" integer,
  	"redirects_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"customers_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"route" "enum_header_items_route" NOT NULL
  );
  
  CREATE TABLE "header_items_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"route" "enum_footer_columns_links_route",
  	"hash" varchar,
  	"category_id" integer
  );
  
  CREATE TABLE "footer_columns_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "footer_columns_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_blocks_hero_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_hero_lines_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_homepage_blocks_hero_variant" DEFAULT 'home',
  	"media_id" integer,
  	"video_id" integer,
  	"cta_route" "enum_homepage_blocks_hero_cta_route",
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_hero_locales" (
  	"chip" varchar,
  	"lead" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_stacked_cards_cards_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_stacked_cards_cards_chips_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_stacked_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"color" "enum_homepage_blocks_stacked_cards_cards_color" DEFAULT 'lavender',
  	"route" "enum_homepage_blocks_stacked_cards_cards_route"
  );
  
  CREATE TABLE "homepage_blocks_stacked_cards_cards_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_stacked_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_homepage_blocks_stacked_cards_source" DEFAULT 'categories',
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_stacked_cards_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_homepage_blocks_showcase_source" DEFAULT 'bundles',
  	"collection_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_showcase_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_product_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_homepage_blocks_product_carousel_source" DEFAULT 'featured',
  	"category_id" integer,
  	"show_filters" boolean DEFAULT true,
  	"limit" numeric DEFAULT 12,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_product_carousel_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote_author" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_story_locales" (
  	"heading" varchar,
  	"text" varchar,
  	"quote" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_materials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_materials_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_dimensions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_dimensions_locales" (
  	"heading" varchar,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_bundle_builder" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_bundle_builder_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_faq_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_faq_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_reviews" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_reviews_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_drag_canvas_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"review_id" integer
  );
  
  CREATE TABLE "homepage_blocks_drag_canvas_items_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_drag_canvas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_drag_canvas_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_homepage_blocks_cta_variant" DEFAULT 'blush',
  	"action" "enum_homepage_blocks_cta_action" DEFAULT 'link',
  	"route" "enum_homepage_blocks_cta_route",
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_cta_locales" (
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_rich_text_locales" (
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_gallery_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_stats_items_locales" (
  	"suffix" varchar,
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"route" "enum_homepage_blocks_stats_route",
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_stats_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_locales" (
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "homepage_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "site_settings_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_hours_locales" (
  	"days" varchar NOT NULL,
  	"time" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_delivery_zones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" "enum_site_settings_delivery_zones_code" NOT NULL,
  	"price" numeric DEFAULT 0,
  	"free_from" numeric
  );
  
  CREATE TABLE "site_settings_delivery_zones_locales" (
  	"label" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_manager_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_default_product_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_default_product_faq_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_name" varchar DEFAULT 'Oblik',
  	"phone" varchar,
  	"email" varchar,
  	"whatsapp" varchar,
  	"viber" varchar,
  	"telegram" varchar,
  	"map_lat" numeric,
  	"map_lng" numeric,
  	"map_image_id" integer,
  	"opening_hours_spec" varchar DEFAULT 'Mo-Fr 10:00-19:00, Sa 11:00-17:00',
  	"currency" varchar DEFAULT 'EUR',
  	"display_currency" varchar DEFAULT 'RSD',
  	"display_rate" numeric DEFAULT 117.2,
  	"lift_price" numeric DEFAULT 2000,
  	"lift_per_floor" numeric DEFAULT 800,
  	"assembly_price" numeric DEFAULT 4500,
  	"maintenance" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"address" varchar,
  	"response_time" varchar,
  	"maintenance_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "products_images" ADD CONSTRAINT "products_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_images" ADD CONSTRAINT "products_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_variants" ADD CONSTRAINT "products_variants_fabric_id_materials_id_fk" FOREIGN KEY ("fabric_id") REFERENCES "public"."materials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_variants" ADD CONSTRAINT "products_variants_finish_id_materials_id_fk" FOREIGN KEY ("finish_id") REFERENCES "public"."materials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_variants" ADD CONSTRAINT "products_variants_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_variants" ADD CONSTRAINT "products_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_variants_locales" ADD CONSTRAINT "products_variants_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_hero_lines" ADD CONSTRAINT "products_blocks_hero_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_hero_lines_locales" ADD CONSTRAINT "products_blocks_hero_lines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_hero_lines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_hero" ADD CONSTRAINT "products_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_hero" ADD CONSTRAINT "products_blocks_hero_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_hero" ADD CONSTRAINT "products_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_hero_locales" ADD CONSTRAINT "products_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_stacked_cards_cards_chips" ADD CONSTRAINT "products_blocks_stacked_cards_cards_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_stacked_cards_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_stacked_cards_cards_chips_locales" ADD CONSTRAINT "products_blocks_stacked_cards_cards_chips_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_stacked_cards_cards_chips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_stacked_cards_cards" ADD CONSTRAINT "products_blocks_stacked_cards_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_stacked_cards_cards" ADD CONSTRAINT "products_blocks_stacked_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_stacked_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_stacked_cards_cards_locales" ADD CONSTRAINT "products_blocks_stacked_cards_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_stacked_cards_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_stacked_cards" ADD CONSTRAINT "products_blocks_stacked_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_stacked_cards_locales" ADD CONSTRAINT "products_blocks_stacked_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_stacked_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_showcase" ADD CONSTRAINT "products_blocks_showcase_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_showcase" ADD CONSTRAINT "products_blocks_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_showcase_locales" ADD CONSTRAINT "products_blocks_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_product_carousel" ADD CONSTRAINT "products_blocks_product_carousel_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_product_carousel" ADD CONSTRAINT "products_blocks_product_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_product_carousel_locales" ADD CONSTRAINT "products_blocks_product_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_product_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_story" ADD CONSTRAINT "products_blocks_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_story_locales" ADD CONSTRAINT "products_blocks_story_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_materials" ADD CONSTRAINT "products_blocks_materials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_materials_locales" ADD CONSTRAINT "products_blocks_materials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_dimensions" ADD CONSTRAINT "products_blocks_dimensions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_dimensions_locales" ADD CONSTRAINT "products_blocks_dimensions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_dimensions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_bundle_builder" ADD CONSTRAINT "products_blocks_bundle_builder_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_bundle_builder_locales" ADD CONSTRAINT "products_blocks_bundle_builder_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_bundle_builder"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_faq_items" ADD CONSTRAINT "products_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_faq_items_locales" ADD CONSTRAINT "products_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_faq" ADD CONSTRAINT "products_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_faq_locales" ADD CONSTRAINT "products_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_reviews" ADD CONSTRAINT "products_blocks_reviews_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_reviews_locales" ADD CONSTRAINT "products_blocks_reviews_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_drag_canvas_items" ADD CONSTRAINT "products_blocks_drag_canvas_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_drag_canvas_items" ADD CONSTRAINT "products_blocks_drag_canvas_items_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_drag_canvas_items" ADD CONSTRAINT "products_blocks_drag_canvas_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_drag_canvas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_drag_canvas_items_locales" ADD CONSTRAINT "products_blocks_drag_canvas_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_drag_canvas_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_drag_canvas" ADD CONSTRAINT "products_blocks_drag_canvas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_drag_canvas_locales" ADD CONSTRAINT "products_blocks_drag_canvas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_drag_canvas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_cta" ADD CONSTRAINT "products_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_cta_locales" ADD CONSTRAINT "products_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_rich_text" ADD CONSTRAINT "products_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_rich_text_locales" ADD CONSTRAINT "products_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_gallery" ADD CONSTRAINT "products_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_gallery_locales" ADD CONSTRAINT "products_blocks_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_stats_items" ADD CONSTRAINT "products_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_stats_items_locales" ADD CONSTRAINT "products_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_stats" ADD CONSTRAINT "products_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_stats_locales" ADD CONSTRAINT "products_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_faq" ADD CONSTRAINT "products_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_faq_locales" ADD CONSTRAINT "products_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_badges" ADD CONSTRAINT "products_badges_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_colors" ADD CONSTRAINT "products_colors_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_missing_translations" ADD CONSTRAINT "products_missing_translations_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_designer_id_designers_id_fk" FOREIGN KEY ("designer_id") REFERENCES "public"."designers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_cutout_id_media_id_fk" FOREIGN KEY ("cutout_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_materials_fk" FOREIGN KEY ("materials_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_chips" ADD CONSTRAINT "categories_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_chips_locales" ADD CONSTRAINT "categories_chips_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_chips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_missing_translations" ADD CONSTRAINT "categories_missing_translations_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_hero_lines" ADD CONSTRAINT "collections_blocks_hero_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_hero_lines_locales" ADD CONSTRAINT "collections_blocks_hero_lines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_hero_lines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_hero" ADD CONSTRAINT "collections_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collections_blocks_hero" ADD CONSTRAINT "collections_blocks_hero_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collections_blocks_hero" ADD CONSTRAINT "collections_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_hero_locales" ADD CONSTRAINT "collections_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_stacked_cards_cards_chips" ADD CONSTRAINT "collections_blocks_stacked_cards_cards_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_stacked_cards_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_stacked_cards_cards_chips_locales" ADD CONSTRAINT "collections_blocks_stacked_cards_cards_chips_locales_pare_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_stacked_cards_cards_chips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_stacked_cards_cards" ADD CONSTRAINT "collections_blocks_stacked_cards_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collections_blocks_stacked_cards_cards" ADD CONSTRAINT "collections_blocks_stacked_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_stacked_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_stacked_cards_cards_locales" ADD CONSTRAINT "collections_blocks_stacked_cards_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_stacked_cards_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_stacked_cards" ADD CONSTRAINT "collections_blocks_stacked_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_stacked_cards_locales" ADD CONSTRAINT "collections_blocks_stacked_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_stacked_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_showcase" ADD CONSTRAINT "collections_blocks_showcase_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collections_blocks_showcase" ADD CONSTRAINT "collections_blocks_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_showcase_locales" ADD CONSTRAINT "collections_blocks_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_product_carousel" ADD CONSTRAINT "collections_blocks_product_carousel_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collections_blocks_product_carousel" ADD CONSTRAINT "collections_blocks_product_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_product_carousel_locales" ADD CONSTRAINT "collections_blocks_product_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_product_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_story" ADD CONSTRAINT "collections_blocks_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_story_locales" ADD CONSTRAINT "collections_blocks_story_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_materials" ADD CONSTRAINT "collections_blocks_materials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_materials_locales" ADD CONSTRAINT "collections_blocks_materials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_dimensions" ADD CONSTRAINT "collections_blocks_dimensions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_dimensions_locales" ADD CONSTRAINT "collections_blocks_dimensions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_dimensions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_bundle_builder" ADD CONSTRAINT "collections_blocks_bundle_builder_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_bundle_builder_locales" ADD CONSTRAINT "collections_blocks_bundle_builder_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_bundle_builder"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_faq_items" ADD CONSTRAINT "collections_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_faq_items_locales" ADD CONSTRAINT "collections_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_faq" ADD CONSTRAINT "collections_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_faq_locales" ADD CONSTRAINT "collections_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_reviews" ADD CONSTRAINT "collections_blocks_reviews_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_reviews_locales" ADD CONSTRAINT "collections_blocks_reviews_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_drag_canvas_items" ADD CONSTRAINT "collections_blocks_drag_canvas_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collections_blocks_drag_canvas_items" ADD CONSTRAINT "collections_blocks_drag_canvas_items_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collections_blocks_drag_canvas_items" ADD CONSTRAINT "collections_blocks_drag_canvas_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_drag_canvas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_drag_canvas_items_locales" ADD CONSTRAINT "collections_blocks_drag_canvas_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_drag_canvas_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_drag_canvas" ADD CONSTRAINT "collections_blocks_drag_canvas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_drag_canvas_locales" ADD CONSTRAINT "collections_blocks_drag_canvas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_drag_canvas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_cta" ADD CONSTRAINT "collections_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_cta_locales" ADD CONSTRAINT "collections_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_rich_text" ADD CONSTRAINT "collections_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_rich_text_locales" ADD CONSTRAINT "collections_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_gallery" ADD CONSTRAINT "collections_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_gallery_locales" ADD CONSTRAINT "collections_blocks_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_stats_items" ADD CONSTRAINT "collections_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_stats_items_locales" ADD CONSTRAINT "collections_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_stats" ADD CONSTRAINT "collections_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_blocks_stats_locales" ADD CONSTRAINT "collections_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_missing_translations" ADD CONSTRAINT "collections_missing_translations_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections" ADD CONSTRAINT "collections_hero_id_media_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collections" ADD CONSTRAINT "collections_cutout_id_media_id_fk" FOREIGN KEY ("cutout_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collections_locales" ADD CONSTRAINT "collections_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collections_locales" ADD CONSTRAINT "collections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_rels" ADD CONSTRAINT "collections_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_rels" ADD CONSTRAINT "collections_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collections_rels" ADD CONSTRAINT "collections_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "materials_missing_translations" ADD CONSTRAINT "materials_missing_translations_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "materials" ADD CONSTRAINT "materials_swatch_id_media_id_fk" FOREIGN KEY ("swatch_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "materials" ADD CONSTRAINT "materials_macro_id_media_id_fk" FOREIGN KEY ("macro_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "materials_locales" ADD CONSTRAINT "materials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "designers" ADD CONSTRAINT "designers_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "designers_locales" ADD CONSTRAINT "designers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."designers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reviews_locales" ADD CONSTRAINT "reviews_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reviews_rels" ADD CONSTRAINT "reviews_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reviews_rels" ADD CONSTRAINT "reviews_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_status_history" ADD CONSTRAINT "orders_status_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiries_rels" ADD CONSTRAINT "inquiries_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries_rels" ADD CONSTRAINT "inquiries_rels_files_fk" FOREIGN KEY ("files_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "customers_addresses" ADD CONSTRAINT "customers_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "customers_sessions" ADD CONSTRAINT "customers_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "customers_rels" ADD CONSTRAINT "customers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "customers_rels" ADD CONSTRAINT "customers_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "carts" ADD CONSTRAINT "carts_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_lines" ADD CONSTRAINT "pages_blocks_hero_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_lines_locales" ADD CONSTRAINT "pages_blocks_hero_lines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_lines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_locales" ADD CONSTRAINT "pages_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stacked_cards_cards_chips" ADD CONSTRAINT "pages_blocks_stacked_cards_cards_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stacked_cards_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stacked_cards_cards_chips_locales" ADD CONSTRAINT "pages_blocks_stacked_cards_cards_chips_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stacked_cards_cards_chips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stacked_cards_cards" ADD CONSTRAINT "pages_blocks_stacked_cards_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_stacked_cards_cards" ADD CONSTRAINT "pages_blocks_stacked_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stacked_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stacked_cards_cards_locales" ADD CONSTRAINT "pages_blocks_stacked_cards_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stacked_cards_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stacked_cards" ADD CONSTRAINT "pages_blocks_stacked_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stacked_cards_locales" ADD CONSTRAINT "pages_blocks_stacked_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stacked_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_showcase" ADD CONSTRAINT "pages_blocks_showcase_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_showcase" ADD CONSTRAINT "pages_blocks_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_showcase_locales" ADD CONSTRAINT "pages_blocks_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_carousel" ADD CONSTRAINT "pages_blocks_product_carousel_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_carousel" ADD CONSTRAINT "pages_blocks_product_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_carousel_locales" ADD CONSTRAINT "pages_blocks_product_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_product_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_story" ADD CONSTRAINT "pages_blocks_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_story_locales" ADD CONSTRAINT "pages_blocks_story_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_materials" ADD CONSTRAINT "pages_blocks_materials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_materials_locales" ADD CONSTRAINT "pages_blocks_materials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_dimensions" ADD CONSTRAINT "pages_blocks_dimensions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_dimensions_locales" ADD CONSTRAINT "pages_blocks_dimensions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_dimensions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_bundle_builder" ADD CONSTRAINT "pages_blocks_bundle_builder_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_bundle_builder_locales" ADD CONSTRAINT "pages_blocks_bundle_builder_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_bundle_builder"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items_locales" ADD CONSTRAINT "pages_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_locales" ADD CONSTRAINT "pages_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_reviews" ADD CONSTRAINT "pages_blocks_reviews_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_reviews_locales" ADD CONSTRAINT "pages_blocks_reviews_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_drag_canvas_items" ADD CONSTRAINT "pages_blocks_drag_canvas_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_drag_canvas_items" ADD CONSTRAINT "pages_blocks_drag_canvas_items_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_drag_canvas_items" ADD CONSTRAINT "pages_blocks_drag_canvas_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_drag_canvas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_drag_canvas_items_locales" ADD CONSTRAINT "pages_blocks_drag_canvas_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_drag_canvas_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_drag_canvas" ADD CONSTRAINT "pages_blocks_drag_canvas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_drag_canvas_locales" ADD CONSTRAINT "pages_blocks_drag_canvas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_drag_canvas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_locales" ADD CONSTRAINT "pages_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text_locales" ADD CONSTRAINT "pages_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_locales" ADD CONSTRAINT "pages_blocks_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_items" ADD CONSTRAINT "pages_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_items_locales" ADD CONSTRAINT "pages_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_locales" ADD CONSTRAINT "pages_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_missing_translations" ADD CONSTRAINT "pages_missing_translations_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "files" ADD CONSTRAINT "files_owner_id_customers_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_collections_fk" FOREIGN KEY ("collections_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_collections_fk" FOREIGN KEY ("collections_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_materials_fk" FOREIGN KEY ("materials_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_designers_fk" FOREIGN KEY ("designers_id") REFERENCES "public"."designers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_carts_fk" FOREIGN KEY ("carts_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_promo_codes_fk" FOREIGN KEY ("promo_codes_id") REFERENCES "public"."promo_codes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_files_fk" FOREIGN KEY ("files_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_items" ADD CONSTRAINT "header_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_items_locales" ADD CONSTRAINT "header_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links_locales" ADD CONSTRAINT "footer_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_locales" ADD CONSTRAINT "footer_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_socials" ADD CONSTRAINT "footer_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_hero_lines" ADD CONSTRAINT "homepage_blocks_hero_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_hero_lines_locales" ADD CONSTRAINT "homepage_blocks_hero_lines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_hero_lines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_hero" ADD CONSTRAINT "homepage_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_hero" ADD CONSTRAINT "homepage_blocks_hero_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_hero" ADD CONSTRAINT "homepage_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_hero_locales" ADD CONSTRAINT "homepage_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_stacked_cards_cards_chips" ADD CONSTRAINT "homepage_blocks_stacked_cards_cards_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_stacked_cards_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_stacked_cards_cards_chips_locales" ADD CONSTRAINT "homepage_blocks_stacked_cards_cards_chips_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_stacked_cards_cards_chips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_stacked_cards_cards" ADD CONSTRAINT "homepage_blocks_stacked_cards_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_stacked_cards_cards" ADD CONSTRAINT "homepage_blocks_stacked_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_stacked_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_stacked_cards_cards_locales" ADD CONSTRAINT "homepage_blocks_stacked_cards_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_stacked_cards_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_stacked_cards" ADD CONSTRAINT "homepage_blocks_stacked_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_stacked_cards_locales" ADD CONSTRAINT "homepage_blocks_stacked_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_stacked_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_showcase" ADD CONSTRAINT "homepage_blocks_showcase_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_showcase" ADD CONSTRAINT "homepage_blocks_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_showcase_locales" ADD CONSTRAINT "homepage_blocks_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_product_carousel" ADD CONSTRAINT "homepage_blocks_product_carousel_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_product_carousel" ADD CONSTRAINT "homepage_blocks_product_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_product_carousel_locales" ADD CONSTRAINT "homepage_blocks_product_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_product_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_story" ADD CONSTRAINT "homepage_blocks_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_story_locales" ADD CONSTRAINT "homepage_blocks_story_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_materials" ADD CONSTRAINT "homepage_blocks_materials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_materials_locales" ADD CONSTRAINT "homepage_blocks_materials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_dimensions" ADD CONSTRAINT "homepage_blocks_dimensions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_dimensions_locales" ADD CONSTRAINT "homepage_blocks_dimensions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_dimensions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_bundle_builder" ADD CONSTRAINT "homepage_blocks_bundle_builder_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_bundle_builder_locales" ADD CONSTRAINT "homepage_blocks_bundle_builder_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_bundle_builder"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_faq_items" ADD CONSTRAINT "homepage_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_faq_items_locales" ADD CONSTRAINT "homepage_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_faq" ADD CONSTRAINT "homepage_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_faq_locales" ADD CONSTRAINT "homepage_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_reviews" ADD CONSTRAINT "homepage_blocks_reviews_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_reviews_locales" ADD CONSTRAINT "homepage_blocks_reviews_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_drag_canvas_items" ADD CONSTRAINT "homepage_blocks_drag_canvas_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_drag_canvas_items" ADD CONSTRAINT "homepage_blocks_drag_canvas_items_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_drag_canvas_items" ADD CONSTRAINT "homepage_blocks_drag_canvas_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_drag_canvas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_drag_canvas_items_locales" ADD CONSTRAINT "homepage_blocks_drag_canvas_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_drag_canvas_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_drag_canvas" ADD CONSTRAINT "homepage_blocks_drag_canvas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_drag_canvas_locales" ADD CONSTRAINT "homepage_blocks_drag_canvas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_drag_canvas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_cta" ADD CONSTRAINT "homepage_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_cta_locales" ADD CONSTRAINT "homepage_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_rich_text" ADD CONSTRAINT "homepage_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_rich_text_locales" ADD CONSTRAINT "homepage_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_gallery" ADD CONSTRAINT "homepage_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_gallery_locales" ADD CONSTRAINT "homepage_blocks_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_stats_items" ADD CONSTRAINT "homepage_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_stats_items_locales" ADD CONSTRAINT "homepage_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_stats" ADD CONSTRAINT "homepage_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_stats_locales" ADD CONSTRAINT "homepage_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_locales" ADD CONSTRAINT "homepage_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_hours" ADD CONSTRAINT "site_settings_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_hours_locales" ADD CONSTRAINT "site_settings_hours_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_hours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_delivery_zones" ADD CONSTRAINT "site_settings_delivery_zones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_delivery_zones_locales" ADD CONSTRAINT "site_settings_delivery_zones_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_delivery_zones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_manager_emails" ADD CONSTRAINT "site_settings_manager_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_default_product_faq" ADD CONSTRAINT "site_settings_default_product_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_default_product_faq_locales" ADD CONSTRAINT "site_settings_default_product_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_default_product_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_map_image_id_media_id_fk" FOREIGN KEY ("map_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_images_order_idx" ON "products_images" USING btree ("_order");
  CREATE INDEX "products_images_parent_id_idx" ON "products_images" USING btree ("_parent_id");
  CREATE INDEX "products_images_image_idx" ON "products_images" USING btree ("image_id");
  CREATE INDEX "products_variants_order_idx" ON "products_variants" USING btree ("_order");
  CREATE INDEX "products_variants_parent_id_idx" ON "products_variants" USING btree ("_parent_id");
  CREATE INDEX "products_variants_fabric_idx" ON "products_variants" USING btree ("fabric_id");
  CREATE INDEX "products_variants_finish_idx" ON "products_variants" USING btree ("finish_id");
  CREATE INDEX "products_variants_image_idx" ON "products_variants" USING btree ("image_id");
  CREATE UNIQUE INDEX "products_variants_locales_locale_parent_id_unique" ON "products_variants_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_variants_locales_parent_id_idx" ON "products_variants_locales" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_hero_lines_order_idx" ON "products_blocks_hero_lines" USING btree ("_order");
  CREATE INDEX "products_blocks_hero_lines_parent_id_idx" ON "products_blocks_hero_lines" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_blocks_hero_lines_locales_locale_parent_id_unique" ON "products_blocks_hero_lines_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_hero_lines_locales_parent_id_idx" ON "products_blocks_hero_lines_locales" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_hero_order_idx" ON "products_blocks_hero" USING btree ("_order");
  CREATE INDEX "products_blocks_hero_parent_id_idx" ON "products_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_hero_path_idx" ON "products_blocks_hero" USING btree ("_path");
  CREATE INDEX "products_blocks_hero_media_idx" ON "products_blocks_hero" USING btree ("media_id");
  CREATE INDEX "products_blocks_hero_video_idx" ON "products_blocks_hero" USING btree ("video_id");
  CREATE UNIQUE INDEX "products_blocks_hero_locales_locale_parent_id_unique" ON "products_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_hero_locales_parent_id_idx" ON "products_blocks_hero_locales" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_stacked_cards_cards_chips_order_idx" ON "products_blocks_stacked_cards_cards_chips" USING btree ("_order");
  CREATE INDEX "products_blocks_stacked_cards_cards_chips_parent_id_idx" ON "products_blocks_stacked_cards_cards_chips" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_blocks_stacked_cards_cards_chips_locales_locale_par" ON "products_blocks_stacked_cards_cards_chips_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_stacked_cards_cards_chips_locales_parent_idx" ON "products_blocks_stacked_cards_cards_chips_locales" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_stacked_cards_cards_order_idx" ON "products_blocks_stacked_cards_cards" USING btree ("_order");
  CREATE INDEX "products_blocks_stacked_cards_cards_parent_id_idx" ON "products_blocks_stacked_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_stacked_cards_cards_image_idx" ON "products_blocks_stacked_cards_cards" USING btree ("image_id");
  CREATE UNIQUE INDEX "products_blocks_stacked_cards_cards_locales_locale_parent_id" ON "products_blocks_stacked_cards_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_stacked_cards_cards_locales_parent_id_idx" ON "products_blocks_stacked_cards_cards_locales" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_stacked_cards_order_idx" ON "products_blocks_stacked_cards" USING btree ("_order");
  CREATE INDEX "products_blocks_stacked_cards_parent_id_idx" ON "products_blocks_stacked_cards" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_stacked_cards_path_idx" ON "products_blocks_stacked_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "products_blocks_stacked_cards_locales_locale_parent_id_uniqu" ON "products_blocks_stacked_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_stacked_cards_locales_parent_id_idx" ON "products_blocks_stacked_cards_locales" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_showcase_order_idx" ON "products_blocks_showcase" USING btree ("_order");
  CREATE INDEX "products_blocks_showcase_parent_id_idx" ON "products_blocks_showcase" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_showcase_path_idx" ON "products_blocks_showcase" USING btree ("_path");
  CREATE INDEX "products_blocks_showcase_collection_idx" ON "products_blocks_showcase" USING btree ("collection_id");
  CREATE UNIQUE INDEX "products_blocks_showcase_locales_locale_parent_id_unique" ON "products_blocks_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_showcase_locales_parent_id_idx" ON "products_blocks_showcase_locales" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_product_carousel_order_idx" ON "products_blocks_product_carousel" USING btree ("_order");
  CREATE INDEX "products_blocks_product_carousel_parent_id_idx" ON "products_blocks_product_carousel" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_product_carousel_path_idx" ON "products_blocks_product_carousel" USING btree ("_path");
  CREATE INDEX "products_blocks_product_carousel_category_idx" ON "products_blocks_product_carousel" USING btree ("category_id");
  CREATE UNIQUE INDEX "products_blocks_product_carousel_locales_locale_parent_id_un" ON "products_blocks_product_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_product_carousel_locales_parent_id_idx" ON "products_blocks_product_carousel_locales" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_story_order_idx" ON "products_blocks_story" USING btree ("_order");
  CREATE INDEX "products_blocks_story_parent_id_idx" ON "products_blocks_story" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_story_path_idx" ON "products_blocks_story" USING btree ("_path");
  CREATE UNIQUE INDEX "products_blocks_story_locales_locale_parent_id_unique" ON "products_blocks_story_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_story_locales_parent_id_idx" ON "products_blocks_story_locales" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_materials_order_idx" ON "products_blocks_materials" USING btree ("_order");
  CREATE INDEX "products_blocks_materials_parent_id_idx" ON "products_blocks_materials" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_materials_path_idx" ON "products_blocks_materials" USING btree ("_path");
  CREATE UNIQUE INDEX "products_blocks_materials_locales_locale_parent_id_unique" ON "products_blocks_materials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_materials_locales_parent_id_idx" ON "products_blocks_materials_locales" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_dimensions_order_idx" ON "products_blocks_dimensions" USING btree ("_order");
  CREATE INDEX "products_blocks_dimensions_parent_id_idx" ON "products_blocks_dimensions" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_dimensions_path_idx" ON "products_blocks_dimensions" USING btree ("_path");
  CREATE UNIQUE INDEX "products_blocks_dimensions_locales_locale_parent_id_unique" ON "products_blocks_dimensions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_dimensions_locales_parent_id_idx" ON "products_blocks_dimensions_locales" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_bundle_builder_order_idx" ON "products_blocks_bundle_builder" USING btree ("_order");
  CREATE INDEX "products_blocks_bundle_builder_parent_id_idx" ON "products_blocks_bundle_builder" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_bundle_builder_path_idx" ON "products_blocks_bundle_builder" USING btree ("_path");
  CREATE UNIQUE INDEX "products_blocks_bundle_builder_locales_locale_parent_id_uniq" ON "products_blocks_bundle_builder_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_bundle_builder_locales_parent_id_idx" ON "products_blocks_bundle_builder_locales" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_faq_items_order_idx" ON "products_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "products_blocks_faq_items_parent_id_idx" ON "products_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_blocks_faq_items_locales_locale_parent_id_unique" ON "products_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_faq_items_locales_parent_id_idx" ON "products_blocks_faq_items_locales" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_faq_order_idx" ON "products_blocks_faq" USING btree ("_order");
  CREATE INDEX "products_blocks_faq_parent_id_idx" ON "products_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_faq_path_idx" ON "products_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "products_blocks_faq_locales_locale_parent_id_unique" ON "products_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_faq_locales_parent_id_idx" ON "products_blocks_faq_locales" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_reviews_order_idx" ON "products_blocks_reviews" USING btree ("_order");
  CREATE INDEX "products_blocks_reviews_parent_id_idx" ON "products_blocks_reviews" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_reviews_path_idx" ON "products_blocks_reviews" USING btree ("_path");
  CREATE UNIQUE INDEX "products_blocks_reviews_locales_locale_parent_id_unique" ON "products_blocks_reviews_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_reviews_locales_parent_id_idx" ON "products_blocks_reviews_locales" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_drag_canvas_items_order_idx" ON "products_blocks_drag_canvas_items" USING btree ("_order");
  CREATE INDEX "products_blocks_drag_canvas_items_parent_id_idx" ON "products_blocks_drag_canvas_items" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_drag_canvas_items_image_idx" ON "products_blocks_drag_canvas_items" USING btree ("image_id");
  CREATE INDEX "products_blocks_drag_canvas_items_review_idx" ON "products_blocks_drag_canvas_items" USING btree ("review_id");
  CREATE UNIQUE INDEX "products_blocks_drag_canvas_items_locales_locale_parent_id_u" ON "products_blocks_drag_canvas_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_drag_canvas_items_locales_parent_id_idx" ON "products_blocks_drag_canvas_items_locales" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_drag_canvas_order_idx" ON "products_blocks_drag_canvas" USING btree ("_order");
  CREATE INDEX "products_blocks_drag_canvas_parent_id_idx" ON "products_blocks_drag_canvas" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_drag_canvas_path_idx" ON "products_blocks_drag_canvas" USING btree ("_path");
  CREATE UNIQUE INDEX "products_blocks_drag_canvas_locales_locale_parent_id_unique" ON "products_blocks_drag_canvas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_drag_canvas_locales_parent_id_idx" ON "products_blocks_drag_canvas_locales" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_cta_order_idx" ON "products_blocks_cta" USING btree ("_order");
  CREATE INDEX "products_blocks_cta_parent_id_idx" ON "products_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_cta_path_idx" ON "products_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "products_blocks_cta_locales_locale_parent_id_unique" ON "products_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_cta_locales_parent_id_idx" ON "products_blocks_cta_locales" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_rich_text_order_idx" ON "products_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "products_blocks_rich_text_parent_id_idx" ON "products_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_rich_text_path_idx" ON "products_blocks_rich_text" USING btree ("_path");
  CREATE UNIQUE INDEX "products_blocks_rich_text_locales_locale_parent_id_unique" ON "products_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_rich_text_locales_parent_id_idx" ON "products_blocks_rich_text_locales" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_gallery_order_idx" ON "products_blocks_gallery" USING btree ("_order");
  CREATE INDEX "products_blocks_gallery_parent_id_idx" ON "products_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_gallery_path_idx" ON "products_blocks_gallery" USING btree ("_path");
  CREATE UNIQUE INDEX "products_blocks_gallery_locales_locale_parent_id_unique" ON "products_blocks_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_gallery_locales_parent_id_idx" ON "products_blocks_gallery_locales" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_stats_items_order_idx" ON "products_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "products_blocks_stats_items_parent_id_idx" ON "products_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_blocks_stats_items_locales_locale_parent_id_unique" ON "products_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_stats_items_locales_parent_id_idx" ON "products_blocks_stats_items_locales" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_stats_order_idx" ON "products_blocks_stats" USING btree ("_order");
  CREATE INDEX "products_blocks_stats_parent_id_idx" ON "products_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_stats_path_idx" ON "products_blocks_stats" USING btree ("_path");
  CREATE UNIQUE INDEX "products_blocks_stats_locales_locale_parent_id_unique" ON "products_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_stats_locales_parent_id_idx" ON "products_blocks_stats_locales" USING btree ("_parent_id");
  CREATE INDEX "products_faq_order_idx" ON "products_faq" USING btree ("_order");
  CREATE INDEX "products_faq_parent_id_idx" ON "products_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_faq_locales_locale_parent_id_unique" ON "products_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_faq_locales_parent_id_idx" ON "products_faq_locales" USING btree ("_parent_id");
  CREATE INDEX "products_badges_order_idx" ON "products_badges" USING btree ("order");
  CREATE INDEX "products_badges_parent_idx" ON "products_badges" USING btree ("parent_id");
  CREATE INDEX "products_colors_order_idx" ON "products_colors" USING btree ("order");
  CREATE INDEX "products_colors_parent_idx" ON "products_colors" USING btree ("parent_id");
  CREATE INDEX "products_missing_translations_order_idx" ON "products_missing_translations" USING btree ("order");
  CREATE INDEX "products_missing_translations_parent_idx" ON "products_missing_translations" USING btree ("parent_id");
  CREATE UNIQUE INDEX "products_sku_idx" ON "products" USING btree ("sku");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE INDEX "products_collection_idx" ON "products" USING btree ("collection_id");
  CREATE INDEX "products_designer_idx" ON "products" USING btree ("designer_id");
  CREATE INDEX "products_cutout_idx" ON "products" USING btree ("cutout_id");
  CREATE INDEX "products_status_idx" ON "products" USING btree ("status");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products_slug_idx" ON "products_locales" USING btree ("slug","_locale");
  CREATE INDEX "products_meta_meta_image_idx" ON "products_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_locales_parent_id_idx" ON "products_locales" USING btree ("_parent_id");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_materials_id_idx" ON "products_rels" USING btree ("materials_id");
  CREATE INDEX "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");
  CREATE INDEX "categories_chips_order_idx" ON "categories_chips" USING btree ("_order");
  CREATE INDEX "categories_chips_parent_id_idx" ON "categories_chips" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "categories_chips_locales_locale_parent_id_unique" ON "categories_chips_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_chips_locales_parent_id_idx" ON "categories_chips_locales" USING btree ("_parent_id");
  CREATE INDEX "categories_missing_translations_order_idx" ON "categories_missing_translations" USING btree ("order");
  CREATE INDEX "categories_missing_translations_parent_idx" ON "categories_missing_translations" USING btree ("parent_id");
  CREATE INDEX "categories_image_idx" ON "categories" USING btree ("image_id");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "categories_slug_idx" ON "categories_locales" USING btree ("slug","_locale");
  CREATE INDEX "categories_meta_meta_image_idx" ON "categories_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_locales_parent_id_idx" ON "categories_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_hero_lines_order_idx" ON "collections_blocks_hero_lines" USING btree ("_order");
  CREATE INDEX "collections_blocks_hero_lines_parent_id_idx" ON "collections_blocks_hero_lines" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "collections_blocks_hero_lines_locales_locale_parent_id_uniqu" ON "collections_blocks_hero_lines_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_blocks_hero_lines_locales_parent_id_idx" ON "collections_blocks_hero_lines_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_hero_order_idx" ON "collections_blocks_hero" USING btree ("_order");
  CREATE INDEX "collections_blocks_hero_parent_id_idx" ON "collections_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_hero_path_idx" ON "collections_blocks_hero" USING btree ("_path");
  CREATE INDEX "collections_blocks_hero_media_idx" ON "collections_blocks_hero" USING btree ("media_id");
  CREATE INDEX "collections_blocks_hero_video_idx" ON "collections_blocks_hero" USING btree ("video_id");
  CREATE UNIQUE INDEX "collections_blocks_hero_locales_locale_parent_id_unique" ON "collections_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_blocks_hero_locales_parent_id_idx" ON "collections_blocks_hero_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_stacked_cards_cards_chips_order_idx" ON "collections_blocks_stacked_cards_cards_chips" USING btree ("_order");
  CREATE INDEX "collections_blocks_stacked_cards_cards_chips_parent_id_idx" ON "collections_blocks_stacked_cards_cards_chips" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "collections_blocks_stacked_cards_cards_chips_locales_locale_" ON "collections_blocks_stacked_cards_cards_chips_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_blocks_stacked_cards_cards_chips_locales_par_idx" ON "collections_blocks_stacked_cards_cards_chips_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_stacked_cards_cards_order_idx" ON "collections_blocks_stacked_cards_cards" USING btree ("_order");
  CREATE INDEX "collections_blocks_stacked_cards_cards_parent_id_idx" ON "collections_blocks_stacked_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_stacked_cards_cards_image_idx" ON "collections_blocks_stacked_cards_cards" USING btree ("image_id");
  CREATE UNIQUE INDEX "collections_blocks_stacked_cards_cards_locales_locale_parent" ON "collections_blocks_stacked_cards_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_blocks_stacked_cards_cards_locales_parent_id_idx" ON "collections_blocks_stacked_cards_cards_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_stacked_cards_order_idx" ON "collections_blocks_stacked_cards" USING btree ("_order");
  CREATE INDEX "collections_blocks_stacked_cards_parent_id_idx" ON "collections_blocks_stacked_cards" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_stacked_cards_path_idx" ON "collections_blocks_stacked_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "collections_blocks_stacked_cards_locales_locale_parent_id_un" ON "collections_blocks_stacked_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_blocks_stacked_cards_locales_parent_id_idx" ON "collections_blocks_stacked_cards_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_showcase_order_idx" ON "collections_blocks_showcase" USING btree ("_order");
  CREATE INDEX "collections_blocks_showcase_parent_id_idx" ON "collections_blocks_showcase" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_showcase_path_idx" ON "collections_blocks_showcase" USING btree ("_path");
  CREATE INDEX "collections_blocks_showcase_collection_idx" ON "collections_blocks_showcase" USING btree ("collection_id");
  CREATE UNIQUE INDEX "collections_blocks_showcase_locales_locale_parent_id_unique" ON "collections_blocks_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_blocks_showcase_locales_parent_id_idx" ON "collections_blocks_showcase_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_product_carousel_order_idx" ON "collections_blocks_product_carousel" USING btree ("_order");
  CREATE INDEX "collections_blocks_product_carousel_parent_id_idx" ON "collections_blocks_product_carousel" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_product_carousel_path_idx" ON "collections_blocks_product_carousel" USING btree ("_path");
  CREATE INDEX "collections_blocks_product_carousel_category_idx" ON "collections_blocks_product_carousel" USING btree ("category_id");
  CREATE UNIQUE INDEX "collections_blocks_product_carousel_locales_locale_parent_id" ON "collections_blocks_product_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_blocks_product_carousel_locales_parent_id_idx" ON "collections_blocks_product_carousel_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_story_order_idx" ON "collections_blocks_story" USING btree ("_order");
  CREATE INDEX "collections_blocks_story_parent_id_idx" ON "collections_blocks_story" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_story_path_idx" ON "collections_blocks_story" USING btree ("_path");
  CREATE UNIQUE INDEX "collections_blocks_story_locales_locale_parent_id_unique" ON "collections_blocks_story_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_blocks_story_locales_parent_id_idx" ON "collections_blocks_story_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_materials_order_idx" ON "collections_blocks_materials" USING btree ("_order");
  CREATE INDEX "collections_blocks_materials_parent_id_idx" ON "collections_blocks_materials" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_materials_path_idx" ON "collections_blocks_materials" USING btree ("_path");
  CREATE UNIQUE INDEX "collections_blocks_materials_locales_locale_parent_id_unique" ON "collections_blocks_materials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_blocks_materials_locales_parent_id_idx" ON "collections_blocks_materials_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_dimensions_order_idx" ON "collections_blocks_dimensions" USING btree ("_order");
  CREATE INDEX "collections_blocks_dimensions_parent_id_idx" ON "collections_blocks_dimensions" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_dimensions_path_idx" ON "collections_blocks_dimensions" USING btree ("_path");
  CREATE UNIQUE INDEX "collections_blocks_dimensions_locales_locale_parent_id_uniqu" ON "collections_blocks_dimensions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_blocks_dimensions_locales_parent_id_idx" ON "collections_blocks_dimensions_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_bundle_builder_order_idx" ON "collections_blocks_bundle_builder" USING btree ("_order");
  CREATE INDEX "collections_blocks_bundle_builder_parent_id_idx" ON "collections_blocks_bundle_builder" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_bundle_builder_path_idx" ON "collections_blocks_bundle_builder" USING btree ("_path");
  CREATE UNIQUE INDEX "collections_blocks_bundle_builder_locales_locale_parent_id_u" ON "collections_blocks_bundle_builder_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_blocks_bundle_builder_locales_parent_id_idx" ON "collections_blocks_bundle_builder_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_faq_items_order_idx" ON "collections_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "collections_blocks_faq_items_parent_id_idx" ON "collections_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "collections_blocks_faq_items_locales_locale_parent_id_unique" ON "collections_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_blocks_faq_items_locales_parent_id_idx" ON "collections_blocks_faq_items_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_faq_order_idx" ON "collections_blocks_faq" USING btree ("_order");
  CREATE INDEX "collections_blocks_faq_parent_id_idx" ON "collections_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_faq_path_idx" ON "collections_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "collections_blocks_faq_locales_locale_parent_id_unique" ON "collections_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_blocks_faq_locales_parent_id_idx" ON "collections_blocks_faq_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_reviews_order_idx" ON "collections_blocks_reviews" USING btree ("_order");
  CREATE INDEX "collections_blocks_reviews_parent_id_idx" ON "collections_blocks_reviews" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_reviews_path_idx" ON "collections_blocks_reviews" USING btree ("_path");
  CREATE UNIQUE INDEX "collections_blocks_reviews_locales_locale_parent_id_unique" ON "collections_blocks_reviews_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_blocks_reviews_locales_parent_id_idx" ON "collections_blocks_reviews_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_drag_canvas_items_order_idx" ON "collections_blocks_drag_canvas_items" USING btree ("_order");
  CREATE INDEX "collections_blocks_drag_canvas_items_parent_id_idx" ON "collections_blocks_drag_canvas_items" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_drag_canvas_items_image_idx" ON "collections_blocks_drag_canvas_items" USING btree ("image_id");
  CREATE INDEX "collections_blocks_drag_canvas_items_review_idx" ON "collections_blocks_drag_canvas_items" USING btree ("review_id");
  CREATE UNIQUE INDEX "collections_blocks_drag_canvas_items_locales_locale_parent_i" ON "collections_blocks_drag_canvas_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_blocks_drag_canvas_items_locales_parent_id_idx" ON "collections_blocks_drag_canvas_items_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_drag_canvas_order_idx" ON "collections_blocks_drag_canvas" USING btree ("_order");
  CREATE INDEX "collections_blocks_drag_canvas_parent_id_idx" ON "collections_blocks_drag_canvas" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_drag_canvas_path_idx" ON "collections_blocks_drag_canvas" USING btree ("_path");
  CREATE UNIQUE INDEX "collections_blocks_drag_canvas_locales_locale_parent_id_uniq" ON "collections_blocks_drag_canvas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_blocks_drag_canvas_locales_parent_id_idx" ON "collections_blocks_drag_canvas_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_cta_order_idx" ON "collections_blocks_cta" USING btree ("_order");
  CREATE INDEX "collections_blocks_cta_parent_id_idx" ON "collections_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_cta_path_idx" ON "collections_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "collections_blocks_cta_locales_locale_parent_id_unique" ON "collections_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_blocks_cta_locales_parent_id_idx" ON "collections_blocks_cta_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_rich_text_order_idx" ON "collections_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "collections_blocks_rich_text_parent_id_idx" ON "collections_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_rich_text_path_idx" ON "collections_blocks_rich_text" USING btree ("_path");
  CREATE UNIQUE INDEX "collections_blocks_rich_text_locales_locale_parent_id_unique" ON "collections_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_blocks_rich_text_locales_parent_id_idx" ON "collections_blocks_rich_text_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_gallery_order_idx" ON "collections_blocks_gallery" USING btree ("_order");
  CREATE INDEX "collections_blocks_gallery_parent_id_idx" ON "collections_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_gallery_path_idx" ON "collections_blocks_gallery" USING btree ("_path");
  CREATE UNIQUE INDEX "collections_blocks_gallery_locales_locale_parent_id_unique" ON "collections_blocks_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_blocks_gallery_locales_parent_id_idx" ON "collections_blocks_gallery_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_stats_items_order_idx" ON "collections_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "collections_blocks_stats_items_parent_id_idx" ON "collections_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "collections_blocks_stats_items_locales_locale_parent_id_uniq" ON "collections_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_blocks_stats_items_locales_parent_id_idx" ON "collections_blocks_stats_items_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_stats_order_idx" ON "collections_blocks_stats" USING btree ("_order");
  CREATE INDEX "collections_blocks_stats_parent_id_idx" ON "collections_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "collections_blocks_stats_path_idx" ON "collections_blocks_stats" USING btree ("_path");
  CREATE UNIQUE INDEX "collections_blocks_stats_locales_locale_parent_id_unique" ON "collections_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_blocks_stats_locales_parent_id_idx" ON "collections_blocks_stats_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_missing_translations_order_idx" ON "collections_missing_translations" USING btree ("order");
  CREATE INDEX "collections_missing_translations_parent_idx" ON "collections_missing_translations" USING btree ("parent_id");
  CREATE INDEX "collections_hero_idx" ON "collections" USING btree ("hero_id");
  CREATE INDEX "collections_cutout_idx" ON "collections" USING btree ("cutout_id");
  CREATE INDEX "collections_status_idx" ON "collections" USING btree ("status");
  CREATE INDEX "collections_updated_at_idx" ON "collections" USING btree ("updated_at");
  CREATE INDEX "collections_created_at_idx" ON "collections" USING btree ("created_at");
  CREATE INDEX "collections_slug_idx" ON "collections_locales" USING btree ("slug","_locale");
  CREATE INDEX "collections_meta_meta_image_idx" ON "collections_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "collections_locales_locale_parent_id_unique" ON "collections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collections_locales_parent_id_idx" ON "collections_locales" USING btree ("_parent_id");
  CREATE INDEX "collections_rels_order_idx" ON "collections_rels" USING btree ("order");
  CREATE INDEX "collections_rels_parent_idx" ON "collections_rels" USING btree ("parent_id");
  CREATE INDEX "collections_rels_path_idx" ON "collections_rels" USING btree ("path");
  CREATE INDEX "collections_rels_products_id_idx" ON "collections_rels" USING btree ("products_id");
  CREATE INDEX "collections_rels_media_id_idx" ON "collections_rels" USING btree ("media_id");
  CREATE INDEX "materials_missing_translations_order_idx" ON "materials_missing_translations" USING btree ("order");
  CREATE INDEX "materials_missing_translations_parent_idx" ON "materials_missing_translations" USING btree ("parent_id");
  CREATE UNIQUE INDEX "materials_key_idx" ON "materials" USING btree ("key");
  CREATE INDEX "materials_swatch_idx" ON "materials" USING btree ("swatch_id");
  CREATE INDEX "materials_macro_idx" ON "materials" USING btree ("macro_id");
  CREATE INDEX "materials_updated_at_idx" ON "materials" USING btree ("updated_at");
  CREATE INDEX "materials_created_at_idx" ON "materials" USING btree ("created_at");
  CREATE INDEX "materials_slug_idx" ON "materials_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "materials_locales_locale_parent_id_unique" ON "materials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "materials_locales_parent_id_idx" ON "materials_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "designers_key_idx" ON "designers" USING btree ("key");
  CREATE INDEX "designers_photo_idx" ON "designers" USING btree ("photo_id");
  CREATE INDEX "designers_updated_at_idx" ON "designers" USING btree ("updated_at");
  CREATE INDEX "designers_created_at_idx" ON "designers" USING btree ("created_at");
  CREATE UNIQUE INDEX "designers_locales_locale_parent_id_unique" ON "designers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "designers_locales_parent_id_idx" ON "designers_locales" USING btree ("_parent_id");
  CREATE INDEX "reviews_product_idx" ON "reviews" USING btree ("product_id");
  CREATE INDEX "reviews_updated_at_idx" ON "reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
  CREATE UNIQUE INDEX "reviews_locales_locale_parent_id_unique" ON "reviews_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "reviews_locales_parent_id_idx" ON "reviews_locales" USING btree ("_parent_id");
  CREATE INDEX "reviews_rels_order_idx" ON "reviews_rels" USING btree ("order");
  CREATE INDEX "reviews_rels_parent_idx" ON "reviews_rels" USING btree ("parent_id");
  CREATE INDEX "reviews_rels_path_idx" ON "reviews_rels" USING btree ("path");
  CREATE INDEX "reviews_rels_media_id_idx" ON "reviews_rels" USING btree ("media_id");
  CREATE INDEX "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE INDEX "orders_items_product_idx" ON "orders_items" USING btree ("product_id");
  CREATE INDEX "orders_status_history_order_idx" ON "orders_status_history" USING btree ("_order");
  CREATE INDEX "orders_status_history_parent_id_idx" ON "orders_status_history" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "orders_number_idx" ON "orders" USING btree ("number");
  CREATE INDEX "orders_customer_idx" ON "orders" USING btree ("customer_id");
  CREATE INDEX "orders_access_token_idx" ON "orders" USING btree ("access_token");
  CREATE UNIQUE INDEX "orders_idempotency_key_idx" ON "orders" USING btree ("idempotency_key");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE UNIQUE INDEX "inquiries_number_idx" ON "inquiries" USING btree ("number");
  CREATE INDEX "inquiries_product_idx" ON "inquiries" USING btree ("product_id");
  CREATE INDEX "inquiries_customer_idx" ON "inquiries" USING btree ("customer_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "inquiries_rels_order_idx" ON "inquiries_rels" USING btree ("order");
  CREATE INDEX "inquiries_rels_parent_idx" ON "inquiries_rels" USING btree ("parent_id");
  CREATE INDEX "inquiries_rels_path_idx" ON "inquiries_rels" USING btree ("path");
  CREATE INDEX "inquiries_rels_files_id_idx" ON "inquiries_rels" USING btree ("files_id");
  CREATE INDEX "customers_addresses_order_idx" ON "customers_addresses" USING btree ("_order");
  CREATE INDEX "customers_addresses_parent_id_idx" ON "customers_addresses" USING btree ("_parent_id");
  CREATE INDEX "customers_sessions_order_idx" ON "customers_sessions" USING btree ("_order");
  CREATE INDEX "customers_sessions_parent_id_idx" ON "customers_sessions" USING btree ("_parent_id");
  CREATE INDEX "customers_updated_at_idx" ON "customers" USING btree ("updated_at");
  CREATE INDEX "customers_created_at_idx" ON "customers" USING btree ("created_at");
  CREATE UNIQUE INDEX "customers_email_idx" ON "customers" USING btree ("email");
  CREATE INDEX "customers_rels_order_idx" ON "customers_rels" USING btree ("order");
  CREATE INDEX "customers_rels_parent_idx" ON "customers_rels" USING btree ("parent_id");
  CREATE INDEX "customers_rels_path_idx" ON "customers_rels" USING btree ("path");
  CREATE INDEX "customers_rels_products_id_idx" ON "customers_rels" USING btree ("products_id");
  CREATE UNIQUE INDEX "carts_customer_idx" ON "carts" USING btree ("customer_id");
  CREATE INDEX "carts_updated_at_idx" ON "carts" USING btree ("updated_at");
  CREATE INDEX "carts_created_at_idx" ON "carts" USING btree ("created_at");
  CREATE UNIQUE INDEX "promo_codes_code_idx" ON "promo_codes" USING btree ("code");
  CREATE INDEX "promo_codes_updated_at_idx" ON "promo_codes" USING btree ("updated_at");
  CREATE INDEX "promo_codes_created_at_idx" ON "promo_codes" USING btree ("created_at");
  CREATE INDEX "pages_blocks_hero_lines_order_idx" ON "pages_blocks_hero_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_lines_parent_id_idx" ON "pages_blocks_hero_lines" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_hero_lines_locales_locale_parent_id_unique" ON "pages_blocks_hero_lines_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_hero_lines_locales_parent_id_idx" ON "pages_blocks_hero_lines_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_media_idx" ON "pages_blocks_hero" USING btree ("media_id");
  CREATE INDEX "pages_blocks_hero_video_idx" ON "pages_blocks_hero" USING btree ("video_id");
  CREATE UNIQUE INDEX "pages_blocks_hero_locales_locale_parent_id_unique" ON "pages_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_hero_locales_parent_id_idx" ON "pages_blocks_hero_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stacked_cards_cards_chips_order_idx" ON "pages_blocks_stacked_cards_cards_chips" USING btree ("_order");
  CREATE INDEX "pages_blocks_stacked_cards_cards_chips_parent_id_idx" ON "pages_blocks_stacked_cards_cards_chips" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_stacked_cards_cards_chips_locales_locale_parent" ON "pages_blocks_stacked_cards_cards_chips_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_stacked_cards_cards_chips_locales_parent_id_idx" ON "pages_blocks_stacked_cards_cards_chips_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stacked_cards_cards_order_idx" ON "pages_blocks_stacked_cards_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_stacked_cards_cards_parent_id_idx" ON "pages_blocks_stacked_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stacked_cards_cards_image_idx" ON "pages_blocks_stacked_cards_cards" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_stacked_cards_cards_locales_locale_parent_id_un" ON "pages_blocks_stacked_cards_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_stacked_cards_cards_locales_parent_id_idx" ON "pages_blocks_stacked_cards_cards_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stacked_cards_order_idx" ON "pages_blocks_stacked_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_stacked_cards_parent_id_idx" ON "pages_blocks_stacked_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stacked_cards_path_idx" ON "pages_blocks_stacked_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_stacked_cards_locales_locale_parent_id_unique" ON "pages_blocks_stacked_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_stacked_cards_locales_parent_id_idx" ON "pages_blocks_stacked_cards_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_showcase_order_idx" ON "pages_blocks_showcase" USING btree ("_order");
  CREATE INDEX "pages_blocks_showcase_parent_id_idx" ON "pages_blocks_showcase" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_showcase_path_idx" ON "pages_blocks_showcase" USING btree ("_path");
  CREATE INDEX "pages_blocks_showcase_collection_idx" ON "pages_blocks_showcase" USING btree ("collection_id");
  CREATE UNIQUE INDEX "pages_blocks_showcase_locales_locale_parent_id_unique" ON "pages_blocks_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_showcase_locales_parent_id_idx" ON "pages_blocks_showcase_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_carousel_order_idx" ON "pages_blocks_product_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_carousel_parent_id_idx" ON "pages_blocks_product_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_carousel_path_idx" ON "pages_blocks_product_carousel" USING btree ("_path");
  CREATE INDEX "pages_blocks_product_carousel_category_idx" ON "pages_blocks_product_carousel" USING btree ("category_id");
  CREATE UNIQUE INDEX "pages_blocks_product_carousel_locales_locale_parent_id_uniqu" ON "pages_blocks_product_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_product_carousel_locales_parent_id_idx" ON "pages_blocks_product_carousel_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_story_order_idx" ON "pages_blocks_story" USING btree ("_order");
  CREATE INDEX "pages_blocks_story_parent_id_idx" ON "pages_blocks_story" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_story_path_idx" ON "pages_blocks_story" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_story_locales_locale_parent_id_unique" ON "pages_blocks_story_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_story_locales_parent_id_idx" ON "pages_blocks_story_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_materials_order_idx" ON "pages_blocks_materials" USING btree ("_order");
  CREATE INDEX "pages_blocks_materials_parent_id_idx" ON "pages_blocks_materials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_materials_path_idx" ON "pages_blocks_materials" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_materials_locales_locale_parent_id_unique" ON "pages_blocks_materials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_materials_locales_parent_id_idx" ON "pages_blocks_materials_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_dimensions_order_idx" ON "pages_blocks_dimensions" USING btree ("_order");
  CREATE INDEX "pages_blocks_dimensions_parent_id_idx" ON "pages_blocks_dimensions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_dimensions_path_idx" ON "pages_blocks_dimensions" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_dimensions_locales_locale_parent_id_unique" ON "pages_blocks_dimensions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_dimensions_locales_parent_id_idx" ON "pages_blocks_dimensions_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_bundle_builder_order_idx" ON "pages_blocks_bundle_builder" USING btree ("_order");
  CREATE INDEX "pages_blocks_bundle_builder_parent_id_idx" ON "pages_blocks_bundle_builder" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_bundle_builder_path_idx" ON "pages_blocks_bundle_builder" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_bundle_builder_locales_locale_parent_id_unique" ON "pages_blocks_bundle_builder_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_bundle_builder_locales_parent_id_idx" ON "pages_blocks_bundle_builder_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_faq_items_locales_locale_parent_id_unique" ON "pages_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_faq_items_locales_parent_id_idx" ON "pages_blocks_faq_items_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_faq_locales_locale_parent_id_unique" ON "pages_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_faq_locales_parent_id_idx" ON "pages_blocks_faq_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_reviews_order_idx" ON "pages_blocks_reviews" USING btree ("_order");
  CREATE INDEX "pages_blocks_reviews_parent_id_idx" ON "pages_blocks_reviews" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_reviews_path_idx" ON "pages_blocks_reviews" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_reviews_locales_locale_parent_id_unique" ON "pages_blocks_reviews_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_reviews_locales_parent_id_idx" ON "pages_blocks_reviews_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_drag_canvas_items_order_idx" ON "pages_blocks_drag_canvas_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_drag_canvas_items_parent_id_idx" ON "pages_blocks_drag_canvas_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_drag_canvas_items_image_idx" ON "pages_blocks_drag_canvas_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_drag_canvas_items_review_idx" ON "pages_blocks_drag_canvas_items" USING btree ("review_id");
  CREATE UNIQUE INDEX "pages_blocks_drag_canvas_items_locales_locale_parent_id_uniq" ON "pages_blocks_drag_canvas_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_drag_canvas_items_locales_parent_id_idx" ON "pages_blocks_drag_canvas_items_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_drag_canvas_order_idx" ON "pages_blocks_drag_canvas" USING btree ("_order");
  CREATE INDEX "pages_blocks_drag_canvas_parent_id_idx" ON "pages_blocks_drag_canvas" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_drag_canvas_path_idx" ON "pages_blocks_drag_canvas" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_drag_canvas_locales_locale_parent_id_unique" ON "pages_blocks_drag_canvas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_drag_canvas_locales_parent_id_idx" ON "pages_blocks_drag_canvas_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_cta_locales_locale_parent_id_unique" ON "pages_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_locales_parent_id_idx" ON "pages_blocks_cta_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_rich_text_locales_locale_parent_id_unique" ON "pages_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_rich_text_locales_parent_id_idx" ON "pages_blocks_rich_text_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_gallery_locales_locale_parent_id_unique" ON "pages_blocks_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_gallery_locales_parent_id_idx" ON "pages_blocks_gallery_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_items_order_idx" ON "pages_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_items_parent_id_idx" ON "pages_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_stats_items_locales_locale_parent_id_unique" ON "pages_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_stats_items_locales_parent_id_idx" ON "pages_blocks_stats_items_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_stats_locales_locale_parent_id_unique" ON "pages_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_stats_locales_parent_id_idx" ON "pages_blocks_stats_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_missing_translations_order_idx" ON "pages_missing_translations" USING btree ("order");
  CREATE INDEX "pages_missing_translations_parent_idx" ON "pages_missing_translations" USING btree ("parent_id");
  CREATE UNIQUE INDEX "pages_key_idx" ON "pages" USING btree ("key");
  CREATE INDEX "pages_hero_image_idx" ON "pages" USING btree ("hero_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages_slug_idx" ON "pages_locales" USING btree ("slug","_locale");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_locales_parent_id_idx" ON "pages_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_media_id_idx" ON "pages_rels" USING btree ("media_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_full_sizes_full_filename_idx" ON "media" USING btree ("sizes_full_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE INDEX "files_owner_idx" ON "files" USING btree ("owner_id");
  CREATE INDEX "files_updated_at_idx" ON "files" USING btree ("updated_at");
  CREATE INDEX "files_created_at_idx" ON "files" USING btree ("created_at");
  CREATE UNIQUE INDEX "files_filename_idx" ON "files" USING btree ("filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_products_id_idx" ON "redirects_rels" USING btree ("products_id");
  CREATE INDEX "redirects_rels_categories_id_idx" ON "redirects_rels" USING btree ("categories_id");
  CREATE INDEX "redirects_rels_collections_id_idx" ON "redirects_rels" USING btree ("collections_id");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_collections_id_idx" ON "payload_locked_documents_rels" USING btree ("collections_id");
  CREATE INDEX "payload_locked_documents_rels_materials_id_idx" ON "payload_locked_documents_rels" USING btree ("materials_id");
  CREATE INDEX "payload_locked_documents_rels_designers_id_idx" ON "payload_locked_documents_rels" USING btree ("designers_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_customers_id_idx" ON "payload_locked_documents_rels" USING btree ("customers_id");
  CREATE INDEX "payload_locked_documents_rels_carts_id_idx" ON "payload_locked_documents_rels" USING btree ("carts_id");
  CREATE INDEX "payload_locked_documents_rels_promo_codes_id_idx" ON "payload_locked_documents_rels" USING btree ("promo_codes_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_files_id_idx" ON "payload_locked_documents_rels" USING btree ("files_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_customers_id_idx" ON "payload_preferences_rels" USING btree ("customers_id");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "header_items_order_idx" ON "header_items" USING btree ("_order");
  CREATE INDEX "header_items_parent_id_idx" ON "header_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_items_locales_locale_parent_id_unique" ON "header_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_items_locales_parent_id_idx" ON "header_items_locales" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_links_category_idx" ON "footer_columns_links" USING btree ("category_id");
  CREATE UNIQUE INDEX "footer_columns_links_locales_locale_parent_id_unique" ON "footer_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_links_locales_parent_id_idx" ON "footer_columns_links_locales" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_locales_locale_parent_id_unique" ON "footer_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_locales_parent_id_idx" ON "footer_columns_locales" USING btree ("_parent_id");
  CREATE INDEX "footer_socials_order_idx" ON "footer_socials" USING btree ("_order");
  CREATE INDEX "footer_socials_parent_id_idx" ON "footer_socials" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_hero_lines_order_idx" ON "homepage_blocks_hero_lines" USING btree ("_order");
  CREATE INDEX "homepage_blocks_hero_lines_parent_id_idx" ON "homepage_blocks_hero_lines" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_blocks_hero_lines_locales_locale_parent_id_unique" ON "homepage_blocks_hero_lines_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_hero_lines_locales_parent_id_idx" ON "homepage_blocks_hero_lines_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_hero_order_idx" ON "homepage_blocks_hero" USING btree ("_order");
  CREATE INDEX "homepage_blocks_hero_parent_id_idx" ON "homepage_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_hero_path_idx" ON "homepage_blocks_hero" USING btree ("_path");
  CREATE INDEX "homepage_blocks_hero_media_idx" ON "homepage_blocks_hero" USING btree ("media_id");
  CREATE INDEX "homepage_blocks_hero_video_idx" ON "homepage_blocks_hero" USING btree ("video_id");
  CREATE UNIQUE INDEX "homepage_blocks_hero_locales_locale_parent_id_unique" ON "homepage_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_hero_locales_parent_id_idx" ON "homepage_blocks_hero_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_stacked_cards_cards_chips_order_idx" ON "homepage_blocks_stacked_cards_cards_chips" USING btree ("_order");
  CREATE INDEX "homepage_blocks_stacked_cards_cards_chips_parent_id_idx" ON "homepage_blocks_stacked_cards_cards_chips" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_blocks_stacked_cards_cards_chips_locales_locale_par" ON "homepage_blocks_stacked_cards_cards_chips_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_stacked_cards_cards_chips_locales_parent_idx" ON "homepage_blocks_stacked_cards_cards_chips_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_stacked_cards_cards_order_idx" ON "homepage_blocks_stacked_cards_cards" USING btree ("_order");
  CREATE INDEX "homepage_blocks_stacked_cards_cards_parent_id_idx" ON "homepage_blocks_stacked_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_stacked_cards_cards_image_idx" ON "homepage_blocks_stacked_cards_cards" USING btree ("image_id");
  CREATE UNIQUE INDEX "homepage_blocks_stacked_cards_cards_locales_locale_parent_id" ON "homepage_blocks_stacked_cards_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_stacked_cards_cards_locales_parent_id_idx" ON "homepage_blocks_stacked_cards_cards_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_stacked_cards_order_idx" ON "homepage_blocks_stacked_cards" USING btree ("_order");
  CREATE INDEX "homepage_blocks_stacked_cards_parent_id_idx" ON "homepage_blocks_stacked_cards" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_stacked_cards_path_idx" ON "homepage_blocks_stacked_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_stacked_cards_locales_locale_parent_id_uniqu" ON "homepage_blocks_stacked_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_stacked_cards_locales_parent_id_idx" ON "homepage_blocks_stacked_cards_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_showcase_order_idx" ON "homepage_blocks_showcase" USING btree ("_order");
  CREATE INDEX "homepage_blocks_showcase_parent_id_idx" ON "homepage_blocks_showcase" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_showcase_path_idx" ON "homepage_blocks_showcase" USING btree ("_path");
  CREATE INDEX "homepage_blocks_showcase_collection_idx" ON "homepage_blocks_showcase" USING btree ("collection_id");
  CREATE UNIQUE INDEX "homepage_blocks_showcase_locales_locale_parent_id_unique" ON "homepage_blocks_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_showcase_locales_parent_id_idx" ON "homepage_blocks_showcase_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_product_carousel_order_idx" ON "homepage_blocks_product_carousel" USING btree ("_order");
  CREATE INDEX "homepage_blocks_product_carousel_parent_id_idx" ON "homepage_blocks_product_carousel" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_product_carousel_path_idx" ON "homepage_blocks_product_carousel" USING btree ("_path");
  CREATE INDEX "homepage_blocks_product_carousel_category_idx" ON "homepage_blocks_product_carousel" USING btree ("category_id");
  CREATE UNIQUE INDEX "homepage_blocks_product_carousel_locales_locale_parent_id_un" ON "homepage_blocks_product_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_product_carousel_locales_parent_id_idx" ON "homepage_blocks_product_carousel_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_story_order_idx" ON "homepage_blocks_story" USING btree ("_order");
  CREATE INDEX "homepage_blocks_story_parent_id_idx" ON "homepage_blocks_story" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_story_path_idx" ON "homepage_blocks_story" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_story_locales_locale_parent_id_unique" ON "homepage_blocks_story_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_story_locales_parent_id_idx" ON "homepage_blocks_story_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_materials_order_idx" ON "homepage_blocks_materials" USING btree ("_order");
  CREATE INDEX "homepage_blocks_materials_parent_id_idx" ON "homepage_blocks_materials" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_materials_path_idx" ON "homepage_blocks_materials" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_materials_locales_locale_parent_id_unique" ON "homepage_blocks_materials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_materials_locales_parent_id_idx" ON "homepage_blocks_materials_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_dimensions_order_idx" ON "homepage_blocks_dimensions" USING btree ("_order");
  CREATE INDEX "homepage_blocks_dimensions_parent_id_idx" ON "homepage_blocks_dimensions" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_dimensions_path_idx" ON "homepage_blocks_dimensions" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_dimensions_locales_locale_parent_id_unique" ON "homepage_blocks_dimensions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_dimensions_locales_parent_id_idx" ON "homepage_blocks_dimensions_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_bundle_builder_order_idx" ON "homepage_blocks_bundle_builder" USING btree ("_order");
  CREATE INDEX "homepage_blocks_bundle_builder_parent_id_idx" ON "homepage_blocks_bundle_builder" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_bundle_builder_path_idx" ON "homepage_blocks_bundle_builder" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_bundle_builder_locales_locale_parent_id_uniq" ON "homepage_blocks_bundle_builder_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_bundle_builder_locales_parent_id_idx" ON "homepage_blocks_bundle_builder_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_faq_items_order_idx" ON "homepage_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "homepage_blocks_faq_items_parent_id_idx" ON "homepage_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_blocks_faq_items_locales_locale_parent_id_unique" ON "homepage_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_faq_items_locales_parent_id_idx" ON "homepage_blocks_faq_items_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_faq_order_idx" ON "homepage_blocks_faq" USING btree ("_order");
  CREATE INDEX "homepage_blocks_faq_parent_id_idx" ON "homepage_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_faq_path_idx" ON "homepage_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_faq_locales_locale_parent_id_unique" ON "homepage_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_faq_locales_parent_id_idx" ON "homepage_blocks_faq_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_reviews_order_idx" ON "homepage_blocks_reviews" USING btree ("_order");
  CREATE INDEX "homepage_blocks_reviews_parent_id_idx" ON "homepage_blocks_reviews" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_reviews_path_idx" ON "homepage_blocks_reviews" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_reviews_locales_locale_parent_id_unique" ON "homepage_blocks_reviews_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_reviews_locales_parent_id_idx" ON "homepage_blocks_reviews_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_drag_canvas_items_order_idx" ON "homepage_blocks_drag_canvas_items" USING btree ("_order");
  CREATE INDEX "homepage_blocks_drag_canvas_items_parent_id_idx" ON "homepage_blocks_drag_canvas_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_drag_canvas_items_image_idx" ON "homepage_blocks_drag_canvas_items" USING btree ("image_id");
  CREATE INDEX "homepage_blocks_drag_canvas_items_review_idx" ON "homepage_blocks_drag_canvas_items" USING btree ("review_id");
  CREATE UNIQUE INDEX "homepage_blocks_drag_canvas_items_locales_locale_parent_id_u" ON "homepage_blocks_drag_canvas_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_drag_canvas_items_locales_parent_id_idx" ON "homepage_blocks_drag_canvas_items_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_drag_canvas_order_idx" ON "homepage_blocks_drag_canvas" USING btree ("_order");
  CREATE INDEX "homepage_blocks_drag_canvas_parent_id_idx" ON "homepage_blocks_drag_canvas" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_drag_canvas_path_idx" ON "homepage_blocks_drag_canvas" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_drag_canvas_locales_locale_parent_id_unique" ON "homepage_blocks_drag_canvas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_drag_canvas_locales_parent_id_idx" ON "homepage_blocks_drag_canvas_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_cta_order_idx" ON "homepage_blocks_cta" USING btree ("_order");
  CREATE INDEX "homepage_blocks_cta_parent_id_idx" ON "homepage_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_cta_path_idx" ON "homepage_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_cta_locales_locale_parent_id_unique" ON "homepage_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_cta_locales_parent_id_idx" ON "homepage_blocks_cta_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_rich_text_order_idx" ON "homepage_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "homepage_blocks_rich_text_parent_id_idx" ON "homepage_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_rich_text_path_idx" ON "homepage_blocks_rich_text" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_rich_text_locales_locale_parent_id_unique" ON "homepage_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_rich_text_locales_parent_id_idx" ON "homepage_blocks_rich_text_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_gallery_order_idx" ON "homepage_blocks_gallery" USING btree ("_order");
  CREATE INDEX "homepage_blocks_gallery_parent_id_idx" ON "homepage_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_gallery_path_idx" ON "homepage_blocks_gallery" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_gallery_locales_locale_parent_id_unique" ON "homepage_blocks_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_gallery_locales_parent_id_idx" ON "homepage_blocks_gallery_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_stats_items_order_idx" ON "homepage_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "homepage_blocks_stats_items_parent_id_idx" ON "homepage_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_blocks_stats_items_locales_locale_parent_id_unique" ON "homepage_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_stats_items_locales_parent_id_idx" ON "homepage_blocks_stats_items_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_stats_order_idx" ON "homepage_blocks_stats" USING btree ("_order");
  CREATE INDEX "homepage_blocks_stats_parent_id_idx" ON "homepage_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_stats_path_idx" ON "homepage_blocks_stats" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_stats_locales_locale_parent_id_unique" ON "homepage_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_stats_locales_parent_id_idx" ON "homepage_blocks_stats_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_locales_locale_parent_id_unique" ON "homepage_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_locales_parent_id_idx" ON "homepage_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_rels_order_idx" ON "homepage_rels" USING btree ("order");
  CREATE INDEX "homepage_rels_parent_idx" ON "homepage_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_rels_path_idx" ON "homepage_rels" USING btree ("path");
  CREATE INDEX "homepage_rels_media_id_idx" ON "homepage_rels" USING btree ("media_id");
  CREATE INDEX "site_settings_hours_order_idx" ON "site_settings_hours" USING btree ("_order");
  CREATE INDEX "site_settings_hours_parent_id_idx" ON "site_settings_hours" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_hours_locales_locale_parent_id_unique" ON "site_settings_hours_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_hours_locales_parent_id_idx" ON "site_settings_hours_locales" USING btree ("_parent_id");
  CREATE INDEX "site_settings_delivery_zones_order_idx" ON "site_settings_delivery_zones" USING btree ("_order");
  CREATE INDEX "site_settings_delivery_zones_parent_id_idx" ON "site_settings_delivery_zones" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_delivery_zones_locales_locale_parent_id_unique" ON "site_settings_delivery_zones_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_delivery_zones_locales_parent_id_idx" ON "site_settings_delivery_zones_locales" USING btree ("_parent_id");
  CREATE INDEX "site_settings_manager_emails_order_idx" ON "site_settings_manager_emails" USING btree ("_order");
  CREATE INDEX "site_settings_manager_emails_parent_id_idx" ON "site_settings_manager_emails" USING btree ("_parent_id");
  CREATE INDEX "site_settings_default_product_faq_order_idx" ON "site_settings_default_product_faq" USING btree ("_order");
  CREATE INDEX "site_settings_default_product_faq_parent_id_idx" ON "site_settings_default_product_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_default_product_faq_locales_locale_parent_id_u" ON "site_settings_default_product_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_default_product_faq_locales_parent_id_idx" ON "site_settings_default_product_faq_locales" USING btree ("_parent_id");
  CREATE INDEX "site_settings_map_image_idx" ON "site_settings" USING btree ("map_image_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_locales_parent_id_idx" ON "site_settings_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "products_images" CASCADE;
  DROP TABLE "products_variants" CASCADE;
  DROP TABLE "products_variants_locales" CASCADE;
  DROP TABLE "products_blocks_hero_lines" CASCADE;
  DROP TABLE "products_blocks_hero_lines_locales" CASCADE;
  DROP TABLE "products_blocks_hero" CASCADE;
  DROP TABLE "products_blocks_hero_locales" CASCADE;
  DROP TABLE "products_blocks_stacked_cards_cards_chips" CASCADE;
  DROP TABLE "products_blocks_stacked_cards_cards_chips_locales" CASCADE;
  DROP TABLE "products_blocks_stacked_cards_cards" CASCADE;
  DROP TABLE "products_blocks_stacked_cards_cards_locales" CASCADE;
  DROP TABLE "products_blocks_stacked_cards" CASCADE;
  DROP TABLE "products_blocks_stacked_cards_locales" CASCADE;
  DROP TABLE "products_blocks_showcase" CASCADE;
  DROP TABLE "products_blocks_showcase_locales" CASCADE;
  DROP TABLE "products_blocks_product_carousel" CASCADE;
  DROP TABLE "products_blocks_product_carousel_locales" CASCADE;
  DROP TABLE "products_blocks_story" CASCADE;
  DROP TABLE "products_blocks_story_locales" CASCADE;
  DROP TABLE "products_blocks_materials" CASCADE;
  DROP TABLE "products_blocks_materials_locales" CASCADE;
  DROP TABLE "products_blocks_dimensions" CASCADE;
  DROP TABLE "products_blocks_dimensions_locales" CASCADE;
  DROP TABLE "products_blocks_bundle_builder" CASCADE;
  DROP TABLE "products_blocks_bundle_builder_locales" CASCADE;
  DROP TABLE "products_blocks_faq_items" CASCADE;
  DROP TABLE "products_blocks_faq_items_locales" CASCADE;
  DROP TABLE "products_blocks_faq" CASCADE;
  DROP TABLE "products_blocks_faq_locales" CASCADE;
  DROP TABLE "products_blocks_reviews" CASCADE;
  DROP TABLE "products_blocks_reviews_locales" CASCADE;
  DROP TABLE "products_blocks_drag_canvas_items" CASCADE;
  DROP TABLE "products_blocks_drag_canvas_items_locales" CASCADE;
  DROP TABLE "products_blocks_drag_canvas" CASCADE;
  DROP TABLE "products_blocks_drag_canvas_locales" CASCADE;
  DROP TABLE "products_blocks_cta" CASCADE;
  DROP TABLE "products_blocks_cta_locales" CASCADE;
  DROP TABLE "products_blocks_rich_text" CASCADE;
  DROP TABLE "products_blocks_rich_text_locales" CASCADE;
  DROP TABLE "products_blocks_gallery" CASCADE;
  DROP TABLE "products_blocks_gallery_locales" CASCADE;
  DROP TABLE "products_blocks_stats_items" CASCADE;
  DROP TABLE "products_blocks_stats_items_locales" CASCADE;
  DROP TABLE "products_blocks_stats" CASCADE;
  DROP TABLE "products_blocks_stats_locales" CASCADE;
  DROP TABLE "products_faq" CASCADE;
  DROP TABLE "products_faq_locales" CASCADE;
  DROP TABLE "products_badges" CASCADE;
  DROP TABLE "products_colors" CASCADE;
  DROP TABLE "products_missing_translations" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "categories_chips" CASCADE;
  DROP TABLE "categories_chips_locales" CASCADE;
  DROP TABLE "categories_missing_translations" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "collections_blocks_hero_lines" CASCADE;
  DROP TABLE "collections_blocks_hero_lines_locales" CASCADE;
  DROP TABLE "collections_blocks_hero" CASCADE;
  DROP TABLE "collections_blocks_hero_locales" CASCADE;
  DROP TABLE "collections_blocks_stacked_cards_cards_chips" CASCADE;
  DROP TABLE "collections_blocks_stacked_cards_cards_chips_locales" CASCADE;
  DROP TABLE "collections_blocks_stacked_cards_cards" CASCADE;
  DROP TABLE "collections_blocks_stacked_cards_cards_locales" CASCADE;
  DROP TABLE "collections_blocks_stacked_cards" CASCADE;
  DROP TABLE "collections_blocks_stacked_cards_locales" CASCADE;
  DROP TABLE "collections_blocks_showcase" CASCADE;
  DROP TABLE "collections_blocks_showcase_locales" CASCADE;
  DROP TABLE "collections_blocks_product_carousel" CASCADE;
  DROP TABLE "collections_blocks_product_carousel_locales" CASCADE;
  DROP TABLE "collections_blocks_story" CASCADE;
  DROP TABLE "collections_blocks_story_locales" CASCADE;
  DROP TABLE "collections_blocks_materials" CASCADE;
  DROP TABLE "collections_blocks_materials_locales" CASCADE;
  DROP TABLE "collections_blocks_dimensions" CASCADE;
  DROP TABLE "collections_blocks_dimensions_locales" CASCADE;
  DROP TABLE "collections_blocks_bundle_builder" CASCADE;
  DROP TABLE "collections_blocks_bundle_builder_locales" CASCADE;
  DROP TABLE "collections_blocks_faq_items" CASCADE;
  DROP TABLE "collections_blocks_faq_items_locales" CASCADE;
  DROP TABLE "collections_blocks_faq" CASCADE;
  DROP TABLE "collections_blocks_faq_locales" CASCADE;
  DROP TABLE "collections_blocks_reviews" CASCADE;
  DROP TABLE "collections_blocks_reviews_locales" CASCADE;
  DROP TABLE "collections_blocks_drag_canvas_items" CASCADE;
  DROP TABLE "collections_blocks_drag_canvas_items_locales" CASCADE;
  DROP TABLE "collections_blocks_drag_canvas" CASCADE;
  DROP TABLE "collections_blocks_drag_canvas_locales" CASCADE;
  DROP TABLE "collections_blocks_cta" CASCADE;
  DROP TABLE "collections_blocks_cta_locales" CASCADE;
  DROP TABLE "collections_blocks_rich_text" CASCADE;
  DROP TABLE "collections_blocks_rich_text_locales" CASCADE;
  DROP TABLE "collections_blocks_gallery" CASCADE;
  DROP TABLE "collections_blocks_gallery_locales" CASCADE;
  DROP TABLE "collections_blocks_stats_items" CASCADE;
  DROP TABLE "collections_blocks_stats_items_locales" CASCADE;
  DROP TABLE "collections_blocks_stats" CASCADE;
  DROP TABLE "collections_blocks_stats_locales" CASCADE;
  DROP TABLE "collections_missing_translations" CASCADE;
  DROP TABLE "collections" CASCADE;
  DROP TABLE "collections_locales" CASCADE;
  DROP TABLE "collections_rels" CASCADE;
  DROP TABLE "materials_missing_translations" CASCADE;
  DROP TABLE "materials" CASCADE;
  DROP TABLE "materials_locales" CASCADE;
  DROP TABLE "designers" CASCADE;
  DROP TABLE "designers_locales" CASCADE;
  DROP TABLE "reviews" CASCADE;
  DROP TABLE "reviews_locales" CASCADE;
  DROP TABLE "reviews_rels" CASCADE;
  DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders_status_history" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "inquiries_rels" CASCADE;
  DROP TABLE "customers_addresses" CASCADE;
  DROP TABLE "customers_sessions" CASCADE;
  DROP TABLE "customers" CASCADE;
  DROP TABLE "customers_rels" CASCADE;
  DROP TABLE "carts" CASCADE;
  DROP TABLE "promo_codes" CASCADE;
  DROP TABLE "pages_blocks_hero_lines" CASCADE;
  DROP TABLE "pages_blocks_hero_lines_locales" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_hero_locales" CASCADE;
  DROP TABLE "pages_blocks_stacked_cards_cards_chips" CASCADE;
  DROP TABLE "pages_blocks_stacked_cards_cards_chips_locales" CASCADE;
  DROP TABLE "pages_blocks_stacked_cards_cards" CASCADE;
  DROP TABLE "pages_blocks_stacked_cards_cards_locales" CASCADE;
  DROP TABLE "pages_blocks_stacked_cards" CASCADE;
  DROP TABLE "pages_blocks_stacked_cards_locales" CASCADE;
  DROP TABLE "pages_blocks_showcase" CASCADE;
  DROP TABLE "pages_blocks_showcase_locales" CASCADE;
  DROP TABLE "pages_blocks_product_carousel" CASCADE;
  DROP TABLE "pages_blocks_product_carousel_locales" CASCADE;
  DROP TABLE "pages_blocks_story" CASCADE;
  DROP TABLE "pages_blocks_story_locales" CASCADE;
  DROP TABLE "pages_blocks_materials" CASCADE;
  DROP TABLE "pages_blocks_materials_locales" CASCADE;
  DROP TABLE "pages_blocks_dimensions" CASCADE;
  DROP TABLE "pages_blocks_dimensions_locales" CASCADE;
  DROP TABLE "pages_blocks_bundle_builder" CASCADE;
  DROP TABLE "pages_blocks_bundle_builder_locales" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq_items_locales" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_faq_locales" CASCADE;
  DROP TABLE "pages_blocks_reviews" CASCADE;
  DROP TABLE "pages_blocks_reviews_locales" CASCADE;
  DROP TABLE "pages_blocks_drag_canvas_items" CASCADE;
  DROP TABLE "pages_blocks_drag_canvas_items_locales" CASCADE;
  DROP TABLE "pages_blocks_drag_canvas" CASCADE;
  DROP TABLE "pages_blocks_drag_canvas_locales" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_cta_locales" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_rich_text_locales" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_gallery_locales" CASCADE;
  DROP TABLE "pages_blocks_stats_items" CASCADE;
  DROP TABLE "pages_blocks_stats_items_locales" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_stats_locales" CASCADE;
  DROP TABLE "pages_missing_translations" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "files" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "header_items" CASCADE;
  DROP TABLE "header_items_locales" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns_links_locales" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer_columns_locales" CASCADE;
  DROP TABLE "footer_socials" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "homepage_blocks_hero_lines" CASCADE;
  DROP TABLE "homepage_blocks_hero_lines_locales" CASCADE;
  DROP TABLE "homepage_blocks_hero" CASCADE;
  DROP TABLE "homepage_blocks_hero_locales" CASCADE;
  DROP TABLE "homepage_blocks_stacked_cards_cards_chips" CASCADE;
  DROP TABLE "homepage_blocks_stacked_cards_cards_chips_locales" CASCADE;
  DROP TABLE "homepage_blocks_stacked_cards_cards" CASCADE;
  DROP TABLE "homepage_blocks_stacked_cards_cards_locales" CASCADE;
  DROP TABLE "homepage_blocks_stacked_cards" CASCADE;
  DROP TABLE "homepage_blocks_stacked_cards_locales" CASCADE;
  DROP TABLE "homepage_blocks_showcase" CASCADE;
  DROP TABLE "homepage_blocks_showcase_locales" CASCADE;
  DROP TABLE "homepage_blocks_product_carousel" CASCADE;
  DROP TABLE "homepage_blocks_product_carousel_locales" CASCADE;
  DROP TABLE "homepage_blocks_story" CASCADE;
  DROP TABLE "homepage_blocks_story_locales" CASCADE;
  DROP TABLE "homepage_blocks_materials" CASCADE;
  DROP TABLE "homepage_blocks_materials_locales" CASCADE;
  DROP TABLE "homepage_blocks_dimensions" CASCADE;
  DROP TABLE "homepage_blocks_dimensions_locales" CASCADE;
  DROP TABLE "homepage_blocks_bundle_builder" CASCADE;
  DROP TABLE "homepage_blocks_bundle_builder_locales" CASCADE;
  DROP TABLE "homepage_blocks_faq_items" CASCADE;
  DROP TABLE "homepage_blocks_faq_items_locales" CASCADE;
  DROP TABLE "homepage_blocks_faq" CASCADE;
  DROP TABLE "homepage_blocks_faq_locales" CASCADE;
  DROP TABLE "homepage_blocks_reviews" CASCADE;
  DROP TABLE "homepage_blocks_reviews_locales" CASCADE;
  DROP TABLE "homepage_blocks_drag_canvas_items" CASCADE;
  DROP TABLE "homepage_blocks_drag_canvas_items_locales" CASCADE;
  DROP TABLE "homepage_blocks_drag_canvas" CASCADE;
  DROP TABLE "homepage_blocks_drag_canvas_locales" CASCADE;
  DROP TABLE "homepage_blocks_cta" CASCADE;
  DROP TABLE "homepage_blocks_cta_locales" CASCADE;
  DROP TABLE "homepage_blocks_rich_text" CASCADE;
  DROP TABLE "homepage_blocks_rich_text_locales" CASCADE;
  DROP TABLE "homepage_blocks_gallery" CASCADE;
  DROP TABLE "homepage_blocks_gallery_locales" CASCADE;
  DROP TABLE "homepage_blocks_stats_items" CASCADE;
  DROP TABLE "homepage_blocks_stats_items_locales" CASCADE;
  DROP TABLE "homepage_blocks_stats" CASCADE;
  DROP TABLE "homepage_blocks_stats_locales" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "homepage_locales" CASCADE;
  DROP TABLE "homepage_rels" CASCADE;
  DROP TABLE "site_settings_hours" CASCADE;
  DROP TABLE "site_settings_hours_locales" CASCADE;
  DROP TABLE "site_settings_delivery_zones" CASCADE;
  DROP TABLE "site_settings_delivery_zones_locales" CASCADE;
  DROP TABLE "site_settings_manager_emails" CASCADE;
  DROP TABLE "site_settings_default_product_faq" CASCADE;
  DROP TABLE "site_settings_default_product_faq_locales" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_products_blocks_hero_variant";
  DROP TYPE "public"."enum_products_blocks_hero_cta_route";
  DROP TYPE "public"."enum_products_blocks_stacked_cards_cards_color";
  DROP TYPE "public"."enum_products_blocks_stacked_cards_cards_route";
  DROP TYPE "public"."enum_products_blocks_stacked_cards_source";
  DROP TYPE "public"."enum_products_blocks_showcase_source";
  DROP TYPE "public"."enum_products_blocks_product_carousel_source";
  DROP TYPE "public"."enum_products_blocks_cta_variant";
  DROP TYPE "public"."enum_products_blocks_cta_action";
  DROP TYPE "public"."enum_products_blocks_cta_route";
  DROP TYPE "public"."enum_products_blocks_stats_route";
  DROP TYPE "public"."enum_products_badges";
  DROP TYPE "public"."enum_products_colors";
  DROP TYPE "public"."enum_products_missing_translations";
  DROP TYPE "public"."enum_products_podium_color";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum_categories_missing_translations";
  DROP TYPE "public"."enum_categories_color";
  DROP TYPE "public"."enum_collections_blocks_hero_variant";
  DROP TYPE "public"."enum_collections_blocks_hero_cta_route";
  DROP TYPE "public"."enum_collections_blocks_stacked_cards_cards_color";
  DROP TYPE "public"."enum_collections_blocks_stacked_cards_cards_route";
  DROP TYPE "public"."enum_collections_blocks_stacked_cards_source";
  DROP TYPE "public"."enum_collections_blocks_showcase_source";
  DROP TYPE "public"."enum_collections_blocks_product_carousel_source";
  DROP TYPE "public"."enum_collections_blocks_cta_variant";
  DROP TYPE "public"."enum_collections_blocks_cta_action";
  DROP TYPE "public"."enum_collections_blocks_cta_route";
  DROP TYPE "public"."enum_collections_blocks_stats_route";
  DROP TYPE "public"."enum_collections_missing_translations";
  DROP TYPE "public"."enum_collections_podium_color";
  DROP TYPE "public"."enum_collections_status";
  DROP TYPE "public"."enum_materials_missing_translations";
  DROP TYPE "public"."enum_materials_type";
  DROP TYPE "public"."enum_materials_color_family";
  DROP TYPE "public"."enum_orders_status_history_status";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_orders_payment_status";
  DROP TYPE "public"."enum_orders_payment_method";
  DROP TYPE "public"."enum_orders_delivery_method";
  DROP TYPE "public"."enum_orders_locale";
  DROP TYPE "public"."enum_inquiries_type";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_inquiries_locale";
  DROP TYPE "public"."enum_customers_locale";
  DROP TYPE "public"."enum_promo_codes_kind";
  DROP TYPE "public"."enum_pages_blocks_hero_variant";
  DROP TYPE "public"."enum_pages_blocks_hero_cta_route";
  DROP TYPE "public"."enum_pages_blocks_stacked_cards_cards_color";
  DROP TYPE "public"."enum_pages_blocks_stacked_cards_cards_route";
  DROP TYPE "public"."enum_pages_blocks_stacked_cards_source";
  DROP TYPE "public"."enum_pages_blocks_showcase_source";
  DROP TYPE "public"."enum_pages_blocks_product_carousel_source";
  DROP TYPE "public"."enum_pages_blocks_cta_variant";
  DROP TYPE "public"."enum_pages_blocks_cta_action";
  DROP TYPE "public"."enum_pages_blocks_cta_route";
  DROP TYPE "public"."enum_pages_blocks_stats_route";
  DROP TYPE "public"."enum_pages_missing_translations";
  DROP TYPE "public"."enum_pages_key";
  DROP TYPE "public"."enum_media_tone";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_header_items_route";
  DROP TYPE "public"."enum_footer_columns_links_route";
  DROP TYPE "public"."enum_homepage_blocks_hero_variant";
  DROP TYPE "public"."enum_homepage_blocks_hero_cta_route";
  DROP TYPE "public"."enum_homepage_blocks_stacked_cards_cards_color";
  DROP TYPE "public"."enum_homepage_blocks_stacked_cards_cards_route";
  DROP TYPE "public"."enum_homepage_blocks_stacked_cards_source";
  DROP TYPE "public"."enum_homepage_blocks_showcase_source";
  DROP TYPE "public"."enum_homepage_blocks_product_carousel_source";
  DROP TYPE "public"."enum_homepage_blocks_cta_variant";
  DROP TYPE "public"."enum_homepage_blocks_cta_action";
  DROP TYPE "public"."enum_homepage_blocks_cta_route";
  DROP TYPE "public"."enum_homepage_blocks_stats_route";
  DROP TYPE "public"."enum_site_settings_delivery_zones_code";`)
}
