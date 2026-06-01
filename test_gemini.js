const data = {
    university: "University of Kansas",
    major: "Business Analytics",
    minor: "Public Health",
    track: "Pre-Medicine",
    notes: "",
    years: 4
};

const systemPrompt = `You are an expert academic advisor for university students.
Your task is to generate a highly realistic, comprehensive academic plan based on the user's inputs. Use Google Search to find the specific courses and curriculum information for the given university and major.

CRITICAL INSTRUCTIONS:
1. Return ONLY raw JSON. No markdown formatting, no backticks, no preamble, no explanations.
2. The JSON must exactly match the schema provided below.
3. Generate exactly ${data.years} years of schedule.
4. Each semester must have 4-6 courses, totaling 15-18 credit hours.
5. Use realistic course codes matching the university and major (e.g., BIO 101, CHEM 201) by referencing real degree maps found via search.
6. Weave general education/core requirements naturally throughout all years. Explicitly label them with "(Gen-Ed)" or "(Core)" in the string.
7. Mark elective slots EXACTLY as: "Open Elective — See electives tab - 3 cr".
8. Provide at least 8 elective options.
9. Provide 5-8 organizations. Valid types: club, professional, honor society, volunteer.
10. Provide 2-4 career fairs.
11. Provide all relevant professional exams for the track (MCAT, LSAT, GRE, etc.). If none are strictly required, provide general grad school or industry certifications.
12. Provide 6-10 personalized advisor tips.
13. If a minor is provided, integrate its courses into the schedule.
14. Honor any additional notes (study abroad, double major, etc.).

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

const userPrompt = `Please create a ${data.years}-year academic plan for a student at ${data.university} majoring in ${data.major}.
Minor: ${data.minor || 'None'}
Track: ${data.track || 'None'}
Additional Notes: ${data.notes || 'None'}

Remember: ONLY OUTPUT RAW JSON.`;

async function run() {
    const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCrMKtssyxEGgx5kl3PXY82noVBI_pEbUs";
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
                        schedule: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    year: { type: "INTEGER" },
                                    fall: { type: "ARRAY", items: { type: "STRING" } },
                                    spring: { type: "ARRAY", items: { type: "STRING" } }
                                }
                            }
                        },
                        electives: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: { name: { type: "STRING" }, credits: { type: "INTEGER" }, description: { type: "STRING" } }
                            }
                        },
                        organizations: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: { name: { type: "STRING" }, description: { type: "STRING" }, type: { type: "STRING" } }
                            }
                        },
                        career_fairs: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: { name: { type: "STRING" }, timing: { type: "STRING" }, purpose: { type: "STRING" } }
                            }
                        },
                        professional_exams: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: { name: { type: "STRING" }, timeline: { type: "STRING" }, description: { type: "STRING" }, prep_time: { type: "STRING" } }
                            }
                        },
                        advisor_tips: { type: "ARRAY", items: { type: "STRING" } }
                    },
                    required: ["schedule", "electives", "organizations", "career_fairs", "professional_exams", "advisor_tips"]
                }
            }
        })
    });
    const result = await response.json();
    console.log(JSON.stringify(result, null, 2));
}
run();
