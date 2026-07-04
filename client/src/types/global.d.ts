type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type GetPendingQueryParams = {
  page?: number;
  limit?: number;
};