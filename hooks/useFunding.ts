import { useState, useEffect } from 'react';
import { FundingOpportunity, FilterOptions } from '@/types/funding';

const MOCK_FUNDING_OPPORTUNITIES: FundingOpportunity[] = [
  {
    id: '1',
    company_name: 'CloudSync',
    tagline: 'Enterprise cloud collaboration reimagined',
    description: 'CloudSync is revolutionizing how enterprise teams collaborate across cloud platforms. Our AI-powered synchronization engine ensures seamless data flow between all major cloud providers, reducing workflow friction by 75%. We have secured contracts with 3 Fortune 500 companies and are on track to reach $5M ARR by Q4.',
    industry: 'saas',
    stage: 'series-a',
    status: 'active',
    target_amount: 5000000,
    raised_amount: 3200000,
    min_investment: 50000,
    max_investment: 500000,
    valuation: 25000000,
    equity_offered: 20,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    location: 'San Francisco, CA',
    founded_year: 2022,
    team_size: 18,
    revenue: 2400000,
    growth_rate: 285,
    pitch_deck: {
      id: 'deck-1',
      url: 'https://example.com/deck.pdf',
      filename: 'CloudSync_Pitch_Deck.pdf',
      pages: 15,
      uploadedAt: new Date().toISOString(),
    },
    founders: [
      {
        id: 'f1',
        name: 'Sarah Chen',
        role: 'CEO & Co-founder',
        linkedin: 'https://linkedin.com/in/sarahchen',
      },
      {
        id: 'f2',
        name: 'Michael Rodriguez',
        role: 'CTO & Co-founder',
        linkedin: 'https://linkedin.com/in/michaelrodriguez',
      },
    ],
    highlights: [
      '3 Fortune 500 clients',
      '$2.4M ARR with 285% YoY growth',
      '97% customer retention rate',
      'Patent-pending AI sync technology',
    ],
    metrics: {
      arr: 2400000,
      customers: 47,
      users: 2340,
    },
    images: [
      'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
    ],
    documents: [
      {
        id: 'doc-1',
        name: 'Term Sheet',
        type: 'pdf',
        url: 'https://example.com/terms.pdf',
      },
      {
        id: 'doc-2',
        name: 'Financial Projections',
        type: 'xlsx',
        url: 'https://example.com/projections.xlsx',
      },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: '2',
    company_name: 'HealthPulse',
    tagline: 'AI-driven preventive healthcare platform',
    description: 'HealthPulse leverages advanced machine learning to predict health issues before they become critical. Our platform integrates with wearables and medical devices to provide real-time health insights. We have partnerships with 12 healthcare providers serving over 50,000 patients.',
    industry: 'healthtech',
    stage: 'seed',
    status: 'active',
    target_amount: 2000000,
    raised_amount: 1400000,
    min_investment: 25000,
    max_investment: 250000,
    valuation: 12000000,
    equity_offered: 15,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
    location: 'Boston, MA',
    founded_year: 2023,
    team_size: 12,
    revenue: 480000,
    growth_rate: 420,
    pitch_deck: {
      id: 'deck-2',
      url: 'https://example.com/deck2.pdf',
      filename: 'HealthPulse_Pitch.pdf',
      pages: 18,
      uploadedAt: new Date().toISOString(),
    },
    founders: [
      {
        id: 'f3',
        name: 'Dr. Emily Watson',
        role: 'CEO & Founder',
        linkedin: 'https://linkedin.com/in/emilywatson',
      },
    ],
    highlights: [
      '12 healthcare partnerships',
      '50,000+ active patients',
      'FDA clearance obtained',
      '95% prediction accuracy',
    ],
    metrics: {
      arr: 480000,
      customers: 12,
      users: 50000,
    },
    images: [
      'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
    ],
    documents: [
      {
        id: 'doc-3',
        name: 'Clinical Trial Results',
        type: 'pdf',
        url: 'https://example.com/clinical.pdf',
      },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: '3',
    company_name: 'FinFlow',
    tagline: 'Next-generation payment infrastructure',
    description: 'FinFlow is building the future of B2B payments with instant settlement and zero-fee international transfers. Our blockchain-based infrastructure processes over $10M in transactions monthly with 99.99% uptime. We are licensed in 15 countries.',
    industry: 'fintech',
    stage: 'series-a',
    status: 'active',
    target_amount: 8000000,
    raised_amount: 2500000,
    min_investment: 100000,
    max_investment: 1000000,
    valuation: 45000000,
    equity_offered: 18,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
    location: 'New York, NY',
    founded_year: 2021,
    team_size: 28,
    revenue: 3200000,
    growth_rate: 310,
    pitch_deck: {
      id: 'deck-3',
      url: 'https://example.com/deck3.pdf',
      filename: 'FinFlow_Investment_Deck.pdf',
      pages: 20,
      uploadedAt: new Date().toISOString(),
    },
    founders: [
      {
        id: 'f4',
        name: 'James Park',
        role: 'CEO',
        linkedin: 'https://linkedin.com/in/jamespark',
      },
      {
        id: 'f5',
        name: 'Lisa Chen',
        role: 'COO',
        linkedin: 'https://linkedin.com/in/lisachen',
      },
    ],
    highlights: [
      '$10M+ monthly transaction volume',
      'Licensed in 15 countries',
      '99.99% uptime guarantee',
      '500+ business customers',
    ],
    metrics: {
      arr: 3200000,
      customers: 500,
    },
    images: [
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
    ],
    documents: [
      {
        id: 'doc-4',
        name: 'Regulatory Licenses',
        type: 'pdf',
        url: 'https://example.com/licenses.pdf',
      },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: '4',
    company_name: 'EduTech Pro',
    tagline: 'Personalized learning for enterprise training',
    description: 'EduTech Pro delivers adaptive learning experiences for corporate training programs. Our AI analyzes learning patterns and creates personalized curriculum paths. We serve 80+ enterprise clients including 5 Fortune 1000 companies.',
    industry: 'edtech',
    stage: 'seed',
    status: 'active',
    target_amount: 3000000,
    raised_amount: 2100000,
    min_investment: 30000,
    max_investment: 300000,
    valuation: 15000000,
    equity_offered: 20,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString(),
    location: 'Austin, TX',
    founded_year: 2022,
    team_size: 15,
    revenue: 1200000,
    growth_rate: 340,
    pitch_deck: {
      id: 'deck-4',
      url: 'https://example.com/deck4.pdf',
      filename: 'EduTech_Pitch.pdf',
      pages: 16,
      uploadedAt: new Date().toISOString(),
    },
    founders: [
      {
        id: 'f6',
        name: 'David Kim',
        role: 'CEO & Founder',
        linkedin: 'https://linkedin.com/in/davidkim',
      },
    ],
    highlights: [
      '80+ enterprise clients',
      '5 Fortune 1000 customers',
      '340% YoY revenue growth',
      '92% course completion rate',
    ],
    metrics: {
      arr: 1200000,
      customers: 80,
      users: 45000,
    },
    images: [
      'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
    ],
    documents: [
      {
        id: 'doc-5',
        name: 'Customer Case Studies',
        type: 'pdf',
        url: 'https://example.com/cases.pdf',
      },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: '5',
    company_name: 'GreenEnergy AI',
    tagline: 'Optimizing renewable energy distribution',
    description: 'GreenEnergy AI uses machine learning to optimize renewable energy distribution across smart grids. Our platform reduces energy waste by 35% and has been deployed in 25 cities. We are partnered with 3 major utility companies.',
    industry: 'ai',
    stage: 'pre-seed',
    status: 'active',
    target_amount: 1500000,
    raised_amount: 650000,
    min_investment: 20000,
    max_investment: 150000,
    valuation: 8000000,
    equity_offered: 18,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 40).toISOString(),
    location: 'Seattle, WA',
    founded_year: 2023,
    team_size: 8,
    revenue: 180000,
    growth_rate: 520,
    pitch_deck: {
      id: 'deck-5',
      url: 'https://example.com/deck5.pdf',
      filename: 'GreenEnergy_Deck.pdf',
      pages: 14,
      uploadedAt: new Date().toISOString(),
    },
    founders: [
      {
        id: 'f7',
        name: 'Maria Garcia',
        role: 'CEO',
        linkedin: 'https://linkedin.com/in/mariagarcia',
      },
      {
        id: 'f8',
        name: 'Tom Anderson',
        role: 'CTO',
        linkedin: 'https://linkedin.com/in/tomanderson',
      },
    ],
    highlights: [
      'Deployed in 25 cities',
      '35% reduction in energy waste',
      '3 major utility partnerships',
      'Patent pending technology',
    ],
    metrics: {
      mrr: 15000,
      customers: 3,
    },
    images: [
      'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg',
    ],
    documents: [
      {
        id: 'doc-6',
        name: 'Pilot Program Results',
        type: 'pdf',
        url: 'https://example.com/pilot.pdf',
      },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: '6',
    company_name: 'RetailFlow',
    tagline: 'Smart inventory management for retailers',
    description: 'RetailFlow provides real-time inventory tracking and predictive restocking for retail chains. Our computer vision and IoT sensors eliminate stockouts and reduce overstock by 40%. We serve 150+ retail locations.',
    industry: 'ecommerce',
    stage: 'series-b',
    status: 'funded',
    target_amount: 15000000,
    raised_amount: 15000000,
    min_investment: 250000,
    max_investment: 2000000,
    valuation: 85000000,
    equity_offered: 15,
    deadline: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    location: 'Chicago, IL',
    founded_year: 2020,
    team_size: 42,
    revenue: 8500000,
    growth_rate: 210,
    pitch_deck: {
      id: 'deck-6',
      url: 'https://example.com/deck6.pdf',
      filename: 'RetailFlow_Series_B.pdf',
      pages: 22,
      uploadedAt: new Date().toISOString(),
    },
    founders: [
      {
        id: 'f9',
        name: 'Robert Johnson',
        role: 'CEO',
        linkedin: 'https://linkedin.com/in/robertjohnson',
      },
    ],
    highlights: [
      '150+ retail locations',
      '$8.5M ARR',
      '40% reduction in overstock',
      'Proven ROI of 250%',
    ],
    metrics: {
      arr: 8500000,
      customers: 32,
      users: 3200,
    },
    images: [
      'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
    ],
    documents: [
      {
        id: 'doc-7',
        name: 'Series B Term Sheet',
        type: 'pdf',
        url: 'https://example.com/seriesb.pdf',
      },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
];

export function useFundingOpportunities() {
  const [opportunities, setOpportunities] = useState<FundingOpportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<FundingOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    industries: [],
    stages: [],
    statuses: [],
    minAmount: 0,
    maxAmount: 20000000,
    minValuation: 0,
    maxValuation: 100000000,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpportunities(MOCK_FUNDING_OPPORTUNITIES);
      setFilteredOpportunities(MOCK_FUNDING_OPPORTUNITIES);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, opportunities]);

  const applyFilters = () => {
    let filtered = [...opportunities];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (opp) =>
          opp.company_name.toLowerCase().includes(searchLower) ||
          opp.tagline.toLowerCase().includes(searchLower) ||
          opp.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.industries.length > 0) {
      filtered = filtered.filter((opp) => filters.industries.includes(opp.industry));
    }

    if (filters.stages.length > 0) {
      filtered = filtered.filter((opp) => filters.stages.includes(opp.stage));
    }

    if (filters.statuses.length > 0) {
      filtered = filtered.filter((opp) => filters.statuses.includes(opp.status));
    }

    filtered = filtered.filter(
      (opp) =>
        opp.target_amount >= filters.minAmount &&
        opp.target_amount <= filters.maxAmount &&
        opp.valuation >= filters.minValuation &&
        opp.valuation <= filters.maxValuation
    );

    setFilteredOpportunities(filtered);
  };

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      industries: [],
      stages: [],
      statuses: [],
      minAmount: 0,
      maxAmount: 20000000,
      minValuation: 0,
      maxValuation: 100000000,
    });
  };

  return {
    opportunities: filteredOpportunities,
    allOpportunities: opportunities,
    loading,
    filters,
    updateFilters,
    resetFilters,
  };
}
