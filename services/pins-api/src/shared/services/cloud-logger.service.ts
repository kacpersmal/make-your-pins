import { Injectable, LoggerService, LogLevel, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface LogEntry {
  severity: string;
  message: string;
  context?: string;
  trace?: string;
  spanId?: string;
  [key: string]: any;
}

@Injectable({ scope: Scope.TRANSIENT })
export class CloudLoggerService implements LoggerService {
  private readonly logLevels: LogLevel[] = [
    'log',
    'error',
    'warn',
    'debug',
    'verbose',
  ];
  private context?: string;

  constructor(private readonly configService: ConfigService) {}

  setContext(context: string) {
    this.context = context;
    return this;
  }

  log(message: any, context?: string) {
    this.writeLog('INFO', message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.writeLog('ERROR', message, context, trace);
  }

  warn(message: any, context?: string) {
    this.writeLog('WARNING', message, context);
  }

  debug(message: any, context?: string) {
    if (this.configService.get<string>('NODE_ENV') !== 'production') {
      this.writeLog('DEBUG', message, context);
    }
  }

  verbose(message: any, context?: string) {
    if (this.configService.get<string>('NODE_ENV') !== 'production') {
      this.writeLog('DEBUG', message, context);
    }
  }

  setLogLevels(levels: LogLevel[]) {
    this.logLevels.length = 0;
    this.logLevels.push(...levels);
  }

  private writeLog(
    severity: string,
    message: any,
    context?: string,
    trace?: string,
  ) {
    const traceHeader =
      process.env.CLOUD_TRACE_CONTEXT || process.env._X_CLOUD_TRACE_CONTEXT;

    const entry: LogEntry = {
      severity,
      message: typeof message === 'object' ? JSON.stringify(message) : message,
      context: context || this.context,
      timestamp: new Date().toISOString(),
      // Cloud Run and Trace information
      'logging.googleapis.com/labels': {
        execution_id: process.env.K_REVISION || 'local',
      },
      'logging.googleapis.com/operation': {
        id: process.env.K_REVISION,
        producer: 'pins-api',
      },
    };

    // Add trace info if available
    if (traceHeader) {
      const projectId =
        process.env.GOOGLE_CLOUD_PROJECT ||
        this.configService.get<string>('PROJECT_ID');

      if (projectId) {
        entry['logging.googleapis.com/trace'] =
          `projects/${projectId}/traces/${traceHeader.split('/')[0]}`;
      }
    }

    if (trace) {
      entry.trace = trace;
    }

    console.log(JSON.stringify(entry));
  }
}
