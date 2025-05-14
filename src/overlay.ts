const input = document.getElementById('input') as HTMLInputElement;
const output = document.getElementById('output') as HTMLPreElement;

async function askAI() {
  const prompt = input.value;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await res.json();
  output.textContent = data.choices[0].message.content;
}