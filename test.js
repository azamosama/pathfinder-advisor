const API_KEY = "AIzaSyCrMKtssyxEGgx5kl3PXY82noVBI_pEbUs";
async function main() {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: "Hello" }] }] })
    });
    console.log(response.status);
    console.log(await response.text());
}
main();
