// ===============================
// My Health Map
// Version 1
// Part 1
// ===============================

// สร้างแผนที่
const map = L.map("map").setView([18.1424,100.1327],15);

// OpenStreetMap
L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:"© OpenStreetMap",
        maxZoom:20
    }
).addTo(map);

// Marker Cluster
const markers = L.markerClusterGroup();

// เก็บข้อมูลบ้านทั้งหมด
let homes = [];

// โหลดข้อมูล HOME
loadHome();


// ===============================
// โหลด HOME.txt
// ===============================

async function loadHome(){

    document.getElementById("status").innerHTML =
    "กำลังอ่าน HOME.txt ...";

    const response = await fetch("HOME.txt");

    const text = await response.text();

    const rows = text
        .replace(/\r/g,"")
        .trim()
        .split("\n");

    const header = rows[0].split("|");

    const LAT = header.indexOf("LATITUDE");
    const LNG = header.indexOf("LONGITUDE");
    const HOUSE = header.indexOf("HOUSE");
    const HOUSE_ID = header.indexOf("HOUSE_ID");

    for(let i=1;i<rows.length;i++){

        const c = rows[i].split("|");

        const lat = parseFloat(c[LAT]);
        const lng = parseFloat(c[LNG]);

        if(isNaN(lat) || isNaN(lng))
            continue;

        const home={

            house:c[HOUSE],

            house_id:c[HOUSE_ID],

            lat:lat,

            lng:lng

        };

        homes.push(home);

    }

    createMarkers();

}// ===============================
// สร้าง Marker
// ===============================

function createMarkers(){

    markers.clearLayers();

    homes.forEach(home=>{

        const marker = L.marker([home.lat,home.lng]);

        marker.bindPopup(`
            <div style="min-width:220px">
                <h3 style="margin:0 0 10px 0;">🏠 บ้านเลขที่ ${home.house}</h3>

                <b>HOUSE_ID</b><br>
                ${home.house_id}<br><br>

                <button onclick="showPeople('${home.house_id}')">
                    👨‍👩‍👧 ดูสมาชิกในบ้าน
                </button>

            </div>
        `);

        markers.addLayer(marker);

    });

    map.addLayer(markers);

    document.getElementById("status").innerHTML =
        "จำนวนบ้านทั้งหมด : " + homes.length.toLocaleString() + " หลัง";

}// ===============================
// ฟังก์ชันชั่วคราว
// Version 2 จะอ่าน PERSON.txt
// ===============================

function showPeople(houseid){

    alert(
        "HOUSE_ID : " + houseid +
        "\n\nVersion 2 จะแสดงรายชื่อสมาชิกจาก PERSON.txt"
    );

}
