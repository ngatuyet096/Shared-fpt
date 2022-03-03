import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { Deserializable } from '../interfaces/deserializable';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

import * as urljoin from 'url-join';
import { QueryEncodeHelper } from '../utils/query-encode-helper';

import { catchError, tap } from 'rxjs/operators';

interface ApiInput {
  apiUrl: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService implements Deserializable<ApiService>, ApiInput {
  apiUrl: string;

  constructor(private _httpClient: HttpClient) {
    this.deserialize({
      apiUrl: environment.api_path,
    });
  }

  deserialize(input: Partial<ApiInput>): ApiService {
    Object.assign(this, input);
    return this;
  }

  get(url: string, opts?: any): Observable<any> {
    const path = urljoin(this.apiUrl, url);

    const params = this._initParams(opts);
    return this._httpClient
      .get(path, {
        params,
      })
      .pipe(
        tap(this._handleResponse),
        catchError(this._handleError),
      );
  }

  post(url: string, body: any = {}, opts?: any): Observable<any> {
    const path = urljoin(this.apiUrl, url);

    const params = this._initParams(opts);

    return this._httpClient
      .post(path, body, {
        params,
      })
      .pipe(
        tap(this._handleResponse),
        catchError(this._handleError),
      );
  }

  put(url: string, body: any): Observable<any> {
    const path = urljoin(this.apiUrl, url);

    return this._httpClient.put(path, body, {}).pipe(
      tap(this._handleResponse),
      catchError(this._handleError),
    );
  }

  delete(url: string): Observable<any> {
    const path = urljoin(this.apiUrl, url);

    return this._httpClient.delete(path, {}).pipe(
      tap(this._handleResponse),
      catchError(this._handleError),
    );
  }

  private _handleResponse = (res: Response) => {
    return res || {};
  };

  private _handleError = (errors: HttpErrorResponse) => {
    if (errors.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();

      if (errors.hasOwnProperty('error')) {
        console.log('errors.error', errors.error)
      }

      return throwError(errors);
    }

    if (errors.error instanceof ProgressEvent) {
      if (errors.status === 0) {
        console.log('A network error occurred. Handle it accordingly.');
      }
      return throwError(errors);
    }

    if (errors.error instanceof ErrorEvent) {
      // A client-side error occurred. Handle it accordingly.
      console.error('errors ', errors.error.message);
      return throwError(errors);
    }

    // return an observable with a user-facing error message
    return throwError(errors.error);
  };

  private _initParams(opts: any = {}): HttpParams {
    let params = new HttpParams({ encoder: new QueryEncodeHelper() });

    if (opts) {
      Object.keys(opts).map((k) => {
        if ([null, undefined, ''].includes(opts[k])) {
          return;
        }
        if (opts[k] === false) {
          params = params.append(k, Number(opts[k]).toString());
          return;
        }

        switch (opts[k].constructor) {
          case Boolean:
            params = params.append(k, Number(opts[k]).toString());
            break;
          case Array:
            opts[k].map((v) => {
              params = params.append(`${k}[]`, v);
            });
            break;

          default:
            params = params.append(k, opts[k]);
            break;
        }
      });
    }

    return params;
  }
}
