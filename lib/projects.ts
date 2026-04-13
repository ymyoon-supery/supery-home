export type Category =
  | "all"
  | "sns-management"
  | "campaign"
  | "influencer-marketing"
  | "total-maintenance"
  | "digital-film"
  | "consulting-branding"
  | "commerce";

export interface MediaItem {
  url: string;
  type: "image" | "video" | "youtube";
  videoId?: string; // YouTube video ID (type === "youtube" 일 때만)
}

export interface Project {
  id: string;
  title: string;
  category: Exclude<Category, "all">;
  categoryLabel: string;
  image: string; // 대표 이미지
  media?: MediaItem[]; // 전체 미디어 (최대 10개)
  description?: string;
  featured?: boolean;
}

export const categoryLabels: Record<Category, string> = {
  all: "ALL",
  "sns-management": "SNS MANAGEMENT",
  campaign: "CAMPAIGN",
  "influencer-marketing": "INFLUENCER MARKETING",
  "total-maintenance": "TOTAL MAINTENANCE",
  "digital-film": "DIGITAL FILM",
  "consulting-branding": "CONSULTING & BRANDING",
  commerce: "COMMERCE",
};

export const categories: Category[] = [
  "all",
  "sns-management",
  "campaign",
  "influencer-marketing",
  "total-maintenance",
  "digital-film",
  "consulting-branding",
  "commerce",
];

// Placeholder projects — replace images with actual portfolio images from the original site
export const projects: Project[] = [
  {
    id: "1",
    title: "브랜드 SNS 채널 운영",
    category: "sns-management",
    categoryLabel: "SNS MANAGEMENT",
    image: "https://cdn.imweb.me/upload/S202512290680c9aed9423/a42e3bfafbf89.png",
    description: "인스타그램, 페이스북 통합 채널 기획 및 운영",
    featured: true,
  },
  {
    id: "2",
    title: "시즌 캠페인",
    category: "campaign",
    categoryLabel: "CAMPAIGN",
    image: "https://cdn.imweb.me/upload/S202512290680c9aed9423/3679815627c88.png",
    description: "브랜드 인지도 확대를 위한 통합 캠페인",
    featured: true,
  },
  {
    id: "3",
    title: "인플루언서 콜라보레이션",
    category: "influencer-marketing",
    categoryLabel: "INFLUENCER MARKETING",
    image: "https://cdn.imweb.me/upload/S202512290680c9aed9423/a42e3bfafbf89.png",
    description: "마이크로 인플루언서 매칭 및 협업",
    featured: true,
  },
  {
    id: "4",
    title: "통합 디지털 마케팅 운영",
    category: "total-maintenance",
    categoryLabel: "TOTAL MAINTENANCE",
    image: "https://cdn.imweb.me/upload/S202512290680c9aed9423/3679815627c88.png",
    description: "SEO, SEM, SNS 통합 운영",
    featured: true,
  },
  {
    id: "5",
    title: "브랜드 영상 콘텐츠",
    category: "digital-film",
    categoryLabel: "DIGITAL FILM",
    image: "https://cdn.imweb.me/upload/S202512290680c9aed9423/a42e3bfafbf89.png",
    description: "브랜드 스토리텔링 영상 기획 및 제작",
    featured: true,
  },
  {
    id: "6",
    title: "브랜드 아이덴티티 리뉴얼",
    category: "consulting-branding",
    categoryLabel: "CONSULTING & BRANDING",
    image: "https://cdn.imweb.me/upload/S202512290680c9aed9423/3679815627c88.png",
    description: "BI 전략 수립 및 비주얼 가이드라인 제작",
    featured: true,
  },
  {
    id: "7",
    title: "커머스 퍼포먼스 마케팅",
    category: "commerce",
    categoryLabel: "COMMERCE",
    image: "https://cdn.imweb.me/upload/S202512290680c9aed9423/a42e3bfafbf89.png",
    description: "ROAS 최적화 퍼포먼스 캠페인",
    featured: false,
  },
  {
    id: "8",
    title: "SNS 콘텐츠 제작",
    category: "sns-management",
    categoryLabel: "SNS MANAGEMENT",
    image: "https://cdn.imweb.me/upload/S202512290680c9aed9423/3679815627c88.png",
    description: "월간 SNS 콘텐츠 기획 및 제작",
    featured: false,
  },
  {
    id: "9",
    title: "론칭 캠페인",
    category: "campaign",
    categoryLabel: "CAMPAIGN",
    image: "https://cdn.imweb.me/upload/S202512290680c9aed9423/a42e3bfafbf89.png",
    description: "신제품 론칭 통합 마케팅 캠페인",
    featured: false,
  },
];

export function getProjectsByCategory(category: Category): Project[] {
  if (category === "all") return projects;
  return projects.filter((p) => p.category === category);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
