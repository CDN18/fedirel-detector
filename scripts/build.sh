#!/bin/bash
if ! command -v jq &> /dev/null; then
    echo "jq not found, please install jq first"
    exit 1
fi

rm -rf dist
mkdir -p dist/chrome
mkdir -p dist/firefox

cp background.js dist/chrome/
cp background.js dist/firefox/
cp content.js dist/chrome/
cp content.js dist/firefox/
cp -r icons dist/chrome/
cp -r icons dist/firefox/

# Chrome
cp manifest.json dist/chrome/
cd dist/chrome
zip -r ../fedirel-detector-chrome.zip .
cd ../..

# Firefox
jq -s '.[0] * .[1]' manifest.json manifest.firefox.json > dist/firefox/manifest.json
jq 'del(.background.service_worker)' dist/firefox/manifest.json > dist/firefox/manifest-tmp.json
mv dist/firefox/manifest-tmp.json dist/firefox/manifest.json
cd dist/firefox
zip -r ../fedirel-detector-firefox.zip .
cd ../..

echo "Build completed."