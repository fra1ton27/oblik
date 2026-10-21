/**
 * Кегль, при котором самое длинное слово заголовка помещается в ширину контейнера
 * (контейнер с container-type: inline-size). ratio — средняя ширина символа в em:
 * у Unbounded строчная кириллица ≈ 0,77, поэтому по умолчанию 0,8 с запасом.
 * Длинные русские слова («конфиденциальности») иначе рвутся посреди слова на 360 px.
 */
export function fitToLongestWord(text: string, base: string, ratio = 0.8): React.CSSProperties {
  const longest = Math.max(4, ...text.split(/\s+/).map((w) => w.length))
  return { fontSize: `min(${base}, calc(100cqi / ${longest} / ${ratio}))` }
}
