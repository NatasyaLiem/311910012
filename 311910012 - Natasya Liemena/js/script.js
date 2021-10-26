const ApiKey = "40e52a4f0a1c458ca414693e0f9d921a";
const baseUrl = "https://api.football-data.org/v2/";
const leagueId = "2021";
const baseEndPoin = `${baseUrl}competitions/${leagueId}`;
const teamEndPoin = `${baseUrl}competitions/${leagueId}/teams`;
const standingEndPoin = `${baseUrl}competitions/${leagueId}/standings`;
const matchEndPoin = `${baseUrl}competitions/${leagueId}/matches`;

const contents = document.querySelector("#content-list");
const title = document.querySelector(".card-title");
const fetchHeader = {
    headers: {
        'X-Auth-Token': ApiKey
    }
};

function getListTeams() {
    title.innerHTML = "Daftar Tim Liga Primer Inggris"
    fetch(teamEndPoin, fetchHeader)
        .then(response => response.json())
        .then(resJson => {
            console.log(resJson.teams);
            let teams = "";
            resJson.teams.forEach(team => {
                teams += `
                <li class="collection-item avatar">
                    <img src="${team.crestUrl}" alt="" class="circle">
                    <span class="title">${team.name}</span>
                    <p>Berdiri: ${team.founded} <br>
                       Markas: ${team.venue}
                    </p>
                    <a href="#" data-id="${team.id}" class="secondary-content"><i class="material-icons" data-id="${team.id}">info</i></a>
                </li>
                `
            });
            contents.innerHTML = '<ul class="collection">' + teams + '</ul>'
            const detil = document.querySelectorAll('.secondary-content');
            detil.forEach(btn=>{
                btn.onclick=(event)=>{
                    showTeamInfo(event.target.dataset.id);
                }
            })
        }).catch(err => {
            console.error(err);
        })
}

function showTeamInfo(id) {
    title.innerHTML = ""
    const detailEndPoin = `${baseUrl}/teams/${id}`;
    fetch(detailEndPoin, fetchHeader)
        .then(response => response.json())
        .then(resJson => {
            console.log(resJson);
           
            //untuk menampilkan squad
            let squads = "";
            resJson.squad.forEach(squad => {
                let lahir = new Date(squad.dateOfBirth).toLocaleDateString("id");
                squads += `
                <div class="col s12 m6">
                    <div class="card blue-grey darken-1">
                        <div class="card-content white-text">
                            <span class="card-title">${squad.name}</span>
                            <p>Posisi : ${squad.position}</p>
                            <p>Tempat, Tanggal Lahir : ${squad.countryOfBirth}, ${lahir}</p>
                            <p>Nationality : ${squad.nationality}</p>
                        </div>
                    </div>
                </div>
                `;
            });

            //untuk menampilkan kompetisi
            let competitions = "";
            let i = 1;
            resJson.activeCompetitions.forEach(competition => {
                competitions += `
                <tr>
                    <td style="padding-left:20px;">${i}.</td>
                    <td>${competition.name} (${competition.code})</td>
                    <td>${competition.area.name}</td>
                    <td>${competition.plan}</td>
                </tr>
                `;
                i++;
            });

            contents.innerHTML = `
                <div class="container" style="width:100%">
                    <div class="row">
                        <div class="col s6" style="text-align:center; padding-top:25px">
                            <img src="${resJson.crestUrl}" alt="">
                        </div>
                        <div class="col s6">
                            <h4>${resJson.name}</h4>
                            <p>Alamat        : ${resJson.address}</p>
                            <p>No. Telpon    : ${resJson.phone}</p>
                            <p>Email         : ${resJson.email}</p>
                            <p>Tahun berdiri : ${resJson.founded}</p>
                            <p>Warna         : ${resJson.clubColors}</p>
                            <p>Venue : ${resJson.venue}</p>
                            <a class="waves-effect waves-light btn" href="${resJson.website}" style="float:right">${resJson.shortName}</a>
                        </div>
                    </div>
                    <div class="row"></div>

                    <div class="row"><h5>Kompetisi Aktif</h5></div>
                    <div class="row">
                        <div class="card">
                            <table class="stripped responsive-table">
                                <thead>
                                    <th style="padding-left:20px;">No.</th>
                                    <th>Nama (ID)</th>
                                    <th>Area</th>
                                    <th>Plan</th>
                                </thead>
                                <tbody>
                                    ${competitions}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="row"></div>

                    <div class="row"><h5>Anggota</h5></div>
                    <div class="row">
                        ${squads}
                    </div>
                </div>
            `;
        }).catch(err => {
            console.error(err);
        })
}


function getListStandings() {
    title.innerHTML = "Klasemen Sementara Liga Primer Inggris";
    fetch(standingEndPoin, fetchHeader)
        .then(response => response.json())
        .then(resJson => {
            console.log(resJson.standings[0]);
            let teams = "";
            let i = 1;
            resJson.standings[0].table.forEach(team => {
                teams += `
                <tr>
                    <td style="padding-left:20px;">${i}.</td>
                    <td><img src="${team.team.crestUrl}" alt="${team.team.name}" width="30px"></td>
                    <td>${team.team.name}</td>
                    <td>${team.playedGames}</td>
                    <td>${team.won}</td>
                    <td>${team.draw}</td>
                    <td>${team.lost}</td>
                    <td>${team.points}</td>
                </tr>
                `;
                i++;

            });
            contents.innerHTML = `
                <div class="card">
                    <table class="stripped responsive-table">
                        <thead>
                            <th></th>
                            <th></th>
                            <th>Nama Tim</th>
                            <th>PG</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>P</th>
                        </thead>
                        <tbody>
                            ${teams}
                        </tbody>
                    </table>
                </div>
            `;
        }).catch(err => {
            console.error(err);
        })
}

function getListMatches() {
    title.innerHTML = "Jadwal Pertandingan Liga Primer Inggris";
    fetch(matchEndPoin, fetchHeader)
        .then(response => response.json())
        .then(resJson => {
            console.log(resJson.matches);
            let matchs = "";
            let i = 1;
            resJson.matches.forEach(match => {
                let d = new Date(match.utcDate).toLocaleDateString("id");
                let scoreHomeTeam = (match.score.fullTime.homeTeam == null ? 0 : match.score.fullTime.homeTeam);
                let scoreAwayTeam = (match.score.fullTime.awayTeam == null ? 0 : match.score.fullTime.awayTeam);
                matchs += `
                <tr>
                    <td style="padding-left:20px;">${i}.</td>
                    <td>${match.homeTeam.name} vs ${match.awayTeam.name}</td>
                    <td>${d}</td>
                    <td>${scoreHomeTeam}:${scoreAwayTeam}</td>
                </tr>
                `;
                i++;

            });
            contents.innerHTML = `
                <div class="card">
                    <table class="stripped responsive-table">
                        <thead>
                            <th></th>
                            <th>Peserta</th>
                            <th>Tanggal</th>
                            <th>Skor Akhir</th>
                        </thead>
                        <tbody>
                            ${matchs}
                        </tbody>
                    </table>
                </div>
            `;
        }).catch(err => {
            console.error(err);
        })
}

function loadPage(page) {
    switch (page) {
        case "teams":
            getListTeams();
            break;
        case "standings":
            getListStandings();
            break;
        case "matches":
            getListMatches();
            break;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

    document.querySelectorAll(".sidenav a, .topnav a").forEach(elm => {
        elm.addEventListener("click", evt => {
            let sideNav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sideNav).close();
            page = evt.target.getAttribute("href").substr(1);
            loadPage(page);
        })
    })
    var page = window.location.hash.substr(1);
    if (page === "" || page === "!") page = "teams";
    loadPage(page);
});