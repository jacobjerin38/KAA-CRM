import { Activity, Contact, Deal, Lead, TeamMember } from '../types';

export const MOCK_LEADS: Lead[] = [
  { id: '1', fullName: 'Alice Johnson', email: 'alice@techcorp.com', status: 'NEW', source: 'Website', ownerId: 'u1', createdAt: '2023-10-25' },
  { id: '2', fullName: 'Bob Smith', email: 'bob@startuplab.io', status: 'WORKING', source: 'Referral', ownerId: 'u1', createdAt: '2023-10-22' },
  { id: '3', fullName: 'Charlie Davis', email: 'charlie@enterprise.net', status: 'QUALIFIED', source: 'LinkedIn', ownerId: 'u1', createdAt: '2023-10-20' },
  { id: '4', fullName: 'Diana Prince', email: 'diana@themiscira.com', status: 'DISQUALIFIED', source: 'Event', ownerId: 'u1', createdAt: '2023-10-15' },
  { id: '5', fullName: 'Evan Wright', email: 'evan@news.org', status: 'NEW', source: 'Website', ownerId: 'u2', createdAt: '2023-10-26' },
  { id: '6', fullName: 'Fiona Green', email: 'fiona@eco.org', status: 'WORKING', source: 'Webinar', ownerId: 'u1', createdAt: '2023-10-24' },
];

export const MOCK_DEALS: Deal[] = [
  { id: '1', title: 'Enterprise License - TechCorp', amount: 50000, stage: 'Proposal', expectedClose: '2023-11-15', accountId: 'a1', ownerId: 'u1' },
  { id: '2', title: 'Q4 Renewal - StartupLab', amount: 12000, stage: 'Negotiation', expectedClose: '2023-10-30', accountId: 'a2', ownerId: 'u1' },
  { id: '3', title: 'Consulting Project - Global', amount: 85000, stage: 'Qualified', expectedClose: '2023-12-01', accountId: 'a3', ownerId: 'u1' },
  { id: '4', title: 'Add-on Seats - Logistics Inc', amount: 5000, stage: 'Won', expectedClose: '2023-10-01', accountId: 'a4', ownerId: 'u1' },
  { id: '5', title: 'New Implementation - RetailCo', amount: 120000, stage: 'New', expectedClose: '2024-01-15', accountId: 'a5', ownerId: 'u1' },
];

export const MOCK_ACTIVITIES: Activity[] = [
  { id: '1', title: 'Follow up on proposal', type: 'CALL', dueAt: '2023-10-27T10:00:00', status: 'OPEN', relatedType: 'DEAL', relatedId: '1', ownerId: 'u1' },
  { id: '2', title: 'Prepare Q4 Report', type: 'TASK', dueAt: '2023-10-28T14:00:00', status: 'OPEN', relatedType: 'ACCOUNT', relatedId: 'a1', ownerId: 'u1' },
  { id: '3', title: 'Lunch with Client', type: 'MEETING', dueAt: '2023-10-29T12:00:00', status: 'OPEN', relatedType: 'CONTACT', relatedId: 'c1', ownerId: 'u1' },
  { id: '4', title: 'Intro Call', type: 'CALL', dueAt: '2023-10-26T09:00:00', status: 'COMPLETED', relatedType: 'LEAD', relatedId: '1', ownerId: 'u1' },
];

export const MOCK_TEAM: TeamMember[] = [
    { id: '1', name: 'Alex Lewis', role: 'Sales Lead', revenue: 245000, dealsClosed: 12, trend: 15, avatar: 'bg-indigo-100 text-indigo-600', status: 'online' },
    { id: '2', name: 'Sarah Chen', role: 'Senior Rep', revenue: 180000, dealsClosed: 8, trend: 5, avatar: 'bg-emerald-100 text-emerald-600', status: 'busy' },
    { id: '3', name: 'Mike Ross', role: 'Account Exec', revenue: 120000, dealsClosed: 15, trend: -2, avatar: 'bg-blue-100 text-blue-600', status: 'offline' },
    { id: '4', name: 'Jessica Day', role: 'SDR', revenue: 45000, dealsClosed: 4, trend: 20, avatar: 'bg-purple-100 text-purple-600', status: 'online' },
];

export const MOCK_REVENUE_DATA = [
  { month: 'Aug', value: 45000 },
  { month: 'Sep', value: 72000 },
  { month: 'Oct', value: 124500 },
  { month: 'Nov', value: 95000 }, // Projected
  { month: 'Dec', value: 150000 }, // Projected
];

export const getDashboardSummary = (filterOwner: 'me' | 'all', filterPeriod: string) => {
  // Simple Mock Filter Logic
  const deals = MOCK_DEALS; 
  const leads = MOCK_LEADS;
  const activities = MOCK_ACTIVITIES;
  const team = filterOwner === 'all' ? MOCK_TEAM : [];

  // Aggregations
  const pipelineValue = deals.filter(d => d.stage !== 'Won' && d.stage !== 'Lost').reduce((acc, curr) => acc + curr.amount, 0);
  const wonValue = deals.filter(d => d.stage === 'Won').reduce((acc, curr) => acc + curr.amount, 0);
  const openActivities = activities.filter(a => a.status === 'OPEN').length;
  const newLeads = leads.length;

  const leadsByStatus = {
    NEW: leads.filter(l => l.status === 'NEW').length,
    WORKING: leads.filter(l => l.status === 'WORKING').length,
    QUALIFIED: leads.filter(l => l.status === 'QUALIFIED').length,
    DISQUALIFIED: leads.filter(l => l.status === 'DISQUALIFIED').length,
  };

  const dealsByStage = [
    { name: 'New', value: deals.filter(d => d.stage === 'New').reduce((a,c) => a+c.amount,0), count: deals.filter(d => d.stage === 'New').length },
    { name: 'Qual', value: deals.filter(d => d.stage === 'Qualified').reduce((a,c) => a+c.amount,0), count: deals.filter(d => d.stage === 'Qualified').length },
    { name: 'Prop', value: deals.filter(d => d.stage === 'Proposal').reduce((a,c) => a+c.amount,0), count: deals.filter(d => d.stage === 'Proposal').length },
    { name: 'Neg', value: deals.filter(d => d.stage === 'Negotiation').reduce((a,c) => a+c.amount,0), count: deals.filter(d => d.stage === 'Negotiation').length },
    { name: 'Won', value: deals.filter(d => d.stage === 'Won').reduce((a,c) => a+c.amount,0), count: deals.filter(d => d.stage === 'Won').length },
  ];

  return {
    pipelineValue: filterOwner === 'all' ? pipelineValue * 3.5 : pipelineValue, // Fake team multiplier
    wonValue: filterOwner === 'all' ? wonValue * 4 : wonValue,
    openActivities,
    newLeads: filterOwner === 'all' ? newLeads * 5 : newLeads,
    leadsByStatus,
    dealsByStage,
    revenueByMonth: MOCK_REVENUE_DATA,
    topDeals: deals.sort((a,b) => b.amount - a.amount).slice(0, 5),
    recentActivities: activities.slice(0, 5),
    teamMembers: team
  };
};