function updateMatchCard(teamA, teamB, scoreA, scoreB, location, date, shootout, shootoutA, shootoutB) {
    const matchCard = document.querySelector('.matchcard');
    if (shootout == false) {
        matchCard.innerHTML = `
        <strong>${teamA}</strong>${scoreA} - ${scoreB}<strong>${teamB}</strong><br>
        <small>${location} | ${date}</small>
        `;
    } else {
        matchCard.innerHTML = `
        <strong>${teamA}</strong> ${scoreA} - ${scoreB} <strong>${teamB}</strong><br>
        <small>(P ${shootoutA} - ${shootoutB})</small><br>
        <small>${location} | ${date}</small>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vS-WGhIDz5Y_o_cSq0biFiqJYBS5ED_7_y-IT_Ncm7snfKB0PtN4BbNDLZUiDfiQXPO-nvE5A4_snaw/pub?output=csv")
        .then(response => response.text())
        .then(csv => {
            const rows = csv.split("\n").map(row => row.split(","));
            // debug purposes consolelog
            console.log(rows);
            let latestMatch = null;
            for (let i = rows.length - 1; i >= 0; i--) {
                const row = rows[i];
                if (row.length >= 4 && row[2] !== "" && row[3] !== "") {
                    latestMatch = row;
                    break;
                }
            }
            if (!latestMatch) {
                document.querySelector(".matchcard").textContent =
                    "No completed matches found.";
                return;
            }
            // get values
            const teamA = latestMatch[0];
            const teamB = latestMatch[1];
            const scoreA = parseInt(latestMatch[2]);
            const scoreB = parseInt(latestMatch[3]);
            // date reorganisatoin
            const year = latestMatch[4].split("-")[0];
            const month = latestMatch[4].split("-")[1];
            const day = latestMatch[4].split("-")[2];
            const date = `${day}/${month}/${year}`;
            const location = latestMatch[5];
            if (latestMatch[6] && latestMatch[7]) {
                var shootout = true;
            } else {
                var shootout = false;
            }
            const shootoutA = latestMatch[6] ? parseInt(latestMatch[6]) : null;
            const shootoutB = latestMatch[7] ? parseInt(latestMatch[7]) : null;
            // update
            updateMatchCard(teamA, teamB, scoreA, scoreB, location, date, shootout, shootoutA, shootoutB);
        });
});