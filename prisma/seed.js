const prisma = require("../configs/prisma");
const bcrypt = require("bcryptjs");

const hashedPassword = bcrypt.hashSync("123456", 10);

const userData = [
  {
    username: "admin",
    email: "admin@test.com",
    password: hashedPassword,
    profileImage: "https://picsum.photos/id/17/50/50",
  },
  {
    username: "andy",
    email: "andy@test.com",
    password: hashedPassword,
    profileImage: "https://picsum.photos/id/18/50/50",
  },
  {
    username: "bob",
    email: "bob@test.com",
    password: hashedPassword,
    profileImage: "https://picsum.photos/id/19/50/50",
  },
  {
    username: "danny",
    email: "danny@test.com",
    password: hashedPassword,
    profileImage: "https://picsum.photos/id/20/50/50",
  },
];

const riskAssessmentResultData = [
  {
    minScore: "0",
    maxScore: "14",
  },
  {
    minScore: "15",
    maxScore: "21",
  },
  {
    minScore: "22",
    maxScore: "29",
  },
  {
    minScore: "30",
    maxScore: "36",
  },
  {
    minScore: "37",
    maxScore: "100",
  },
];

const riskAssessmentQuestionData = [
    {
        question: "ปัจจุบันคุณอายุ",
        options: ["มากกว่า 55 ปี", "45-55 ปี", "35-44 ปี", "น้อยกว่า 35 ปี"]
    },
    {
        question: "ปัจจุบันคุณมีภาระทางการเงินและค่าใช้จ่ายประจำ เช่น ค่าผ่อนบ้าน รถ ค่าใช้จ่ายส่วนตัว และค่าเลี้ยงดูครอบครัว",
        options: ["มากกว่าร้อยละ 75 ของรายได้ทั้งหมด", "ระหว่างร้อยละ 50 ถึง 75 ของรายได้ทั้งหมด", "ระหว่างร้อยละ 25 ถึง 50 ของรายได้ทั้งหมด", "น้องกว่าร้อยละ 25 ของรายได้ทั้งหมด"]
    },
    {
        question: "คุณมีสถานภาพทางการเงินในปัจจุบันอย่างไร",
        options: ["มีทรัพย์สินน้อยกว่าหนี้สิน", "มีทรัพย์สินเท่ากับหนี้สิน", "มีทรัพย์สินมากกว่าหนี้สิน", "มีความมั่นใจว่ามีเงินออมหรือเงินลงทุนเพียงพอสำหรับการใช้ขีวิตหลังเกษียณอายุแล้ว"]
    },
    {
        question: "คุณเคยมีประสบการณ์ หรือมีความรู้ในการลงทุนในทรัพย์สินที่เสี่ยงที่สุดกลุ่มใด",
        options: ["เงินฝากธนาคาร", "พันธบัตรรัฐบาลหรือกองทุนรวมพันธบัตรรัฐบาล", "หุ้นหู้หรือกองทุนรวมตราสารหนี้", "หุ้มสามัญหรือกองทุนรวมหุ้น หรือทรัพย์สินอื่นที่มีความเสี่ยงสูง"]
    },
    {
        question: "ระยะเวลาที่คุณคาดว่าจะไม่มีความจำเป็นที่ต้องใช้เงินลงทุนนี้",
        options: ["ไม่เกิน 1 ปี", "1 ถึง 3 ปี", "3 ถึง 5 ปี", "มากกว่า 5 ปี"]
    },
    {
        question: "วัตถุประสงค์หลักในการลงทุนของคุณ คือ",
        options: ["เน้นเงินต้นต้องปลอดภัยและได้รับผลตอบแทนสม่ำเสมอแต่ต่ำได้", "เน้นโอกาสได้รับผลตอบแทนที่สม่ำเสมอ แต่อาจเสี่ยงที่จะสูญเสียเงินต้นได้บ้าง", "เน้นโอกาสได้รับผลตอบแทนที่สูงขึ้น แต่อาจเสี่ยงที่จะสูญเสียเงินต้นได้มากขึ้น", "เน้นผลตอบแทนสูงสุดในระยะยาว แต่อาจเสี่ยงที่จะสูญเงินต้นส่วนใหญ่ได้"]
    },
    {
        question: "คุณเต็มใจที่จะลงทุนในกลุ่มการลงทุนใด",
        options: ["กลุ่มการลงทุนที่ 1 มีโอกาสได้รับผลตอบแทน 2.5% โดยไม่ขาดทุนเลย", "กลุ่มการลงทุนที่ 2 มีโอกาสได้รับผลตอบแทนสูงสุด 7% แต่อาจมีผลขาดทุนได้ถึง 1%", "กลุ่มการลงทุนที่ 3 มีโอกาสได้รับผลตอบแทนสูงสุด 15% แต่อาจมีผลขาดทุนได้ถึง 5%", "กลุ่มการลงทุนที่ 4 มีโอกาสได้รับผลตอบแทนสูงสุด 25% แต่อาจมีผลขาดทุนได้ถึง 15%"]
    },
    {
        question: "ถ้าคุณเลือกลงทุนในทรัพย์สินที่มีโอกาสได้รับผลตอบแทนมาก แต่มีโอกาสขาดทุนสูงด้วยเช่นกัน คุณจะรู้สึกอย่างไร",
        options: ["กังวลและตื่นตระหนกกลัวขาดทุน", "ไม่สบายใจแต่พอเข้าใจได้บ้าง", "เข้าใจและรับความผันผวนได้ในระดับหนึ่ง", "ไม่กังวลกับโอกาสขาดทุนสูง และหวังกับผลตอบแทนที่อาจจะได้รับสูงขึ้น"]
    },
    {
        question: "คุณจะรู้สึกกังวล/รับไม่ได้ เมื่อมูลค่าเงินลงทุนของคุณมีการปรับตัวลดลงในสัดส่วนเท่าใด",
        options: ["5% หรือน้อยกว่า", "มากกว่า 5%-10%", "มากกว่า 10%-20%", "มากกว่า 20% ขึ้นไป"]
    },
    {
        question: "หากปีที่แล้วคุณลงทุนไป 100,000 บาท ปีนี้คุณพบว่ามูลค่าเงินลงทุนลดลงเหลือ 85,000 บาท คุณจะทำอย่างไร",
        options: ["ตกใจ และต้องการขายการลงทุนที่เหลือทิ้ง", "กังวลใจ และจะปรับเปลี่ยนการลงทุนบางส่วนไปในทรัพย์สินที่เสี่ยงน้อยลง", "อดทนถือต่อไปได้ และรอผลตอบแทนปรับตัวกลับมา", "ยังมั่นใจ เพราะเข้าใจว่าต้องลงทุนระยะยาว และจะเพิ่มเงินลงทุนในแบบเดิมเพื่อเฉลี่ยต้นทุน"]
    },
]



console.log("db seed...user");

async function seedDB() {
  await prisma.user.createMany({
    data: userData,
  });

  await prisma.riskAssessmentResult.createMany({
    data: riskAssessmentResultData,
  });

  await prisma.riskAssessmentQuestionData.createMany({
    data: riskAssessmentQuestionData,
  });
}

seedDB();
