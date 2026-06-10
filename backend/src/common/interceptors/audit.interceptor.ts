import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Lightweight audit trail — logs every mutating request with the acting user.
 * In production this would persist to the AuditLog table via PrismaService.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Audit');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const { method, url, user } = req;

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle().pipe(
        tap(() => {
          this.logger.log(
            `${method} ${url} by ${user?.email ?? 'anonymous'} (org=${user?.orgId ?? '-'})`,
          );
        }),
      );
    }
    return next.handle();
  }
}
