// =====================================================
// ระบบบริหารเงินประจำห้อง ม.5/15
// SCRIPT.JS
// =====================================================


const API_URL =
    "https://script.google.com/macros/s/AKfycbyasX67a_85EcRXBicAkV7Si0MPOo6CLdch3VKDJJxBHr2G9C9nEMx-U7MI7CczuGvTJA/exec";


const PROMPTPAY_NUMBER =
    "0801056605";


/* =====================================================
   รหัสผ่าน 5 หลัก
===================================================== */

const ACCESS_CODES = [

    "33362",
    "33365",
    "33457",
    "36280",
    "36281",
    "36282",
    "36284",
    "36285",
    "36286",
    "36287",
    "36288",
    "36289",
    "32914",
    "33029",
    "33175",
    "33284",
    "33355",
    "33487",
    "33488",
    "33489",
    "33492",
    "36290",
    "36291",
    "36292",
    "36293",
    "36294",
    "36295",
    "36296",
    "36298",
    "36299",
    "36300",
    "36301",
    "36303",
    "36304",
    "36305"

];


let students = [];


/* =====================================================
   DOM
===================================================== */

const welcomeScreen =
    document.getElementById(
        "welcomeScreen"
    );


const schoolLogo =
    document.getElementById(
        "schoolLogo"
    );


const homePage =
    document.getElementById(
        "homePage"
    );


const checkPage =
    document.getElementById(
        "checkPage"
    );


const paymentPage =
    document.getElementById(
        "paymentPage"
    );


const overviewPage =
    document.getElementById(
        "overviewPage"
    );


/* =====================================================
   เริ่มต้น
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        hideAllPages();

        if (welcomeScreen) {
            welcomeScreen.style.display =
                "flex";
        }


        loadStudents();

        setupButtons();

        setupLogin();

        setupSlipFile();

        setupQR();

        setupOverview();

    }
);


/* =====================================================
   ซ่อนทุกหน้า
===================================================== */

function hideAllPages() {

    if (welcomeScreen)
        welcomeScreen.style.display =
            "none";

    if (homePage)
        homePage.style.display =
            "none";

    if (checkPage)
        checkPage.style.display =
            "none";

    if (paymentPage)
        paymentPage.style.display =
            "none";

    if (overviewPage)
        overviewPage.style.display =
            "none";

}


/* =====================================================
   ระบบรหัสผ่าน
===================================================== */

function setupLogin() {

    const codeInput =
        document.getElementById(
            "accessCode"
        );


    const confirmButton =
        document.getElementById(
            "confirmCode"
        );


    if (!codeInput || !confirmButton)
        return;


    confirmButton.addEventListener(
        "click",
        checkAccessCode
    );


    codeInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                checkAccessCode();

            }

        }
    );

}


function checkAccessCode() {

    const codeInput =
        document.getElementById(
            "accessCode"
        );


    const message =
        document.getElementById(
            "codeMessage"
        );


    const code =
        codeInput.value.trim();


    if (
        !/^\d{5}$/.test(code)
    ) {

        message.textContent =
            "กรุณากรอกรหัสตัวเลข 5 หลัก";

        codeInput.focus();

        return;

    }


    if (
        !ACCESS_CODES.includes(code)
    ) {

        message.textContent =
            "รหัสไม่ถูกต้อง";

        codeInput.value = "";

        codeInput.focus();

        return;

    }


    /* รหัสถูกต้อง */

    message.textContent =
        "ยืนยันสำเร็จ ✓";


    codeInput.disabled = true;


    const button =
        document.getElementById(
            "confirmCode"
        );


    button.disabled = true;


    /* ตราโรงเรียนหมุนเอง */

    if (schoolLogo) {

        schoolLogo.animate(

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


    /* ค่อย ๆ จางหน้าแรก */

    setTimeout(
        function () {

            if (welcomeScreen) {

                welcomeScreen.animate(

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


    /* เข้าเว็บอัตโนมัติ */

    setTimeout(
        function () {

            hideAllPages();

            if (homePage) {

                homePage.style.display =
                    "block";

                homePage.animate(

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


/* =====================================================
   ปุ่มต่าง ๆ
===================================================== */

function setupButtons() {

    const openCheck =
        document.getElementById(
            "openCheck"
        );


    if (openCheck) {

        openCheck.addEventListener(
            "click",
            showCheckPage
        );

    }


    const openPayment =
        document.getElementById(
            "openPayment"
        );


    if (openPayment) {

        openPayment.addEventListener(
            "click",
            showPaymentPage
        );

    }


    const openOverview =
        document.getElementById(
            "openOverview"
        );


    if (openOverview) {

        openOverview.addEventListener(
            "click",
            showOverviewPage
        );

    }


    const backFromCheck =
        document.getElementById(
            "backFromCheck"
        );


    if (backFromCheck) {

        backFromCheck.addEventListener(
            "click",
            showHome
        );

    }


    const backFromPayment =
        document.getElementById(
            "backFromPayment"
        );


    if (backFromPayment) {

        backFromPayment.addEventListener(
            "click",
            showHome
        );

    }


    const backFromOverview =
        document.getElementById(
            "backFromOverview"
        );


    if (backFromOverview) {

        backFromOverview.addEventListener(
            "click",
            showHome
        );

    }


    const student =
        document.getElementById(
            "student"
        );


    if (student) {

        student.addEventListener(
            "change",
            function () {

                updateCheckStudentName();

                checkPayment();

            }
        );

    }


    const studentName =
        document.getElementById(
            "studentName"
        );


    if (studentName) {

        studentName.addEventListener(
            "change",
            checkPayment
        );

    }


    const month =
        document.getElementById(
            "month"
        );


    if (month) {

        month.addEventListener(
            "change",
            checkPayment
        );

    }


    const paymentStudent =
        document.getElementById(
            "paymentStudent"
        );


    if (paymentStudent) {

        paymentStudent.addEventListener(
            "change",
            updatePaymentStudentName
        );

    }


    const submitPayment =
        document.getElementById(
            "submitPayment"
        );


    if (submitPayment) {

        submitPayment.addEventListener(
            "click",
            submitPaymentData
        );

    }


    const closeModal =
        document.getElementById(
            "closeModal"
        );


    if (closeModal) {

        closeModal.addEventListener(
            "click",
            closeStudentModal
        );

    }


    const modal =
        document.getElementById(
            "studentModal"
        );


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


/* =====================================================
   หน้า
===================================================== */

function showHome() {

    hideAllPages();

    if (homePage) {

        homePage.style.display =
            "block";

    }

}


function showCheckPage() {

    hideAllPages();

    if (checkPage) {

        checkPage.style.display =
            "block";

    }

}


function showPaymentPage() {

    hideAllPages();

    if (paymentPage) {

        paymentPage.style.display =
            "block";

    }

    generatePaymentQR();

}


function showOverviewPage() {

    hideAllPages();

    if (overviewPage) {

        overviewPage.style.display =
            "block";

    }

    loadOverview();

}


/* =====================================================
   โหลดนักเรียน
===================================================== */

async function loadStudents() {

    try {

        const response =
            await fetch(
                API_URL +
                "?action=students"
            );


        const data =
            await response.json();


        if (
            data.success &&
            Array.isArray(
                data.students
            )
        ) {

            students =
                data.students;


            populateStudentSelects();

        }

    }
    catch (error) {

        console.error(
            "โหลดรายชื่อไม่สำเร็จ",
            error
        );

    }

}


/* =====================================================
   Select นักเรียน
===================================================== */

function populateStudentSelects() {

    const checkStudent =
        document.getElementById(
            "student"
        );


    const paymentStudent =
        document.getElementById(
            "paymentStudent"
        );


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


/* =====================================================
   ชื่ออัตโนมัติ
===================================================== */

function updateCheckStudentName() {

    const number =
        document.getElementById(
            "student"
        )?.value;


    const nameSelect =
        document.getElementById(
            "studentName"
        );


    if (!nameSelect)
        return;


    nameSelect.innerHTML =
        '<option value="">-- เลือกชื่อ --</option>';


    const student =
        students.find(
            function (item) {

                return String(
                    item.number
                ) === String(number);

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
        document.getElementById(
            "paymentStudent"
        )?.value;


    const nameSelect =
        document.getElementById(
            "paymentStudentName"
        );


    if (!nameSelect)
        return;


    nameSelect.innerHTML =
        '<option value="">-- เลือกชื่อ --</option>';


    const student =
        students.find(
            function (item) {

                return String(
                    item.number
                ) === String(number);

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


/* =====================================================
   ตรวจสอบยอด
===================================================== */

async function checkPayment() {

    const number =
        document.getElementById(
            "student"
        )?.value;


    const month =
        document.getElementById(
            "month"
        )?.value;


    const status =
        document.getElementById(
            "status"
        );


    if (!number || !month) {

        document.getElementById(
            "required"
        ).textContent =
            "0 บาท";


        document.getElementById(
            "paid"
        ).textContent =
            "0 บาท";


        document.getElementById(
            "remaining"
        ).textContent =
            "0 บาท";


        if (status) {

            status.textContent =
                "กรุณาเลือกเลขที่ ชื่อ และเดือน";

        }

        return;

    }


    try {

        const url =
            API_URL +
            "?action=payment" +
            "&number=" +
            encodeURIComponent(number) +
            "&month=" +
            encodeURIComponent(month);


        const response =
            await fetch(url);


        const data =
            await response.json();


        if (!data.success) {

            if (status) {

                status.textContent =
                    data.message ||
                    "เกิดข้อผิดพลาด";

            }

            return;

        }


        const required =
            Number(data.required) || 0;


        const paid =
            Number(data.paid) || 0;


        const remaining =
            Math.max(
                required - paid,
                0
            );


        document.getElementById(
            "required"
        ).textContent =
            required.toLocaleString(
                "th-TH"
            ) +
            " บาท";


        document.getElementById(
            "paid"
        ).textContent =
            paid.toLocaleString(
                "th-TH"
            ) +
            " บาท";


        document.getElementById(
            "remaining"
        ).textContent =
            remaining.toLocaleString(
                "th-TH"
            ) +
            " บาท";


        if (status) {

            if (remaining <= 0) {

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

        console.error(error);


        if (status) {

            status.textContent =
                "ไม่สามารถเชื่อมต่อระบบได้";

        }

    }

}


/* =====================================================
   QR PromptPay
===================================================== */

function emvTag(id, value) {

    return (
        id +
        String(value.length)
            .padStart(2, "0") +
        value
    );

}


function crc16(data) {

    let crc = 0xFFFF;


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

            if (crc & 0x8000) {

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
        .padStart(4, "0");

}


function createPromptPayPayload(
    mobile,
    amount
) {

    let phone =
        String(mobile)
            .replace(/\D/g, "");


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


    let payload = "";


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


    const crc =
        crc16(crcInput);


    return (
        crcInput +
        crc
    );

}


function generatePaymentQR() {

    const amountInput =
        document.getElementById(
            "amount"
        );


    const qrContainer =
        document.getElementById(
            "qrcode"
        );


    const qrAmount =
        document.getElementById(
            "qrAmount"
        );


    if (
        !amountInput ||
        !qrContainer
    )
        return;


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

            text: payload,

            width: 260,

            height: 260,

            correctLevel:
                QRCode.CorrectLevel.M

        }
    );


    if (qrAmount) {

        qrAmount.textContent =
            amount.toLocaleString(
                "th-TH",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            ) +
            " บาท";

    }

}


function setupQR() {

    const amount =
        document.getElementById(
            "amount"
        );


    if (!amount)
        return;


    amount.addEventListener(
        "input",
        generatePaymentQR
    );

}


/* =====================================================
   สลิป
===================================================== */

function setupSlipFile() {

    const fileInput =
        document.getElementById(
            "slipFile"
        );


    const fileName =
        document.getElementById(
            "fileName"
        );


    if (
        !fileInput ||
        !fileName
    )
        return;


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


/* =====================================================
   บีบอัดรูป
===================================================== */

function compressImage(file) {

    return new Promise(
        function (resolve, reject) {

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


/* =====================================================
   ส่งข้อมูลชำระเงิน
===================================================== */

async function submitPaymentData() {

    const number =
        document.getElementById(
            "paymentStudent"
        )?.value;


    const month =
        document.getElementById(
            "paymentMonth"
        )?.value;


    const amount =
        document.getElementById(
            "amount"
        )?.value;


    const date =
        document.getElementById(
            "date"
        )?.value;


    const fileInput =
        document.getElementById(
            "slipFile"
        );


    const status =
        document.getElementById(
            "submitStatus"
        );


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
                "image/jpeg"

        };


        const response =
            await fetch(
                API_URL,
                {

                    method:
                        "POST",

                    body:
                        JSON.stringify(
                            payload
                        )

                }
            );


        const data =
            await response.json();


        if (data.success) {

            if (status) {

                status.textContent =
                    "บันทึกข้อมูลสำเร็จ ✓";

            }


            alert(
                "แจ้งชำระเงินสำเร็จ ✓"
            );


            document.getElementById(
                "paymentStudent"
            ).value = "";


            document.getElementById(
                "paymentStudentName"
            ).innerHTML =
                '<option value="">-- เลือกชื่อ --</option>';


            document.getElementById(
                "paymentMonth"
            ).value = "";


            document.getElementById(
                "amount"
            ).value = "";


            document.getElementById(
                "date"
            ).value = "";


            document.getElementById(
                "slipFile"
            ).value = "";


            document.getElementById(
                "fileName"
            ).textContent =
                "ยังไม่ได้เลือกไฟล์";


            document.getElementById(
                "qrcode"
            ).innerHTML = "";


            document.getElementById(
                "qrAmount"
            ).textContent =
                "—";

        }
        else {

            if (status) {

                status.textContent =
                    data.message ||
                    "เกิดข้อผิดพลาด";

            }


            alert(
                data.message ||
                "ไม่สามารถบันทึกข้อมูลได้"
            );

        }

    }
    catch (error) {

        console.error(error);


        if (status) {

            status.textContent =
                "เกิดข้อผิดพลาดในการเชื่อมต่อ";

        }


        alert(
            "ไม่สามารถเชื่อมต่อ Google Apps Script ได้"
        );

    }

}


/* =====================================================
   ดูยอดทุกคน
===================================================== */

function setupOverview() {

    const month =
        document.getElementById(
            "overviewMonth"
        );


    if (month) {

        month.addEventListener(
            "change",
            loadOverview
        );

    }

}


async function loadOverview() {

    const month =
        document.getElementById(
            "overviewMonth"
        )?.value;


    const grid =
        document.getElementById(
            "studentGrid"
        );


    const status =
        document.getElementById(
            "overviewStatus"
        );


    if (!grid || !month)
        return;


    grid.innerHTML = "";


    if (status) {

        status.textContent =
            "กำลังโหลดข้อมูล...";

    }


    try {

        const url =
            API_URL +
            "?action=overview" +
            "&month=" +
            encodeURIComponent(
                month
            );


        const response =
            await fetch(url);


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message ||
                "โหลดข้อมูลไม่สำเร็จ"
            );

        }


        renderStudentCards(
            data.students
        );


        if (status) {

            status.textContent =
                "ข้อมูลประจำเดือน " +
                month +
                " • ทั้งหมด " +
                data.students.length +
                " คน";

        }

    }
    catch (error) {

        console.error(error);


        if (status) {

            status.textContent =
                "ไม่สามารถโหลดข้อมูลได้";

        }

    }

}


function renderStudentCards(
    data
) {

    const grid =
        document.getElementById(
            "studentGrid"
        );


    if (!grid)
        return;


    grid.innerHTML = "";


    data.forEach(
        function (student) {

            const card =
                document.createElement(
                    "button"
                );


            card.type =
                "button";


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


            card.innerHTML = `

                <div class="student-avatar">
                    👤
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

                <div class="student-balance
                    ${
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


/* =====================================================
   รายละเอียดนักเรียน
===================================================== */

function showStudentDetail(
    student
) {

    const modal =
        document.getElementById(
            "studentModal"
        );


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


    document.getElementById(
        "detailNumber"
    ).textContent =
        "เลขที่ " +
        student.number;


    document.getElementById(
        "detailName"
    ).textContent =
        student.name;


    document.getElementById(
        "detailRequired"
    ).textContent =
        required.toLocaleString(
            "th-TH"
        ) +
        " บาท";


    document.getElementById(
        "detailPaid"
    ).textContent =
        paid.toLocaleString(
            "th-TH"
        ) +
        " บาท";


    document.getElementById(
        "detailRemaining"
    ).textContent =
        remaining.toLocaleString(
            "th-TH"
        ) +
        " บาท";


    const detailStatus =
        document.getElementById(
            "detailStatus"
        );


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


    if (modal) {

        modal.style.display =
            "flex";

    }

}


function closeStudentModal() {

    const modal =
        document.getElementById(
            "studentModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}


/* =====================================================
   ป้องกัน HTML แปลก ๆ จากชื่อ
===================================================== */

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