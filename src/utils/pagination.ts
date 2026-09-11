export interface PaginationResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  status: boolean;
  message: string;
}



export const parsePaginationParams = (query: any): { page: number; limit: number; search?: string } => {
  let page = parseInt(query.page as string, 10) || 1;
  let limit = parseInt(query.limit as string, 10) || 10;
  const search = (query.search as string) || undefined;

  // Validation
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;
  if (limit > 100) limit = 100; // Max 100 per page

  return { page, limit, search };
};

export const formatPaginationResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message: string = "Data fetched successfully"
): PaginationResult<T> => {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    status: true,
    message,
  };
};