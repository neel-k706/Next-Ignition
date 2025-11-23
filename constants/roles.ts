import { RoleOption } from '@/types/user';

export const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'founder',
    title: 'Founder',
    description: 'Leading a startup and looking to build, scale, and succeed',
    icon: 'rocket',
  },
  {
    id: 'cofounder',
    title: 'Co-founder',
    description: 'Partnering on a venture and sharing the entrepreneurial journey',
    icon: 'users',
  },
  {
    id: 'investor',
    title: 'Investor',
    description: 'Seeking opportunities to fund and support promising startups',
    icon: 'trending-up',
  },
  {
    id: 'expert',
    title: 'Expert',
    description: 'Providing guidance, mentorship, and specialized knowledge',
    icon: 'briefcase',
  },
];
