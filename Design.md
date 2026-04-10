> このファイルはAIエージェントが正確な日本語UIを生成するためのデザイン仕様書です。
> セクションヘッダーは英語、値の説明は日本語で記述しています。

---

## 1. Visual Theme & Atmosphere
- **デザイン方針**: クリーン、プロフェッショナル、信頼感
- **密度**: 情報密度が高く、一覧性の良い業務UI
- **キーワード**: シンプル、実用的、モダンSaaS

---

## 2. Color Palette & Roles

### Primary（ブランドカラー）
- **Primary** (`#2563EB`): メインのブランドカラー。CTAボタン、リンク等に使用 (Blue 600)
- **Primary Dark** (`#1D4ED8`): ホバー・プレス時のプライマリカラー (Blue 700)

### Semantic（意味的な色）
- **Danger** (`#EF4444`): エラー、削除、危険な操作
- **Warning** (`#F59E0B`): 警告、注意喚起
- **Success** (`#10B981`): 成功、完了

### Neutral（ニュートラル）
- **Text Primary** (`#1E293B`): 本文テキスト (Slate 800)
- **Text Secondary** (`#64748B`): 補足テキスト、ラベル (Slate 500)
- **Text Disabled** (`#94A3B8`): 無効状態のテキスト (Slate 400)
- **Border** (`#E2E8F0`): 区切り線、入力欄の枠 (Slate 200)
- **Background** (`#F8FAFC`): ページ全体背景 (Slate 50)
- **Surface** (`#FFFFFF`): カード、モーダル等の面 (White)

---

## 3. Typography Rules

### 3.1 和文フォント
- **ゴシック体**: "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Meiryo"

### 3.2 欧文フォント
- **サンセリフ**: "Inter", "Helvetica Neue", "Arial"

### 3.3 font-family 指定
```css
/* 本文 */
font-family: "Inter", "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Meiryo", sans-serif;

/* 等幅 */
font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
```

### 3.4 文字サイズ・ウェイト階層
| Role | Font | Size | Weight | Line Height | Letter Spacing | 備考 |
|------|------|------|--------|-------------|----------------|------|
| Display | — | 32px | 700 | 1.3 | 0.02em | ページタイトル等 |
| Heading 1 | — | 24px | 700 | 1.4 | 0.02em | セクション見出し |
| Heading 2 | — | 20px | 600 | 1.4 | 0 | サブ見出し |
| Heading 3 | — | 16px | 600 | 1.5 | 0 | 小見出し |
| Body | — | 14px | 400 | 1.6 | 0.04em | 本文 |
| Caption | — | 12px | 400 | 1.5 | 0.04em | 補足、注釈 |
| Small | — | 11px | 400 | 1.5 | 0.05em | 最小テキスト |

### 3.5 行間・字間
- **本文の行間 (line-height)**: 1.6
- **見出しの行間**: 1.3 - 1.4
- **本文の字間 (letter-spacing)**: 0.04em
- **見出しの字間**: 0.02em

### 3.6 禁則処理・改行ルール
```css
word-break: break-all;
overflow-wrap: break-word;
line-break: strict;
```

### 3.7 OpenType 機能
```css
font-feature-settings: "palt" 1;
```

---

## 4. Component Stylings

### Buttons
**Primary**
- Background: `#2563EB`
- Text: `#FFFFFF`
- Padding: 8px 16px
- Border Radius: 6px
- Font Size: 14px
- Font Weight: 500

**Secondary**
- Background: `#FFFFFF`
- Text: `#1E293B`
- Border: 1px solid `#E2E8F0`
- Padding: 8px 16px
- Border Radius: 6px

### Cards
- Background: `#FFFFFF`
- Border: 1px solid `#E2E8F0`
- Border Radius: 8px
- Padding: 24px
- Shadow: `0 1px 3px rgba(0,0,0,0.1)`

---

## 5. Spacing System
| Token | Value |
|-------|-------|
| XS | 4px |
| S | 8px |
| M | 16px |
| L | 24px |
| XL | 32px |
| XXL | 48px |

## 6. Depth & Elevation
| Level | Shadow | 用途 |
|-------|--------|------|
| 0 | none | フラットな要素 |
| 1 | `0 1px 3px rgba(0,0,0,0.1)` | カード、ボタン |
| 2 | `0 4px 6px rgba(0,0,0,0.1)` | ドロップダウン |
| 3 | `0 10px 15px rgba(0,0,0,0.1)` | モーダル、ポップオーバー |

---

## 7. Do's and Don'ts
### Do（推奨）
- 視認性の高いクリーンなレイアウトを維持する。
- 階層構造はボーダーや薄い影（Level 1）で表現する。

### Don't（禁止）
- 派手なグラデーションや光沢（Glow/Glassmorphism）を使用しない（AIチックなUIを避けるため）。
- 黒背景（Darkモード）をデフォルトとしない。明るく清潔感のある画面にする。

---

## 8. Breakpoints
| Name | Width | 説明 |
|------|-------|------|
| Mobile | ≤ 768px | モバイルレイアウト |
| Desktop | > 768px | デスクトップレイアウト |
