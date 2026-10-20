import type { RichBlock } from '../lexical'
import type { T3 } from './taxonomy'

export type SeedReview = { product: string; author: string; city: T3; rating: number; text: T3; withPhoto?: boolean }

export const reviews: SeedReview[] = [
  {
    product: 'sofa-oblako',
    author: 'Jelena M.',
    city: { ru: 'Белград', en: 'Belgrade', sr: 'Beograd' },
    rating: 5,
    text: {
      ru: 'Диван глубокий, как и обещали: вечером засыпаем на нём всей семьёй. Чехлы уже стирали — сели идеально.',
      en: 'As deep as promised — the whole family falls asleep on it in the evenings. We have washed the covers already and they fit perfectly.',
      sr: 'Dubok kao što su obećali — uveče cela porodica zaspi na njemu. Presvlake smo već prali i savršeno stoje.',
    },
    withPhoto: true,
  },
  {
    product: 'dining-terasa',
    author: 'Алексей К.',
    city: { ru: 'Нови-Сад', en: 'Novi Sad', sr: 'Novi Sad' },
    rating: 5,
    text: {
      ru: 'Сделали стол на 20 см длиннее стандартного. Дерево живое, ножки действительно не мешают.',
      en: 'They made the table 20 cm longer than standard. The wood feels alive and the legs really stay out of the way.',
      sr: 'Napravili su sto 20 cm duži od standardnog. Drvo je živo, a noge zaista ne smetaju.',
    },
    withPhoto: true,
  },
  {
    product: 'chair-terasa',
    author: 'Milica R.',
    city: { ru: 'Панчево', en: 'Pančevo', sr: 'Pančevo' },
    rating: 4,
    text: {
      ru: 'Стулья лёгкие и удобные. Ждали шесть недель вместо четырёх, но менеджер заранее предупредил.',
      en: 'Light, comfortable chairs. We waited six weeks instead of four, but the manager let us know in advance.',
      sr: 'Lagane i udobne stolice. Čekali smo šest nedelja umesto četiri, ali menadžer nas je unapred obavestio.',
    },
  },
  {
    product: 'shelf-lestnica',
    author: 'Stefan P.',
    city: { ru: 'Белград', en: 'Belgrade', sr: 'Beograd' },
    rating: 5,
    text: {
      ru: 'Поставили «Лесенку» под скатом мансарды — как будто её делали для нашей комнаты.',
      en: 'We put the Lestnica under the attic slope — it looks made for our room.',
      sr: 'Postavili smo „Lestvicu” ispod kosog krova potkrovlja — kao da je pravljena za našu sobu.',
    },
    withPhoto: true,
  },
  {
    product: 'bed-len',
    author: 'Ирина С.',
    city: { ru: 'Земун', en: 'Zemun', sr: 'Zemun' },
    rating: 5,
    text: {
      ru: 'Кровать не скрипит совсем, а льняное изголовье приятно трогать. Собрали за полчаса.',
      en: 'The bed doesn’t creak at all, and the linen headboard is lovely to touch. Assembled in half an hour.',
      sr: 'Krevet uopšte ne škripi, a laneno uzglavlje je prijatno na dodir. Sklopljen za pola sata.',
    },
  },
  {
    product: 'coffee-krug',
    author: 'Ana D.',
    city: { ru: 'Ниш', en: 'Niš', sr: 'Niš' },
    rating: 5,
    text: {
      ru: 'Травертин вживую ещё красивее. Пятна от кофе не остаются, проверено.',
      en: 'The travertine is even prettier in person. Coffee doesn’t stain it — tested.',
      sr: 'Travertin je uživo još lepši. Kafa ne ostavlja mrlje — provereno.',
    },
  },
  {
    product: 'armchair-oblako',
    author: 'Nikola V.',
    city: { ru: 'Крагуевац', en: 'Kragujevac', sr: 'Kragujevac' },
    rating: 5,
    text: {
      ru: 'Кресло для чтения мечты: широкое, мягкое, спина не устаёт.',
      en: 'My dream reading chair: wide, soft, and my back never gets tired.',
      sr: 'Fotelja za čitanje iz snova: široka, meka, leđa se ne umaraju.',
    },
    withPhoto: true,
  },
  {
    product: 'lamp-luna',
    author: 'Maja T.',
    city: { ru: 'Белград', en: 'Belgrade', sr: 'Beograd' },
    rating: 4,
    text: {
      ru: 'Свет мягкий, над столом не слепит. Хотелось бы больше вариантов цвета.',
      en: 'Soft light that doesn’t dazzle over the table. I’d love more colour options.',
      sr: 'Meko svetlo koje ne zaslepljuje iznad stola. Volela bih više boja.',
    },
  },
  {
    product: 'sideboard-terasa',
    author: 'Дмитрий Л.',
    city: { ru: 'Белград', en: 'Belgrade', sr: 'Beograd' },
    rating: 5,
    text: {
      ru: 'Буфет вместил весь сервиз. Двери на нажатие — без ручек выглядит очень чисто.',
      en: 'The sideboard swallowed our whole dinner service. Push-to-open doors look so clean without handles.',
      sr: 'U bife je stao ceo servis. Vrata na pritisak bez ručki izgledaju vrlo čisto.',
    },
  },
  {
    product: 'pouf-oblako',
    author: 'Tamara J.',
    city: { ru: 'Суботица', en: 'Subotica', sr: 'Subotica' },
    rating: 5,
    text: {
      ru: 'Брали к дивану, а теперь пуф живёт в детской — все за него спорят.',
      en: 'We bought it for the sofa, but now the pouf lives in the kids’ room — everyone fights over it.',
      sr: 'Kupili smo ga uz sofu, a sada tabure živi u dečjoj sobi — svi se otimaju za njega.',
    },
  },
]

type PageSeed = { key: 'privacy' | 'terms' | 'delivery' | 'about' | 'custom' | 'contact'; title: T3; intro: T3; content?: Record<'ru' | 'en' | 'sr', RichBlock[]>; legal?: boolean }

export const pages: PageSeed[] = [
  {
    key: 'privacy',
    legal: true,
    title: { ru: 'Политика конфиденциальности', en: 'Privacy policy', sr: 'Politika privatnosti' },
    intro: {
      ru: 'Как мы собираем, храним и используем ваши данные. Черновик: требует проверки юристом.',
      en: 'How we collect, store and use your data. Draft: requires legal review.',
      sr: 'Kako prikupljamo, čuvamo i koristimo vaše podatke. Nacrt: potrebna je provera pravnika.',
    },
    content: {
      ru: [
        { h2: 'Какие данные мы собираем' },
        { p: 'Имя, телефон, email и адрес доставки — когда вы оформляете заказ, оставляете заявку или создаёте личный кабинет.' },
        { h2: 'Зачем они нужны' },
        { ul: ['Чтобы связаться с вами и подтвердить заказ.', 'Чтобы доставить мебель и выставить счёт.', 'Чтобы отправлять письма о статусе заказа и, с вашего согласия, рассылку.'] },
        { h2: 'Cookie' },
        { p: 'Необходимые cookie работают всегда: корзина, вход, язык. Аналитику и маркетинг включаем только после вашего согласия в баннере.' },
        { h2: 'Ваши права' },
        { p: 'Вы можете запросить копию данных, исправить их или удалить аккаунт в разделе «Профиль» личного кабинета либо написать нам на почту.' },
      ],
      en: [
        { h2: 'What we collect' },
        { p: 'Your name, phone number, email and delivery address — when you place an order, send a request or create an account.' },
        { h2: 'Why we need it' },
        { ul: ['To contact you and confirm your order.', 'To deliver your furniture and invoice you.', 'To send order updates and, with your consent, our newsletter.'] },
        { h2: 'Cookies' },
        { p: 'Essential cookies are always on: basket, sign-in, language. Analytics and marketing are only enabled after you agree in the banner.' },
        { h2: 'Your rights' },
        { p: 'You can request a copy of your data, correct it or delete your account in the Profile section of your account, or email us.' },
      ],
      sr: [
        { h2: 'Koje podatke prikupljamo' },
        { p: 'Ime, telefon, email i adresu za dostavu — kada poručite, pošaljete zahtev ili napravite nalog.' },
        { h2: 'Zašto su nam potrebni' },
        { ul: ['Da vas kontaktiramo i potvrdimo porudžbinu.', 'Da dostavimo nameštaj i izdamo račun.', 'Da šaljemo obaveštenja o porudžbini i, uz vašu saglasnost, bilten.'] },
        { h2: 'Kolačići' },
        { p: 'Neophodni kolačići rade uvek: korpa, prijava, jezik. Analitiku i marketing uključujemo tek kada se saglasite u banneru.' },
        { h2: 'Vaša prava' },
        { p: 'Možete zatražiti kopiju podataka, ispraviti ih ili obrisati nalog u odeljku „Profil” ili nam pisati mejlom.' },
      ],
    },
  },
  {
    key: 'terms',
    legal: true,
    title: { ru: 'Условия продажи', en: 'Terms of sale', sr: 'Uslovi prodaje' },
    intro: {
      ru: 'Как оформляется, оплачивается и доставляется заказ. Черновик: требует проверки юристом.',
      en: 'How orders are placed, paid for and delivered. Draft: requires legal review.',
      sr: 'Kako se porudžbina poručuje, plaća i dostavlja. Nacrt: potrebna je provera pravnika.',
    },
    content: {
      ru: [
        { h2: 'Оформление заказа' },
        { p: 'Заказ на сайте — это заявка. Менеджер подтверждает состав, срок изготовления и способ оплаты по телефону или письмом.' },
        { h2: 'Оплата' },
        { p: 'Оплата по счёту или при получении после подтверждения. Для мебели под заказ возможна предоплата 50 %.' },
        { h2: 'Возврат' },
        { p: 'Товары из наличия можно вернуть в течение 14 дней. Мебель, сделанная по вашим размерам, возврату не подлежит, кроме случаев брака.' },
      ],
      en: [
        { h2: 'Placing an order' },
        { p: 'An order on the website is a request. A manager confirms the items, lead time and payment by phone or email.' },
        { h2: 'Payment' },
        { p: 'Pay by invoice or on delivery once confirmed. Made-to-order pieces may require a 50% deposit.' },
        { h2: 'Returns' },
        { p: 'In-stock items can be returned within 14 days. Furniture made to your measurements can only be returned if faulty.' },
      ],
      sr: [
        { h2: 'Poručivanje' },
        { p: 'Porudžbina na sajtu je zahtev. Menadžer telefonom ili mejlom potvrđuje sastav, rok izrade i način plaćanja.' },
        { h2: 'Plaćanje' },
        { p: 'Plaćanje po računu ili pri preuzimanju, nakon potvrde. Za nameštaj po meri moguć je avans od 50 %.' },
        { h2: 'Povraćaj' },
        { p: 'Proizvode sa lagera možete vratiti u roku od 14 dana. Nameštaj rađen po vašim merama vraća se samo u slučaju greške.' },
      ],
    },
  },
  {
    key: 'delivery',
    legal: true,
    title: { ru: 'Доставка и оплата', en: 'Delivery & payment', sr: 'Dostava i plaćanje' },
    intro: {
      ru: 'Привозим, поднимаем и собираем. Сроки и цены зависят от зоны.',
      en: 'We deliver, carry upstairs and assemble. Times and prices depend on the zone.',
      sr: 'Dostavljamo, unosimo i sklapamo. Rokovi i cene zavise od zone.',
    },
    content: {
      ru: [
        { h2: 'Доставка' },
        { ul: ['По Белграду — 40 €, бесплатно от 1 500 €.', 'По Сербии — 90 €, 3–5 дней после готовности.', 'Самовывоз из шоурума — бесплатно.'] },
        { h2: 'Оплата' },
        { p: 'После подтверждения менеджером: по счёту на юрлицо или физлицо, либо при получении. Онлайн-оплата картой появится позже.' },
        { h2: 'Гарантия' },
        { p: '10 лет на каркас и столярные соединения, 2 года на механизмы и ткани.' },
        { h2: 'Уход' },
        { p: 'Дерево протирайте влажной салфеткой и раз в год обновляйте масло. Чехлы из льна стираются при 30 °C.' },
        { h2: 'Вопросы и ответы' },
        { p: 'Сборку делает наша бригада. Подъём на этаж без лифта стоит 8 € за этаж.' },
      ],
      en: [
        { h2: 'Delivery' },
        { ul: ['Belgrade — €40, free over €1,500.', 'Elsewhere in Serbia — €90, 3–5 days once ready.', 'Showroom pick-up — free.'] },
        { h2: 'Payment' },
        { p: 'Once a manager confirms the order: by invoice (business or private) or on delivery. Online card payment is coming later.' },
        { h2: 'Warranty' },
        { p: '10 years on frames and joinery, 2 years on mechanisms and fabrics.' },
        { h2: 'Care' },
        { p: 'Wipe wood with a damp cloth and refresh the oil once a year. Linen covers wash at 30 °C.' },
        { h2: 'FAQ' },
        { p: 'Our own team handles assembly. Carrying upstairs without a lift costs €8 per floor.' },
      ],
      sr: [
        { h2: 'Dostava' },
        { ul: ['Beograd — 40 €, besplatno od 1.500 €.', 'Ostatak Srbije — 90 €, 3–5 dana nakon izrade.', 'Preuzimanje u šou-rumu — besplatno.'] },
        { h2: 'Plaćanje' },
        { p: 'Nakon potvrde menadžera: po računu za pravna ili fizička lica, ili pri preuzimanju. Online plaćanje karticom stiže kasnije.' },
        { h2: 'Garancija' },
        { p: '10 godina na ramove i spojeve, 2 godine na mehanizme i tkanine.' },
        { h2: 'Održavanje' },
        { p: 'Drvo brišite vlažnom krpom i jednom godišnje obnovite ulje. Lanene presvlake se peru na 30 °C.' },
        { h2: 'Pitanja i odgovori' },
        { p: 'Sklapanje radi naš tim. Unošenje bez lifta košta 8 € po spratu.' },
      ],
    },
  },
  {
    key: 'about',
    title: { ru: 'О нас и производство', en: 'About us & our workshop', sr: 'O nama i proizvodnja' },
    intro: {
      ru: 'Мы проектируем и делаем мебель в собственном цехе в Белграде с 2016 года.',
      en: 'We have been designing and making furniture in our own Belgrade workshop since 2016.',
      sr: 'Od 2016. projektujemo i pravimo nameštaj u sopstvenoj radionici u Beogradu.',
    },
  },
  {
    key: 'custom',
    title: { ru: 'Мебель на заказ', en: 'Made to measure', sr: 'Nameštaj po meri' },
    intro: {
      ru: 'Ваши размеры, ваша ткань и отделка. Дизайнер ведёт заказ от эскиза до сборки.',
      en: 'Your dimensions, your fabric and finish. A designer guides the order from sketch to assembly.',
      sr: 'Vaše mere, vaša tkanina i obrada. Dizajner vodi porudžbinu od skice do sklapanja.',
    },
  },
  {
    key: 'contact',
    title: { ru: 'Контакты и шоурум', en: 'Contact & showroom', sr: 'Kontakt i šou-rum' },
    intro: {
      ru: 'Приходите посидеть на диванах и потрогать ткани — или напишите нам.',
      en: 'Come and sit on the sofas and feel the fabrics — or drop us a line.',
      sr: 'Dođite da sednete na sofe i dodirnete tkanine — ili nam pišite.',
    },
  },
]

export const productionSteps: Array<{ title: T3; text: T3; color: 'lavender' | 'pistachio' | 'blush' | 'mist' | 'sand' | 'plum' }> = [
  {
    title: { ru: 'Эскиз', en: 'Sketch', sr: 'Skica' },
    text: {
      ru: 'Дизайнер рисует предмет, проверяет пропорции на макете 1:5 и считает нагрузки.',
      en: 'The designer draws the piece, checks proportions on a 1:5 model and calculates loads.',
      sr: 'Dizajner crta predmet, proverava proporcije na maketi 1:5 i računa opterećenja.',
    },
    color: 'lavender',
  },
  {
    title: { ru: 'Материалы', en: 'Materials', sr: 'Materijali' },
    text: {
      ru: 'Выбираем доски вручную, сушим дерево и подбираем ткани у европейских фабрик.',
      en: 'We hand-pick boards, dry the timber and source fabrics from European mills.',
      sr: 'Ručno biramo daske, sušimo drvo i nabavljamo tkanine iz evropskih fabrika.',
    },
    color: 'pistachio',
  },
  {
    title: { ru: 'Цех', en: 'Workshop', sr: 'Radionica' },
    text: {
      ru: 'Столяры собирают каркас на шипах и клею — без лишних саморезов.',
      en: 'Our joiners assemble frames with tenons and glue — no unnecessary screws.',
      sr: 'Stolari sklapaju ramove čepovima i lepkom — bez suvišnih šrafova.',
    },
    color: 'plum',
  },
  {
    title: { ru: 'Отделка', en: 'Finishing', sr: 'Obrada' },
    text: {
      ru: 'Масло с воском в три слоя, обивка и пошив чехлов в нашем ателье.',
      en: 'Three coats of hardwax oil, upholstery and covers sewn in our own studio.',
      sr: 'Tri sloja ulja sa voskom, tapaciranje i šivenje presvlaka u našem ateljeu.',
    },
    color: 'blush',
  },
  {
    title: { ru: 'Доставка', en: 'Delivery', sr: 'Dostava' },
    text: {
      ru: 'Привозим своей командой, поднимаем, собираем и забираем упаковку.',
      en: 'Our own team delivers, carries upstairs, assembles and takes the packaging away.',
      sr: 'Naš tim dostavlja, unosi, sklapa i odnosi ambalažu.',
    },
    color: 'mist',
  },
]

export const customSteps: Array<{ title: T3; text: T3 }> = [
  {
    title: { ru: 'Заявка', en: 'Request', sr: 'Zahtev' },
    text: { ru: 'Расскажите, что нужно, и приложите фото или план комнаты.', en: 'Tell us what you need and attach photos or a floor plan.', sr: 'Recite nam šta vam treba i priložite fotografije ili plan sobe.' },
  },
  {
    title: { ru: 'Встреча с дизайнером', en: 'Meet the designer', sr: 'Sastanak sa dizajnerom' },
    text: { ru: 'В шоуруме или по видео: выбираем ткань, отделку и уточняем размеры.', en: 'In the showroom or on video: we choose fabrics and finishes and confirm the size.', sr: 'U šou-rumu ili putem videa: biramo tkaninu, obradu i potvrđujemo mere.' },
  },
  {
    title: { ru: 'Эскиз и смета', en: 'Sketch & quote', sr: 'Skica i ponuda' },
    text: { ru: 'За 3–5 дней присылаем чертёж, 3D-вид и точную цену.', en: 'Within 3–5 days we send a drawing, a 3D view and an exact price.', sr: 'Za 3–5 dana šaljemo crtež, 3D prikaz i tačnu cenu.' },
  },
  {
    title: { ru: 'Производство', en: 'Production', sr: 'Izrada' },
    text: { ru: '4–8 недель в нашем цехе, с фотоотчётом по этапам.', en: '4–8 weeks in our workshop, with progress photos along the way.', sr: '4–8 nedelja u našoj radionici, uz foto-izveštaje po fazama.' },
  },
  {
    title: { ru: 'Доставка и сборка', en: 'Delivery & assembly', sr: 'Dostava i sklapanje' },
    text: { ru: 'Привозим и собираем, оставляем инструкцию по уходу.', en: 'We deliver, assemble and leave you a care guide.', sr: 'Dostavljamo, sklapamo i ostavljamo uputstvo za održavanje.' },
  },
]

export const customFaq: Array<{ q: T3; a: T3 }> = [
  {
    q: { ru: 'Сколько стоит индивидуальный заказ?', en: 'How much does a custom piece cost?', sr: 'Koliko košta nameštaj po meri?' },
    a: {
      ru: 'Обычно на 10–25 % дороже модели из каталога. Точную цену называем после эскиза.',
      en: 'Usually 10–25% more than the catalogue model. We give an exact price after the sketch.',
      sr: 'Obično 10–25 % više od modela iz kataloga. Tačnu cenu dajemo posle skice.',
    },
  },
  {
    q: { ru: 'Можно ли привезти свою ткань?', en: 'Can I bring my own fabric?', sr: 'Mogu li da donesem svoju tkaninu?' },
    a: {
      ru: 'Да, если она подходит для обивки по износостойкости. Проверим образец бесплатно.',
      en: 'Yes, if it is durable enough for upholstery. We test a sample for free.',
      sr: 'Da, ako je dovoljno izdržljiva za tapaciranje. Uzorak proveravamo besplatno.',
    },
  },
  {
    q: { ru: 'Вы работаете с дизайнерами интерьера?', en: 'Do you work with interior designers?', sr: 'Da li radite sa dizajnerima enterijera?' },
    a: {
      ru: 'Да, у нас партнёрская программа и отдельные условия для студий.',
      en: 'Yes — we have a partner programme with special terms for studios.',
      sr: 'Da, imamo partnerski program sa posebnim uslovima za studije.',
    },
  },
]

export const productFaq: Array<{ q: T3; a: T3 }> = [
  {
    q: { ru: 'Сколько стоит доставка?', en: 'How much is delivery?', sr: 'Koliko košta dostava?' },
    a: {
      ru: 'По Белграду — 40 €, бесплатно от 1 500 €. По Сербии — 90 €. Точную сумму покажем при оформлении.',
      en: 'Belgrade €40, free over €1,500. Elsewhere in Serbia €90. You’ll see the exact amount at checkout.',
      sr: 'Beograd 40 €, besplatno od 1.500 €. Ostatak Srbije 90 €. Tačan iznos videćete pri poručivanju.',
    },
  },
  {
    q: { ru: 'Кто собирает мебель?', en: 'Who assembles the furniture?', sr: 'Ko sklapa nameštaj?' },
    a: {
      ru: 'Наша бригада. Сборка — 45 €, подъём на лифте — 20 €, без лифта — 8 € за этаж.',
      en: 'Our own team. Assembly is €45; carrying up by lift €20, without a lift €8 per floor.',
      sr: 'Naš tim. Sklapanje je 45 €; unošenje liftom 20 €, bez lifta 8 € po spratu.',
    },
  },
  {
    q: { ru: 'Какая гарантия?', en: 'What is the warranty?', sr: 'Kolika je garancija?' },
    a: {
      ru: '10 лет на каркас и соединения, 2 года на ткани и механизмы.',
      en: '10 years on frames and joints, 2 years on fabrics and mechanisms.',
      sr: '10 godina na ramove i spojeve, 2 godine na tkanine i mehanizme.',
    },
  },
  {
    q: { ru: 'Можно ли изменить размер?', en: 'Can the size be changed?', sr: 'Može li se promeniti dimenzija?' },
    a: {
      ru: 'Да, большинство моделей делаем по вашим размерам с шагом 5 см — оставьте заявку «Нужен другой размер?».',
      en: 'Yes, most models can be made to your size in 5 cm steps — use “Need a different size?”.',
      sr: 'Da, većinu modela pravimo po vašoj meri u koracima od 5 cm — pošaljite zahtev „Treba vam druga dimenzija?”.',
    },
  },
]
