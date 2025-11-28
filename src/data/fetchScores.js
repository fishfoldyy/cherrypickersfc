const SHEET_ID = "<YOUR_SHEET_ID>";
const SHEET_NAME = "Sheet1"; // default sheet name

export default async function fetchScores() {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;
    const res = await fetch(url);
    const text = await res.text();

    // Google Sheets JSON is wrapped in extra text, remove it
    const json = JSON.parse(text.substr(47).slice(0, -2));
    const rows = json.table.rows;

    return rows.map(row => ({
      teamA: row.c[0]?.v || "",
      teamB: row.c[1]?.v || "",
      scoreA: row.c[2]?.v || 0,
      scoreB: row.c[3]?.v || 0,
      date: row.c[4]?.v || "",
    }));
  } catch (error) {
    console.error("Error fetching scores:", error);
    return [];
  }
}