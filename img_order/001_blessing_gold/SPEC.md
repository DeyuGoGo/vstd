# 工單 001 — 貪婪之月（Gold Blessing Icon）

## 用途

戰鬥中升級時的「祝福卡片」icon。屬於六種 active 祝福之一，目前其他五張已完成，僅缺這張。

## 規格

| 項目 | 值 |
|------|-----|
| **檔名** | `gold.png` |
| **尺寸** | 256 × 256 px |
| **格式** | PNG，8-bit RGBA（含透明背景或深色底皆可，會被裁進圓角方框） |
| **交付路徑** | `app/public/img/blessings/gold.png` |
| **顯示尺寸** | 實際 UI 顯示 82 × 82 圓角方塊（`object-fit: cover`），所以**主要視覺請集中在中央 70%**，邊緣會被裁切 |

## 風格參考

請參考 `references/` 資料夾內現有的五張祝福 icon（arcane / haste / crit / crystal / echo / aura），保持同系列統一風格：

- 暗色奇幻基調，紫黑色背景
- 中央放置主體物件（寶珠 / 心 / 眼 / 沙漏 等等），帶發光效果
- 飽和度偏中高，光暈強烈
- 整體偏「神秘 / 魔法道具」感

## 內容方向（可自由發揮）

主題為**「貪婪之月（金幣加成 +25%）」**，建議元素：

- 月亮（殘月 / 滿月）+ 金幣 / 寶箱 / 金塊 的組合
- 主色調：金黃 `#f5c95c`（這是程式裡這張卡的 tint 顏色，讓視覺光暈與卡片 UI 呼應）
- 可以加金屬反光、星塵、月光灑落等細節

## 交付方式

把畫好的 `gold.png` 直接放到 `app/public/img/blessings/gold.png`，並回報一聲即可，工程那邊會掛上 `art` 欄位。

掛載後的程式碼修改會是：

```ts
// app/src/battle/data/blessings.ts
{
  id: 'gold', name: '貪婪之月',
  desc: '金幣獲取提升 ', desc2: '',
  val: '25%', glyph: 'coin',
  art: 'img/blessings/gold.png',   // ← 新增這行
  tint: '#f5c95c',
  active: true,
  apply: (m) => { m.goldGainMul *= 1.25; },
},
```
