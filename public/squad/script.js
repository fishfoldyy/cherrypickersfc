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

    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vS-WGhIDz5Y_o_cSq0biFiqJYBS5ED_7_y-IT_Ncm7snfKB0PtN4BbNDLZUiDfiQXPO-nvE5A4_snaw/pub?gid=1229481303&single=true&output=csv")
    .then(response => response.text())
    .then(csv => {
        const rows = csv.split("\n").map(row => row.split(","));
        console.log(rows);

        const players = [];

        // all players
        for (let i = 1; i < rows.length; i++) {
            players.push(rows[i]);
        }

        const gkList = document.getElementById("gk-list");
        gkList.innerHTML = "";
        const defList = document.getElementById("def-list");
        defList.innerHTML = "";
        const midList = document.getElementById("mid-list");
        midList.innerHTML = "";
        const fwdList = document.getElementById("fwd-list");
        fwdList.innerHTML = "";

        if (players.length === 0) {
            gkList.innerHTML = `
                <li><div class="card"><strong>No players found.</strong></div></li>
            `;
            return;
        }

        // build each card
        players.forEach((row, index) => {
            const name = row[0];
            const squadNo = row[1];
            const pos = row[2];
            const apps = row[3];
            const goals = row[4];
            const assts = row[5];
            const GApg = row[6];
            const cleanShts = row[7];
            const redCards = row[8];
            const yellowCards = row[9];
            const penScored = row[10];
            const penTaken = row[11];
            const penPct = row[12];

            const id = rows.indexOf(row);

            let shownStats = "";

            // stat showing logic
            if (pos === "Goalkeeper") { // GK best stat
                if (cleanShts > 0) {
                    shownStats = `${cleanShts} clean sheet(s)`;
                } else {
                    shownStats = `${apps} appearance(s)`;
                }
            } else if (pos === "Defender") { // DEF best stat
                if (cleanShts > 0) {
                    shownStats = `${cleanShts} clean sheet(s)`;
                } else if (goals > 0 && assts > 0) {
                    shownStats = `${goals} goal(s) and ${assts} assist(s)`;
                } else if (goals > 0) {
                    shownStats = `${goals} goal(s)`;
                } else if (assts > 0) {
                    shownStats = `${assts} assist(s)`;
                } else {
                    shownStats = `${apps} appearance(s)`;
                }
            } else if (pos === "Midfielder" || pos === "Forward") { // MID & FWD best stat
                if (goals > 0 && assts > 0) {
                    shownStats = `${goals} goals and ${assts} assist(s)`;
                } else if (goals > 0) {
                    shownStats = `${goals} goal(s)`;
                } else if (assts > 0) {
                    shownStats = `${assts} assist(s)`;
                } else {
                    shownStats = `${apps} appearance(s)`;
                }
            }

            const cardContents = `
                <strong>${squadNo}</strong><strong>${name}</strong><br>
                <small>${shownStats}</small>
            `;

            const li = document.createElement("li");
            /*
            li.innerHTML = `
                <a class="cardAnchors" href="/squad/${squadNo}">
                    <div class="card squadcard">${cardContents}</div>
                </a>
            `;
            */
            li.innerHTML = `
                <div class="card squadcard">${cardContents}</div>
            `;
            
            if (pos === "Goalkeeper") gkList.appendChild(li);
            else if (pos === "Defender") defList.appendChild(li);
            else if (pos === "Midfielder") midList.appendChild(li);
            else if (pos === "Forward") fwdList.appendChild(li);
        });
    });
});