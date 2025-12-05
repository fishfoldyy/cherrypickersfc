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

    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vS-WGhIDz5Y_o_cSq0biFiqJYBS5ED_7_y-IT_Ncm7snfKB0PtN4BbNDLZUiDfiQXPO-nvE5A4_snaw/pub?gid=0&single=true&output=csv")
    .then(response => response.text())
    .then(csv => {
        const rows = csv.split("\n").map(row => row.split(","));
        console.log(rows);

        const completeMatches = [];
        const incompleteMatches = [];
        const allMatches = [];

        let lastComplete = null;
        for (let i = rows.length - 1; i >= 1; i--) {
            const r = rows[i];
            if (r.length >= 4 && r[2] !== "" && r[3] !== "") {
                lastComplete = r;
                break;
            }
        }

        const mList = document.getElementById("place-for-matchcard");
        mList.innerHTML = "";

        if (!lastComplete) {
            mList.innerHTML = `
                <li><div class="card"><strong>No matches found.</strong></div></li>
            `;
        } else {
            const row = lastComplete;
            const teamA = row[0];
            const teamB = row[1];
            const scoreA = parseInt(row[2]);
            const scoreB = parseInt(row[3]);

            const [day, month, year] = row[4].split("-");
            const date = `${day}/${month}/${year}`;
            const location = row[5];

            const shootoutA = row[6] ? parseInt(row[6]) : null;
            const shootoutB = row[7] ? parseInt(row[7]) : null;
            const shootout = shootoutA !== null && shootoutB !== null;

            const id = rows.indexOf(row);

            const cardContents = shootout
                ? `
                    <strong>${teamA}</strong> ${scoreA} - ${scoreB} <strong>${teamB}</strong><br>
                    <small>(penalties ${shootoutA} - ${shootoutB})</small><br>
                    <small>${location} | ${date}</small>
                `
                : `
                    <strong>${teamA}</strong> ${scoreA} - ${scoreB} <strong>${teamB}</strong><br>
                    <small>${location} | ${date}</small>
                `;

            const resultClass =
                scoreA > scoreB || (shootoutA > shootoutB)
                    ? "win"
                    : scoreB > scoreA || (shootoutB > shootoutA)
                    ? "lose"
                    : "";

            const li = document.createElement("li");
            /*
            li.innerHTML = `
                <a class="cardAnchors" href="/fixtures/${id}">
                    <div class="card ${resultClass}">${cardContents}</div>
                </a>
            `;
            */
            li.innerHTML = `
                <div class="card ${resultClass}">${cardContents}</div>
            `;
            mList.appendChild(li);
        }
    });
});