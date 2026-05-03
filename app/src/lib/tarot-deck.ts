import type { TarotCard } from '@/types/session';

/**
 * 22 张大阿尔卡那。V1 不放真实牌面图，用 SVG 文字卡片占位（DESIGN §5.5 决定）。
 * 泰语牌名沿用泰国塔罗社群常用译法。
 *
 * TODO: 上线前请泰国本地塔罗顾问校对 nameTh / keywordsTh。
 */
export const TAROT_DECK: TarotCard[] = [
  { id: 'major-00-fool', nameEn: 'The Fool', nameTh: 'คนโง่', arcana: 'major',
    keywordsTh: ['การเริ่มต้น', 'อิสระ', 'ความไร้เดียงสา'], symbol: '✦' },
  { id: 'major-01-magician', nameEn: 'The Magician', nameTh: 'นักมายากล', arcana: 'major',
    keywordsTh: ['ความเป็นไปได้', 'พลัง', 'การลงมือ'], symbol: '✧' },
  { id: 'major-02-high-priestess', nameEn: 'The High Priestess', nameTh: 'นักบวชหญิง', arcana: 'major',
    keywordsTh: ['ปัญญาญาณ', 'ความเงียบ', 'การฟังตัวเอง'], symbol: '☽' },
  { id: 'major-03-empress', nameEn: 'The Empress', nameTh: 'จักรพรรดินี', arcana: 'major',
    keywordsTh: ['การหล่อเลี้ยง', 'ความอุดม', 'ความอ่อนโยน'], symbol: '♀' },
  { id: 'major-04-emperor', nameEn: 'The Emperor', nameTh: 'จักรพรรดิ', arcana: 'major',
    keywordsTh: ['ความมั่นคง', 'การปกป้อง', 'ขอบเขต'], symbol: '♂' },
  { id: 'major-05-hierophant', nameEn: 'The Hierophant', nameTh: 'ครูศักดิ์สิทธิ์', arcana: 'major',
    keywordsTh: ['ขนบ', 'การชี้แนะ', 'ความศรัทธา'], symbol: '☥' },
  { id: 'major-06-lovers', nameEn: 'The Lovers', nameTh: 'คู่รัก', arcana: 'major',
    keywordsTh: ['ความสัมพันธ์', 'การเลือก', 'ความผูกพัน'], symbol: '♡' },
  { id: 'major-07-chariot', nameEn: 'The Chariot', nameTh: 'รถม้าศึก', arcana: 'major',
    keywordsTh: ['ความตั้งใจ', 'การเดินหน้า', 'ชัยชนะ'], symbol: '⇈' },
  { id: 'major-08-strength', nameEn: 'Strength', nameTh: 'พลัง', arcana: 'major',
    keywordsTh: ['ความอดทน', 'พลังในใจ', 'ความนุ่มนวล'], symbol: '∞' },
  { id: 'major-09-hermit', nameEn: 'The Hermit', nameTh: 'นักพรต', arcana: 'major',
    keywordsTh: ['ความสันโดษ', 'การหาตัวเอง', 'แสงเล็ก ๆ'], symbol: '✦' },
  { id: 'major-10-wheel', nameEn: 'Wheel of Fortune', nameTh: 'วงล้อโชคชะตา', arcana: 'major',
    keywordsTh: ['การหมุนเวียน', 'จังหวะ', 'การเปลี่ยน'], symbol: '◯' },
  { id: 'major-11-justice', nameEn: 'Justice', nameTh: 'ความยุติธรรม', arcana: 'major',
    keywordsTh: ['ความสมดุล', 'ความจริง', 'ความรับผิดชอบ'], symbol: '⚖' },
  { id: 'major-12-hanged-man', nameEn: 'The Hanged Man', nameTh: 'คนถูกแขวน', arcana: 'major',
    keywordsTh: ['การหยุด', 'มุมมองใหม่', 'การปล่อย'], symbol: '⊥' },
  { id: 'major-13-death', nameEn: 'Death', nameTh: 'ความตาย', arcana: 'major',
    keywordsTh: ['การจบ', 'การเปลี่ยนผ่าน', 'การปลด'], symbol: '☥' },
  { id: 'major-14-temperance', nameEn: 'Temperance', nameTh: 'การประมาณตน', arcana: 'major',
    keywordsTh: ['ความสมดุล', 'ความนุ่มนวล', 'การผสาน'], symbol: '∿' },
  { id: 'major-15-devil', nameEn: 'The Devil', nameTh: 'ปีศาจ', arcana: 'major',
    keywordsTh: ['การยึดติด', 'เงา', 'ความกลัว'], symbol: '✦' },
  { id: 'major-16-tower', nameEn: 'The Tower', nameTh: 'หอคอย', arcana: 'major',
    keywordsTh: ['การสะเทือน', 'การพังทลาย', 'การเปิดเผย'], symbol: '⊙' },
  { id: 'major-17-star', nameEn: 'The Star', nameTh: 'ดวงดาว', arcana: 'major',
    keywordsTh: ['ความหวัง', 'การเยียวยา', 'แสงเงียบ'], symbol: '★' },
  { id: 'major-18-moon', nameEn: 'The Moon', nameTh: 'ดวงจันทร์', arcana: 'major',
    keywordsTh: ['ความไม่ชัดเจน', 'ความรู้สึก', 'ความฝัน'], symbol: '☾' },
  { id: 'major-19-sun', nameEn: 'The Sun', nameTh: 'ดวงอาทิตย์', arcana: 'major',
    keywordsTh: ['ความสว่าง', 'ความสุข', 'การมีชีวิต'], symbol: '☀' },
  { id: 'major-20-judgement', nameEn: 'Judgement', nameTh: 'การพิพากษา', arcana: 'major',
    keywordsTh: ['การเรียก', 'การฟื้น', 'การให้อภัย'], symbol: '☥' },
  { id: 'major-21-world', nameEn: 'The World', nameTh: 'โลก', arcana: 'major',
    keywordsTh: ['ความเต็ม', 'การปิดวง', 'ความรวมเป็นหนึ่ง'], symbol: '◉' },
];

export function drawRandomCard(): TarotCard {
  const idx = Math.floor(Math.random() * TAROT_DECK.length);
  return TAROT_DECK[idx];
}

export function findCard(id: string): TarotCard | undefined {
  return TAROT_DECK.find((c) => c.id === id);
}
