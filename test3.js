const API_KEY = "AIzaSyCrMKtssyxEGgx5kl3PXY82noVBI_pEbUs";
async function main() {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: "Create a 4-year academic plan for a student at University of Kansas majoring in Business Analytics. Return JSON." }] }],
            tools: [{ googleSearch: {} }],
            generationConfig: {
                maxOutputTokens: 8192,
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        schedule: { type: "ARRAY", items: { type: "OBJECT", properties: { year: { type: "INTEGER" }, fall: { type: "ARRAY", items: { type: "STRING" } }, spring: { type: "ARRAY", items: { type: "STRING" } } } } }
                    },
                    required: ["schedule"]
                }
            }
        })
    });
    if (!response.ok) {
        console.log("Error:", await response.text());
        return;
    }
    const result = await response.json();
    console.log("Success! Output:", result.candidates[0].content.parts[0].text);
}
main();
