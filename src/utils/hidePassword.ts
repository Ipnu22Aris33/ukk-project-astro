export function hidePassword<T extends { password?: any }>(data: T) {
  const { password, ...safe } = data;
  return safe;
}
