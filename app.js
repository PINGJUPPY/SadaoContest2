// ================= ตั้งค่าระบบ =================
const API_URL = "https://script.google.com/macros/s/AKfycbwe2cc7c3dfQcVRShpXuP51SFMpk42NozsUYeM8NsRI6Zwkx5h6bYh_r8K3uqglBCZ6QA/exec";

let loginAttempts = 0;
let isCooldown = false;
let currentUser = null;
let worksData = []; // เก็บข้อมูลผลงาน

// ================= ระบบเกณฑ์การให้คะแนนแบบ Dynamic =================
// ออกแบบให้เรียกใช้ซ้ำได้ ช่วยให้หน้าจอโหลดเร็ว และลดพื้นที่โค้ด
const criteriaConfig = {
    "Oral Presentation : วิจัย": [
        { section: "ส่วนที่ 1 เนื้อหาบทคัดย่อ และผลงานฉบับสมบูรณ์ (รวม 80 คะแนน)", items: [
            { id: "q1_1", text: "ชื่อเรื่องมีความเหมาะสม น่าสนใจ", max: 10 },
            { id: "q1_2", text: "ที่มาและความสำคัญ", max: 10 },
            { id: "q1_3", text: "วัตถุประสงค์ สมมติฐาน กรอบแนวคิด ระเบียบวิธีวิจัย", max: 15 },
            { id: "q1_4", text: "เครื่องมือและการวิเคราะห์ข้อมูล", max: 15 },
            { id: "q1_5", text: "ผลการวิจัย", max: 10 },
            { id: "q1_6", text: "การอภิปรายผลการวิจัย", max: 10 },
            { id: "q1_7", text: "การสรุปและข้อเสนอแนะ", max: 10 }
        ]},
        { section: "ส่วนที่ 2 การนำเสนอ และการนำไปใช้ประโยชน์ (รวม 20 คะแนน)", items: [
            { id: "q2_1", text: "บุคลิกภาพและความมั่นใจ", max: 5 },
            { id: "q2_2", text: "การนำไปใช้ประโยชน์", max: 10 },
            { id: "q2_3", text: "การตอบคำถาม", max: 5 }
        ]}
    ],
    "Poster Presentation : วิจัย": [
        { section: "ส่วนที่ 1 เนื้อหา (รวม 50 คะแนน)", items: [
            { id: "p1_1", text: "ชื่อเรื่องและเนื้อหามีความน่าสนใจ", max: 10 },
            { id: "p1_2", text: "บทนำ มีเหตุผลเพียงพอ", max: 10 },
            { id: "p1_3", text: "วัตถุประสงค์และระเบียบวิธีวิจัยถูกต้อง", max: 10 },
            { id: "p1_4", text: "สรุปผลการศึกษา", max: 10 },
            { id: "p1_5", text: "การอภิปรายและข้อเสนอแนะ", max: 10 }
        ]},
        { section: "ส่วนที่ 2 การนำเสนอ และการนำไปใช้ประโยชน์ (รวม 50 คะแนน)", items: [
            { id: "p2_1", text: "บุคลิกภาพและความมั่นใจ", max: 5 },
            { id: "p2_2", text: "การจัดองค์ประกอบน่าสนใจ", max: 15 },
            { id: "p2_3", text: "การนำไปใช้ประโยชน์", max: 15 },
            { id: "p2_4", text: "การตอบคำถาม", max: 15 }
        ]}
    ]
    // *** สามารถเพิ่มประเภท CQI, R2R, Photo voice เข้ามาตรงนี้ได้เลยโดยใช้โครงสร้างเดียวกัน ***
};

// ================= ระบบ UI & API =================
function showLoading(show) {
    document.getElementById('loading-overlay').style.display = show ? 'flex' : 'none';
}

async function handleLogin() {
    if (isCooldown) return;
    
    const inputId = document.getElementById('login-id').value;
    if(inputId.length !== 6) {
        Swal.fire({ icon: 'warning', title: 'แจ้งเตือน', text: 'กรุณากรอกรหัส 6 หลัก' });
        return;
    }

    showLoading(true);
    try {
        // ยิง API เช็ค Login
        const response = await fetch(`${API_URL}?action=login&id=${inputId}`);
        const result = await response.json();

        if (result.success) {
            currentUser = result.user; // คาดหวัง Object {id, name, role, group}
            loginAttempts = 0;
            
            Swal.fire({
                title: 'ยินดีต้อนรับ!',
                text: `คุณ ${currentUser.name} (${currentUser.role})`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                document.getElementById('login-section').classList.add('hidden-page');
                document.getElementById('main-app').classList.remove('hidden-page');
                
                document.getElementById('user-name').innerText = currentUser.name;
                document.getElementById('user-role').innerText = currentUser.role;
                
                navigate('home');
                fetchWorks(); // ดึงข้อมูลผลงานเตรียมไว้
            });
        } else {
            handleLoginFail();
        }
    } catch (error) {
        console.error("Login Error:", error);
        // Fallback ไว้ทดสอบระบบกรณี API ยังไม่สมบูรณ์
        if(inputId === "123456") {
             currentUser = { id: "123456", name: "นพ.ทดสอบ (Admin)", role: "Admin", group: "All" };
             document.getElementById('login-section').classList.add('hidden-page');
             document.getElementById('main-app').classList.remove('hidden-page');
             document.getElementById('user-name').innerText = currentUser.name;
             document.getElementById('user-role').innerText = currentUser.role;
             navigate('home');
        } else {
             handleLoginFail();
        }
    } finally {
        showLoading(false);
    }
}

function handleLoginFail() {
    loginAttempts++;
    if(loginAttempts >= 3) {
        startCooldown();
    } else {
        Swal.fire({
            title: 'รหัสไม่ถูกต้อง!',
            text: `มีโอกาสเข้าได้อีก ${3 - loginAttempts} ครั้ง`,
            icon: 'error'
        });
    }
}

function startCooldown() {
    isCooldown = true;
    let timeLeft = 90;
    const timerDisplay = document.getElementById('cooldown-timer');
    const inputField = document.getElementById('login-id');
    const btn = document.getElementById('btn-login');
    
    timerDisplay.classList.remove('hidden');
    inputField.disabled = true;
    btn.disabled = true;
    btn.classList.add('opacity-50');

    Swal.fire({ title: 'ระบบระงับชั่วคราว', text: 'กรอกผิดเกิน 3 ครั้ง กรุณารอ 90 วินาที', icon: 'warning' });

    const countdown = setInterval(() => {
        timerDisplay.innerText = `คูลดาวน์: ${timeLeft} วินาที`;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(countdown);
            isCooldown = false;
            loginAttempts = 0;
            timerDisplay.classList.add('hidden');
            inputField.disabled = false;
            inputField.value = '';
            btn.disabled = false;
            btn.classList.remove('opacity-50');
        }
    }, 1000);
}

// ================= ระบบนำทาง (Navigation) =================
function navigate(page) {
    const titles = { home: "หน้าหลัก", works: "รายชื่อผลงาน", scoring: "เลือกผลงานเพื่อให้คะแนน", summary: "สรุปผลคะแนน" };
    document.getElementById('current-menu-title').innerText = titles[page];
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = ''; 

    if (page === 'home') renderHome();
    else if (page === 'works') renderWorks();
    else if (page === 'scoring') renderScoringList();
    else if (page === 'summary') renderSummary();
}

function renderHome() {
    document.getElementById('content-area').innerHTML = `
        <div class="glass-panel p-8 text-center bg-white/40">
            <h2 class="text-2xl font-bold mb-4 text-blue-900">ยินดีต้อนรับสู่ระบบให้คะแนน</h2>
            <p class="text-gray-700 mb-6">กรุณาเลือกเมนูที่แถบด้านล่างเพื่อเริ่มต้นการทำงาน</p>
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-blue-100 p-4 rounded-xl shadow">
                    <h3 class="font-bold text-blue-800">ห้องพรีเซนต์</h3>
                    <p class="text-3xl font-bold mt-2 text-blue-600">3</p>
                </div>
                <div class="bg-green-100 p-4 rounded-xl shadow">
                    <h3 class="font-bold text-green-800">ผลงานทั้งหมด</h3>
                    <p class="text-3xl font-bold mt-2 text-green-600">100</p>
                </div>
            </div>
        </div>
    `;
}

// ================= ฟอร์มให้คะแนน (UX เร็ว ลื่นไหล) =================
function openScoringForm(workId, category, title) {
    document.getElementById('current-menu-title').innerText = "กำลังให้คะแนน...";
    const criteria = criteriaConfig[category];
    
    if(!criteria) {
        Swal.fire('ข้อผิดพลาด', 'ยังไม่ได้ตั้งค่าเกณฑ์ของประเภทนี้ในระบบ', 'error');
        return;
    }

    let html = `
        <div class="glass-panel p-5 bg-white/90">
            <div class="border-b-2 border-blue-500 pb-3 mb-4">
                <h2 class="text-xl font-bold text-blue-900">${title}</h2>
                <p class="text-sm font-semibold text-gray-600">ประเภท: ${category}</p>
            </div>
            <form id="score-form" onsubmit="submitScore(event, '${workId}', '${category}')">
    `;

    criteria.forEach(sec => {
        html += `<div class="bg-blue-50 p-3 rounded-lg mb-4 shadow-sm border border-blue-100">
                    <h3 class="font-bold text-blue-800 mb-3 text-sm">${sec.section}</h3>`;
        
        sec.items.forEach(item => {
            // ใช้ Range Slider ผสมตัวเลข เพื่อให้กดและลากได้ไวที่สุดในมือถือ
            html += `
                <div class="mb-4 bg-white p-3 rounded border border-gray-200">
                    <label class="block text-sm font-semibold mb-2 text-gray-700">${item.text} (เต็ม ${item.max})</label>
                    <div class="flex items-center gap-3">
                        <input type="range" id="${item.id}" min="0" max="${item.max}" value="0" required
                               class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                               oninput="document.getElementById('val_${item.id}').innerText = this.value; calculateTotal();">
                        <span id="val_${item.id}" class="text-xl font-bold text-white w-12 text-center bg-blue-600 rounded-lg py-1 shadow">0</span>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    });

    html += `
            <div class="flex items-center justify-between bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6 shadow">
                <label class="font-bold text-red-600">คะแนนหักลบ (-)</label>
                <input type="number" id="deduct_score" min="0" max="100" value="0" class="w-20 p-2 text-center rounded border border-red-300 font-bold text-red-600" oninput="calculateTotal()">
            </div>
            
            <div class="sticky bottom-4 z-50">
                <div class="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center border-2 border-blue-400">
                    <div>
                        <p class="text-xs text-blue-200">รวมคะแนนทั้งหมด</p>
                        <p class="text-3xl font-bold"><span id="total_score_display">0</span> <span class="text-sm font-normal">/ 100</span></p>
                    </div>
                    <button type="submit" class="bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition transform hover:scale-105">
                        <i class="fas fa-paper-plane mr-2"></i> ส่งคะแนน
                    </button>
                </div>
            </div>
            </form>
        </div>
    `;
    
    document.getElementById('content-area').innerHTML = html;
}

function calculateTotal() {
    let total = 0;
    // หา input range ทั้งหมดในฟอร์มมารวมกัน
    const inputs = document.querySelectorAll('input[type="range"]');
    inputs.forEach(inp => total += parseInt(inp.value || 0));
    
    const deduct = parseInt(document.getElementById('deduct_score').value || 0);
    total -= deduct;
    if(total < 0) total = 0;
    
    document.getElementById('total_score_display').innerText = total;
}

async function submitScore(e, workId, category) {
    e.preventDefault();
    const inputs = document.querySelectorAll('input[type="range"]');
    let scoreData = {};
    inputs.forEach(inp => scoreData[inp.id] = parseInt(inp.value));
    
    const deduct = parseInt(document.getElementById('deduct_score').value || 0);
    const total = parseInt(document.getElementById('total_score_display').innerText);

    const payload = {
        action: "submitScore",
        workId: workId,
        judgeId: currentUser.id,
        judgeName: currentUser.name,
        category: category,
        scores: scoreData,
        deduct: deduct,
        totalScore: total
    };

    showLoading(true);
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        
        Swal.fire({ icon: 'success', title: 'ส่งคะแนนสำเร็จ!', timer: 1500, showConfirmButton: false });
        navigate('scoring'); // กลับไปหน้าเลือกผลงาน
    } catch (err) {
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่', 'error');
        console.error(err);
    } finally {
        showLoading(false);
    }
}

function logout() {
    Swal.fire({
        title: 'ยืนยันการออกจากระบบ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ออกจากระบบ',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#d33'
    }).then((result) => {
        if (result.isConfirmed) {
            currentUser = null;
            document.getElementById('main-app').classList.add('hidden-page');
            document.getElementById('login-section').classList.remove('hidden-page');
            document.getElementById('login-id').value = '';
        }
    });
}
