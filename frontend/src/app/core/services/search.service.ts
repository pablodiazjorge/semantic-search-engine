import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { SearchResultModel } from '../models/search-result.model';
import { DocumentModel } from '../models/document.model';

/**
 * Signals are stable from Angular 16/17 onwards and are used here to keep
 * the search results state reactive without needing a BehaviorSubject.
 */
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly apiUrl = '/api';

  // Reactive signal holding the list of search results (stable in Angular 17)
  readonly results = signal<SearchResultModel[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor(private readonly http: HttpClient) {}

  search(query: string, topK: number = 5): Observable<SearchResultModel[]> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<SearchResultModel[]>(`${this.apiUrl}/search`, { query, topK })
      .pipe(
        tap({
          next: (results) => {
            this.results.set(results);
            this.loading.set(false);
          },
          error: (err) => {
            this.error.set(err?.message ?? 'Search error');
            this.loading.set(false);
          }
        })
      );
  }

  ingest(content: string): Observable<DocumentModel> {
    return this.http.post<DocumentModel>(`${this.apiUrl}/ingest`, { content });
  }

  health(): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${this.apiUrl}/health`);
  }
}
