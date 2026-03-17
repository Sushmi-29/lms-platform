export const orderBy = (field: string, direction: 'ASC' | 'DESC' = 'ASC') => {
  return `ORDER BY ${field} ${direction}`;
};