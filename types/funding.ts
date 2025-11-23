export type FundingStatus = 'active' | 'funded' | 'closed';
export type FundingStage = 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c';
export type IndustryType = 'saas' | 'fintech' | 'healthtech' | 'edtech' | 'ecommerce' | 'ai' | 'blockchain' | 'other';

export interface PitchDeck {
  id: string;
  url: string;
  filename: string;
  pages: number;
  uploadedAt: string;
}

export interface Founder {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  linkedin?: string;
}

export interface FundingOpportunity {
  id: string;
  company_name: string;
  tagline: string;
  description: string;
  industry: IndustryType;
  stage: FundingStage;
  status: FundingStatus;
  target_amount: number;
  raised_amount: number;
  min_investment: number;
  max_investment: number;
  valuation: number;
  equity_offered: number;
  deadline: string;
  location: string;
  founded_year: number;
  team_size: number;
  revenue: number;
  growth_rate: number;
  pitch_deck?: PitchDeck;
  founders: Founder[];
  highlights: string[];
  metrics: {
    mrr?: number;
    arr?: number;
    users?: number;
    customers?: number;
  };
  logo?: string;
  images: string[];
  video_url?: string;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface FilterOptions {
  search: string;
  industries: IndustryType[];
  stages: FundingStage[];
  statuses: FundingStatus[];
  minAmount: number;
  maxAmount: number;
  minValuation: number;
  maxValuation: number;
}
