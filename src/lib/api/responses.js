/**
 * API Response Utilities
 * Standardized JSON responses for all API routes
 */

export function successResponse(data, message = 'Success', statusCode = 200) {
  return Response.json(
    {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}

export function errorResponse(message, statusCode = 500, errors = null) {
  return Response.json(
    {
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}

export function validationErrorResponse(errors) {
  return errorResponse('Validation failed', 400, errors);
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = 'Forbidden') {
  return errorResponse(message, 403);
}

export function notFoundResponse(message = 'Resource not found') {
  return errorResponse(message, 404);
}
