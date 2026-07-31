#!/usr/bin/env bash
set -euo pipefail

OLD="https://nsb-ruby.vercel.app"
PUBLIC_DOMAIN="https://nsb-ruby-mographiccode.vercel.app"
ASSET_VERSION="20260731-balanced-v1"

rm -rf public
mkdir -p public/ar public/assets \
  public/images/nextImageExportOptimizer \
  public/images/services/nextImageExportOptimizer \
  public/images/portfolio/nextImageExportOptimizer \
  public/images/partners/nextImageExportOptimizer \
  public/images/companies/nextImageExportOptimizer

cp ar/index.html public/ar/index.html
cp assets/styles.css assets/app.js public/assets/
sed -i "s#/assets/styles.css#/assets/styles.css?v=${ASSET_VERSION}#; s#/assets/app.js#/assets/app.js?v=${ASSET_VERSION}#" public/ar/index.html

fetch(){ curl --fail --silent --show-error --location --retry 3 --retry-delay 1 "$1" -o "$2"; }

for name in hero-opt-1200.WEBP about-opt-1200.WEBP logo-opt-384.WEBP logo-white-opt-384.WEBP; do
  fetch "$OLD/images/nextImageExportOptimizer/$name" "public/images/nextImageExportOptimizer/$name"
done

for n in 1 3 4 5; do
  fetch "$OLD/images/services/nextImageExportOptimizer/${n}-opt-1200.WEBP" "public/images/services/nextImageExportOptimizer/${n}-opt-1200.WEBP"
done

for n in $(seq 1 11); do
  fetch "$OLD/images/portfolio/nextImageExportOptimizer/${n}-opt-1200.WEBP" "public/images/portfolio/nextImageExportOptimizer/${n}-opt-1200.WEBP"
done

partner_sizes=(128 256 256 256 128 256 256 256 256 256 256 128 256 384 384)
for i in $(seq 1 15); do
  s=${partner_sizes[$((i-1))]}
  fetch "$OLD/images/partners/nextImageExportOptimizer/${i}-opt-${s}.WEBP" "public/images/partners/nextImageExportOptimizer/${i}-opt-${s}.WEBP"
done

company_sizes=(256 256 256 256 128 256)
for i in $(seq 1 6); do
  s=${company_sizes[$((i-1))]}
  fetch "$OLD/images/companies/nextImageExportOptimizer/${i}-opt-${s}.WEBP" "public/images/companies/nextImageExportOptimizer/${i}-opt-${s}.WEBP"
done

cat > public/index.html <<'HTML'
<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=/ar/"><title>نسب العقارية</title><link rel="canonical" href="/ar/"></head><body><script>location.replace('/ar/')</script><a href="/ar/">الانتقال إلى الموقع العربي</a></body></html>
HTML

cat > public/404.html <<'HTML'
<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>الصفحة غير موجودة | نسب</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;text-align:center;background:#202a30;color:#fff;font-family:Arial,sans-serif}a{color:#d1ba35}</style></head><body><main><h1>404</h1><p>الصفحة المطلوبة غير موجودة.</p><a href="/ar/">العودة إلى الموقع</a></main></body></html>
HTML

cat > public/robots.txt <<TXT
User-agent: *
Allow: /
Sitemap: ${PUBLIC_DOMAIN}/sitemap.xml
TXT

cat > public/sitemap.xml <<XML
<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${PUBLIC_DOMAIN}/ar/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url></urlset>
XML

find public -type f -size 0 -print -quit | grep -q . && { echo "Empty asset detected" >&2; exit 1; } || true
