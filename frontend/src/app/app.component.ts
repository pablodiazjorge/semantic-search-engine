import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchInputComponent } from './features/search-input/search-input.component';
import { ResultsListComponent } from './features/results-list/results-list.component';
import { DocumentUploadComponent } from './features/document-upload/document-upload.component';
import { SearchService } from './core/services/search.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SearchInputComponent, ResultsListComponent, DocumentUploadComponent],
  template: `
    <div class="app-wrapper">
      <div class="brand-stripe"></div>

      <header class="app-header animate-fade-in">
        <span class="eyebrow">Corporate semantic engine</span>
        <h1>Semantic Search Engine</h1>
        <p>Search meaning, not just keywords. PostgreSQL + pgvector + Spring Boot + Angular.</p>
      </header>

      <main class="app-main">
        <section class="panel upload-panel animate-fade-in" style="animation-delay: 0.1s">
          <app-document-upload></app-document-upload>
        </section>

        <section class="panel search-panel animate-fade-in" style="animation-delay: 0.2s">
          <div class="search-heading">
            <h2>Search documents</h2>
            <span class="hint">Try: "transformers", "embeddings" or "vector databases"</span>
          </div>

          <app-search-input></app-search-input>

          @if (searchService.loading()) {
            <div class="status-message loading">
              <span class="spinner"></span>
              Searching through documents...
            </div>
          }

          @if (searchService.error()) {
            <div class="status-message error">
              {{ searchService.error() }}
            </div>
          }

          <app-results-list [results]="searchService.results()"></app-results-list>
        </section>
      </main>

      <footer class="app-footer">
        <small>Built with Spring Boot 3.2.6 · Angular 17.3.12 · PostgreSQL 16 · pgvector 0.6.2</small>
      </footer>
    </div>
  `,
  styles: [`
    .app-wrapper {
      max-width: 920px;
      margin: 0 auto;
      padding: 0 1.25rem 3rem;
    }

    .brand-stripe {
      height: 8px;
      background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 50%, var(--secondary) 100%);
      margin: 0 -1.25rem 2rem;
      border-radius: 0 0 1rem 1rem;
    }

    .app-header {
      text-align: center;
      margin-bottom: 2.5rem;
      padding: 1rem 0;
    }

    .eyebrow {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--accent);
      background: var(--accent-soft);
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      margin-bottom: 0.75rem;
      border: 1.5px solid #fed7aa;
    }

    .app-header h1 {
      font-size: 3rem;
      color: var(--text);
      margin-bottom: 0.75rem;
    }

    .app-header p {
      margin: 0;
      color: var(--text-muted);
      font-size: 1.1rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .app-main {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    .panel {
      background: var(--surface);
      border: 2px solid var(--border-strong);
      border-radius: var(--radius);
      box-shadow: var(--shadow-hard);
      padding: 1.75rem;
      transition: box-shadow 0.25s ease, transform 0.25s ease;
    }

    .panel:hover {
      box-shadow: var(--shadow-hover);
      transform: translateY(-2px);
    }

    .search-heading {
      margin-bottom: 1.25rem;
    }

    .search-heading h2 {
      font-size: 1.75rem;
      color: var(--secondary);
    }

    .hint {
      display: block;
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-top: 0.25rem;
    }

    .status-message {
      margin-top: 1.25rem;
      padding: 0.875rem 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .status-message.loading {
      background: var(--surface-warm);
      border: 1.5px dashed var(--primary);
      color: var(--primary-dark);
    }

    .status-message.error {
      background: #fef2f2;
      border: 1.5px solid #fecaca;
      color: #b91c1c;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2.5px solid var(--primary);
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .app-footer {
      margin-top: 3rem;
      text-align: center;
      color: var(--text-muted);
    }

    .app-footer small {
      font-size: 0.8rem;
    }
  `]
})
export class AppComponent {
  constructor(public readonly searchService: SearchService) {}
}
