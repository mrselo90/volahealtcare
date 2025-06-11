import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
  statusCode?: number;
  details?: any;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  success: boolean;
}

/**
 * Create a successful API response
 */
export const createSuccessResponse = <T>(
  data: T,
  message?: string,
  statusCode: number = 200
): NextResponse => {
  const response: ApiResponse<T> = {
    data,
    success: true,
    ...(message && { message }),
    statusCode
  };

  return NextResponse.json(response, { status: statusCode });
};

/**
 * Create an error API response
 */
export const createErrorResponse = (
  error: string,
  statusCode: number = 500,
  details?: any
): NextResponse => {
  const response: ApiResponse = {
    error,
    success: false,
    statusCode,
    ...(details && { details })
  };

  // Log error for debugging
  console.error(`API Error [${statusCode}]:`, error, details || '');

  return NextResponse.json(response, { status: statusCode });
};

/**
 * Create a paginated response
 */
export const createPaginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
): NextResponse => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const response: PaginatedResponse<T> = {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev
    },
    success: true,
    ...(message && { message })
  };

  return NextResponse.json(response, { status: 200 });
};

/**
 * Handle validation errors
 */
export const createValidationErrorResponse = (errors: string[]): NextResponse => {
  return createErrorResponse(
    'Validation failed',
    400,
    { validationErrors: errors }
  );
};

/**
 * Handle not found errors
 */
export const createNotFoundResponse = (resource: string = 'Resource'): NextResponse => {
  return createErrorResponse(`${resource} not found`, 404);
};

/**
 * Handle unauthorized errors
 */
export const createUnauthorizedResponse = (message: string = 'Unauthorized'): NextResponse => {
  return createErrorResponse(message, 401);
};

/**
 * Handle forbidden errors
 */
export const createForbiddenResponse = (message: string = 'Forbidden'): NextResponse => {
  return createErrorResponse(message, 403);
};

/**
 * Handle conflict errors (e.g., duplicate data)
 */
export const createConflictResponse = (message: string): NextResponse => {
  return createErrorResponse(message, 409);
};

/**
 * Handle internal server errors
 */
export const createInternalServerErrorResponse = (
  error?: any,
  message: string = 'Internal server error'
): NextResponse => {
  return createErrorResponse(
    message,
    500,
    process.env.NODE_ENV === 'development' ? error : undefined
  );
};

/**
 * Wrapper for API route handlers with consistent error handling
 */
export const withApiErrorHandling = (
  handler: (req: Request, context?: any) => Promise<NextResponse>
) => {
  return async (req: Request, context?: any): Promise<NextResponse> => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error('API Error:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('Validation failed')) {
          return createValidationErrorResponse([error.message]);
        }
        
        if (error.message.includes('not found')) {
          return createNotFoundResponse();
        }
        
        if (error.message.includes('Unauthorized')) {
          return createUnauthorizedResponse();
        }
        
        if (error.message.includes('duplicate') || error.message.includes('already exists')) {
          return createConflictResponse(error.message);
        }
      }
      
      // Default to internal server error
      return createInternalServerErrorResponse(
        error,
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  };
};

/**
 * Extract pagination parameters from URL search params
 */
export const extractPaginationParams = (searchParams: URLSearchParams) => {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '10')));
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
  
  return { page, limit, sortBy, sortOrder, skip: (page - 1) * limit };
};

/**
 * Type-safe response helper for TypeScript
 */
export const apiResponse = {
  success: createSuccessResponse,
  error: createErrorResponse,
  paginated: createPaginatedResponse,
  validation: createValidationErrorResponse,
  notFound: createNotFoundResponse,
  unauthorized: createUnauthorizedResponse,
  forbidden: createForbiddenResponse,
  conflict: createConflictResponse,
  internal: createInternalServerErrorResponse,
  withErrorHandling: withApiErrorHandling,
  extractPagination: extractPaginationParams
}; 