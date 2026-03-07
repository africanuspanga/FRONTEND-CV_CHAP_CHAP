type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  context?: Record<string, unknown>;
}

function formatLog(entry: LogEntry): string {
  return JSON.stringify(entry);
}

export const logger = {
  info(message: string, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...( context && { context }),
    };
    console.log(formatLog(entry));
  },

  warn(message: string, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      ...(context && { context }),
    };
    console.warn(formatLog(entry));
  },

  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    const errorContext: Record<string, unknown> = { ...context };
    if (error instanceof Error) {
      errorContext.errorName = error.name;
      errorContext.errorMessage = error.message;
      errorContext.stack = error.stack;
    } else if (error) {
      errorContext.errorRaw = String(error);
    }
    const entry: LogEntry = {
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      context: errorContext,
    };
    console.error(formatLog(entry));
  },
};
