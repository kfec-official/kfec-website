"""kfec_logo.png(프로젝트 루트)로부터 웹용 로고 파일을 생성합니다.
사용법: python3 scripts/make-logos.py   (Pillow 필요: pip install pillow)
"""
from PIL import Image

NAVY = (6, 55, 123)
src = Image.open("kfec_logo.png").convert("RGBA")
full = src.crop(src.getbbox())

def recolor(img, rgb):
    out = Image.new("RGBA", img.size, rgb + (0,))
    out.putalpha(img.getchannel("A"))
    return out

# 워드마크(KFEC 글자만): 첫 번째 가로 덩어리
a = full.getchannel("A")
rows = [y for y in range(full.height) if a.crop((0, y, full.width, y + 1)).getbbox()]
end = rows[0]
for y in rows[1:]:
    if y != end + 1:
        break
    end = y
mark = full.crop((0, 0, full.width, end + 1))
mark = mark.crop(mark.getbbox())

def save(img, name, height=None):
    if height:
        img = img.resize((round(img.width * height / img.height), height), Image.LANCZOS)
    img.save(f"public/images/{name}", optimize=True)

save(recolor(full, NAVY), "kfec-logo.png", 400)
save(recolor(full, (255, 255, 255)), "kfec-logo-white.png", 400)
save(recolor(mark, NAVY), "kfec-mark.png", 120)
save(recolor(mark, (255, 255, 255)), "kfec-mark-white.png", 120)

# Open Graph 이미지 1200x630 (남색 배경 + 흰색 로고)
og = Image.new("RGB", (1200, 630), NAVY)
w = recolor(full, (255, 255, 255))
w = w.resize((760, round(w.height * 760 / w.width)), Image.LANCZOS)
og.paste(w, ((1200 - w.width) // 2, (630 - w.height) // 2), w)
og.save("public/og-image.png", optimize=True)

# 파비콘 / 앱 아이콘
for size, name in [(512, "icon-512.png"), (180, "apple-touch-icon.png"), (48, "favicon.png")]:
    ic = Image.new("RGB", (size, size), NAVY)
    m = recolor(mark, (255, 255, 255))
    mw = round(size * 0.8)
    m = m.resize((mw, round(m.height * mw / m.width)), Image.LANCZOS)
    ic.paste(m, ((size - m.width) // 2, (size - m.height) // 2), m)
    ic.save(f"public/{name}", optimize=True)
print("done")
