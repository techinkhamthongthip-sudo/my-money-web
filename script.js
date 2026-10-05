// =====================================================
// ระบบบริหารเงินประจำห้อง ม.5/15
// SCRIPT.JS — V3 AUTHENTICATION FIX
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyasX67a_85EcRXBicAkV7Si0MPOo6CLdch3VKDJJxBHr2G9C9nEMx-U7MI7CczuGvTJA/exec";

const PROMPTPAY_NUMBER = "0801056605";


// =====================================================
// AUTHENTICATION
// =====================================================

let AUTH_TOKEN =
    sessionStorage.getItem("M515_AUTH_TOKEN") || "";

let students = [];
let tiltStarted = false;


// =====================================================
// DOM
// =====================================================

const $ = (id) =>
    document.getElementById(id);


// =====================================================
// เริ่มระบบ
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        hideAllPages();

        const welcome = $("welcomeScreen");

        if (welcome) {
            welcome.style.display = "flex";
        }

        setupLogin();
        setupButtons();
        setupQR();
        setupSlipFile();
        setupOverview();

    }
);


// =====================================================
// ซ่อนทุกหน้า
// =====================================================

function hideAllPages() {

    const pages = [
        "welcomeScreen",
        "homePage",
        "checkPage",
        "paymentPage",
        "overviewPage"
    ];

    pages.forEach(
        function (id) {

            const el = $(id);

            if (el) {
                el.style.display = "none";
            }

        }
    );

}


// =====================================================
// TOKEN
// =====================================================

function getAuthToken() {

    return (
        String(AUTH_TOKEN || "").trim() ||
        String(
            sessionStorage.getItem(
                "M515_AUTH_TOKEN"
            ) || ""
        ).trim()
    );

}


// =====================================================
// ตรวจสอบ Error ของ Authentication
// =====================================================

function isAuthError(message) {

    const msg =
        String(message || "");


    return (
        msg.includes("ไม่ได้เข้าสู่ระบบ") ||
        msg.includes("Token ไม่ถูกต้อง") ||
        msg.includes("Session หมดอายุ") ||
        msg.includes("Login ไม่ได้ส่ง Token") ||
        msg.includes("หมดอายุ")
    );

}


// =====================================================
// จัดการ Session หมดอายุ
// =====================================================

function handleAuthError(message) {

    if (!isAuthError(message)) {
        return false;
    }


    AUTH_TOKEN = "";

    sessionStorage.removeItem(
        "M515_AUTH_TOKEN"
    );


    alert(
        "เซสชันเข้าสู่ระบบหมดอายุ กรุณาเข้าสู่ระบบใหม่"
    );


    location.reload();


    return true;

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    AUTH_TOKEN = "";

    sessionStorage.removeItem(
        "M515_AUTH_TOKEN"
    );

    location.reload();

}


// =====================================================
// สร้าง API URL
// ป้องกัน Browser ใช้ข้อมูลเก่า
// =====================================================

function buildApiUrl(
    action,
    params = {}
) {

    const url =
        new URL(
            API_URL
        );


    url.searchParams.set(
        "action",
        action
    );


    const token =
        getAuthToken();


    if (token) {

        url.searchParams.set(
            "token",
            token
        );

    }


    Object.keys(params).forEach(
        function (key) {

            const value =
                params[key];


            if (
                value !== undefined &&
                value !== null
            ) {

                url.searchParams.set(
                    key,
                    value
                );

            }

        }
    );


    // ป้องกัน Cache
    url.searchParams.set(
        "_t",
        Date.now()
    );


    return url.toString();

}


// =====================================================
// LOGIN
// =====================================================

function setupLogin() {

    const input =
        $("accessCode");

    const button =
        $("confirmCode");


    if (!input || !button) {
        return;
    }


    button.addEventListener(
        "click",
        checkAccessCode
    );


    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                checkAccessCode();

            }

        }
    );

}


// =====================================================
// ตรวจสอบรหัส
// =====================================================

async function checkAccessCode() {

    const input =
        $("accessCode");

    const message =
        $("codeMessage");


    if (!input) {
        return;
    }


    const code =
        input.value.trim();


    if (!/^\d{5}$/.test(code)) {

        if (message) {

            message.textContent =
                "กรุณากรอกรหัสตัวเลข 5 หลัก";

        }

        input.focus();

        return;
    }


    try {

        if (message) {

            message.textContent =
                "กำลังตรวจสอบ...";

        }


        // Login ไม่ต้องใช้ Token
        const url =
            buildApiUrl(
                "login",
                {
                    code: code
                }
            );


        const response =
            await fetch(
                url,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "เซิร์ฟเวอร์ตอบกลับ HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        if (!data.success) {

            if (message) {

                message.textContent =
                    data.message ||
                    "รหัสไม่ถูกต้อง";

            }

            input.value = "";

            input.focus();

            return;
        }


        // =================================================
        // สำคัญมาก
        // ตรวจสอบว่า Backend ส่ง Token กลับมาจริง
        // =================================================

        if (!data.token) {

            throw new Error(
                "ระบบ Login ไม่ได้ส่ง Token กลับมา"
            );

        }


        AUTH_TOKEN =
            String(
                data.token
            ).trim();


        if (!AUTH_TOKEN) {

            throw new Error(
                "ระบบ Login ส่ง Token ว่างกลับมา"
            );

        }


        sessionStorage.setItem(
            "M515_AUTH_TOKEN",
            AUTH_TOKEN
        );


        // =================================================
        // เริ่มระบบตรวจจับการเอียงมือถือ
        // =================================================


        // =================================================
        // โหลดข้อมูลหลัง Login
        // =================================================

        await loadStudents();


        if (message) {

            message.textContent =
                "เข้าสู่ระบบสำเร็จ ✓";

        }


        input.disabled = true;


        const button =
            $("confirmCode");

        if (button) {
            button.disabled = true;
        }


        // =================================================
        // หมุนโลโก้
        // =================================================

        const logo =
            $("schoolLogo");


        if (logo) {

            logo.animate(
                [
                    {
                        transform:
                            "rotate(0deg) scale(1)"
                    },
                    {
                        transform:
                            "rotate(360deg) scale(1.08)"
                    },
                    {
                        transform:
                            "rotate(720deg) scale(1)"
                    },
                    {
                        transform:
                            "rotate(1080deg) scale(1.05)"
                    },
                    {
                        transform:
                            "rotate(1440deg) scale(1)"
                    }
                ],
                {
                    duration: 1800,
                    easing:
                        "cubic-bezier(.2,.8,.2,1)",
                    fill: "forwards"
                }
            );

        }


        // =================================================
        // เปลี่ยนหน้า
        // =================================================

        setTimeout(
            function () {

                const welcome =
                    $("welcomeScreen");

                if (welcome) {

                    welcome.animate(
                        [
                            {
                                opacity: 1,
                                transform:
                                    "scale(1)"
                            },
                            {
                                opacity: 0,
                                transform:
                                    "scale(1.04)"
                            }
                        ],
                        {
                            duration: 600,
                            easing: "ease-in",
                            fill: "forwards"
                        }
                    );

                }

            },
            1200
        );


        setTimeout(
            function () {

                hideAllPages();


                const home =
                    $("homePage");


                if (home) {

                    home.style.display =
                        "block";


                    home.animate(
                        [
                            {
                                opacity: 0,
                                transform:
                                    "translateY(20px)"
                            },
                            {
                                opacity: 1,
                                transform:
                                    "translateY(0)"
                            }
                        ],
                        {
                            duration: 500,
                            easing: "ease-out"
                        }
                    );

                }

            },
            1800
        );

    }
    catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        if (message) {

            message.textContent =
                error.message ||
                "ไม่สามารถเชื่อมต่อระบบได้";

        }

    }

}


// =====================================================
// ปุ่มเมนู
// =====================================================

function setupButtons() {

    // =================================================
    // ตรวจสอบยอด
    // =================================================

    const openCheck =
        $("openCheck");

    if (openCheck) {

        openCheck.addEventListener(
            "click",
            showCheckPage
        );

    }


    // =================================================
    // แจ้งชำระ
    // =================================================

    const openPayment =
        $("openPayment");

    if (openPayment) {

        openPayment.addEventListener(
            "click",
            showPaymentPage
        );

    }


    // =================================================
    // ดูยอดทุกคน
    // =================================================

    const openOverview =
        $("openOverview");

    if (openOverview) {

        openOverview.addEventListener(
            "click",
            showOverviewPage
        );

    }


    // =================================================
    // กลับหน้าแรก
    // =================================================

    const backCheck =
        $("backFromCheck");

    if (backCheck) {

        backCheck.addEventListener(
            "click",
            showHome
        );

    }


    const backPayment =
        $("backFromPayment");

    if (backPayment) {

        backPayment.addEventListener(
            "click",
            showHome
        );

    }


    const backOverview =
        $("backFromOverview");

    if (backOverview) {

        backOverview.addEventListener(
            "click",
            showHome
        );

    }


    // =================================================
    // เลือกนักเรียน
    // =================================================

    const student =
        $("student");

    if (student) {

        student.addEventListener(
            "change",
            function () {

                updateCheckStudentName();

                checkPayment();

            }
        );

    }


    // =================================================
    // เดือน
    // =================================================

    const month =
        $("month");

    if (month) {

        month.addEventListener(
            "change",
            checkPayment
        );

    }


    // =================================================
    // นักเรียนหน้าแจ้งชำระ
    // =================================================

    const paymentStudent =
        $("paymentStudent");

    if (paymentStudent) {

        paymentStudent.addEventListener(
            "change",
            updatePaymentStudentName
        );

    }


    // =================================================
    // ส่งข้อมูล
    // =================================================

    const submit =
        $("submitPayment");

    if (submit) {

        submit.addEventListener(
            "click",
            submitPaymentData
        );

    }


    // =================================================
    // ปิด Modal
    // =================================================

    const closeModal =
        $("closeModal");

    if (closeModal) {

        closeModal.addEventListener(
            "click",
            closeStudentModal
        );

    }


    const modal =
        $("studentModal");

    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    closeStudentModal();

                }

            }
        );

    }

}


// =====================================================
// เปลี่ยนหน้า
// =====================================================

function showHome() {

    hideAllPages();

    const home =
        $("homePage");

    if (home) {

        home.style.display =
            "block";

    }

}


function showCheckPage() {

    hideAllPages();

    const page =
        $("checkPage");

    if (page) {

        page.style.display =
            "block";

    }

}


function showPaymentPage() {

    hideAllPages();

    const page =
        $("paymentPage");

    if (page) {

        page.style.display =
            "block";

    }

    generatePaymentQR();

}


function showOverviewPage() {

    // =================================================
    // ตรวจ Token ก่อนเปิดหน้า
    // =================================================

    if (!getAuthToken()) {

        alert(
            "กรุณาเข้าสู่ระบบก่อน"
        );

        return;

    }


    hideAllPages();

    const page =
        $("overviewPage");

    if (page) {

        page.style.display =
            "block";

    }

    loadOverview();

}


// =====================================================
// โหลดรายชื่อนักเรียน
// =====================================================

async function loadStudents() {

    try {

        const url =
            buildApiUrl(
                "students"
            );


        const response =
            await fetch(
                url,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "เซิร์ฟเวอร์ตอบกลับ HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        if (!data.success) {

            if (
                handleAuthError(
                    data.message
                )
            ) {
                return;
            }


            throw new Error(
                data.message ||
                "โหลดรายชื่อไม่สำเร็จ"
            );

        }


        if (
            Array.isArray(
                data.students
            )
        ) {

            students =
                data.students;

        }


        populateStudentSelects();

    }
    catch (error) {

        console.error(
            "LOAD STUDENTS ERROR:",
            error
        );


        if (
            !isAuthError(
                error.message
            )
        ) {

            alert(
                error.message ||
                "ไม่สามารถโหลดรายชื่อนักเรียนได้"
            );

        }

    }

}


// =====================================================
// สร้าง Select นักเรียน
// =====================================================

function populateStudentSelects() {

    const checkStudent =
        $("student");


    const paymentStudent =
        $("paymentStudent");


    if (checkStudent) {

        checkStudent.innerHTML =
            '<option value="">-- เลือกเลขที่ --</option>';

    }


    if (paymentStudent) {

        paymentStudent.innerHTML =
            '<option value="">-- เลือกเลขที่ --</option>';

    }


    students.forEach(
        function (student) {

            if (checkStudent) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    student.number;


                option.textContent =
                    student.number;


                checkStudent.appendChild(
                    option
                );

            }


            if (paymentStudent) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    student.number;


                option.textContent =
                    student.number;


                paymentStudent.appendChild(
                    option
                );

            }

        }
    );

}


// =====================================================
// แสดงชื่อจากเลขที่
// =====================================================

function updateCheckStudentName() {

    const number =
        $("student")?.value;


    const nameSelect =
        $("studentName");


    if (!nameSelect) {
        return;
    }


    nameSelect.innerHTML =
        '<option value="">-- เลือกชื่อ --</option>';


    const student =
        students.find(
            function (item) {

                return String(
                    item.number
                ) ===
                String(number);

            }
        );


    if (student) {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            student.name;


        option.textContent =
            student.name;


        option.selected =
            true;


        nameSelect.appendChild(
            option
        );

    }

}


function updatePaymentStudentName() {

    const number =
        $("paymentStudent")?.value;


    const nameSelect =
        $("paymentStudentName");


    if (!nameSelect) {
        return;
    }


    nameSelect.innerHTML =
        '<option value="">-- เลือกชื่อ --</option>';


    const student =
        students.find(
            function (item) {

                return String(
                    item.number
                ) ===
                String(number);

            }
        );


    if (student) {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            student.name;


        option.textContent =
            student.name;


        option.selected =
            true;


        nameSelect.appendChild(
            option
        );

    }

}


// =====================================================
// ตรวจสอบยอด
// =====================================================

async function checkPayment() {

    const number =
        $("student")?.value;


    const month =
        $("month")?.value;


    const status =
        $("status");


    const requiredEl =
        $("required");


    const paidEl =
        $("paid");


    const remainingEl =
        $("remaining");


    if (
        !number ||
        !month
    ) {

        if (requiredEl) {
            requiredEl.textContent =
                "0 บาท";
        }

        if (paidEl) {
            paidEl.textContent =
                "0 บาท";
        }

        if (remainingEl) {
            remainingEl.textContent =
                "0 บาท";
        }

        if (status) {
            status.textContent =
                "กรุณาเลือกเลขที่ ชื่อ และเดือน";
        }

        return;
    }


    if (!getAuthToken()) {

        if (status) {

            status.textContent =
                "กรุณาเข้าสู่ระบบใหม่";

        }

        return;

    }


    try {

        const url =
            buildApiUrl(
                "payment",
                {
                    number:
                        number,

                    month:
                        month
                }
            );


        const response =
            await fetch(
                url,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "เซิร์ฟเวอร์ตอบกลับ HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        if (!data.success) {

            if (
                handleAuthError(
                    data.message
                )
            ) {
                return;
            }


            if (status) {

                status.textContent =
                    data.message ||
                    "เกิดข้อผิดพลาด";

            }

            return;
        }


        const required =
            Number(
                data.required
            ) || 0;


        const paid =
            Number(
                data.paid
            ) || 0;


        const remaining =
            Math.max(
                required - paid,
                0
            );


        if (requiredEl) {

            requiredEl.textContent =
                required.toLocaleString(
                    "th-TH"
                ) +
                " บาท";

        }


        if (paidEl) {

            paidEl.textContent =
                paid.toLocaleString(
                    "th-TH"
                ) +
                " บาท";

        }


        if (remainingEl) {

            remainingEl.textContent =
                remaining.toLocaleString(
                    "th-TH"
                ) +
                " บาท";

        }


        if (status) {

            if (
                required > 0 &&
                remaining <= 0
            ) {

                status.textContent =
                    "ชำระครบแล้ว ✓";

            }
            else {

                status.textContent =
                    "ยังมียอดค้างชำระ " +
                    remaining.toLocaleString(
                        "th-TH"
                    ) +
                    " บาท";

            }

        }

    }
    catch (error) {

        console.error(
            "PAYMENT CHECK ERROR:",
            error
        );


        if (
            handleAuthError(
                error.message
            )
        ) {
            return;
        }


        if (status) {

            status.textContent =
                "ไม่สามารถเชื่อมต่อระบบได้";

        }

    }

}


// =====================================================
// PROMPTPAY QR
// =====================================================

function emvTag(
    id,
    value
) {

    return (
        id +
        String(
            value.length
        ).padStart(
            2,
            "0"
        ) +
        value
    );

}


function crc16(data) {

    let crc =
        0xFFFF;


    for (
        let i = 0;
        i < data.length;
        i++
    ) {

        crc ^=
            data.charCodeAt(i) << 8;


        for (
            let j = 0;
            j < 8;
            j++
        ) {

            if (
                crc & 0x8000
            ) {

                crc =
                    (crc << 1) ^
                    0x1021;

            }
            else {

                crc =
                    crc << 1;

            }


            crc &=
                0xFFFF;

        }

    }


    return crc
        .toString(16)
        .toUpperCase()
        .padStart(
            4,
            "0"
        );

}


function createPromptPayPayload(
    mobile,
    amount
) {

    let phone =
        String(mobile)
            .replace(
                /\D/g,
                ""
            );


    if (
        phone.startsWith("0")
    ) {

        phone =
            "0066" +
            phone.substring(1);

    }


    const merchantAccountInfo =
        emvTag(
            "00",
            "A000000677010111"
        ) +
        emvTag(
            "01",
            phone
        );


    let payload =
        "";


    payload +=
        emvTag(
            "00",
            "01"
        );


    payload +=
        emvTag(
            "01",
            "12"
        );


    payload +=
        emvTag(
            "29",
            merchantAccountInfo
        );


    payload +=
        emvTag(
            "52",
            "0000"
        );


    payload +=
        emvTag(
            "53",
            "764"
        );


    if (
        Number(amount) > 0
    ) {

        payload +=
            emvTag(
                "54",
                Number(amount)
                    .toFixed(2)
            );

    }


    payload +=
        emvTag(
            "58",
            "TH"
        );


    payload +=
        emvTag(
            "59",
            "SSW ROOM M515"
        );


    payload +=
        emvTag(
            "60",
            "LOEI"
        );


    const crcInput =
        payload +
        "6304";


    return (
        crcInput +
        crc16(crcInput)
    );

}


// =====================================================
// สร้าง QR
// =====================================================

function generatePaymentQR() {

    const amountInput =
        $("amount");


    const qrContainer =
        $("qrcode");


    const qrAmount =
        $("qrAmount");


    if (
        !amountInput ||
        !qrContainer
    ) {
        return;
    }


    const amount =
        Number(
            amountInput.value
        );


    qrContainer.innerHTML =
        "";


    if (
        !amount ||
        amount <= 0
    ) {

        if (qrAmount) {

            qrAmount.textContent =
                "—";

        }

        return;
    }


    if (
        typeof QRCode ===
        "undefined"
    ) {

        qrContainer.innerHTML =
            "<p>โหลดระบบ QR ไม่สำเร็จ</p>";

        return;
    }


    const payload =
        createPromptPayPayload(
            PROMPTPAY_NUMBER,
            amount
        );


    new QRCode(
        qrContainer,
        {
            text:
                payload,

            width:
                260,

            height:
                260,

            correctLevel:
                QRCode.CorrectLevel.M
        }
    );


    if (qrAmount) {

        qrAmount.textContent =
            amount.toLocaleString(
                "th-TH",
                {
                    minimumFractionDigits:
                        2,

                    maximumFractionDigits:
                        2
                }
            ) +
            " บาท";

    }

}


function setupQR() {

    const amount =
        $("amount");


    if (!amount) {
        return;
    }


    amount.addEventListener(
        "input",
        generatePaymentQR
    );

}


// =====================================================
// อัปโหลดสลิป
// =====================================================

function setupSlipFile() {

    const fileInput =
        $("slipFile");


    const fileName =
        $("fileName");


    if (
        !fileInput ||
        !fileName
    ) {
        return;
    }


    fileInput.addEventListener(
        "change",
        function () {

            if (
                this.files &&
                this.files.length > 0
            ) {

                fileName.textContent =
                    this.files[0].name;

            }
            else {

                fileName.textContent =
                    "ยังไม่ได้เลือกไฟล์";

            }

        }
    );

}


// =====================================================
// บีบอัดรูป
// =====================================================

function compressImage(file) {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const image =
                        new Image();


                    image.onload =
                        function () {

                            const maxWidth =
                                1200;


                            let width =
                                image.width;


                            let height =
                                image.height;


                            if (
                                width >
                                maxWidth
                            ) {

                                height =
                                    Math.round(
                                        height *
                                        maxWidth /
                                        width
                                    );

                                width =
                                    maxWidth;

                            }


                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            canvas.width =
                                width;


                            canvas.height =
                                height;


                            const ctx =
                                canvas.getContext(
                                    "2d"
                                );


                            ctx.drawImage(
                                image,
                                0,
                                0,
                                width,
                                height
                            );


                            resolve(
                                canvas.toDataURL(
                                    "image/jpeg",
                                    0.75
                                )
                            );

                        };


                    image.onerror =
                        function () {

                            reject(
                                new Error(
                                    "ไม่สามารถอ่านรูปได้"
                                )
                            );

                        };


                    image.src =
                        event.target.result;

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "ไม่สามารถอ่านไฟล์ได้"
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


// =====================================================
// ส่งแจ้งชำระเงิน
// =====================================================

async function submitPaymentData() {

    const number =
        $("paymentStudent")?.value;


    const month =
        $("paymentMonth")?.value;


    const amount =
        $("amount")?.value;


    const date =
        $("date")?.value;


    const fileInput =
        $("slipFile");


    const status =
        $("submitStatus");


    if (!number) {

        alert(
            "กรุณาเลือกเลขที่"
        );

        return;
    }


    if (!month) {

        alert(
            "กรุณาเลือกเดือน"
        );

        return;
    }


    if (
        !amount ||
        Number(amount) <= 0
    ) {

        alert(
            "กรุณากรอกจำนวนเงิน"
        );

        return;
    }


    if (!date) {

        alert(
            "กรุณาเลือกวันที่โอน"
        );

        return;
    }


    if (
        !fileInput ||
        !fileInput.files.length
    ) {

        alert(
            "กรุณาแนบสลิปการโอนเงินจริง"
        );

        return;
    }


    if (!getAuthToken()) {

        alert(
            "Session หมดอายุ กรุณาเข้าสู่ระบบใหม่"
        );

        logout();

        return;
    }


    try {

        if (status) {

            status.textContent =
                "กำลังอัปโหลดสลิป...";

        }


        const image =
            await compressImage(
                fileInput.files[0]
            );


        const payload = {

            number:
                number,

            month:
                month,

            amount:
                Number(amount),

            date:
                date,

            image:
                image,

            mimeType:
                "image/jpeg",

            token:
                getAuthToken()

        };


        const response =
            await fetch(
                API_URL +
                "?_t=" +
                Date.now(),
                {
                    method:
                        "POST",

                    cache:
                        "no-store",

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );


        if (!response.ok) {

            throw new Error(
                "เซิร์ฟเวอร์ตอบกลับ HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        if (!data.success) {

            if (
                handleAuthError(
                    data.message
                )
            ) {
                return;
            }


            if (status) {

                status.textContent =
                    data.message ||
                    "เกิดข้อผิดพลาด";

            }


            alert(
                data.message ||
                "ไม่สามารถบันทึกข้อมูลได้"
            );

            return;
        }


        if (status) {

            status.textContent =
                data.message ||
                "บันทึกข้อมูลสำเร็จ ✓";

        }


        alert(
            data.message ||
            "แจ้งชำระเงินสำเร็จ ✓"
        );


        // =================================================
        // ล้างฟอร์ม
        // =================================================

        const paymentStudent =
            $("paymentStudent");

        if (paymentStudent) {

            paymentStudent.value =
                "";

        }


        const paymentStudentName =
            $("paymentStudentName");

        if (paymentStudentName) {

            paymentStudentName.innerHTML =
                '<option value="">-- เลือกชื่อ --</option>';

        }


        const paymentMonth =
            $("paymentMonth");

        if (paymentMonth) {

            paymentMonth.value =
                "";

        }


        const amountEl =
            $("amount");

        if (amountEl) {

            amountEl.value =
                "";

        }


        const dateEl =
            $("date");

        if (dateEl) {

            dateEl.value =
                "";

        }


        fileInput.value =
            "";


        const fileName =
            $("fileName");

        if (fileName) {

            fileName.textContent =
                "ยังไม่ได้เลือกไฟล์";

        }


        const qr =
            $("qrcode");

        if (qr) {

            qr.innerHTML =
                "";

        }


        const qrAmount =
            $("qrAmount");

        if (qrAmount) {

            qrAmount.textContent =
                "—";

        }

    }
    catch (error) {

        console.error(
            "SUBMIT PAYMENT ERROR:",
            error
        );


        if (
            handleAuthError(
                error.message
            )
        ) {
            return;
        }


        if (status) {

            status.textContent =
                "เกิดข้อผิดพลาดในการเชื่อมต่อ";

        }


        alert(
            "ไม่สามารถเชื่อมต่อ Google Apps Script ได้"
        );

    }

}


// =====================================================
// ดูยอดทุกคน
// =====================================================

function setupOverview() {

    const month =
        $("overviewMonth");


    if (!month) {
        return;
    }


    month.addEventListener(
        "change",
        loadOverview
    );

}


// =====================================================
// โหลดข้อมูลภาพรวม
// =====================================================

async function loadOverview() {

    const month =
        $("overviewMonth")?.value;


    const grid =
        $("studentGrid");


    const status =
        $("overviewStatus");


    if (
        !grid ||
        !month
    ) {
        return;
    }


    // =================================================
    // ตรวจ Token ก่อนเรียก API
    // =================================================

    const token =
        getAuthToken();


    if (!token) {

        if (status) {

            status.textContent =
                "กรุณาเข้าสู่ระบบใหม่";

        }


        alert(
            "ไม่พบ Session การเข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่"
        );


        logout();

        return;

    }


    grid.innerHTML =
        "";


    if (status) {

        status.textContent =
            "กำลังโหลดข้อมูล...";

    }


    try {

        const url =
            buildApiUrl(
                "overview",
                {
                    month:
                        month
                }
            );


        console.log(
            "OVERVIEW URL:",
            url
        );


        console.log(
            "AUTH TOKEN EXISTS:",
            !!getAuthToken()
        );


        const response =
            await fetch(
                url,
                {
                    cache:
                        "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "เซิร์ฟเวอร์ตอบกลับ HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "OVERVIEW RESPONSE:",
            data
        );


        if (!data.success) {

            if (
                handleAuthError(
                    data.message
                )
            ) {
                return;
            }


            throw new Error(
                data.message ||
                "โหลดข้อมูลไม่สำเร็จ"
            );

        }


        renderStudentCards(
            data.students || []
        );


        if (status) {

            status.textContent =
                "ข้อมูลประจำเดือน " +
                month +
                " • ทั้งหมด " +
                (
                    data.students ||
                    []
                ).length +
                " คน";

        }

    }
    catch (error) {

        console.error(
            "OVERVIEW ERROR:",
            error
        );


        if (
            handleAuthError(
                error.message
            )
        ) {
            return;
        }


        if (status) {

            status.textContent =
                error.message ||
                "ไม่สามารถโหลดข้อมูลได้";

        }

    }

}


// =====================================================
// สร้าง Card นักเรียน
// =====================================================

function renderStudentCards(
    data
) {

    const grid =
        $("studentGrid");


    if (!grid) {
        return;
    }


    grid.innerHTML =
        "";


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        grid.innerHTML = `
            <div class="empty-student">
                ไม่พบข้อมูลนักเรียน
            </div>
        `;

        return;

    }


    data.forEach(
        function (student) {

            const photo =
                `images/${student.number}.jpg`;

            const card =
                document.createElement("button");


            card.className =
                "student-card";


            const paid =
                Number(
                    student.paid
                ) || 0;


            const required =
                Number(
                    student.required
                ) || 0;


            const remaining =
                Math.max(
                    required -
                    paid,
                    0
                );


            const complete =
                remaining <= 0 &&
                required > 0;


            // =================================================
            // สร้าง Card
            // =================================================

            card.innerHTML = `

                <div class="student-avatar">
                    <img src="${photo}" alt="${escapeHtml(student.name)}">
                </div>

                <div class="student-number">
                    เลขที่ ${escapeHtml(
                        student.number
                    )}
                </div>

                <div class="student-name">
                    ${escapeHtml(
                        student.name
                    )}
                </div>

                <div class="student-balance ${
                    complete
                        ? "paid-status"
                        : "unpaid-status"
                }">

                    ${
                        complete
                            ? "ชำระครบแล้ว ✓"
                            : "ค้าง " +
                              remaining.toLocaleString(
                                  "th-TH"
                              ) +
                              " บาท"
                    }

                </div>

            `;


            card.addEventListener(
                "click",
                function () {

                    showStudentDetail(
                        student
                    );

                }
            );


            grid.appendChild(
                card
            );

        }
    );

}


// =====================================================
// รายละเอียดนักเรียน
// =====================================================

function showStudentDetail(student) {

    const modal =
        $("studentModal");

    const detailPhoto =
        $("detailPhoto");


    if (detailPhoto) {

        detailPhoto.src =
            `images/${String(student.number).trim()}.jpg`;

        detailPhoto.alt =
            student.name ||
            "รูปนักเรียน";

    }


    const required =
        Number(
            student.required
        ) || 0;


    const paid =
        Number(
            student.paid
        ) || 0;


    const remaining =
        Math.max(
            required -
            paid,
            0
        );


    const detailNumber =
        $("detailNumber");


    const detailName =
        $("detailName");


    const detailRequired =
        $("detailRequired");


    const detailPaid =
        $("detailPaid");


    const detailRemaining =
        $("detailRemaining");


    const detailStatus =
        $("detailStatus");


    if (detailNumber) {

        detailNumber.textContent =
            "เลขที่ " +
            student.number;

    }


    if (detailName) {

        detailName.textContent =
            student.name;

    }


    if (detailRequired) {

        detailRequired.textContent =
            required.toLocaleString(
                "th-TH"
            ) +
            " บาท";

    }


    if (detailPaid) {

        detailPaid.textContent =
            paid.toLocaleString(
                "th-TH"
            ) +
            " บาท";

    }


    if (detailRemaining) {

        detailRemaining.textContent =
            remaining.toLocaleString(
                "th-TH"
            ) +
            " บาท";

    }


    if (detailStatus) {

        if (
            required > 0 &&
            remaining <= 0
        ) {

            detailStatus.textContent =
                "ชำระครบแล้ว ✓";

            detailStatus.style.background =
                "#e4f6ec";

            detailStatus.style.color =
                "#23774d";

        }
        else {

            detailStatus.textContent =
                "ยังมียอดค้าง " +
                remaining.toLocaleString(
                    "th-TH"
                ) +
                " บาท";

            detailStatus.style.background =
                "#fff0ed";

            detailStatus.style.color =
                "#bd574b";

        }

    }


    if (modal) {

        modal.style.display =
            "flex";

    }

}


// =====================================================
// ปิด Modal
// =====================================================

function closeStudentModal() {

    const modal =
        $("studentModal");


    if (modal) {

        modal.style.display =
            "none";

    }

}


// =====================================================
// พื้นหลังขยับตามการเอียงมือถือ
// =====================================================

async function startTiltBackground() {

    if (tiltStarted) {
        return;
    }


    const welcome =
        $("welcomeScreen");


    if (!welcome) {
        return;
    }


    // iPhone / iPad ต้องขอสิทธิ์ก่อน
    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {

        try {

            const permission =
                await DeviceOrientationEvent.requestPermission();


            if (permission !== "granted") {
                return;
            }

        }
        catch (error) {

            console.error(
                "ไม่สามารถขอสิทธิ์ Motion ได้:",
                error
            );

            return;

        }

    }


    // ป้องกันการสร้าง Event ซ้ำ
    tiltStarted = true;


    window.addEventListener(
        "deviceorientation",
        function (event) {

            let gamma =
                event.gamma || 0;


            // จำกัดการเอียง
            gamma =
                Math.max(
                    -30,
                    Math.min(
                        30,
                        gamma
                    )
                );


            // -30° = ซ้าย
            //  0°  = กลาง
            // +30° = ขวา

            const position =
                50 +
                (gamma / 30) * 35;


            welcome.style.backgroundPosition =
                `${position}% center`;

        },
        true
    );

}


// =====================================================
// ป้องกัน HTML Injection
// =====================================================

function escapeHtml(
    text
) {

    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}

document.addEventListener("DOMContentLoaded", function () {
    startTiltBackground();
});
