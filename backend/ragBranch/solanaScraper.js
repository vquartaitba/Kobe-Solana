const axios = require("axios");
const cheerio = require("cheerio");
const { createClient } = require("@supabase/supabase-js");
const OpenAI = require("openai");

// const SUPABASE_ANON_KEY =
//   "";
// const OPENAI_API_KEY =
//   "";
// const SUPABASE_URL = "https://eajrvhzuisvfdqkobved.supabase.co";

// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function scrapeDocumentation() {
  const sites = [
    { name: "Solana", baseUrl: "https://solana.com", docsPath: "/docs" },
    { name: "Avalanche", baseUrl: "https://docs.avax.network", docsPath: "/" },
    {
      name: "Polygon",
      baseUrl: "https://docs.polygon.technology",
      docsPath: "/",
    },
  ];

  for (const site of sites) {
    await scrapeSite(site);
  }
}

async function scrapeSite({ name, baseUrl, docsPath }) {
  const docsUrl = `${baseUrl}${docsPath}`;
  console.log(`Scraping ${name} docs from ${docsUrl}`);

  try {
    const response = await axios.get(docsUrl);
    const $ = cheerio.load(response.data);

    // Extract main content
    const mainContent = $("main").text().trim();
    await processContent(mainContent, docsUrl, name);

    // Extract and process sidebar links
    const sidebarLinks = [];
    $("nav a").each((i, elem) => {
      const href = $(elem).attr("href");
      if (href && href.startsWith(docsPath)) {
        sidebarLinks.push(href);
      }
    });

    // Process sidebar links
    for (const link of sidebarLinks) {
      const fullUrl = `${baseUrl}${link}`;
      try {
        const pageResponse = await axios.get(fullUrl);
        const page$ = cheerio.load(pageResponse.data);
        const pageContent = page$("main").text().trim();
        await processContent(pageContent, fullUrl, name);
        console.log(`Successfully processed: ${fullUrl}`);
      } catch (error) {
        handleScrapingError(error, fullUrl);
      }
    }
  } catch (error) {
    handleScrapingError(error, docsUrl);
  }
}

async function processContent(content, url, siteName) {
  // Implement your content processing logic here
  console.log(`Processing ${siteName} content from: ${url}`);
  // For example: await storeInSupabase(content, url, siteName);
}

function handleScrapingError(error, url) {
  if (error.response && error.response.status === 404) {
    console.warn(`Page not found: ${url}`);
  } else {
    console.error(`Error fetching ${url}:`, error.message);
  }
}

scrapeDocumentation().catch(console.error);
