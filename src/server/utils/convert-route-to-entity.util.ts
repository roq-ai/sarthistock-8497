const mapping: Record<string, string> = {
  'investment-recommendations': 'investment_recommendation',
  organizations: 'organization',
  portfolios: 'portfolio',
  stocks: 'stock',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
