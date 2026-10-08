/* =========================================
   SPIDER-WATCH
   ADVANCED CRIME INTELLIGENCE DASHBOARD
========================================= */


// =========================================
// DATA
// =========================================


const STORAGE_KEY = "spiderWatchIncidents_v2";


const sampleIncidents = [

    {
        id: 1,
        location: "Queens",
        time: "2026-08-11T09:20",
        crimeType: "Robbery",
        severity: "High",
        people: 4,
        latitude: 40.7282,
        longitude: -73.7949,
        resolved: false
    },

    {
        id: 2,
        location: "Brooklyn",
        time: "2026-08-10T18:45",
        crimeType: "Theft",
        severity: "Medium",
        people: 2,
        latitude: 40.6782,
        longitude: -73.9442,
        resolved: true
    },

    {
        id: 3,
        location: "Manhattan",
        time: "2026-08-10T14:10",
        crimeType: "Assault",
        severity: "High",
        people: 3,
        latitude: 40.7831,
        longitude: -73.9712,
        resolved: false
    },

    {
        id: 4,
        location: "Bronx",
        time: "2026-08-09T21:30",
        crimeType: "Burglary",
        severity: "Medium",
        people: 1,
        latitude: 40.8448,
        longitude: -73.8648,
        resolved: false
    },

    {
        id: 5,
        location: "Queens",
        time: "2026-08-09T11:15",
        crimeType: "Theft",
        severity: "Low",
        people: 1,
        latitude: 40.7421,
        longitude: -73.8214,
        resolved: true
    },

    {
        id: 6,
        location: "Manhattan",
        time: "2026-08-08T20:00",
        crimeType: "Robbery",
        severity: "High",
        people: 5,
        latitude: 40.7580,
        longitude: -73.9855,
        resolved: false
    },

    {
        id: 7,
        location: "Brooklyn",
        time: "2026-08-07T16:20",
        crimeType: "Cyber Crime",
        severity: "Medium",
        people: 6,
        latitude: 40.6501,
        longitude: -73.9496,
        resolved: true
    },

    {
        id: 8,
        location: "Bronx",
        time: "2026-08-06T10:40",
        crimeType: "Assault",
        severity: "High",
        people: 2,
        latitude: 40.8370,
        longitude: -73.8654,
        resolved: false
    }

];


let incidents =
    JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    );


if (!incidents) {

    incidents = sampleIncidents;

    saveData();

}


// =========================================
// SAVE DATA
// =========================================


function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(incidents)
    );

}


// =========================================
// CLOCK
// =========================================


function updateClock() {

    const now = new Date();

    const time =
        now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

    document.getElementById(
        "clock"
    ).textContent = time;

}


setInterval(
    updateClock,
    1000
);

updateClock();


// =========================================
// DATE/TIME FIX
// =========================================


function setDefaultDateTime() {

    const input =
        document.getElementById("time");

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    const hours =
        String(
            now.getHours()
        ).padStart(2, "0");

    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");


    input.value =
        `${year}-${month}-${day}T${hours}:${minutes}`;

}


setDefaultDateTime();


// =========================================
// MAP
// =========================================


const map =
    L.map("map").setView(
        [40.7128, -74.0060],
        11
    );


L.tileLayer(

    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    {

        attribution:
            "&copy; OpenStreetMap contributors"

    }

).addTo(map);


const markerLayer =
    L.layerGroup().addTo(map);


// =========================================
// MARKER COLOR
// =========================================


function markerColor(severity) {

    if (severity === "High") {

        return "#ed1745";

    }

    if (severity === "Medium") {

        return "#ff9f43";

    }

    return "#35d07f";

}


// =========================================
// UPDATE MAP
// =========================================


function updateMap() {

    markerLayer.clearLayers();


    incidents.forEach(
        incident => {


            const marker =
                L.circleMarker(

                    [
                        incident.latitude,
                        incident.longitude
                    ],

                    {

                        radius:
                            incident.severity === "High"
                                ? 10
                                : 7,

                        fillColor:
                            markerColor(
                                incident.severity
                            ),

                        color:
                            "#ffffff",

                        weight: 1,

                        fillOpacity: 0.85

                    }

                );


            marker.bindPopup(`

                <div>

                    <strong>
                        ${incident.crimeType}
                    </strong>

                    <br><br>

                    <b>Location:</b>
                    ${incident.location}

                    <br>

                    <b>Severity:</b>
                    ${incident.severity}

                    <br>

                    <b>People affected:</b>
                    ${incident.people}

                    <br>

                    <b>Status:</b>
                    ${
                        incident.resolved
                            ? "Resolved"
                            : "Open"
                    }

                </div>

            `);


            marker.addTo(markerLayer);

        }
    );

}


// =========================================
// STATISTICS
// =========================================


function updateStatistics() {


    const total =
        incidents.length;


    const high =
        incidents.filter(
            i =>
                i.severity === "High"
        ).length;


    const resolved =
        incidents.filter(
            i =>
                i.resolved
        ).length;


    const people =
        incidents.reduce(
            (sum, i) =>
                sum + Number(i.people),
            0
        );


    document.getElementById(
        "totalIncidents"
    ).textContent = total;


    document.getElementById(
        "highRisk"
    ).textContent = high;


    document.getElementById(
        "resolvedCases"
    ).textContent = resolved;


    document.getElementById(
        "peopleAffected"
    ).textContent = people;


    const change =
        total >= 5
            ? "Elevated activity detected"
            : "Normal activity level";


    document.getElementById(
        "incidentChange"
    ).textContent = change;

}


// =========================================
// INSIGHT ENGINE
// =========================================


function updateInsight() {


    const insight =
        document.getElementById(
            "mainInsight"
        );


    const description =
        document.getElementById(
            "insightDescription"
        );


    if (incidents.length === 0) {

        insight.textContent =
            "Waiting for incident data.";

        description.textContent =
            "Add an incident to begin intelligence analysis.";

        return;

    }


    // Find highest risk location

    const locationCounts = {};


    incidents.forEach(
        incident => {

            if (
                !locationCounts[
                    incident.location
                ]
            ) {

                locationCounts[
                    incident.location
                ] = 0;

            }

            locationCounts[
                incident.location
            ]++;

        }
    );


    let highestLocation = "";

    let highestCount = 0;


    Object.keys(locationCounts)
        .forEach(
            location => {

                if (
                    locationCounts[location]
                    >
                    highestCount
                ) {

                    highestLocation =
                        location;

                    highestCount =
                        locationCounts[location];

                }

            }
        );


    const high =
        incidents.filter(
            i =>
                i.severity === "High"
        ).length;


    const percentage =
        Math.round(
            (high / incidents.length)
            * 100
        );


    insight.textContent =
        `${highestLocation} is currently the most active zone.`;


    description.textContent =
        `${highestLocation} has ${highestCount} reported incidents. ${percentage}% of all current incidents are classified as high severity.`;

}


// =========================================
// INCIDENT TABLE
// =========================================


function displayIncidents() {


    const table =
        document.getElementById(
            "incidentTable"
        );


    const search =
        document.getElementById(
            "searchInput"
        ).value
        .toLowerCase();


    const severity =
        document.getElementById(
            "severityFilter"
        ).value;


    const status =
        document.getElementById(
            "statusFilter"
        ).value;


    const filtered =
        incidents.filter(
            incident => {


                const searchMatch =

                    incident.location
                        .toLowerCase()
                        .includes(search)

                    ||

                    incident.crimeType
                        .toLowerCase()
                        .includes(search);


                const severityMatch =

                    severity === "All"

                    ||

                    incident.severity ===
                        severity;


                const statusMatch =

                    status === "All"

                    ||

                    (
                        status === "Resolved"
                        &&
                        incident.resolved
                    )

                    ||

                    (
                        status === "Open"
                        &&
                        !incident.resolved
                    );


                return (
                    searchMatch
                    &&
                    severityMatch
                    &&
                    statusMatch
                );

            }
        );


    document.getElementById(
        "visibleCount"
    ).textContent =
        filtered.length;


    table.innerHTML = "";


    if (filtered.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="7">

                    <div class="empty-state">

                        <strong>
                            No incidents found
                        </strong>

                        Try changing your search or filters.

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    filtered.forEach(
        incident => {


            const row =
                document.createElement("tr");


            const severityClass =
                incident.severity
                    .toLowerCase();


            row.innerHTML = `

                <td>

                    <div class="incident-name">

                        ${incident.crimeType}

                    </div>

                    <div class="muted">

                        ID #${incident.id}

                    </div>

                </td>


                <td>

                    ${incident.location}

                </td>


                <td>

                    ${formatDate(
                        incident.time
                    )}

                </td>


                <td>

                    <span
                        class="badge badge-${severityClass}"
                    >

                        ${incident.severity}

                    </span>

                </td>


                <td>

                    ${incident.people} people

                </td>


                <td>

                    <span
                        class="badge ${
                            incident.resolved
                                ? "badge-resolved"
                                : "badge-open"
                        }"
                    >

                        ${
                            incident.resolved
                                ? "Resolved"
                                : "Open"
                        }

                    </span>

                </td>


                <td>

                    <button
                        class="table-action"
                        onclick="toggleResolved(${incident.id})"
                    >

                        ${
                            incident.resolved
                                ? "Reopen"
                                : "Resolve"
                        }

                    </button>


                    <button
                        class="table-action delete-action"
                        onclick="deleteIncident(${incident.id})"
                    >

                        Delete

                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );

}


// =========================================
// DATE FORMAT
// =========================================


function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleString(
        [],
        {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// =========================================
// RESOLVE
// =========================================


function toggleResolved(id) {


    incidents =
        incidents.map(
            incident => {

                if (
                    incident.id === id
                ) {

                    incident.resolved =
                        !incident.resolved;

                }

                return incident;

            }
        );


    saveData();

    refreshDashboard();

}


// =========================================
// DELETE
// =========================================


function deleteIncident(id) {


    const confirmed =
        confirm(
            "Delete this incident?"
        );


    if (!confirmed) {

        return;

    }


    incidents =
        incidents.filter(
            incident =>
                incident.id !== id
        );


    saveData();

    refreshDashboard();

}


// =========================================
// HIGH-RISK AREAS
// =========================================


function updateRiskAreas() {


    const container =
        document.getElementById(
            "riskAreas"
        );


    const counts = {};


    incidents.forEach(
        incident => {


            if (
                !counts[
                    incident.location
                ]
            ) {

                counts[
                    incident.location
                ] = 0;

            }


            counts[
                incident.location
            ]++;

        }
    );


    const areas =
        Object.entries(counts)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );


    container.innerHTML = "";


    if (areas.length === 0) {

        container.innerHTML =
            "<p class='muted'>No risk data available.</p>";

        return;

    }


    const maximum =
        areas[0][1];


    areas
        .slice(0, 5)
        .forEach(
            ([location, count]) => {


                const percentage =
                    (count / maximum)
                    * 100;


                container.innerHTML += `

                    <div class="risk-item">

                        <div class="risk-top">

                            <span class="risk-name">

                                ${location}

                            </span>

                            <span class="risk-number">

                                ${count} incidents

                            </span>

                        </div>


                        <div class="risk-bar">

                            <div
                                class="risk-fill"
                                style="width:${percentage}%"
                            ></div>

                        </div>

                    </div>

                `;

            }
        );

}


// =========================================
// ACTIVITY FEED
// =========================================


function updateActivity() {


    const feed =
        document.getElementById(
            "activityFeed"
        );


    const latest =
        [...incidents]
            .sort(
                (a, b) =>
                    new Date(b.time)
                    -
                    new Date(a.time)
            )
            .slice(0, 5);


    feed.innerHTML = "";


    latest.forEach(
        incident => {


            feed.innerHTML += `

                <div class="activity-item">

                    <span class="activity-dot"></span>

                    <div>

                        <strong>

                            ${incident.crimeType}
                            reported in
                            ${incident.location}

                        </strong>

                        <small>

                            ${formatDate(
                                incident.time
                            )}

                        </small>

                    </div>

                </div>

            `;

        }
    );

}


// =========================================
// CHARTS
// =========================================


let trendChart;

let crimeChart;


// =========================================
// TREND CHART
// =========================================


function createTrendChart() {


    const canvas =
        document.getElementById(
            "trendChart"
        );


    if (trendChart) {

        trendChart.destroy();

    }


    const filter =
        document.getElementById(
            "trendFilter"
        ).value;


    const days = [];


    const values = [];


    for (
        let i = 6;
        i >= 0;
        i--
    ) {


        const date =
            new Date();


        date.setDate(
            date.getDate() - i
        );


        const label =
            date.toLocaleDateString(
                [],
                {
                    weekday: "short"
                }
            );


        days.push(label);


        const count =
            incidents.filter(
                incident => {


                    const incidentDate =
                        new Date(
                            incident.time
                        );


                    const sameDay =
                        incidentDate
                            .toDateString()
                        ===
                        date.toDateString();


                    const sameCrime =

                        filter === "all"
                        ||
                        incident.crimeType ===
                            filter;


                    return (
                        sameDay
                        &&
                        sameCrime
                    );

                }
            ).length;


        values.push(count);

    }


    trendChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels: days,

                    datasets: [

                        {

                            label:
                                "Incidents",

                            data:
                                values,

                            borderColor:
                                "#ed1745",

                            backgroundColor:
                                "rgba(237,23,69,0.10)",

                            fill: true,

                            tension: 0.4,

                            pointBackgroundColor:
                                "#ed1745",

                            pointBorderColor:
                                "#ffffff",

                            pointRadius: 4

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            display: false

                        }

                    },

                    scales: {

                        x: {

                            grid: {

                                color:
                                    "#20242d"

                            },

                            ticks: {

                                color:
                                    "#737988"

                            }

                        },

                        y: {

                            beginAtZero: true,

                            ticks: {

                                stepSize: 1,

                                color:
                                    "#737988"

                            },

                            grid: {

                                color:
                                    "#20242d"

                            }

                        }

                    }

                }

            }
        );

}


// =========================================
// CRIME CHART
// =========================================


function createCrimeChart() {


    const canvas =
        document.getElementById(
            "crimeChart"
        );


    if (crimeChart) {

        crimeChart.destroy();

    }


    const counts = {};


    incidents.forEach(
        incident => {

            if (
                !counts[
                    incident.crimeType
                ]
            ) {

                counts[
                    incident.crimeType
                ] = 0;

            }


            counts[
                incident.crimeType
            ]++;

        }
    );


    crimeChart =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels:
                        Object.keys(
                            counts
                        ),

                    datasets: [

                        {

                            data:
                                Object.values(
                                    counts
                                ),

                            backgroundColor: [

                                "#ed1745",

                                "#ff9f43",

                                "#4da3ff",

                                "#35d07f",

                                "#a78bfa",

                                "#ffd166",

                                "#6c757d"

                            ],

                            borderWidth: 0

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    cutout: "68%",

                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {

                                color: "#a4a9b5",

                                padding: 15,

                                font: {

                                    size: 10

                                }

                            }

                        }

                    }

                }

            }
        );

}


// =========================================
// MODAL
// =========================================


const modal =
    document.getElementById(
        "incidentModal"
    );


document
    .getElementById(
        "openModalBtn"
    )
    .addEventListener(
        "click",
        () => {

            setDefaultDateTime();

            modal.classList.add(
                "show"
            );

        }
    );


function closeModal() {

    modal.classList.remove(
        "show"
    );

}


document
    .getElementById(
        "closeModalBtn"
    )
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById(
        "cancelBtn"
    )
    .addEventListener(
        "click",
        closeModal
    );


modal.addEventListener(
    "click",
    event => {

        if (
            event.target === modal
        ) {

            closeModal();

        }

    }
);


// =========================================
// ADD INCIDENT
// =========================================


document
    .getElementById(
        "incidentForm"
    )
    .addEventListener(
        "submit",
        event => {


            event.preventDefault();


            const location =
                document.getElementById(
                    "location"
                ).value.trim();


            const time =
                document.getElementById(
                    "time"
                ).value;


            const crimeType =
                document.getElementById(
                    "crimeType"
                ).value;


            const severity =
                document.getElementById(
                    "severity"
                ).value;


            const people =
                Number(
                    document.getElementById(
                        "people"
                    ).value
                );


            const latitude =
                Number(
                    document.getElementById(
                        "latitude"
                    ).value
                );


            const longitude =
                Number(
                    document.getElementById(
                        "longitude"
                    ).value
                );


            // Validate coordinates

            if (
                latitude < -90 ||
                latitude > 90
            ) {

                alert(
                    "Latitude must be between -90 and 90."
                );

                return;

            }


            if (
                longitude < -180 ||
                longitude > 180
            ) {

                alert(
                    "Longitude must be between -180 and 180."
                );

                return;

            }


            const incident = {

                id:
                    Date.now(),

                location,

                time,

                crimeType,

                severity,

                people,

                latitude,

                longitude,

                resolved:
                    false

            };


            incidents.unshift(
                incident
            );


            saveData();

            refreshDashboard();


            document
                .getElementById(
                    "incidentForm"
                )
                .reset();


            setDefaultDateTime();

            closeModal();


            // Move map to new incident

            map.setView(
                [
                    latitude,
                    longitude
                ],
                13
            );

        }
    );


// =========================================
// FILTER EVENTS
// =========================================


document
    .getElementById(
        "searchInput"
    )
    .addEventListener(
        "input",
        displayIncidents
    );


document
    .getElementById(
        "severityFilter"
    )
    .addEventListener(
        "change",
        displayIncidents
    );


document
    .getElementById(
        "statusFilter"
    )
    .addEventListener(
        "change",
        displayIncidents
    );


document
    .getElementById(
        "trendFilter"
    )
    .addEventListener(
        "change",
        createTrendChart
    );


// =========================================
// RESET FILTERS
// =========================================


document
    .getElementById(
        "resetFilters"
    )
    .addEventListener(
        "click",
        () => {

            document.getElementById(
                "searchInput"
            ).value = "";


            document.getElementById(
                "severityFilter"
            ).value = "All";


            document.getElementById(
                "statusFilter"
            ).value = "All";


            displayIncidents();

        }
    );


// =========================================
// REFRESH EVERYTHING
// =========================================


function refreshDashboard() {

    updateStatistics();

    displayIncidents();

    updateMap();

    updateInsight();

    updateRiskAreas();

    updateActivity();

    createTrendChart();

    createCrimeChart();

}


// =========================================
// START APPLICATION
// =========================================


refreshDashboard();