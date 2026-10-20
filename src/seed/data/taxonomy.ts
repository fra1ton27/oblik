import type { FurnitureType } from '../images'

/** Текст на трёх языках */
export type T3 = { ru: string; en: string; sr: string }

export type SeedCategory = {
  key: string
  title: T3
  description: T3
  chips: T3[]
  color: 'lavender' | 'pistachio' | 'blush' | 'mist' | 'sand'
  icon: FurnitureType
  order: number
}

export const categories: SeedCategory[] = [
  {
    key: 'sofas',
    title: { ru: 'Диваны и кресла', en: 'Sofas & armchairs', sr: 'Sofe i fotelje' },
    description: {
      ru: 'Глубокая посадка, съёмные чехлы и каркас из массива — мягкая мебель, которая не проседает годами.',
      en: 'Deep seats, removable covers and solid wood frames — upholstery that keeps its shape for years.',
      sr: 'Duboka sedišta, presvlake koje se skidaju i ramovi od masiva — tapacirani nameštaj koji godinama drži oblik.',
    },
    chips: [
      { ru: 'Модульные', en: 'Modular', sr: 'Modularne' },
      { ru: 'Прямые', en: 'Straight', sr: 'Ravne' },
      { ru: 'Кресла', en: 'Armchairs', sr: 'Fotelje' },
    ],
    color: 'lavender',
    icon: 'sofa',
    order: 1,
  },
  {
    key: 'tables',
    title: { ru: 'Столы', en: 'Tables', sr: 'Stolovi' },
    description: {
      ru: 'Обеденные, журнальные и рабочие столы из дуба, ореха и травертина. Делаем по вашим размерам.',
      en: 'Dining, coffee and work tables in oak, walnut and travertine. Made to your measurements.',
      sr: 'Trpezarijski, klub i radni stolovi od hrasta, oraha i travertina. Pravimo ih po vašim merama.',
    },
    chips: [
      { ru: 'Обеденные', en: 'Dining', sr: 'Trpezarijski' },
      { ru: 'Журнальные', en: 'Coffee', sr: 'Klub stolovi' },
      { ru: 'Рабочие', en: 'Desks', sr: 'Radni' },
    ],
    color: 'pistachio',
    icon: 'dining',
    order: 2,
  },
  {
    key: 'chairs',
    title: { ru: 'Стулья', en: 'Chairs', sr: 'Stolice' },
    description: {
      ru: 'Лёгкие стулья, табуреты и скамьи: собираем на шипах, без лишнего металла.',
      en: 'Light chairs, stools and benches, joined with mortise and tenon — no unnecessary metal.',
      sr: 'Lagane stolice, hokerice i klupe, spojene čepovima — bez suvišnog metala.',
    },
    chips: [
      { ru: 'Обеденные', en: 'Dining', sr: 'Trpezarijske' },
      { ru: 'Барные', en: 'Bar', sr: 'Barske' },
      { ru: 'Скамьи', en: 'Benches', sr: 'Klupe' },
    ],
    color: 'blush',
    icon: 'chair',
    order: 3,
  },
  {
    key: 'storage',
    title: { ru: 'Хранение', en: 'Storage', sr: 'Odlaganje' },
    description: {
      ru: 'Стеллажи-террасы, комоды и буфеты: модульные, как ступени, и спокойные по фасаду.',
      en: 'Terrace shelving, chests and sideboards — modular like steps, calm on the front.',
      sr: 'Police-terase, komode i bifei — modularni kao stepenice, mirnih fronti.',
    },
    chips: [
      { ru: 'Стеллажи', en: 'Shelving', sr: 'Police' },
      { ru: 'Комоды', en: 'Chests', sr: 'Komode' },
      { ru: 'Буфеты', en: 'Sideboards', sr: 'Bifei' },
    ],
    color: 'mist',
    icon: 'shelf',
    order: 4,
  },
  {
    key: 'beds',
    title: { ru: 'Кровати', en: 'Beds', sr: 'Kreveti' },
    description: {
      ru: 'Кровати с мягким изголовьем и прикроватные тумбы. Основание держит любой матрас.',
      en: 'Beds with upholstered headboards and nightstands. The base suits any mattress.',
      sr: 'Kreveti sa tapaciranim uzglavljem i noćni stočići. Podloga odgovara svakom dušeku.',
    },
    chips: [
      { ru: 'Двуспальные', en: 'Double', sr: 'Bračni' },
      { ru: 'Мягкие', en: 'Upholstered', sr: 'Tapacirani' },
      { ru: 'Тумбы', en: 'Nightstands', sr: 'Noćni stočići' },
    ],
    color: 'sand',
    icon: 'bed',
    order: 5,
  },
  {
    key: 'decor',
    title: { ru: 'Предметы интерьера', en: 'Objects', sr: 'Predmeti za enterijer' },
    description: {
      ru: 'Свет, зеркала, пуфы и вазы — детали, которые собирают комнату в одну историю.',
      en: 'Lighting, mirrors, poufs and vases — the details that pull a room together.',
      sr: 'Rasveta, ogledala, tabureti i vaze — detalji koji spajaju prostoriju u jednu priču.',
    },
    chips: [
      { ru: 'Свет', en: 'Lighting', sr: 'Rasveta' },
      { ru: 'Зеркала', en: 'Mirrors', sr: 'Ogledala' },
      { ru: 'Пуфы', en: 'Poufs', sr: 'Tabureti' },
    ],
    color: 'lavender',
    icon: 'lamp',
    order: 6,
  },
]

export type SeedMaterial = {
  key: string
  title: T3
  type: 'wood' | 'fabric' | 'metal' | 'stone'
  swatchColor: string
  colorFamily: string
  origin: T3
  description: T3
  care: T3
}

export const materials: SeedMaterial[] = [
  {
    key: 'oak',
    title: { ru: 'Дуб', en: 'Oak', sr: 'Hrast' },
    type: 'wood',
    swatchColor: '#C9A77C',
    colorFamily: 'oak',
    origin: { ru: 'Славония, Хорватия', en: 'Slavonia, Croatia', sr: 'Slavonija, Hrvatska' },
    description: {
      ru: 'Плотный европейский дуб с выразительной текстурой. Сушим до 8–10 % влажности и покрываем маслом с воском.',
      en: 'Dense European oak with a pronounced grain, dried to 8–10% moisture and finished with hardwax oil.',
      sr: 'Gust evropski hrast izražene teksture, sušen do 8–10 % vlage i zaštićen uljem sa voskom.',
    },
    care: {
      ru: 'Протирайте влажной салфеткой, раз в год обновляйте масло.',
      en: 'Wipe with a damp cloth and refresh the oil once a year.',
      sr: 'Brišite vlažnom krpom, jednom godišnje obnovite ulje.',
    },
  },
  {
    key: 'walnut',
    title: { ru: 'Американский орех', en: 'American walnut', sr: 'Američki orah' },
    type: 'wood',
    swatchColor: '#6E4B3A',
    colorFamily: 'walnut',
    origin: { ru: 'Пенсильвания, США', en: 'Pennsylvania, USA', sr: 'Pensilvanija, SAD' },
    description: {
      ru: 'Тёплый шоколадный тон, который со временем становится светлее и глубже.',
      en: 'A warm chocolate tone that grows lighter and richer with time.',
      sr: 'Topao čokoladni ton koji vremenom postaje svetliji i dublji.',
    },
    care: {
      ru: 'Избегайте прямого солнца и горячих предметов без подставки.',
      en: 'Keep out of direct sun and use coasters under hot items.',
      sr: 'Izbegavajte direktno sunce i vrele predmete bez podmetača.',
    },
  },
  {
    key: 'ash',
    title: { ru: 'Ясень', en: 'Ash', sr: 'Jasen' },
    type: 'wood',
    swatchColor: '#DCC9A8',
    colorFamily: 'sand',
    origin: { ru: 'Шумадия, Сербия', en: 'Šumadija, Serbia', sr: 'Šumadija, Srbija' },
    description: {
      ru: 'Светлое упругое дерево — идеально для гнутых спинок и тонких ножек.',
      en: 'Pale, springy timber — ideal for bent backrests and slender legs.',
      sr: 'Svetlo, elastično drvo — idealno za savijene naslone i tanke noge.',
    },
    care: {
      ru: 'Сухая или слегка влажная уборка, без агрессивной химии.',
      en: 'Dry or slightly damp cleaning, no harsh chemicals.',
      sr: 'Suvo ili blago vlažno čišćenje, bez agresivne hemije.',
    },
  },
  {
    key: 'steel',
    title: { ru: 'Сталь с порошковым покрытием', en: 'Powder-coated steel', sr: 'Čelik sa plastifikacijom' },
    type: 'metal',
    swatchColor: '#3B3740',
    colorFamily: 'graphite',
    origin: { ru: 'Нови-Сад, Сербия', en: 'Novi Sad, Serbia', sr: 'Novi Sad, Srbija' },
    description: {
      ru: 'Тонкий стальной профиль, матовая графитовая краска, которая не боится царапин.',
      en: 'Slim steel profile with a matt graphite coating that shrugs off scratches.',
      sr: 'Tanak čelični profil sa mat grafitnom bojom otpornom na ogrebotine.',
    },
    care: { ru: 'Протирайте мягкой тканью.', en: 'Wipe with a soft cloth.', sr: 'Brišite mekom krpom.' },
  },
  {
    key: 'travertine',
    title: { ru: 'Травертин', en: 'Travertine', sr: 'Travertin' },
    type: 'stone',
    swatchColor: '#E6D8C3',
    colorFamily: 'milk',
    origin: { ru: 'Тоскана, Италия', en: 'Tuscany, Italy', sr: 'Toskana, Italija' },
    description: {
      ru: 'Пористый тёплый камень, заполненный и отшлифованный до бархатной поверхности.',
      en: 'A warm porous stone, filled and honed to a velvety surface.',
      sr: 'Topao porozan kamen, ispunjen i brušen do baršunaste površine.',
    },
    care: {
      ru: 'Сразу вытирайте вино и цитрус, раз в полгода — пропитка для камня.',
      en: 'Wipe up wine and citrus straight away; reseal every six months.',
      sr: 'Odmah obrišite vino i citruse; impregnacija na svakih šest meseci.',
    },
  },
  {
    key: 'linen',
    title: { ru: 'Лён', en: 'Linen', sr: 'Lan' },
    type: 'fabric',
    swatchColor: '#E8DCC8',
    colorFamily: 'sand',
    origin: { ru: 'Фландрия, Бельгия', en: 'Flanders, Belgium', sr: 'Flandrija, Belgija' },
    description: {
      ru: 'Плотный стираный лён: дышит летом, становится мягче с каждой стиркой.',
      en: 'Heavy washed linen: breathable in summer and softer with every wash.',
      sr: 'Gust prani lan: diše leti i postaje mekši sa svakim pranjem.',
    },
    care: {
      ru: 'Чехлы снимаются, стирка при 30 °C, сушка без барабана.',
      en: 'Covers come off; wash at 30 °C and line dry.',
      sr: 'Presvlake se skidaju; pranje na 30 °C, sušenje bez mašine.',
    },
  },
  {
    key: 'boucle',
    title: { ru: 'Букле', en: 'Bouclé', sr: 'Buklé' },
    type: 'fabric',
    swatchColor: '#F3EEE6',
    colorFamily: 'milk',
    origin: { ru: 'Бьелла, Италия', en: 'Biella, Italy', sr: 'Bijela, Italija' },
    description: {
      ru: 'Фактурная петельчатая ткань из шерсти и хлопка, тёплая на ощупь.',
      en: 'A textured looped fabric of wool and cotton, warm to the touch.',
      sr: 'Teksturisana tkanina sa petljicama od vune i pamuka, topla na dodir.',
    },
    care: {
      ru: 'Сухая чистка, пылесос с мягкой насадкой.',
      en: 'Dry clean only; vacuum with a soft brush.',
      sr: 'Samo hemijsko čišćenje; usisavanje mekom četkom.',
    },
  },
  {
    key: 'velvet',
    title: { ru: 'Велюр «Шалфей»', en: 'Sage velvet', sr: 'Velur „Žalfija”' },
    type: 'fabric',
    swatchColor: '#9DAA8B',
    colorFamily: 'green',
    origin: { ru: 'Лион, Франция', en: 'Lyon, France', sr: 'Lion, Francuska' },
    description: {
      ru: 'Плотный хлопковый велюр приглушённого зелёного цвета, износостойкость 60 000 циклов.',
      en: 'Dense cotton velvet in a muted green, rated to 60,000 rub cycles.',
      sr: 'Gust pamučni velur prigušene zelene boje, otpornost 60.000 ciklusa.',
    },
    care: {
      ru: 'Чистите по направлению ворса, пятна — влажной губкой.',
      en: 'Brush with the pile; dab stains with a damp sponge.',
      sr: 'Čistite u smeru vlakana, mrlje vlažnim sunđerom.',
    },
  },
]

export type SeedDesigner = { key: string; name: string; role: T3; bio: T3; quote: T3; bg: string; tone: string }

export const designers: SeedDesigner[] = [
  {
    key: 'ana-petrovic',
    name: 'Ana Petrović',
    role: { ru: 'Арт-директор', en: 'Art director', sr: 'Art direktorka' },
    bio: {
      ru: 'Архитектор по образованию. Десять лет проектировала интерьеры в Белграде и Вене, прежде чем открыть мастерскую.',
      en: 'An architect by training, Ana spent ten years designing interiors in Belgrade and Vienna before opening the workshop.',
      sr: 'Arhitektkinja po obrazovanju. Deset godina je projektovala enterijere u Beogradu i Beču pre nego što je otvorila radionicu.',
    },
    quote: {
      ru: 'Хорошая вещь не спорит с домом — она в нём живёт.',
      en: 'A good piece never argues with a home — it lives in it.',
      sr: 'Dobra stvar se ne raspravlja sa domom — ona u njemu živi.',
    },
    bg: '#D6CCF3',
    tone: '#5A5165',
  },
  {
    key: 'marko-ilic',
    name: 'Marko Ilić',
    role: { ru: 'Мебельный инженер', en: 'Furniture engineer', sr: 'Inženjer nameštaja' },
    bio: {
      ru: 'Отвечает за конструкции: столярные соединения, нагрузки и то, чтобы стол можно было передать детям.',
      en: 'Marko looks after construction — joinery, loads, and making sure a table can be handed down to your children.',
      sr: 'Marko je zadužen za konstrukcije — spojeve, opterećenja i to da se sto može ostaviti deci.',
    },
    quote: {
      ru: 'Если соединение красивое, его не нужно прятать.',
      en: 'If a joint is beautiful, there is no need to hide it.',
      sr: 'Ako je spoj lep, ne treba ga skrivati.',
    },
    bg: '#E1ECC0',
    tone: '#56702A',
  },
  {
    key: 'vera-sokolova',
    name: 'Vera Sokolova',
    role: { ru: 'Дизайнер текстиля', en: 'Textile designer', sr: 'Dizajnerka tekstila' },
    bio: {
      ru: 'Подбирает ткани и проектирует мягкую мебель: от плотности пены до шва на подушке.',
      en: 'Vera chooses the fabrics and designs our upholstery, from foam density to the seam on a cushion.',
      sr: 'Vera bira tkanine i projektuje tapacirani nameštaj, od gustine pene do šava na jastuku.',
    },
    quote: {
      ru: 'Ткань должна стареть красиво — как любимый свитер.',
      en: 'Fabric should age gracefully — like a favourite jumper.',
      sr: 'Tkanina treba lepo da stari — kao omiljeni džemper.',
    },
    bg: '#F4DDD3',
    tone: '#3B3049',
  },
]

export type SeedCollection = {
  key: string
  title: T3
  slugs: T3
  tagline: T3
  room: T3
  story: T3
  isBundle: boolean
  bundleDiscount: number
  podiumColor: 'lavender' | 'pistachio' | 'blush' | 'mist' | 'sand'
  products: string[]
  order: number
}

export const collections: SeedCollection[] = [
  {
    key: 'oblako',
    title: { ru: 'Облако', en: 'Oblako', sr: 'Oblak' },
    slugs: { ru: 'oblako', en: 'oblako', sr: 'oblak' },
    tagline: { ru: 'Мягкая гостиная', en: 'A soft living room', sr: 'Meka dnevna soba' },
    room: { ru: 'Гостиная', en: 'Living room', sr: 'Dnevna soba' },
    story: {
      ru: 'Коллекция выросла из одного эскиза: подушка, на которую хочется упасть после долгого дня. Мы оставили только округлые объёмы, мягкий лён и букле, а в столах — тёплый травертин и дуб.',
      en: 'The collection grew from a single sketch: a cushion you want to sink into after a long day. We kept only rounded volumes, soft linen and bouclé, with warm travertine and oak for the tables.',
      sr: 'Kolekcija je nastala iz jedne skice: jastuk u koji poželite da utonete posle dugog dana. Zadržali smo samo zaobljene forme, mek lan i buklé, a za stolove topli travertin i hrast.',
    },
    isBundle: true,
    bundleDiscount: 10,
    podiumColor: 'lavender',
    products: ['sofa-oblako', 'armchair-oblako', 'coffee-krug', 'side-kaplya', 'pouf-oblako'],
    order: 1,
  },
  {
    key: 'terasa',
    title: { ru: 'Терраса', en: 'Terasa', sr: 'Terasa' },
    slugs: { ru: 'terrasa', en: 'terasa', sr: 'terasa' },
    tagline: { ru: 'Столовая на большую семью', en: 'A dining room for a big family', sr: 'Trpezarija za veliku porodicu' },
    room: { ru: 'Столовая', en: 'Dining room', sr: 'Trpezarija' },
    story: {
      ru: 'Ступени террас на склонах над Дунаем подсказали ритм: стол с ножками-трапециями, скамья, буфет с каменной столешницей и свет, который собирает всех вместе.',
      en: 'The stepped terraces above the Danube set the rhythm: a table with trapezoid legs, a bench, a sideboard with a stone top and a light that gathers everyone together.',
      sr: 'Stepenaste terase iznad Dunava dale su ritam: sto sa nogama u obliku trapeza, klupa, bife sa kamenom pločom i svetlo koje sve okuplja.',
    },
    isBundle: true,
    bundleDiscount: 8,
    podiumColor: 'pistachio',
    products: ['dining-terasa', 'chair-terasa', 'bench-terasa', 'sideboard-terasa', 'lamp-luna'],
    order: 2,
  },
  {
    key: 'len',
    title: { ru: 'Лён', en: 'Lan', sr: 'Lan' },
    slugs: { ru: 'len', en: 'lan', sr: 'lan' },
    tagline: { ru: 'Тихая спальня', en: 'A quiet bedroom', sr: 'Tiha spavaća soba' },
    room: { ru: 'Спальня', en: 'Bedroom', sr: 'Spavaća soba' },
    story: {
      ru: 'Спальня без лишнего: кровать с мягким изголовьем, светлый ясень, зеркало-арка и комод, в котором помещается всё.',
      en: 'A bedroom with nothing extra: an upholstered bed, pale ash, an arched mirror and a chest that fits everything.',
      sr: 'Spavaća soba bez suvišnog: krevet sa tapaciranim uzglavljem, svetli jasen, ogledalo u obliku luka i komoda u koju sve stane.',
    },
    isBundle: false,
    bundleDiscount: 0,
    podiumColor: 'blush',
    products: ['bed-len', 'nightstand-len', 'chest-len', 'mirror-arka'],
    order: 3,
  },
]
