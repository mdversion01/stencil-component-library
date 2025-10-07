import { setAssetPath } from '@stencil/core';
/**
 * Set asset path for lazy-loaded assets
 */
setAssetPath((document.currentScript as HTMLScriptElement)?.src || '');

/**
 * Export reusable utilities
 */
export { format } from './utils/utils';

/**
 * Export all component types
 */
export * from './components';
