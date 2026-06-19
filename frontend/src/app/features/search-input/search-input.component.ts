import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../core/services/search.service';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-box">
      <div class="input-wrapper">
        <input
          type="text"
          [(ngModel)]="query"
          (keyup.enter)="onSearch()"
          placeholder="Type your semantic query..."
          class="search-input"
        />
      </div>
      <button (click)="onSearch()" [disabled]="!query.trim() || loading" class="search-button">
        {{ loading ? 'Searching...' : 'Search' }}
      </button>
    </div>
  `,
  styles: [`
    .search-box {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .input-wrapper {
      position: relative;
      flex: 1 1 240px;
    }

    .search-input {
      width: 100%;
      padding: 0.9rem 1rem;
      border: 2px solid var(--border-strong);
      border-radius: var(--radius);
      font-size: 1rem;
      background: var(--surface-warm);
      color: var(--text);
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    }

    .search-input:focus {
      border-color: var(--primary);
      background: var(--surface);
      box-shadow: 4px 4px 0px 0px rgba(217, 119, 6, 0.18);
      transform: translateY(-1px);
    }

    .search-button {
      padding: 0.9rem 1.75rem;
      background: var(--primary);
      color: #fff;
      border: 2px solid var(--primary-dark);
      border-radius: var(--radius);
      font-size: 1rem;
      font-weight: 700;
      box-shadow: 4px 4px 0px 0px var(--primary-dark);
      transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    }

    .search-button:hover:not(:disabled) {
      background: var(--primary-dark);
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0px 0px rgba(180, 83, 9, 0.6);
    }

    .search-button:active:not(:disabled) {
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0px 0px var(--primary-dark);
    }

    .search-button:disabled {
      opacity: 0.55;
      cursor: not-allowed;
      box-shadow: none;
    }
  `]
})
export class SearchInputComponent {
  query = '';
  loading = false;

  @Output() search = new EventEmitter<string>();

  constructor(private readonly searchService: SearchService) {}

  onSearch(): void {
    const trimmed = this.query.trim();
    if (!trimmed) {
      return;
    }

    this.loading = true;
    this.searchService.search(trimmed, 5).subscribe({
      next: () => {
        this.loading = false;
        this.search.emit(trimmed);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
