import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => { 
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            return throwError(error.statusText);
          }

          const applicationError = error.headers.get('Application-Error');
          if (applicationError) {
            console.error(applicationError);
            return throwError(applicationError);
          }

          const serverError = error.error;
          let modalStateError = ''; 
          if (serverError && typeof serverError === 'object') {
            for (const key in serverError) {
              if (serverError[key]) {
                modalStateError += serverError[key] + '\n';
              }
            }
          }
          return throwError(modalStateError || serverError || 'Server Error');
        }
      })
    );
  }
}

// We need to create an error interceptor provider that we can later add to our
// app.module.ts
export const ErrorInterceptorProvider = {
  // Add an additional http interceptor to the existing Angular array
  // of http interceptors
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  // Set to true since we don't want to replace this to our existing Angular array
  // of interceptors but we need to add it.
  multi: true
}