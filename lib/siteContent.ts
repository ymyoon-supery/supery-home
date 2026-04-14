export interface ServiceItem {
  label: string;
  desc: string;
}

export interface ServiceCardItem {
  number: string;
  title: string;
  description: string;
  detail: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface SiteContent {
  services: {
    title: string;
    body: string;
    downloadUrl: string;
    items: ServiceItem[];
  };
  about: {
    heroLine1: string;
    heroLine2: string;
    heroLine3: string;
    bodyKo: string;
    bodyKo2: string;
    bodyEn: string;
    stats: StatItem[];
    serviceCards: ServiceCardItem[];
  };
  contact: {
    heroSubtitle: string;
    address: string;
    tel: string;
    fax: string;
    web: string;
  };
  footer: {
    tagline: string;
    address: string;
    tel: string;
    fax: string;
    web: string;
  };
}

export const defaultSiteContent: SiteContent = {
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
    bodyKo:
      "좋은 아이디어는 깊이 있는 인사이트에서 시작됩니다. 우리는 브랜드의 본질을 꿰뚫는 통찰력을 바탕으로 급변하는 마케팅 환경에 최적화된 해답을 제시합니다. 데이터 기반의 정교한 분석과 창의적인 전략을 결합하여 소비자의 숨은 니즈를 파악하고, 단순한 제작을 넘어 브랜드의 실질적인 성장을 견인하는 실용적인 솔루션을 설계합니다.",
    bodyKo2:
      "소비자와 소통하고 공유하는 모든 접점을 하나의 의미 있는 콘텐츠로 정의하며, 진정성 있는 메시지를 통해 브랜드와 소비자 사이의 깊은 신뢰와 유대감을 구축합니다.",
    bodyEn:
      "Based on deep insights into brand essence and consumer needs, we provide creative and practical solutions optimized for the rapidly changing digital environment. By combining data-driven analysis with strategic thinking, we design every touchpoint as authentic content. We build sustainable growth and trust through meaningful connections, helping our clients advance toward a more innovative vision.",
    stats: [
      { value: 500, suffix: "+", label: "Projects" },
      { value: 200, suffix: "+", label: "Brands" },
      { value: 10, suffix: "년+", label: "Experience" },
      { value: 98, suffix: "%", label: "Satisfaction" },
    ],
    serviceCards: [
      {
        number: "01",
        title: "SNS Management",
        description: "SNS 채널 전략 수립 및 콘텐츠 운영",
        detail: "브랜드에 최적화된 SNS 채널 전략을 수립하고, 일관성 있는 콘텐츠를 지속적으로 운영합니다.",
      },
      {
        number: "02",
        title: "Campaign",
        description: "브랜드 캠페인 기획 및 실행",
        detail: "브랜드 목표에 맞는 캠페인을 기획하고 멀티채널에서 통합 실행합니다.",
      },
      {
        number: "03",
        title: "Influencer Marketing",
        description: "인플루언서 매칭 및 협업 마케팅",
        detail: "브랜드 이미지에 부합하는 인플루언서를 선별하고 효과적인 협업을 진행합니다.",
      },
      {
        number: "04",
        title: "Total Maintenance",
        description: "디지털 마케팅 통합 운영",
        detail: "SEO, SEM, SNS, 콘텐츠 마케팅을 통합 운영하여 브랜드 디지털 존재감을 강화합니다.",
      },
      {
        number: "05",
        title: "Digital Film",
        description: "영상 콘텐츠 기획 및 제작",
        detail: "브랜드 스토리를 담은 고품질 영상 콘텐츠를 기획부터 제작까지 원스톱으로 제공합니다.",
      },
      {
        number: "06",
        title: "Consulting & Branding",
        description: "브랜드 컨설팅 및 전략 수립",
        detail: "브랜드의 본질을 분석하고 장기적인 브랜드 전략과 아이덴티티를 수립합니다.",
      },
      {
        number: "07",
        title: "Commerce",
        description: "커머스 마케팅 및 퍼포먼스 운영",
        detail: "데이터 기반의 퍼포먼스 마케팅으로 커머스 매출과 ROAS를 극대화합니다.",
      },
    ],
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
