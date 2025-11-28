export default async function fetchScores() {
  try {
    const url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vS-WGhIDz5Y_o_cSq0biFiqJYBS5ED_7_y-IT_Ncm7snfKB0PtN4BbNDLZUiDfiQXPO-nvE5A4_snaw/pub?output=csv`;
    const res = await fetch(url);
    const text = await res.text();

    const rows = text.split("\n").map(r => r.split(","));
    const headers = rows[0];

    const data = rows.slice(1).map(row => {
      let obj = {};
      row.forEach((value, i) => {
        obj[headers[i]] = value.trim();
      });
      return obj;
    });

    return data;
  } catch (error) {
    console.error("Error fetching scores:", error);
    return [];
  }
}