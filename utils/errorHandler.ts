/**
 * Centralized error handling utilities
 */

export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export class NetworkError extends Error {
  code = 'NETWORK_ERROR';
  constructor(message: string = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  code = 'VALIDATION_ERROR';
  fields?: Record<string, string>;
  constructor(message: string, fields?: Record<string, string>) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

export class AuthError extends Error {
  code = 'AUTH_ERROR';
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Format error message for display
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  return error instanceof NetworkError || 
         (error instanceof Error && error.message.includes('network'));
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  return error instanceof ValidationError;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof NetworkError) {
    return 'Please check your internet connection and try again.';
  }
  if (error instanceof ValidationError) {
    return error.message || 'Please check your input and try again.';
  }
  if (error instanceof AuthError) {
    return 'Please sign in again to continue.';
  }
  return formatError(error);
}

/**
 * Log error for debugging (in production, send to error tracking service)
 */
export function logError(error: unknown, context?: string) {
  const errorMessage = formatError(error);
  const logMessage = context 
    ? `[${context}] ${errorMessage}`
    : errorMessage;
  
  console.error(logMessage, error);
  
  // In production, send to error tracking service (e.g., Sentry)
  // if (__DEV__ === false) {
  //   Sentry.captureException(error, { tags: { context } });
  // }
}

