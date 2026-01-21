import { AxiosError } from 'axios';
import { logger, Errors } from '@readingForest/libs';

/**
 * Helper to handle axios errors and convert to ApiError
 */
export const handleApiError = (error: unknown, defaultMessage: string): never => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message =
      (error.response?.data as any)?.error ||
      (error.response?.data as any)?.message ||
      defaultMessage;

    if (status === 404) {
      throw Errors.notFound(message);
    }
    if (status === 409) {
      throw Errors.conflict(message);
    }
    if (status === 400) {
      throw Errors.badRequest(message);
    }
    if (status === 401) {
      throw Errors.unauthorized(message);
    }
    if (status === 403) {
      throw Errors.forbidden(message);
    }
  }
  logger.error('Unexpected error in guardian service', { error });
  throw Errors.internalServer(defaultMessage);
};
