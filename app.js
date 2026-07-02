// ======================================
// My Health Map Version 2
// Part 1
// ======================================

// ---------- สร้างแผนที่ ----------
const map = L.map("map").setView([18.1424, 100.1327], 15);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "© OpenStreetMap",
        maxZoom: 20
    }
).addTo(map);

// ---------- Marker Cluster ----------
const markers = L.markerClusterGroup();
map.addLayer(markers);

// ---------- ตัวแปร ----------
let homes = [];
let people = [];

// ---------- เริ่มโหลดข้อมูล ----------
loadData();

async function loadData(){

    document.getElementById("status").innerHTML =
        "กำลังโหลดข้อมูล...";

    // โหลด HOME และ PERSON พร้อมกัน
    const [homeResponse, personResponse] = await Promise.all([
        fetch("HOME.txt"),
        fetch("PERSON.txt")
    ]);

    const homeText = await homeResponse.text();
    const personText = await personResponse.text();

    loadHomes(homeText);

    loadPersons(personText);

    createMarkers();

}// ======================================
// อ่าน HOME.txt
// ======================================

function loadHomes(text){

    const rows = text
        .replace(/\r/g,"")
        .trim()
        .split("\n");

    const header = rows[0].split("|");

    const HID = header.indexOf("HID");
    const HOUSE = header.indexOf("HOUSE");
    const HOUSE_ID = header.indexOf("HOUSE_ID");
    const LAT = header.indexOf("LATITUDE");
    const LNG = header.indexOf("LONGITUDE");

    homes = [];

    for(let i=1;i<rows.length;i++){

        const c = rows[i].split("|");

        const lat = parseFloat(c[LAT]);
        const lng = parseFloat(c[LNG]);

        if(isNaN(lat) || isNaN(lng)) continue;

        homes.push({

            hid : c[HID],

            house : c[HOUSE],

            house_id : c[HOUSE_ID],

            lat : lat,

            lng : lng

        });

    }

    console.log("HOME =",homes.length);

}



// ======================================
// อ่าน PERSON.txt
// ======================================

function loadPersons(text){

    const rows = text
        .replace(/\r/g,"")
        .trim()
        .split("\n");

    const header = rows[0].split("|");

    const HID = header.indexOf("HID");
    const PRENAME = header.indexOf("PRENAME");
    const NAME = header.indexOf("NAME");
    const LNAME = header.indexOf("LNAME");
    const SEX = header.indexOf("SEX");
    const BIRTH = header.indexOf("BIRTH");

    people = [];

    for(let i=1;i<rows.length;i++){

        const c = rows[i].split("|");

        people.push({

            hid : c[HID],

            fullname :
                c[PRENAME] + " " +
                c[NAME] + " " +
                c[LNAME],

            sex : c[SEX],

            birth : c[BIRTH]

        });

    }

    console.log("PERSON =",people.length);

}// ======================================
// สร้าง Marker และแสดงสมาชิกในบ้าน
// ======================================

function createMarkers(){

    markers.clearLayers();

    homes.forEach(home=>{

        // ค้นหาสมาชิกจาก HID
        const members = people.filter(p => p.hid === home.hid);

        // สร้าง HTML รายชื่อสมาชิก
        let html = "";

        if(members.length===0){

            html = "<i>ไม่พบข้อมูลสมาชิก</i>";

        }else{

            html = "<ol>";

            members.forEach(person=>{

                html += "<li>"+person.fullname+"</li>";

            });

            html += "</ol>";

        }

        const marker = L.marker([home.lat,home.lng]);

        marker.bindPopup(`
            <div style="min-width:260px">

                <h3 style="margin-bottom:10px;">
                    🏠 บ้านเลขที่ ${home.house}
                </h3>

                <b>HOUSE_ID :</b> ${home.house_id}<br>
                <b>HID :</b> ${home.hid}<br><br>

                <b>👨 สมาชิกในบ้าน (${members.length} คน)</b>

                <hr>

                ${html}

            </div>
        `);

        markers.addLayer(marker);

    });

    map.addLayer(markers);

    document.getElementById("status").innerHTML =
        "🏠 บ้าน " +
        homes.length.toLocaleString() +
        " หลัง | 👨 ประชาชน " +
        people.length.toLocaleString() +
        " คน";

}



// ======================================
// ค้นหาบ้าน
// ======================================

document.getElementById("search").addEventListener("keyup",function(){

    const keyword=this.value.trim();

    if(keyword==="") return;

    const home=homes.find(h=>h.house.includes(keyword));

    if(!home) return;

    map.setView([home.lat,home.lng],18);

});
