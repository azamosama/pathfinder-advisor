const API_KEY = "AIzaSyCrMKtssyxEGgx5kl3PXY82noVBI_pEbUs";

const systemPrompt = `You are an expert academic advisor for university students.
Your task is to generate a highly realistic, comprehensive academic plan based on the user's inputs. Use Google Search to find the specific courses and curriculum information for the given university and major.

CRITICAL INSTRUCTIONS:
1. Return ONLY raw JSON. No markdown formatting, no backticks, no preamble, no explanations.
2. The JSON must exactly match the schema provided below.
3. Generate exactly 4 years of schedule.
4. Each semester must have 4-6 courses, totaling 15-18 credit hours.
5. Use realistic course codes matching the university and major (e.g., BIO 101, CHEM 201) by referencing real degree maps found via search.
6. Weave general education/core requirements naturally throughout all years. Explicitly label them with "(Gen-Ed)" or "(Core)" in the string.
7. Mark elective slots EXACTLY as: "Open Elective — See electives tab - 3 cr".
8. Provide at least 8 elective options.
9. Provide 5-8 organizations. Valid types: club, professional, honor society, volunteer.
10. Provide 2-4 career fairs.
11. Provide all relevant professional exams for the track (MCAT, LSAT, GRE, etc.). If none are strictly required, provide general grad school or industry certifications.
12. Provide 6-10 personalized advisor tips.

SCHEMA:
{
  "schedule": [
    {
      "year": 1,
      "fall": ["Course Name (DEPT 101) - 3 cr", "..."],
      "spring": ["Course Name (DEPT 102) - 3 cr", "..."]
    }
  ],
  "electives": [
    { "name": "Course Name (DEPT 200)", "credits": 3, "description": "One-line description" }
  ],
  "organizations": [
    { "name": "Org name", "description": "Why relevant", "type": "club|professional|honor society|volunteer" }
  ],
  "career_fairs": [
    { "name": "Fair name", "timing": "e.g. Fall of Junior Year", "purpose": "Why attend" }
  ],
  "professional_exams": [
    { "name": "Exam name", "timeline": "When to take it", "description": "What it is", "prep_time": "Typical prep duration" }
  ],
  "advisor_tips": ["Tip 1", "Tip 2"]
}`;

const userPrompt = `Please create a 4-year academic plan for a student at University of Kansas majoring in Business Analytics.
Minor: Public Health
Track: Pre-Medicine
Additional Notes: None

Remember: ONLY OUTPUT RAW JSON.`;

async function main() {
    console.log("Fetching...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            tools: [{ googleSearch: {} }],
            generationConfig: {
                maxOutputTokens: 8192
            }
        })
    });

    if (!response.ok) {
        console.log("Error:", await response.text());
        return;
    }
    const result = await response.json();
    console.log("Raw output:\n", result.candidates[0].content.parts[0].text);
}
main();
