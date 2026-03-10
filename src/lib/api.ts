export async function generateSummary(sessionId) {
    const res = await fetch("http://localhost:5000/api/sessions/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Summary failed");
    return data.data;
}