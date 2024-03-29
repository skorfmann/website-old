const chromium = require("chrome-aws-lambda");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  // Load html from template
  const html = fs.readFileSync(path.resolve(__dirname, "./template.html")).toString();

  // Get generated post json
  const posts = require("./posts.json");

  // Render HTML
  // Wait for 0 network connections to ensure webfonts downloaded
  await page.setContent(html, {
    waitUntil: ["networkidle0"],
  });

  // Wait until the document is fully rendered
  await page.evaluateHandle("document.fonts.ready");

  // Set the viewport to your preferred image size
  await page.setViewport({
    width: 600,
    height: 315,
    deviceScaleFactor: 2,
  });

  // Create an img directory in the output folder
  const dir = path.resolve(__dirname, "../dist/images/og");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  // Go over all the posts
  for (const post of posts) {
    // Update the H1 element with the post title
    await page.evaluate((post) => {
      // We use `innerHTML` since we added `&nbsp;`
      const title = document.querySelector("h1");
      title.innerHTML = post.title;

      // If you have other data to insert,
      // find the DOM elements and update that here
    }, post);

    // Optional just for progress feedback
    console.log(`Image: ${post.slug}.png`);

    // Save a screenshot to public/img/slug-of-post.png
    await page.screenshot({
      path: `${dir}/${post.slug}.png`,
      type: "png",
      clip: { x: 0, y: 0, width: 600, height: 315 },
    });
  }

  await browser.close();
})();