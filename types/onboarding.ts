export interface OnboardingData {
  fullName: string;
  location: string;
  bio: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;

  ventureName?: string;
  ventureDescription?: string;
  ventureIndustry?: string;
  ventureStage?: string;

  investmentFocus?: string;
  investmentRange?: string;
  portfolioSize?: string;

  expertiseAreas?: string[];
  yearsExperience?: number;
  hourlyRate?: number;

  skills?: Array<{
    name: string;
    level: string;
  }>;
}

export type OnboardingStep = 'personal' | 'role-specific' | 'skills' | 'review';
