# Pixel Lab · 影像分析實驗室

線上展示：https://pixel-lab-yan-ting-142.yanruyu0608.chatgpt.site

GitHub Pages：https://shanksace.github.io/pixel-lab/

公開原始碼：https://github.com/ShanksAce/pixel-lab

互動式影像處理與人臉分析期中專題。四大核心功能皆在瀏覽器執行，沒有圖片上傳 API，也不收集影像。

## 開始使用

安裝 Node.js 18 以上，在本目錄執行：

```sh
npm start
```

開啟 http://127.0.0.1:4173 。無須 npm install。也可用 Python 3.9+ 執行 `python -m http.server 4173 --directory dist`。

## 功能

- PNG、JPEG、BMP 解碼與 metadata；拖曳載入、20 MB 限制、長邊 1600 px 等比例縮圖。
- Original、R/G/B、Y/U/V 灰階通道與 256-bin 同步直方圖。
- 1–15 階奇數自訂方陣、JSON / 文字矩陣、6 組預設、正規化、bias、reflect101 / replicate 邊界。
- 180° 翻轉卷積核的數學卷積；Web Worker 運算；RGB MSE / PSNR；前後比較與 PNG 匯出。
- face-api.js 0.22.2 Tiny Face Detector，模型隨網站提供；信心門檻、320/416/608 輸入，數量、方框、分數及 JSON 匯出。

## 驗證

```sh
npm test
```

19 項 Node.js 原生測試（15 項數值、2 項介面、2 項載入狀態）覆蓋已知數值、直方圖總量、非對稱卷積、邊界與防呆。
`verify.html` 提供 15 項瀏覽器回歸測試；其中兩項人臉狀態測試使用替身模型，真實模型另外實測。詳見 `docs/VALIDATION.md`。測試工具無額外套件。

## 檔案

- `dist/core.mjs`：可獨立測試的數值演算法。
- `dist/app.mjs`：影像載入、互動、直方圖與推論整合。
- `dist/filter-worker.mjs`：背景卷積工作程序。
- `dist/models/`：Tiny Face Detector 模型檔。
- `dist/vendor/`：固定版函式庫及 MIT 授權。
- `dist/guide.html`：操作、公式及限制。
- `docs/AI_AUDIT_TRAIL.md`：實際使用者指令與代理內部調整紀錄，兩者明確區分。

## 環境與相依性

本專題使用 JavaScript ES modules / HTML / CSS；Python 為可選靜態伺服器，不是影像運算相依。
face-api.js 0.22.2（含 TensorFlow.js）已放入 vendor；Node.js 為本機啟動與測試工具。無 pip 套件，requirements.txt 註明此事，避免誤導。

## 部署

`dist/` 可直接部署至靜態主機。`.github/workflows/pages.yml` 提供 GitHub Pages Actions 部署，需於 repository Settings → Pages → Build and deployment 選擇 GitHub Actions。
所有資產使用相對路徑，支援 repository Pages 子路徑。不可直接以 file:// 開啟，ES modules / Worker / 模型須透過 HTTP(S)。

## 精度與限制

YUV 定義：Y=.299R+.587G+.114B，U=.492(B−Y)+128，V=.877(R−Y)+128；取整裁切為 8 bit，並非 YCbCr，也非 4:2:0。
PSNR 以運算尺寸的原圖 RGB 與濾波後裁切取整的 RGB 比較，alpha 不納入；MSE=0 時為 Infinity。RGB 計算在 sRGB 編碼值上，沒有線性化。
瀏覽器解碼為 RGBA，不宣稱可還原原始檔案儲存的色深與通道。縮圖、色彩管理與瀏覽器字型可能使數值略有差異。
人臉分數非校準機率；無法保證找出所有臉。608 / 0.70 在附帶四人範例找到 4 張；416 / 0.50 找到 3 張；608 / 0.30 找到 6 張（含 2 個誤檢）。此單張案例並非通用準確率。

## 來源及授權

face-api.js / 模型：https://github.com/justadudewhohacks/face-api.js （MIT，詳見 `dist/vendor/face-api-LICENSE.txt`）。
多人臉範例：同一專案 `examples/images/bbt1.jpg`，是影視畫面測試素材，僅供教學驗證；不宣稱擁有其影像著作權。
自製色彩測試圖於程式中即時繪製。
自撰程式以 MIT 授權，見 LICENSE。若改作商業用途，請改用有適當授權的測試照片。



## 最後複核改善（2026-11-07）

快速切換圖片採最後選擇優先；改動參數即清除舊 PSNR／人臉結果，過期運算不套用。人臉 JSON 包含實際 threshold、inputSize、原始與運算尺寸。沒有新增相依套件。
