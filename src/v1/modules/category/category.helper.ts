interface LocationNode {
  id: number;
  name: string;
  parentId: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  children?: LocationNode[];
}

export function buildTree(locations: LocationNode[], parentId: number | null): LocationNode[] {
  return locations
    .filter((loc) => loc.parentId === parentId)
    .map((loc) => ({
      ...loc,
      children: buildTree(locations, loc.id),
    }));
}

export function buildPath(locations: LocationNode[], locationId: number): LocationNode[] {
  const location = locations.find((loc) => loc.id === locationId);
  if (!location) return [];

  if (!location.parentId) return [location];

  return [...buildPath(locations, location.parentId), location];
}
