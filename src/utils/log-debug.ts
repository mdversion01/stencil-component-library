// src/utils/log-debug.ts

export interface LogContext {
  [key: string]: unknown;
}

const timestamp = () => new Date().toISOString();

function logWithLevel(
  devMode: boolean,
  component: string,
  level: 'INFO' | 'WARN' | 'ERROR',
  message: string,
  context?: LogContext,
  stack?: string,
): void {
  if (!devMode) return;

  const tag = `[${component}] [${level}] [${timestamp()}]`;
  const log = console.warn; // unified allowed method for logging

  if (context) {
    log(`${tag} ${message}`, context);
  } else {
    log(`${tag} ${message}`);
  }

  if (level === 'ERROR' && stack) {
    console.error(stack);
  }
}

export function logInfo(
  devMode: boolean,
  component: string,
  message: string,
  context?: LogContext,
): void {
  logWithLevel(devMode, component, 'INFO', message, context);
}

export function logWarn(
  devMode: boolean,
  component: string,
  message: string,
  context?: LogContext,
): void {
  logWithLevel(devMode, component, 'WARN', message, context);
}

export function logError(
  devMode: boolean,
  component: string,
  message: string,
  context?: LogContext,
  stack?: string,
): void {
  logWithLevel(devMode, component, 'ERROR', message, context, stack);
}
