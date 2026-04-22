/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 *
 * The comments in this file are only to help you learn how the starter code
 * works. The instructions for the project are in the README. That said, here
 * are the three things you should do first to learn about the starter code:
 * - 1 - Change something small in index.html or style.css, then reload your
 *    browser and make sure you can see that change.
 * - 2 - On your browser, right click anywhere on the page and select
 *    "Inspect" to open the browser developer tools. Then, go to the "console"
 *    tab in the new window that opened up. This console is where you will see
 *    JavaScript errors and logs, which is extremely helpful for debugging.
 *    (These instructions assume you're using Chrome, opening developer tools
 *    may be different on other browsers. We suggest using Chrome.)
 * - 3 - Add another string to the titles array a few lines down. Reload your
 *    browser and observe what happens. You should see a fourth "card" appear
 *    with the string you added to the array, but a broken image.
 *
 */
class Player {
  constructor({name,team,position,age}) {
    this.name= name;
    this.team= team;
    this.position = position;
    this.age = age;
  }
  initials() {
    let parts = this.name.trim().split(" ");
    let firstin = "";
    let secondin = "";
    if (parts.length>0 && parts[0]) {
      firstin = parts[0][0];
    }
    if (parts.length > 1 && parts[1]) {
      secondin = parts[1][0];
    }
    return (firstin+secondin).toUpperCase();
  }
  sport() {
    return "You messed up";
  }
  stats() {
    return [];
  }
}

class NBAPlayer extends Player {
  constructor(data) {
    super(data);
    this.ppg = data.ppg;
    this.rpg = data.rpg;
    this.apg = data.apg;
    this.spg = data.spg;
    this.bpg = data.bpg;
  }
  sport() {
   return "NBA"; 
  }
  stats() {
    return [{key: "ppg", label: "PPG", value: this.ppg},
      {key: "rpg", label: "RPG", value: this.rpg},
      {key: "apg", label: "APG", value: this.apg},
      {key: "spg", label: "SPG", value: this.spg},
      {key: "bpg", label: "BPG", value: this.bpg}];
  }
}

class NFLPlayer extends Player {
  constructor(data) {
    super(data);
    this.stat1 = data.stat1;
    this.stat2 = data.stat2;
    this.stat3 = data.stat3;
    this.stat4 = data.stat4;
    this.stat5 = data.stat5;
    this.statLabels = data.statLabels;
  }
  sport() {
   return "NFL"; 
  }
  stats() {
    return [{key: "stat1", label: this.statLabels[0], value: this.stat1},
      {key: "stat2", label: this.statLabels[1], value: this.stat2},
      {key: "stat3", label: this.statLabels[2], value: this.stat3},
      {key: "stat4", label: this.statLabels[3], value: this.stat4},
      {key: "stat5", label: this.statLabels[4], value: this.stat5}];
  }
}

class MLBPlayer extends Player {
  constructor(data) {
    super(data);
    this.avg = data.avg;
    this.hr = data.hr;
    this.rbi = data.rbi;
    this.ops = data.ops;
    this.sb = data.sb;
  }
  sport() { 
  return "MLB"; 
  }
  stats() {
    return [{key: "avg", label: "AVG", value: this.avg},
      {key: "hr", label: "HR", value: this.hr},
      {key: "rbi", label: "RBI", value: this.rbi},
      {key: "ops", label: "OPS", value: this.ops},
      {key: "sb", label: "SB", value: this.sb}];
  }
}

const sdata = {
  NBA:[],
  NFL:[],
  MLB:[],
};

async function load() {
  const srcs = [{sport: "NBA", file: "nba-data.json", make: data => new NBAPlayer(data)},
    {sport: "NFL", file: "nfl-data.json", make: data => new NFLPlayer(data)},
    {sport: "MLB", file: "mlb-data.json", make: data => new MLBPlayer(data)}];
  await Promise.all(srcs.map(async ({sport, file, make})=>{
    const res = await fetch(file);
    const arr = await res.json();
    sdata[sport] = arr.map(make);
  }));
  updateHeader();
  redraw();
}

let currspo = "NBA";
let sortk = null;
let sortd = "desc";
let sq = "";

const positions = {
  NBA: ["PG", "SG", "SF", "PF", "C"],
  NFL: ["QB", "RB", "WR", "TE", "DE", "LB", "CB", "S"],
  MLB: ["SP", "RP", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "DH"],
};

const statfields = {
  NBA: [{id: "q", label: "PPG (points/game)", key: "ppg", step: "0.1"},
    {id: "w", label: "RPG (rebounds/game)", key: "rpg", step: "0.1"},
    {id: "e", label: "APG (assists/game)", key: "apg", step: "0.1"},
    {id: "r", label: "SPG (steals/game)", key: "spg", step: "0.1"},
    {id: "t", label: "BPG (blocks/game)", key: "bpg", step: "0.1"}],
  NFL: [{id: "q", label: "Stat 1 (yards/sacks)", key: "stat1", step: "0.1"},
    {id: "w", label: "Stat 2 (TDs/tackles)", key: "stat2", step: "0.1"},
    {id: "e", label: "Stat 3 (INTs/recs/TFL)", key: "stat3", step: "0.1"},
    {id: "r", label: "Stat 4 (rating/ypc/FF)", key: "stat4", step: "0.1"},
    {id: "t", label: "Stat 5 (comp%/fumbles/PD)", key: "stat5", step: "0.1"}],
  MLB: [{id: "q", label: "AVG (batting average)", key: "avg", step: "0.001"},
    {id: "w", label: "HR (home runs)", key: "hr", step: "1"},
    {id: "e", label: "RBI", key: "rbi", step: "1"},
    {id: "r", label: "OPS", key: "ops", step: "0.001"},
    {id: "t", label: "SB (stolen bases)", key: "sb", step: "1"}],
};

function switcher(sport) {
  currspo = sport;
  sortk = null;
  sortd = "desc";
  document.getElementById("search").value = "";
  sq = "";
  document.querySelectorAll(".tab-btn").forEach(btn =>{
    btn.classList.toggle("active", btn.dataset.sport === sport);
  });
  redraw();
}

function sortByStat(key) {
  if (sortk ==key) {
    sortd = sortd == "desc" ? "asc" : "desc";
  } 
  else {
    sortk = key;
    sortd = "desc";
  }
  redraw();
}

function whensearch() {
  sq = document.getElementById("search").value.toLowerCase();
  redraw();
}

function redraw() {
  const players = sdata[currspo];
  const sample = players[0].stats();
  let list = players.filter(p =>!sq ||p.name.toLowerCase().includes(sq) ||p.team.toLowerCase().includes(sq));
  if (sortk) {
    list = [...list].sort((a, b) => {
      const av = a[sortk] !== undefined ? a[sortk] : 0;
      const bv = b[sortk] !== undefined ? b[sortk] : 0;
      return sortd === "desc" ? bv - av : av - bv;
    });
  }
  heade(sample);
  document.getElementById("results-label").textContent =
    list.length + " player" + (list.length !== 1 ? "s" : "");
  const box = document.getElementById("card-container");
  box.innerHTML = "";
  if (list.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="7" class="no-results">No players match your search.</td>`;
    box.appendChild(tr);
    return;
  }
  list.forEach(p => box.appendChild(mkrow(p)));
}

function heade(sample) {
  const hrow = document.getElementById("stat-headers");
  hrow.querySelectorAll(".stat-th").forEach(th => th.remove());
  sample.forEach(stat =>{
    const th = document.createElement("th");
    th.className = "stat-th"+ (sortk === stat.key ? " sorted" : "");
    th.title = "Sort by " +stat.label;
    th.textContent = stat.label + (sortk === stat.key ? (sortd === "desc" ? " ↓" : " ↑") : "");
    th.addEventListener("click", () => sortByStat(stat.key));
    hrow.appendChild(th);
  });
}

function mkrow(p) {
  const st = p.stats();
  const tr = document.createElement("tr");
  tr.className = "player-row";
  tr.innerHTML = `
    <td class="cell-avatar">
      <div class="avatar avatar-${currspo}">${p.initials()}</div>
    </td>
    <td class="cell-name">
      <span class="player-name">${p.name}</span>
      <span class="player-meta">${p.team} &middot; ${p.position} &middot; Age ${p.age}</span>
    </td>
    ${st.map(s => `<td class="cell-stat${sortk === s.key ? " sorted" : ""}">${s.value}</td>`).join("")}
  `;
  return tr;
}

function updateHeader() {
  const tot = Object.values(sdata).reduce((s, arr) => s + arr.length, 0);
  document.getElementById("header-stats").innerHTML = `
    <div class="hstat"><span class="hstat-val">${sdata.NBA.length}</span><span class="hstat-lbl">NBA</span></div>
    <div class="hstat"><span class="hstat-val">${sdata.NFL.length}</span><span class="hstat-lbl">NFL</span></div>
    <div class="hstat"><span class="hstat-val">${sdata.MLB.length}</span><span class="hstat-lbl">MLB</span></div>
    <div class="hstat"><span class="hstat-val">${tot}</span><span class="hstat-lbl">Total</span></div>
  `;
}

function modaopen() {
  buildForm();
  document.getElementById("modal-overlay").style.display = "flex";
  document.getElementById("form-error").style.display = "none";
  document.getElementById("f-name").focus();
}

function modaclose() {
  document.getElementById("modal-overlay").style.display = "none";
}

function whenclicker(e) {
  if (e.target === document.getElementById("modal-overlay")) modaclose();
}

function buildForm() {
  const sp = currspo;
  document.getElementById("modal-sport-label").textContent = "Add " + sp + " Player";
  document.getElementById("f-pos").innerHTML =
    positions[sp].map(p => `<option value="${p}">${p}</option>`).join("");
  document.getElementById("stat-fields").innerHTML =
    statfields[sp].map(f => `
      <div class="form-field">
        <label for="${f.id}">${f.label}</label>
        <input type="number" id="${f.id}" data-key="${f.key}" placeholder="0" step="${f.step}" min="0" />
      </div>
    `).join("");
  const nflbox = document.getElementById("nfl-label-fields");
  if (sp === "NFL") {
    nflbox.style.display = "block";
    nflbox.innerHTML = `
      <p class="form-note">Short labels for your 5 stats (e.g. "Pass Yds", "TDs"):</p>
      <div class="form-row-5">
        ${[1,2,3,4,5].map(i =>
          `<input type="text" id="f-lbl${i}" placeholder="Stat ${i}" maxlength="12" />`
        ).join("")}
      </div>
    `;
  } else {
    nflbox.style.display = "none";
  }
}

function addp() {
  const sp = currspo;
  const name = document.getElementById("f-name").value.trim();
  const team = document.getElementById("f-team").value.trim();
  const pos = document.getElementById("f-pos").value;
  const age = parseInt(document.getElementById("f-age").value) || 0;
  const err = document.getElementById("form-error");

  if (!name || !team) {
    err.textContent = "Please fill in at least a name and team.";
    err.style.display = "block";
    return;
  }

  const vals = {};
  document.querySelectorAll("#stat-fields input[data-key]").forEach(input => {
    vals[input.dataset.key] = parseFloat(input.value) || 0;
  });

  let np;
  if (sp === "NBA") {
    np = new NBAPlayer({name, team, position: pos, age, ...vals});
  } else if (sp === "NFL") {
    const statLabels = [1,2,3,4,5].map(i => {
      const el = document.getElementById("f-lbl" + i);
      return el && el.value.trim() ? el.value.trim() : "Stat " + i;
    });
    np = new NFLPlayer({name, team, position: pos, age, ...vals, statLabels});
  } else if (sp === "MLB") {
    np = new MLBPlayer({name, team, position: pos, age, ...vals});
  }

  sdata[sp].push(np);
  modaclose();
  updateHeader();
  redraw();
}