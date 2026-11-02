const fs = require('fs');
const path = require('path');

const existingPath = path.join(__dirname, 'data', 'ai_scenarios.json');
const current = JSON.parse(fs.readFileSync(existingPath, 'utf8'));

const newScenarios = [
  {
    id: "hospital_visit",
    title: "Khám Bệnh Tại Bệnh Viện (医院看病与问诊)",
    level: "HSK 3 - 4",
    icon: "stethoscope",
    role: "Bác sĩ khoa nội tại Bệnh viện Nhân dân Bắc Kinh",
    initialMessage: "你好！请坐。请问你哪里不舒服？发烧、头痛还是咳嗽？这种情况持续几天了？",
    suggestedReplies: [
      "医生，我从昨天晚上开始发烧，嗓子也很疼。",
      "我肚子疼得厉害，可能昨天吃了不干净的东西。",
      "医生，我需要做血常规检查或者打针吗？"
    ]
  },
  {
    id: "rent_apartment",
    title: "Thuê Nhà & Ký Hợp Đồng (房屋租赁与咨询)",
    level: "HSK 3 - 4",
    icon: "home",
    role: "Nhân viên môi giới bất động sản tại Thượng Hải",
    initialMessage: "您好！欢迎来看房。这是一套一室一厅的精装修公寓，离地铁站步行只要五分钟。您对租金和租期有什么要求吗？",
    suggestedReplies: [
      "请问一个月的房租是多少？押金怎么交？",
      "房间里配有洗衣机、冰箱和空调吗？水电费怎么算？",
      "如果我签一年的合同，房租可以稍微便宜一点吗？"
    ]
  },
  {
    id: "airport_checkin",
    title: "Check-in Sân Bay & Thủ Tục Bay (机场值机与托运)",
    level: "HSK 3 - 4",
    icon: "plane",
    role: "Nhân viên quầy làm thủ tục hãng hàng không Air China",
    initialMessage: "您好！请出示您的护照和机票预订信息。请问您有几件行李需要托运？您想要靠窗还是靠过道的座位？",
    suggestedReplies: [
      "您好，我有两件行李箱需要托运，请问超重了吗？",
      "我想选一个靠窗的座位，还有位置吗？",
      "请问几点开始登机？登机口在几号？"
    ]
  },
  {
    id: "taxi_directions",
    title: "Đi Taxi & Hỏi Đường (打车出行与指路)",
    level: "HSK 2 - 3",
    icon: "car",
    role: "Tài xế taxi thân thiện tại Bắc Kinh",
    initialMessage: "师傅好！您去哪儿啊？直接报地名或者在手机上给我看一下定位都行。",
    suggestedReplies: [
      "师傅，我去王府井步行街，大概需要多长时间？",
      "我现在有点儿赶时间，请问哪条路不会堵车？",
      "前面路口右转停一下就行，我用微信支付车费。"
    ]
  },
  {
    id: "bank_exchange",
    title: "Giao Dịch Ngân Hàng & Đổi Tiền (银行开户与换汇)",
    level: "HSK 4 - 5",
    icon: "credit-card",
    role: "Giao dịch viên Ngân hàng Trung Quốc (Bank of China)",
    initialMessage: "您好，请问您办理什么业务？存取款、开立新账户还是兑换外币？请先在机器上取号排队。",
    suggestedReplies: [
      "我想用美元兑换一些人民币现金，请问今天的汇率是多少？",
      "我是外国留学生，想用护照办一张借记卡用于日常消费。",
      "请问如果开通手机银行和网银，需要填写哪些申请表格？"
    ]
  },
  {
    id: "business_negotiation",
    title: "Đàm Phán Thương Mại & Ký Kết (商务合作与谈判)",
    level: "HSK 5 - 6",
    icon: "briefcase",
    role: "Giám đốc đối ngoại công ty xuất nhập khẩu tại Thâm Quyến",
    initialMessage: "贵方提出的合作方案我们已经仔细审阅过了。总体上我们非常有诚意达成合作，但在单价和交货周期上，双方还需要进一步协商。",
    suggestedReplies: [
      "如果我们首批订购量增加到五万件，贵公司能在单价上给予5%的折扣吗？",
      "对于付款方式，我们建议采用30%定金，剩余尾款见提单副本后电汇支付。",
      "希望我们双方能够本着互利共赢的原则，长期稳定地合作下去。"
    ]
  }
];

const allScenarios = [...current, ...newScenarios];
fs.writeFileSync(existingPath, JSON.stringify(allScenarios, null, 2), 'utf8');
console.log(`Đã xuất sắc nâng cấp Kịch Bản Đàm Thoại AI lên ${allScenarios.length} Tình Huống Thực Chiến tại ${existingPath}`);
