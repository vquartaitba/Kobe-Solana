const fs = require("fs");
const OpenAI = require("openai");
const { createClient } = require("@supabase/supabase-js");
const pLimit = require("p-limit");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CONCURRENCY_LIMIT = 5;
const limit = pLimit(CONCURRENCY_LIMIT);

async function handleQuery(query) {
  const input = query.replace(/\n/g, " ");

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input,
  });
  
  const [{ embedding }] = embeddingResponse.data;

  try {
    const { data: documents, error } = await supabase.rpc("match_documents", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 10,
    });

    if (error) {
      console.error("Error fetching documents from Supabase:", error);
      throw error;
    }

    let contextText = "";

    contextText += documents
      .map((document) => `${document.content.trim()}---\n`)
      .join("");

    const messages = [
      {
        role: "system",
        content: `You are a web3 grandmaster with expert knowledge in Solidity and Rust for smart contract development. You understand the inner workings of Ethereum Virtual Machines (EVMs) and are well-versed in multiple blockchain platforms, including Ethereum, Solana, Polkadot, and Avalanche. You are skilled in blockchain security, consensus mechanisms, DeFi, NFTs, and dApp development. Your answers are precise, authoritative, and deeply informed by your expertise in these technologies. Whenever you answer, you provide the source of knowledge of your answers, whether it's a link or an academic paper. Provide them by saying: Information learned from: (and link where you found the information)`,
      },
      {
        role: "user",
        content: `Context sections: "${contextText}" Question: "${query}" Answer as simple text:`,
      },
    ];

    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-4o-mini",
      temperature: 0.5,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error processing query with OpenAI:", error);
    throw error;
  }
}

// Exportar la función handleQuery
module.exports = { handleQuery };

// Ejemplo de uso para debug
/* const input = "What are the latest updates on polygon?";
(async () => {
  try {
    const result = await handleQuery(input);
    console.log(result);
  } catch (error) {
    console.error("Error processing query:", error);
  }
})();
*/
