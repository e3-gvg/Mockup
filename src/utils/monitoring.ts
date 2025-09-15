'use client';

// Performance monitoring and error tracking utility

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

interface ErrorReport {
  message: string;
  stack?: string;
  component?: string;
  timestamp: number;
  userAgent: string;
  url: string;
  userId?: string;
}

interface UserAction {
  action: string;
  component?: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

class MonitoringService {
  private static instance: MonitoringService;
  private metrics: PerformanceMetric[] = [];
  private errors: ErrorReport[] = [];
  private userActions: UserAction[] = [];
  private isEnabled: boolean = true;

  private constructor() {
    this.setupPerformanceObserver();
    this.setupErrorHandling();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  // Setup performance observer for Core Web Vitals
  private setupPerformanceObserver(): void {
    if (typeof window === 'undefined') return;

    try {
      // Observe Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric({
            name: entry.name,
            value: entry.startTime,
            timestamp: Date.now(),
            tags: {
              type: entry.entryType,
              duration: entry.duration?.toString() || '0'
            }
          });
        });
      });

      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }
  }

  // Setup global error handling
  private setupErrorHandling(): void {
    if (typeof window === 'undefined') return;

    // Handle unhandled errors
    window.addEventListener('error', (event) => {
      this.recordError({
        message: event.message,
        stack: event.error?.stack,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.recordError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    });
  }

  // Record performance metric
  public recordMetric(metric: PerformanceMetric): void {
    if (!this.isEnabled) return;

    this.metrics.push(metric);
    
    // Keep only last 100 metrics to prevent memory issues
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Log critical performance issues
    if (metric.name === 'largest-contentful-paint' && metric.value > 2500) {
      console.warn(`Poor LCP detected: ${metric.value}ms`);
    }
  }

  // Record error
  public recordError(error: ErrorReport): void {
    if (!this.isEnabled) return;

    this.errors.push(error);
    
    // Keep only last 50 errors
    if (this.errors.length > 50) {
      this.errors = this.errors.slice(-50);
    }

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Monitoring - Error recorded:', error);
    }
  }

  // Record user action
  public recordUserAction(action: UserAction): void {
    if (!this.isEnabled) return;

    this.userActions.push(action);
    
    // Keep only last 200 actions
    if (this.userActions.length > 200) {
      this.userActions = this.userActions.slice(-200);
    }
  }

  // Get performance summary
  public getPerformanceSummary(): {
    avgLoadTime: number;
    totalMetrics: number;
    criticalIssues: number;
  } {
    const loadTimes = this.metrics
      .filter(m => m.name === 'navigation')
      .map(m => m.value);
    
    const avgLoadTime = loadTimes.length > 0 
      ? loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length 
      : 0;

    const criticalIssues = this.metrics
      .filter(m => 
        (m.name === 'largest-contentful-paint' && m.value > 2500) ||
        (m.name === 'first-contentful-paint' && m.value > 1500)
      ).length;

    return {
      avgLoadTime,
      totalMetrics: this.metrics.length,
      criticalIssues
    };
  }

  // Get error summary
  public getErrorSummary(): {
    totalErrors: number;
    recentErrors: ErrorReport[];
    errorsByComponent: Record<string, number>;
  } {
    const recentErrors = this.errors.slice(-10);
    const errorsByComponent: Record<string, number> = {};

    this.errors.forEach(error => {
      const component = error.component || 'Unknown';
      errorsByComponent[component] = (errorsByComponent[component] || 0) + 1;
    });

    return {
      totalErrors: this.errors.length,
      recentErrors,
      errorsByComponent
    };
  }

  // Send data to external monitoring service (placeholder)
  public async sendToExternalService(): Promise<void> {
    if (!this.isEnabled || process.env.NODE_ENV === 'development') return;

    try {
      // This would send data to services like DataDog, New Relic, etc.
      const payload = {
        metrics: this.metrics.slice(-20), // Send last 20 metrics
        errors: this.errors.slice(-10),   // Send last 10 errors
        userActions: this.userActions.slice(-50), // Send last 50 actions
        timestamp: Date.now(),
        sessionId: this.getSessionId()
      };

      // Example: await fetch('/api/monitoring', { method: 'POST', body: JSON.stringify(payload) });
      console.log('Monitoring data ready to send:', payload);
    } catch (error) {
      console.error('Failed to send monitoring data:', error);
    }
  }

  // Get or create session ID
  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server';
    
    let sessionId = sessionStorage.getItem('monitoring-session-id');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('monitoring-session-id', sessionId);
    }
    return sessionId;
  }

  // Enable/disable monitoring
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  // Clear all data
  public clearData(): void {
    this.metrics = [];
    this.errors = [];
    this.userActions = [];
  }
}

// Singleton instance
const monitoring = MonitoringService.getInstance();

// Convenience functions
export const recordMetric = (name: string, value: number, tags?: Record<string, string>) => {
  monitoring.recordMetric({ name, value, timestamp: Date.now(), tags });
};

export const recordError = (message: string, component?: string, stack?: string) => {
  monitoring.recordError({
    message,
    component,
    stack,
    timestamp: Date.now(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'Unknown'
  });
};

export const recordUserAction = (action: string, component?: string, metadata?: Record<string, unknown>) => {
  monitoring.recordUserAction({ action, component, timestamp: Date.now(), metadata });
};

// React Hook for monitoring
export const useMonitoring = () => {
  const trackAction = (action: string, component?: string, metadata?: Record<string, unknown>) => {
    recordUserAction(action, component, metadata);
  };

  const trackError = (error: Error, component?: string) => {
    recordError(error.message, component, error.stack);
  };

  const trackPerformance = (name: string, startTime: number) => {
    const duration = performance.now() - startTime;
    recordMetric(name, duration, { type: 'custom' });
  };

  return {
    trackAction,
    trackError,
    trackPerformance,
    getPerformanceSummary: () => monitoring.getPerformanceSummary(),
    getErrorSummary: () => monitoring.getErrorSummary()
  };
};

export default monitoring;