const API_URL = "https://script.google.com/macros/s/AKfycbwe2cc7c3dfQcVRShpXuP51SFMpk42NozsUYeM8NsRI6Zwkx5h6bYh_r8K3uqglBCZ6QA/exec";
let loginAttempts = 0;
let isCooldown = false;
let currentUser = null;

const criteriaConfig = {
    "Oral Presentation : วิจัย": [
        { section: "ส่วนที่ 1 เนื้อหาบทคัดย่อ และผลงานฉบับสมบูรณ์ (รวม 80 คะแนน)", items: [
            { id: "q1", text: "1) ชื่อเรื่องมีความเหมาะสม น่าสนใจ", max: 10 },
            { id: "q2", text: "2) ที่มาและความสำคัญ", max: 10 },
            { id: "q3", text: "3) วัตถุประสงค์การวิจัย / สมมติฐานการวิจัย/ กรอบแนวคิด ระเบียบวิธีวิจัย และการเลือกกลุ่มตัวอย่าง", max: 15 },
            { id: "q4", text: "4) เครื่องมือการวิจัยและการทดสอบคุณภาพขั้นตอนการวิจัย และการวิเคราะห์ข้อมูล การวิจัย", max: 15 },
            { id: "q5", text: "5) ผลการวิจัย", max: 10 },
            { id: "q6", text: "6) การอภิปรายผลการวิจัย", max: 10 },
            { id: "q7", text: "7) การสรุปการวิจัยและข้อเสนอแนะจากการวิจัย", max: 10 }
        ]},
        { section: "ส่วนที่ 2 การนำเสนอ และการนำไปใช้ประโยชน์ (รวม 20 คะแนน)", items: [
            { id: "q8", text: "1) บุคลิกภาพและความมั่นใจของผู้นำเสนอ", max: 5 },
            { id: "q9", text: "2) การนำไปใช้ประโยชน์", max: 10 },
            { id: "q10", text: "3) การตอบคำถาม", max: 5 }
        ]}
    ],
    "Poster Presentation : วิจัย": [
        { section: "ส่วนที่ 1 เนื้อหา (รวม 50 คะแนน)", items: [
            { id: "q1", text: "1) ชื่อเรื่องและเนื้อหามีความน่าสนใจ", max: 10 },
            { id: "q2", text: "2) บทนำ มีเหตุผลเพียงพอ และบอกถึงความสำคัญของปัญหา", max: 10 },
            { id: "q3", text: "3) วัตถุประสงค์ชัดเจน ระเบียบวิธีวิจัยถูกต้อง เหมาะสม", max: 10 },
            { id: "q4", text: "4) สรุปผลการศึกษาสอดคล้องกับวัตถุประสงค์การวิจัย", max: 10 },
            { id: "q5", text: "5) การอภิปรายและการให้ข้อเสนอแนะครอบคลุมประเด็นสำคัญ", max: 10 }
        ]},
        { section: "ส่วนที่ 2 การนำเสนอ และการนำไปใช้ประโยชน์ (รวม 50 คะแนน)", items: [
            { id: "q6", text: "1) การนำเสนอบุคลิกภาพและความมั่นใจของผู้นำเสนอ", max: 5 },
            { id: "q7", text: "2) การจัดองค์ประกอบและเนื้อหาเหมาะสมความน่าสนใจ", max: 15 },
            { id: "q8", text: "3) การนำไปใช้ประโยชน์", max: 15 },
            { id: "q9", text: "4) การตอบคำถาม", max: 15 }
        ]}
    ],
    "Oral Presentation : R2R": [
        { section: "ส่วนที่ 1 เนื้อหาบทคัดย่อ และผลงานฉบับสมบูรณ์ (รวม 80 คะแนน)", items: [
            { id: "q1", text: "1) ชื่อเรื่องมีความเหมาะสม น่าสนใจ", max: 5 },
            { id: "q2", text: "2) ที่มาและความสำคัญ", max: 10 },
            { id: "q3", text: "3) วัตถุประสงค์การวิจัย / สมมติฐานการวิจัย/ กรอบแนวคิด ระเบียบวิธีวิจัย และการ เลือกกลุ่มตัวอย่าง", max: 15 },
            { id: "q4", text: "4) เครื่องมือการวิจัยและการทดสอบคุณภาพขั้นตอนการวิจัย และการวิเคราะห์ข้อมูล การวิจัย", max: 15 },
            { id: "q5", text: "5) ผลการวิจัย", max: 10 },
            { id: "q6", text: "6) การอภิปรายผลการวิจัย", max: 10 },
            { id: "q7", text: "7) การสรุปการวิจัยและข้อเสนอแนะจากการวิจัย", max: 10 },
        ]},
        { section: "ส่วนที่ 2 การนำเสนอ และการนำไปใช้ประโยชน์ (รวม 20 คะแนน)", items: [
            { id: "q9", text: "1) การนำเสนอบุคลิกภาพและความมั่นใจของผู้นำเสนอ", max: 5 },
            { id: "q10", text: "2) การนำไปใช้ประโยชน์", max: 10 },
            { id: "q11", text: "3) การตอบคำถาม", max: 5 }
        ]}
    ],
    "Oral Presentation : CQI Clinic": [
        { section: "ส่วนที่ 1 เนื้อหาบทคัดย่อ และผลงานฉบับสมบูรณ์ (รวม 80 คะแนน)", items: [
            { id: "q1", text: "1) ชื่อเรื่องมีความเหมาะสม", max: 5 },
            { id: "q2", text: "2) ระบุปัญหาเชื่อมโยงเห็น Gap of knowledge", max: 10 },
            { id: "q3", text: "3) ความสอดคล้องของวัตถุประสงค์และวิธีดำเนินงาน", max: 10 },
            { id: "q4", text: "4) ความถูกต้องและเหมาะสมของวิธีดำเนินงานเกี่ยวกับประชากร/กลุ่มตัวอย่าง", max: 10 },
            { id: "q5", text: "5) พัฒนา/เลือกเครื่องมือที่มีคุณภาพ", max: 10 },
            { id: "q6", text: "6) การเก็บรวบรวมข้อมูลได้อย่างเหมาะสมและการวิเคราะห์ข้อมูลได้อย่างถูกต้อง", max: 10 },
            { id: "q7", text: "7) สรุปผลและเสนอแนะได้สอดคล้องกับวัตถุประสงค์ของการศึกษา", max: 10 },
            { id: "q8", text: "8) ประโยชน์ต่อการนำไปใช้และคุณค่าต่อการนำไปใช้ต่อยอด", max: 15 }
        ]},
        { section: "ส่วนที่ 2 การนำเสนอ และการนำไปใช้ประโยชน์ (รวม 20 คะแนน)", items: [
            { id: "q9", text: "1) การนำเสนอบุคลิกภาพและความมั่นใจของผู้นำเสนอ", max: 5 },
            { id: "q10", text: "2) การนำไปใช้ประโยชน์", max: 10 },
            { id: "q11", text: "3) การตอบคำถาม", max: 5 }
        ]}
    ],
    "Oral Presentation : CQI Non Clinic": [
        { section: "ส่วนที่ 1 เนื้อหาบทคัดย่อ และผลงานฉบับสมบูรณ์ (รวม 80 คะแนน)", items: [
            { id: "q1", text: "1) ชื่อเรื่องมีความเหมาะสม", max: 5 },
            { id: "q2", text: "2) ระบุปัญหาเชื่อมโยงเห็น Gap of knowledge", max: 10 },
            { id: "q3", text: "3) ความสอดคล้องของวัตถุประสงค์และวิธีดำเนินงาน", max: 10 },
            { id: "q4", text: "4) ความถูกต้องและเหมาะสมของวิธีดำเนินงานเกี่ยวกับประชากร/กลุ่มตัวอย่าง", max: 10 },
            { id: "q5", text: "5) พัฒนา/เลือกเครื่องมือที่มีคุณภาพ", max: 10 },
            { id: "q6", text: "6) การเก็บรวบรวมข้อมูลได้อย่างเหมาะสมและการวิเคราะห์ข้อมูลได้อย่างถูกต้อง", max: 10 },
            { id: "q7", text: "7) สรุปผลและเสนอแนะได้สอดคล้องกับวัตถุประสงค์ของการศึกษา", max: 10 },
            { id: "q8", text: "8) ประโยชน์ต่อการนำไปใช้และคุณค่าต่อการนำไปใช้ต่อยอด", max: 15 }
        ]},
        { section: "ส่วนที่ 2 การนำเสนอ และการนำไปใช้ประโยชน์ (รวม 20 คะแนน)", items: [
            { id: "q9", text: "1) การนำเสนอบุคลิกภาพและความมั่นใจของผู้นำเสนอ", max: 5 },
            { id: "q10", text: "2) การนำไปใช้ประโยชน์", max: 10 },
            { id: "q11", text: "3) การตอบคำถาม", max: 5 }
        ]}
    ],
    "ผลงานประเภทนวัตกรรม Poster": [
        { section: "ส่วนที่ 1 ชื่อเรื่องและเนื้อหา (รวม 50 คะแนน)", items: [
            { id: "q1", text: "1) ชื่อเรื่องและเนื้อหามีความน่าสนใจ", max: 10 },
            { id: "q2", text: "2) วัตถุประสงค์และกระบวนสร้างนวัตกรรมหรือสิ่งประดิษฐ์ ถูกต้องเหมาะสม", max: 10 },
            { id: "q3", text: "3) ผลสำเร็จ สอดคล้องกับวัตถุประสงค์", max: 10 },
            { id: "q4", text: "4) การขยายผลหรือพัฒนาต่อยอด", max: 10 },
            { id: "q5", text: "5) ความสมบูรณ์ของเนื้อหาตามวัตถุประสงค์และการอภิปราย", max: 10 }
        ]},
        { section: "ส่วนที่ 2 การนำเสนอ และการนำไปใช้ประโยชน์ (รวม 50 คะแนน)", items: [
            { id: "q6", text: "1) การนำเสนอบุคลิกภาพและความมั่นใจของผู้นำเสนอ", max: 10 },
            { id: "q7", text: "2) การจัดองค์ประกอบเหมาะสมน่าสนใจ", max: 15 },
            { id: "q8", text: "3) การนำไปใช้ประโยชน์", max: 15 },
            { id: "q9", text: "4) การตอบคำถาม", max: 10 }
        ]}
    ],
    "Photo voice : ในชุมชน": [
        { section: "ส่วนที่ 1 ชื่อภาพ/เนื้อหา (รวม 30 คะแนน)", items: [
            { id: "q1", text: "1) ชื่อภาพและเนื้อหาสัมพันธ์กับภาพ", max: 15 },
            { id: "q2", text: "2) สื่อถึงเรื่องราวที่ต้องการนำเสนอ", max: 15 }
        ]},
        { section: "ส่วนที่ 2 ภาพ และเทคนิคการถ่ายภาพ (รวม 50 คะแนน)", items: [
            { id: "q3", text: "1) สื่อความหมาย /อารมณ์ มีความคิดสร้างสรรค์", max: 15 },
            { id: "q4", text: "2) สอดคล้องกับชื่อภาพและเนื้อหา", max: 10 },
            { id: "q5", text: "3) มีความคมชัด /จุดเด่นของภาพ", max: 10 },
            { id: "q6", text: "4) มุมกล้อง /องค์ประกอบของภาพ", max: 15 }
        ]},
        { section: "ส่วนที่ 3 การนำเสนอ และตอบคำถาม (รวม 20 คะแนน)", items: [
            { id: "q7", text: "1) การนำเสนอบุคลิกภาพและความมั่นใจของผู้นำเสนอ", max: 10 },
            { id: "q8", text: "2) การตอบคำถาม", max: 10 }
        ]}
    ],
    "Photo voice : ในสถานบริการ": [
         { section: "ส่วนที่ 1 ชื่อภาพ/เนื้อหา (รวม 30 คะแนน)", items: [
            { id: "q1", text: "1) ชื่อภาพและเนื้อหาสัมพันธ์กับภาพ", max: 15 },
            { id: "q2", text: "2) สื่อถึงเรื่องราวที่ต้องการนำเสนอ", max: 15 }
        ]},
        { section: "ส่วนที่ 2 ภาพ และเทคนิคการถ่ายภาพ (รวม 50 คะแนน)", items: [
            { id: "q3", text: "1) สื่อความหมาย /อารมณ์ มีความคิดสร้างสรรค์", max: 15 },
            { id: "q4", text: "2) สอดคล้องกับชื่อภาพและเนื้อหา", max: 10 },
            { id: "q5", text: "3) มีความคมชัด /จุดเด่นของภาพ", max: 10 },
            { id: "q6", text: "4) มุมกล้อง /องค์ประกอบของภาพ", max: 15 }
        ]},
        { section: "ส่วนที่ 3 การนำเสนอ และตอบคำถาม (รวม 20 คะแนน)", items: [
            { id: "q7", text: "1) การนำเสนอบุคลิกภาพและความมั่นใจของผู้นำเสนอ", max: 10 },
            { id: "q8", text: "2) การตอบคำถาม", max: 10 }
        ]}
    ],
    "เรื่องเล่า": [
        { section: "ส่วนที่ 1 เนื้อเรื่อง/บท น่าสนใจ (รวม 70 คะแนน)", items: [
            { id: "q1", text: "1) มีหัวใจของเรื่อง /ประเด็นที่จะสื่อสารต่อผู้ฟัง – ผู้ชม มีการกำหนดเป้าหมายที่ชัดเจน", max: 15 },
            { id: "q2", text: "2) มีการกำหนดกรอบของแก่นเรื่อง", max: 15 },
            { id: "q3", text: "3) การสร้างฉาก การแนะนำตัวละคร การสร้างปมความ ขัดแย้ง การคลี่คลาย หรือ high light", max: 15 },
            { id: "q4", text: "4) โครงเรื่องเล่าผ่านเรื่องราวเพื่อเปลี่ยนแปลงระบบงานที่สำคัญ หรือสร้างแรง บันดาลใจ หรือ เร้าพลัง/ปลุกพลัง", max: 15 },
            { id: "q5", text: "5) มีผลลัพธ์ที่เกิดจากการเปลี่ยนแปลงระบบงาน หรือมี Lesson learned ทีสามารถนำไปใช้ ประโยชน์ในงาน", max: 10 }
        ]},
        { section: "ส่วนที่ 2 การนำเสนอ (รวม 30 คะแนน)", items: [
            { id: "q6", text: "1) การเล่า/การนำเสนอ (เกริ่นนำ ,การสร้างฉาก, การเปิดลีลาการนำเสนอและการสรุป)", max: 10 },
            { id: "q7", text: "2) เทคนิคการนำเสนอ หรือ การใช้สื่อ (ดึงดูด น่าสนใจ และมีความต่อเนื่องเชื่อมโยง)", max: 10 },
            { id: "q8", text: "3) การตอบคำถาม", max: 10 }
        ]}
    ],
    "หนังสั้น": [
        { section: "ส่วนที่ 1 เนื้อหา (รวม 40 คะแนน)", items: [
            { id: "q1", text: "1) การร้อยเรียงเรื่องราว น่าสนใจ", max: 15 },
            { id: "q2", text: "2) เนื้อเรื่อง/บท สะท้อนความรู้สึกและการเรียนรู้", max: 10 },
            { id: "q3", text: "3) การแสดง/การสื่อ/ท่าทางอารมณ์สอดคล้องกับเหตุการณ์ในเรื่อง", max: 15 }
        ]},
        { section: "ส่วนที่ 2 การนำเสนอ (รวม 20 คะแนน)", items: [
            { id: "q4", text: "1) เข้าใจง่าย", max: 10 },
            { id: "q5", text: "2) ดึงดูดผู้ชม", max: 10 }
        ]},
        { section: "ส่วนที่ 3 ผลที่ได้ (รวม 20 คะแนน)", items: [
            { id: "q6", text: "1) มีความคิดสร้างสรรค์", max: 10 },
            { id: "q7", text: "2) บทเรียนที่ดี", max: 10 }
        ]},
        { section: "ส่วนที่ 4 เทคนิคคุณภาพการถ่ายทำ (รวม 20 คะแนน)", items: [
            { id: "q8", text: "เหมาะสมกับเนื้อเรื่อง/มุมกล้อง/ระยะ/การกำกับ/ การตัดต่อ/การเรียงลำดับ/ความกระชับของเนื้อหา/เสียง", max: 20 }
        ]}
    ]
};


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
        // ทดสอบระบบ: จำลองการเข้าสู่ระบบสำเร็จสำหรับรหัส 6 หลักทุกตัว
        setTimeout(() => {
            currentUser = { id: inputId, name: "คณะกรรมการ", role: "Judge", group: "1" };
            Swal.fire({
                title: 'เข้าสู่ระบบสำเร็จ!',
                text: `ยินดีต้อนรับ ${currentUser.name}`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                document.getElementById('login-section').classList.add('hidden-page');
                document.getElementById('main-app').classList.remove('hidden-page');
                document.getElementById('user-name').innerText = currentUser.name;
                document.getElementById('user-role').innerText = currentUser.role;
                navigate('home');
            });
            showLoading(false);
        }, 800);
    } catch (error) {
        showLoading(false);
        handleLoginFail();
    }
}

function handleLoginFail() {
    loginAttempts++;
    if(loginAttempts >= 3) {
        startCooldown();
    } else {
        Swal.fire('รหัสไม่ถูกต้อง!', `เหลือโอกาสอีก ${3 - loginAttempts} ครั้ง`, 'error');
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

    Swal.fire('ระบบระงับชั่วคราว', 'กรอกผิดเกิน 3 ครั้ง กรุณารอ 90 วินาที', 'warning');

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

function navigate(page) {
    const titles = { home: "หน้าหลัก", works: "รายชื่อผลงาน", scoring: "เลือกผลงานเพื่อให้คะแนน", summary: "สรุปผลคะแนน" };
    document.getElementById('current-menu-title').innerText = titles[page];
    const contentArea = document.getElementById('content-area');
    
    if (page === 'home') {
        contentArea.innerHTML = `
            <div class="glass-panel p-8 text-center bg-white/40">
                <h2 class="text-2xl font-bold mb-4 text-blue-900">ยินดีต้อนรับสู่ระบบประเมินผลงาน</h2>
                <p class="text-gray-800 mb-6">มหกรรมวิชาการสาธารณสุข อำเภอสะเดา ปี 2569</p>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-blue-100/80 p-4 rounded-xl shadow border border-blue-200">
                        <h3 class="font-bold text-blue-900">สถานะ</h3>
                        <p class="text-xl font-bold mt-2 text-blue-600">พร้อมใช้งาน</p>
                    </div>
                    <div class="bg-green-100/80 p-4 rounded-xl shadow border border-green-200" onclick="renderCategorySelect()" style="cursor:pointer;">
                        <h3 class="font-bold text-green-900">ทดสอบฟอร์ม</h3>
                        <p class="text-sm font-bold mt-2 text-green-600">คลิกที่นี่ <i class="fas fa-hand-pointer"></i></p>
                    </div>
                </div>
            </div>
        `;
    } else if (page === 'scoring') {
        renderCategorySelect();
    } else {
        contentArea.innerHTML = `<div class="glass-panel p-8 text-center text-white"><p>กำลังพัฒนาระบบดึงข้อมูลจาก Database...</p></div>`;
    }
}

function renderCategorySelect() {
    document.getElementById('current-menu-title').innerText = "เลือกประเภทผลงาน";
    let html = `<div class="grid grid-cols-1 md:grid-cols-2 gap-3 pb-20">`;
    
    Object.keys(criteriaConfig).forEach(cat => {
        html += `
            <button onclick="openScoringForm('W001', '${cat}', 'ผลงานทดสอบระบบ (${cat})')" 
                    class="glass-panel p-4 text-left hover:bg-white/40 transition active:scale-95 border-l-4 border-blue-500">
                <p class="font-bold text-blue-900 truncate">${cat}</p>
                <p class="text-xs text-gray-700 mt-1">คลิกเพื่อเปิดฟอร์มให้คะแนน</p>
            </button>
        `;
    });
    html += `</div>`;
    document.getElementById('content-area').innerHTML = html;
}

function openScoringForm(workId, category, title) {
    document.getElementById('current-menu-title').innerText = "กำลังให้คะแนน...";
    const criteria = criteriaConfig[category];
    
    let html = `
        <div class="glass-panel p-4 md:p-6 bg-white/95 pb-32">
            <div class="border-b-2 border-cyan-500 pb-3 mb-4">
                <h2 class="text-lg md:text-xl font-bold text-blue-900">${title}</h2>
                <p class="text-sm font-semibold text-gray-600 bg-gray-100 inline-block px-2 py-1 rounded mt-1">${category}</p>
            </div>
            <form id="score-form" onsubmit="submitScore(event, '${workId}', '${category}')">
    `;

    criteria.forEach(sec => {
        html += `<div class="bg-blue-50/50 p-3 md:p-4 rounded-xl mb-4 shadow-sm border border-blue-100">
                    <h3 class="font-bold text-blue-800 mb-4 text-sm md:text-base border-l-4 border-blue-500 pl-2">${sec.section}</h3>`;
        
        sec.items.forEach(item => {
            html += `
                <div class="mb-5 bg-white p-3 md:p-4 rounded-lg border border-gray-200 shadow-sm">
                    <label class="block text-sm md:text-base font-bold mb-3 text-gray-700">${item.text} <span class="text-blue-500">(เต็ม ${item.max})</span></label>
                    <div class="flex items-center gap-4">
                        <input type="range" id="${item.id}" min="0" max="${item.max}" value="0" required
                               class="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                               oninput="document.getElementById('val_${item.id}').innerText = this.value; calculateTotal();">
                        <span id="val_${item.id}" class="text-2xl font-bold text-white w-14 text-center bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg py-1 shadow-md">0</span>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    });

    html += `
            <div class="flex items-center justify-between bg-red-50 p-4 rounded-xl border border-red-200 mb-4 shadow-sm">
                <label class="font-bold text-red-600"><i class="fas fa-minus-circle"></i> คะแนนหักลบ</label>
                <input type="number" id="deduct_score" min="0" max="100" value="0" class="w-24 p-2 text-center rounded-lg border-2 border-red-300 font-bold text-red-600 text-lg outline-none focus:border-red-500 transition" oninput="calculateTotal()">
            </div>
            
            <div class="fixed bottom-0 left-0 right-0 p-4 z-50 bg-gradient-to-t from-gray-900 to-transparent">
                <div class="bg-gradient-to-r from-blue-900 to-cyan-800 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center border border-blue-400/50 max-w-4xl mx-auto">
                    <div>
                        <p class="text-xs text-cyan-200 mb-1">รวมคะแนนทั้งหมด</p>
                        <p class="text-3xl md:text-4xl font-bold drop-shadow"><span id="total_score_display">0</span> <span class="text-sm font-normal text-cyan-100">/ 100</span></p>
                    </div>
                    <button type="submit" class="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-400 hover:to-emerald-300 text-white font-bold py-3 px-6 md:px-8 rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95 border border-green-300/50">
                        <i class="fas fa-paper-plane mr-2"></i> บันทึก
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
    const inputs = document.querySelectorAll('input[type="range"]');
    inputs.forEach(inp => total += parseInt(inp.value || 0));
    
    const deduct = parseInt(document.getElementById('deduct_score').value || 0);
    total -= deduct;
    if(total < 0) total = 0;
    
    document.getElementById('total_score_display').innerText = total;
}

async function submitScore(e, workId, category) {
    e.preventDefault();
    const deduct = parseInt(document.getElementById('deduct_score').value || 0);
    const total = parseInt(document.getElementById('total_score_display').innerText);

    Swal.fire({
        title: 'ยืนยันการส่งคะแนน?',
        html: `คะแนนรวม: <b>${total}</b> / 100`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ส่งคะแนน!',
        cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            showLoading(true);
            setTimeout(() => {
                showLoading(false);
                Swal.fire('สำเร็จ!', 'บันทึกคะแนนเรียบร้อยแล้ว', 'success');
                navigate('scoring');
            }, 1000);
        }
    });
}

function logout() {
    Swal.fire({
        title: 'ออกจากระบบ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'ออกจากระบบ',
        cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            currentUser = null;
            document.getElementById('main-app').classList.add('hidden-page');
            document.getElementById('login-section').classList.remove('hidden-page');
            document.getElementById('login-id').value = '';
        }
    });
}
