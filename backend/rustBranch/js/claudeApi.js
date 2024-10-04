const fetch = require('node-fetch');

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const API_URL = 'https://api.anthropic.com/v1/messages';

async function generateMessageWithClaude(prompt, model = 'claude-3-5-sonnet-20240620') {
  try {
    const data = {
      model: model,
      max_tokens: 2000,
      messages: [
        { role: "user", content: prompt }
      ]
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    let code = result.content[0].text;
    
    // Eliminar las comillas triples y el texto antes del código
    code = code.replace(/^[\s\S]*?```move\s*/, '');
    code = code.replace(/```$/, '');
    code = code.trim();

    return code;
  } catch (error) {
    console.error('Error al llamar a la API de Claude:', error);
    throw new Error('No se pudo generar una respuesta con Claude');
  }
}

module.exports = { generateMessageWithClaude };