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
        console.log(rows);

        const completeMatches = [];
        const incompleteMatches = [];

        // collect all complete matches from newest → oldest
        for (let i = rows.length - 1; i >= 1; i--) {
            const row = rows[i];
            if (row.length >= 4 && row[2] !== "" && row[3] !== "") {
                completeMatches.push(row);
            } else if (row.length >= 2 && row[0] !== "" && row[1] !== "") {
                incompleteMatches.push(row);
            }
        }

        const fList = document.getElementById("fixtures-list");
        fList.innerHTML = "";
        const mList = document.getElementById("matches-list");
        mList.innerHTML = "";

        if (incompleteMatches.length === 0) {
            fList.innerHTML = `
                <li><div class="card"><strong>No future matches found.</strong></div></li>
            `;
            return;
        }

        if (completeMatches.length === 0) {
            mList.innerHTML = `
                <li><div class="card"><strong>No future matches found.</strong></div></li>
            `;
            return;
        }

        // build each card
        incompleteMatches.forEach(row => {
            const teamA = row[0];
            const teamB = row[1];

            const [year, month, day] = row[4].split("-");
            const date = `${day}/${month}/${year}`;

            const location = row[5];

            let cardContents = "";
            
            cardContents = `
                <strong>${teamA}</strong> vs <strong>${teamB}</strong><br>
                <small>${location} | ${date}</small>
            `;

            const li = document.createElement("li");
            li.innerHTML = `<div class="card">${cardContents}</div>`;
            fList.appendChild(li);
        });

        completeMatches.forEach(row => {
            const teamA = row[0];
            const teamB = row[1];
            const scoreA = parseInt(row[2]);
            const scoreB = parseInt(row[3]);

            const [year, month, day] = row[4].split("-");
            const date = `${day}/${month}/${year}`;

            const location = row[5];

            const shootout = row[6] && row[7];
            const shootoutA = row[6] ? parseInt(row[6]) : null;
            const shootoutB = row[7] ? parseInt(row[7]) : null;

            let cardContents = "";

            if (!shootout) {
                cardContents = `
                    <strong>${teamA}</strong> ${scoreA} - ${scoreB} <strong>${teamB}</strong><br>
                    <small>${location} | ${date}</small>
                `;
            } else {
                cardContents = `
                    <strong>${teamA}</strong> ${scoreA} - ${scoreB} <strong>${teamB}</strong><br>
                    <small>(penalties ${shootoutA} - ${shootoutB})</small><br>
                    <small>${location} | ${date}</small>
                `;
            }

            const li = document.createElement("li");
            if (scoreA > scoreB) {
                li.innerHTML = `<div class="card win">${cardContents}</div>`;
            } else if (scoreB > scoreA) {
                li.innerHTML = `<div class="card lose">${cardContents}</div>`;
            } else if (shootoutA > shootoutB) {
                li.innerHTML = `<div class="card win">${cardContents}</div>`;
            } else if (shootoutB > shootoutA) {
                li.innerHTML = `<div class="card lose">${cardContents}</div>`;
            } else {
                li.innerHTML = `<div class="card">${cardContents}</div>`;
            }
            mList.appendChild(li);
        });
    });
});