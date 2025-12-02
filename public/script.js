function updateMatchCard(teamA, teamB, scoreA, scoreB, location, date, shootout, shootoutA, shootoutB) {
    let cardContents = "";

    if (shootout == false) {
        cardContents = `
        <strong>${teamA}</strong>${scoreA} - ${scoreB}<strong>${teamB}</strong><br>
        <small>${location} | ${date}</small>
        `;
    } else {
        cardContents = `
        <strong>${teamA}</strong> ${scoreA} - ${scoreB} <strong>${teamB}</strong><br>
        <small>(penalties ${shootoutA} - ${shootoutB})</small><br>
        <small>${location} | ${date}</small>
        `;
    }
    const card = document.createElement("div");
    if (scoreA > scoreB) {
        card.innerHTML = `<div class="card win">${cardContents}</div>`;
    } else if (scoreB > scoreA) {
        card.innerHTML = `<div class="card lose">${cardContents}</div>`;
    } else if (shootoutA > shootoutB) {
        card.innerHTML = `<div class="card win">${cardContents}</div>`;
    } else if (shootoutB > shootoutA) {
        card.innerHTML = `<div class="card lose">${cardContents}</div>`;
    } else {
        card.innerHTML = `<div class="card">${cardContents}</div>`;
    }
    document.getElementById("place-for-matchcard").appendChild(card);
}

document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('back-to-top');
    el.classList.add('hide');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            el.classList.remove('hide');
            el.classList.add('show');
        } else {
            el.classList.remove('show');
            el.classList.add('hide');
        }
    });

    el.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

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
                document.getElementById("matchcard").innerHTML = `
                <strong>No completed matches found.</strong>
                `;
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