// 사용법: node scripts/init-site-bin.mjs <JSONBIN_API_KEY>
const apiKey = process.argv[2];

if (!apiKey) {
  console.error("사용법: node scripts/init-site-bin.mjs <JSONBIN_API_KEY>");
  process.exit(1);
}

const defaultContent = {
  services: {
    title: "From SNS\nto Platform",
    body: "디지털 콘텐츠와 광고 마케팅 전반을 기획·운영하며 브랜드와 소비자 간의 소통을 만들어갑니다.",
    downloadUrl: "#",
    items: [
      { label: "SNS Management", desc: "SNS 채널 전략 수립 및 콘텐츠 운영" },
      { label: "Campaign", desc: "브랜드 캠페인 기획 및 실행" },
      { label: "Influencer Marketing", desc: "인플루언서 매칭 및 협업 마케팅" },
      { label: "Total Maintenance", desc: "디지털 마케팅 통합 운영" },
      { label: "Digital Film", desc: "영상 콘텐츠 기획 및 제작" },
      { label: "Consulting & Branding", desc: "브랜드 컨설팅 및 전략 수립" },
      { label: "Commerce", desc: "커머스 마케팅 및 퍼포먼스 운영" },
    ],
  },
  about: {
    heroLine1: "GOOD IDEA",
    heroLine2: "STARTS WITH",
    heroLine3: "GOOD INSIGHT",
    bodyKo: "좋은 아이디어는 깊이 있는 인사이트에서 시작됩니다.",
    bodyKo2: "소비자와 소통하고 공유하는 모든 접점을 하나의 의미 있는 콘텐츠로 정의합니다.",
    bodyEn: "Based on deep insights into brand essence and consumer needs, we provide creative and practical solutions.",
    stats: [
      { value: 500, suffix: "+", label: "Projects" },
      { value: 200, suffix: "+", label: "Brands" },
      { value: 10, suffix: "년+", label: "Experience" },
      { value: 98, suffix: "%", label: "Satisfaction" },
    ],
    serviceCards: [],
  },
  contact: {
    heroSubtitle: "브랜드의 성장을 함께 만들어갈 준비가 되어 있습니다. 언제든지 연락주세요.",
    address: "Jobok Building 102, 201\n23, Nonhyeon-ro 135-gil\nGangnam-gu, Seoul\nRepublic of Korea",
    tel: "02-540-3445",
    fax: "02-540-3443",
    web: "www.supery.co.kr",
  },
  footer: {
    tagline: "끊임없이 변화하는 멀티채널 환경에서\n브랜드의 가치를 극대화합니다.",
    address: "Jobok Building 102, 201, 23, Nonhyeon-ro 135-gil,\nGangnam-gu, Seoul, Republic of Korea",
    tel: "02-540-3445",
    fax: "02-540-3443",
    web: "www.supery.co.kr",
  },
};

const res = await fetch("https://api.jsonbin.io/v3/b", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Master-Key": apiKey,
    "X-Bin-Name": "supery-site-content",
    "X-Bin-Private": "true",
  },
  body: JSON.stringify(defaultContent),
});

const data = await res.json();

if (!res.ok) {
  console.error("오류:", JSON.stringify(data));
  process.exit(1);
}

const binId = data.metadata?.id ?? "";
console.log("\n✅ Bin 생성 완료!");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("JSONBIN_SITE_BIN_ID =", binId);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("\nVercel → Settings → Environment Variables 에 위 값을 추가하세요.");
