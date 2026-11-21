const puppeteer = require('C:/Users/Kathik/AppData/Roaming/npm/node_modules/puppeteer');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Kathik/.gemini/antigravity/brain/47c47b66-34f1-4d0f-bf6b-e84f7d303de4';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function verify() {
  console.log('Launching Chrome for Hero Wellbeing Refinement verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  const viewports = [
    { name: 'mobile-360', width: 360, height: 800 },
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'mobile-430', width: 430, height: 932 },
    { name: 'ipad-768', width: 768, height: 1024 },
    { name: 'ipad-1024', width: 1024, height: 768 },
    { name: 'desktop-1440', width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    console.log(`\n=== Testing ${vp.name} (${vp.width}x${vp.height}) ===`);
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    const audit = await page.evaluate(() => {
      const isDesktop = window.innerWidth >= 1280;
      const heroSection = document.getElementById('home');
      const videoEl = isDesktop
        ? document.querySelector('#home .hidden.xl\\:flex video')
        : document.querySelector('#home .flex.xl\\:hidden video');

      const videoShape = isDesktop
        ? document.querySelector('#home .hidden.xl\\:flex .w-\\[54\\%\\]')
        : document.querySelector('#home .flex.xl\\:hidden .rounded-b-\\[56px\\], #home .flex.xl\\:hidden .rounded-b-\\[72px\\], #home .flex.xl\\:hidden .rounded-b-\\[80px\\]');

      const heading = isDesktop
        ? document.querySelector('#home .hidden.xl\\:flex h1')
        : document.querySelector('#home .flex.xl\\:hidden h1');

      const overlay = isDesktop
        ? null
        : document.querySelector('#home .flex.xl\\:hidden .bg-gradient-to-b');

      const supportingText = isDesktop
        ? document.querySelector('#home .hidden.xl\\:flex p')
        : document.querySelector('#home .flex.xl\\:hidden p');

      const ctaGrid = isDesktop
        ? null
        : document.querySelector('#home .flex.xl\\:hidden .grid');

      const winHeight = window.innerHeight;
      const winWidth = window.innerWidth;

      const videoRect = videoShape ? videoShape.getBoundingClientRect() : null;
      const headingRect = heading ? heading.getBoundingClientRect() : null;
      const supportingRect = supportingText ? supportingText.getBoundingClientRect() : null;
      const ctaRect = ctaGrid ? ctaGrid.getBoundingClientRect() : null;

      const gapVideoToSupporting = (videoRect && supportingRect)
        ? Math.round(supportingRect.top - videoRect.bottom)
        : null;

      const gapSupportingToCta = (supportingRect && ctaRect)
        ? Math.round(ctaRect.top - supportingRect.bottom)
        : null;

      const gapCtaToBottom = ctaRect
        ? Math.round(winHeight - ctaRect.bottom)
        : null;

      const headingStyle = heading ? window.getComputedStyle(heading) : null;
      const overlayZIndex = overlay ? window.getComputedStyle(overlay).zIndex : null;
      const headingZIndex = heading ? window.getComputedStyle(heading.parentElement.parentElement).zIndex : null;

      const hasHorizontalOverflow = document.documentElement.scrollWidth > winWidth;

      return {
        isDesktop,
        videoWidth: videoRect ? Math.round(videoRect.width) : null,
        videoHeight: videoRect ? Math.round(videoRect.height) : null,
        sideMarginLeft: videoRect ? Math.round(videoRect.left) : null,
        sideMarginRight: videoRect ? Math.round(winWidth - videoRect.right) : null,
        videoTop: videoRect ? Math.round(videoRect.top) : null,
        videoSrc: videoEl ? (videoEl.currentSrc || videoEl.querySelector('source')?.getAttribute('src')) : null,
        videoReadyState: videoEl ? videoEl.readyState : null,
        videoPaused: videoEl ? videoEl.paused : null,
        videoCurrentTime: videoEl ? videoEl.currentTime : null,
        headingCenteredHorizontally: (headingRect && videoRect)
          ? Math.abs(Math.round((headingRect.left + headingRect.right) / 2) - Math.round((videoRect.left + videoRect.right) / 2)) <= 4
          : false,
        headingCenteredVertically: (headingRect && videoRect)
          ? Math.abs(Math.round((headingRect.top + headingRect.bottom) / 2) - Math.round((videoRect.top + videoRect.bottom) / 2)) <= 15
          : false,
        headingFontWeight: headingStyle ? headingStyle.fontWeight : null,
        layerHierarchyValid: (parseInt(headingZIndex, 10) > parseInt(overlayZIndex, 10)),
        gapVideoToSupporting,
        gapSupportingToCta,
        gapCtaToBottom,
        hasHorizontalOverflow,
      };
    });

    console.log(`Audit result for ${vp.name}:`, audit);

    const shotPath = path.join(ARTIFACT_DIR, `wellbeing-hero-${vp.name}.png`);
    await page.screenshot({ path: shotPath });
    console.log(`Saved screenshot: ${shotPath}`);
  }

  await browser.close();
  console.log('\nVerification complete!');
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
