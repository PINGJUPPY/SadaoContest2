let loginAttempts = 0;
let isCooldown = false;
let currentUser = null;

// ================= ระบบ Login =================
function handleLogin() {
    if (isCooldown) return;
    
    const inputId = document.getElementById('login-id').value;
    const btn = document.getElementById('btn-login');
    
    // ตรงนี้จริงๆ ต้อง fetch ไปเทียบกับข้อมูลจาก Google Sheets
    // จำลองการตรวจสอบ
    if(inputId === "123456") {
        // สำเร็จ - แสดง 3D Popup (ใช้ SweetAlert2 โหลดรูป 3D/GIF ได้)
        Swal.fire({
            title: 'เข้าสู่ระบบสำเร็จ!',
            text: 'ยินดีต้อนรับเข้าสู่ระบบจัดการ',
            icon: 'success', // สามารถเปลี่ยน imageUrl เป็นตัวการ์ตูน 3D ที่เตรียมไว้ได้
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            currentUser = { name: "นพ.ทดสอบ", role: "Judge", group: 1 };
            document.getElementById('login-section').classList.add('hidden-page');
            document.getElementById('main-app').classList.remove('hidden-page');
            document.getElementById('user-name').innerText = currentUser.name;
            document.getElementById('user-role').innerText = currentUser.role;
            navigate('home');
        });
    } else {
        loginAttempts++;
        if(loginAttempts >= 3) {
            startCooldown();
        } else {
            Swal.fire({
                title: 'รหัสไม่ถูกต้อง!',
                text: `คุณเหลือโอกาสอีก ${3 - loginAttempts} ครั้ง`,
                icon: 'error'
            });
        }
    }
}

function startCooldown() {
    isCooldown = true;
    let timeLeft = 90;
    const timerDisplay = document.getElementById('cooldown-timer');
    const inputFields = document.getElementById('login-id');
    const btn = document.getElementById('btn-login');
    
    timerDisplay.classList.remove('hidden');
    inputFields.disabled = true;
    btn.disabled = true;
    btn.classList.add('opacity-50');

    Swal.fire({ title: 'กรุณารอสักครู่', text: 'คุณกรอกผิดเกิน 3 ครั้ง ระบบกำลังระงับการใช้งาน', icon: 'warning' });

    const countdown = setInterval(() => {
        timerDisplay.innerText = `กรุณารอ ${timeLeft} วินาที`;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(countdown);
            isCooldown = false;
            loginAttempts = 0;
            timerDisplay.classList.add('hidden');
            inputFields.disabled = false;
            btn.disabled = false;
            btn.classList.remove('opacity-50');
            inputFields.value = '';
        }
    }, 1000);
}

// ================= ระบบการ Navigation =================
function navigate(page) {
    const titles = { home: "หน้าหลัก", works: "รายชื่อผลงาน", scoring: "ระบบให้คะแนน", summary: "สรุปผลคะแนน" };
    document.getElementById('current-menu-title').innerText = titles[page];
    
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = ''; // Clear เนื้อหาเก่า
    
    if (page === 'scoring') renderScoringPage();
    // เพิ่มเงื่อนไขสำหรับหน้าอื่นๆ 
}

// ================= UI ให้คะแนน (ออกแบบเพื่อความรวดเร็ว) =================
function renderScoringPage() {
    const contentArea = document.getElementById('content-area');
    // โครงสร้างการให้คะแนนแบบเร็ว (ใช้ Range Slider หรือ Button Group)
    // นี่คือตัวอย่างฟอร์มของ Oral Presentation : วิจัย 
    
    let html = `
        <div class="glass-panel p-6 bg-white bg-opacity-90">
            <div class="border-b-2 border-blue-200 pb-3 mb-4">
                <h3 class="text-xl font-bold">ชื่อผลงาน: การพัฒนาระบบคิว...</h3>
                <p class="text-sm text-gray-600">ประเภท: Oral Presentation วิจัย | ระดับ: โรงพยาบาลสะเดา</p>
            </div>
            
            <form id="score-form" onsubmit="event.preventDefault(); submitScore();">
                <div class="mb-4">
                    <label class="block font-semibold mb-2">1. ชื่อเรื่องมีความเหมาะสม น่าสนใจ (เต็ม 10)</label>
                    <div class="flex items-center gap-4">
                        <input type="range" min="0" max="10" value="0" class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                               oninput="document.getElementById('val1').innerText = this.value">
                        <span id="val1" class="text-2xl font-bold text-blue-600 w-12 text-center bg-blue-100 rounded-lg py-1">0</span>
                    </div>
                </div>
                
                <div class="mt-6">
                    <button type="submit" class="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg transition-transform transform active:scale-95">
                        ยืนยันการให้คะแนน
                    </button>
                </div>
            </form>
        </div>
    `;
    contentArea.innerHTML = html;
}
