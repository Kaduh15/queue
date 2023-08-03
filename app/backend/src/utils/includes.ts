export function includes<T>(array: T[], include: string | T) {
  const result = array.some((value) => value === include)

  return result
}
