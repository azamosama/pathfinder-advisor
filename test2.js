const API_KEY = "AIzaSyCrMKtssyxEGgx5kl3PXY82noVBI_pEbUs";

const systemPrompt = `You are an expert academic advisor for university students.
Your task is to generate a highly realistic, comprehensive academic plan based on the user's inputs. Use Google Search to find the specific courses and curriculum information for the given university and major.

CRITICAL INSTRUCTIONS:
1. Return ONLY raw JSON.
2. Generate exactly 4 years of schedule.
3. Each semester must have 4-6 courses.
4. Use realistic course codes matching the university and major (e.g., BIO 101, CHEM 201) by referencing real degree maps found via search.
5. Provide electives, organizations, career fairs, professional exams, and advisor tips.`;

const userPrompt = `Please create a 4-year academic plan for a student at University of Kansas majoring in Business Analytics.`;

async function main() {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            tools: [{ googleSearchRetrieval: { dynamicRetrievalConfig: { mode: "MODE_DYNAMIC", dynamicThreshold: 0.3 } } }],
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
    console.log("Success! Characters:", result.candidates[0].content.parts[0].text.length);
}
main();
