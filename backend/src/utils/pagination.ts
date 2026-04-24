/**
 * PAGINATION UTILITY — helper functions untuk pagination
 */

export interface PaginationParams {
  page?: number | string;
  limit?: number | string;
  search?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Parse pagination parameters dari request
 * Default: page 1, limit 10
 */
export const parsePaginationParams = (params: PaginationParams) => {
  let page = parseInt(String(params.page || 1));
  let limit = parseInt(String(params.limit || 10));

  // Validate
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;
  if (limit > 100) limit = 100; // Max limit untuk mencegah abuse

  return { page, limit };
};

/**
 * Calculate pagination metadata
 */
export const calculatePaginationMeta = (
  totalRecords: number,
  page: number,
  limit: number,
): PaginationMeta => {
  const totalPages = Math.ceil(totalRecords / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages));

  return {
    currentPage,
    totalPages,
    pageSize: limit,
    totalRecords,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

/**
 * Format pagination result dengan data dan metadata
 */
export const formatPaginationResult = <T>(
  data: T[],
  totalRecords: number,
  page: number,
  limit: number,
): PaginationResult<T> => {
  return {
    data,
    pagination: calculatePaginationMeta(totalRecords, page, limit),
  };
};

/**
 * Calculate skip untuk Prisma
 */
export const calculateSkip = (page: number, limit: number) => {
  return (page - 1) * limit;
};
