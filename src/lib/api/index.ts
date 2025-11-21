/**
 * Exportaciones centralizadas de los servicios API
 * Sigue la estructura DDD del backend
 */

// Shared
export * from './shared/apiClient';
export * from './types';

// Bounded Contexts
export * from './iam/auth';
export * from './iam/invite';
export * from './profiles/profile';
export * from './healthtracking/disturbances';
export * from './healthtracking/symptoms';
export * from './healthtracking/treatments';
