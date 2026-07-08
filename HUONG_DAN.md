# Chi Tieu Chung — Huong dan cai dat

## Buoc 1: Tao Google Sheet + Apps Script (mat 3 phut)

1. Mo [sheets.google.com](https://sheets.google.com) -> Tao sheet moi
   - Dat ten: `Chi Tieu Chung`
   - **Khong can sua gi trong sheet** — script tu dong tao du lieu

2. Vao menu **Extensions -> Apps Script**
   - Xoa code cu, copy noi dung file `AppsScript.gs` vao
   - Ctrl+S -> dat ten project: `ChiTieuAPI`

3. Deploy:
   - Click **Deploy -> New deployment**
   - Chon **Web app**
   - Description: `Chi tieu chung API`
   - **Execute as:** Me
   - **Who has access:** Anyone
   - Click **Deploy**
   - **Copy URL** (dang: `https://script.google.com/macros/s/.../exec`)

## Buoc 2: Cap nhat file index.html

1. Mo `index.html` bang text editor
2. Tim dong: `const SHEET_URL = '';`
3. Dan URL vua copy vao: `const SHEET_URL = 'https://script.google.com/macros/s/.../exec';`
4. Luu file

## Buoc 3: Up len GitHub Pages (de 2 nguoi cung truy cap)

### Cach 1: Git command line
```bash
cd ~/Desktop/chitieu/
git init
git add index.html
git commit -m "add chitieu app"
# Tao repo moi tren github.com -> copy URL
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

Sau do:
- Vao repo tren github.com -> Settings -> Pages
- Source: `main`, folder: `/ (root)`
- **Luu y:** Neu token khong du quyen, vao Settings -> Pages bang tay chon branch main
- Sau 1-2 phut, web se co URL: `https://USERNAME.github.io/REPO/`

### Cach 2: Gui file truc tiep
Neu khong muon GitHub, co the:
- Gui file `index.html` cho Vy qua Zalo/Telegram
- Vy mo bang **Coc Coc** (hoac Chrome)
- Nhung luc mo se la `file://` -> **Khong doc duoc Google Sheet** (CORS)
- Chi xem duoc data trong localstorage

## Luu y:
- Ca 2 nguoi cung mo **cung 1 URL** -> cung 1 database
- Ai them/sua/xoa -> sheet thay doi -> load lai la thay
- **Neu bi loi CORS khi fetch sheet:** thu mo bang Chrome/Coc Coc, khong dung file://
