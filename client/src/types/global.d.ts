type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type GetQueryParams = {
  page?: number;
  limit?: number;
  status?: string;
};