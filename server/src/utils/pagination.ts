export function getPagination(
  page?: unknown,
  limit?: unknown,
  defaultLimit = 10,
) {
  const pageNumber =
    Number.isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);

  const limitNumber =
    Number.isNaN(Number(limit)) || Number(limit) < 1
      ? defaultLimit
      : Number(limit);

  return {
    page: pageNumber,
    limit: limitNumber,
    skip: (pageNumber - 1) * limitNumber,
  };
}
