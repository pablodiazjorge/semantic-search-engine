import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultModel } from '../../core/models/search-result.model';

@Component({
  selector: 'app-results-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="results-container">
      @for (result of results; track result.id) {
        @defer (on viewport) {
          <article class="result-card" [style.animation-delay]="$index * 0.05 + 's'">
            <div class="result-accent"></div>
            <div class="result-body">
              <div class="result-header">
                <span class="result-badge">#{{ result.id }}</span>
                <span class="result-score" title="Cosine distance (lower = more similar)">
                  Score {{ result.score | number:'1.4-4' }}
                </span>
              </div>
              <p class="result-content">{{ result.content }}</p>
            </div>
          </article>
        } @placeholder {
          <div class="placeholder-card">Loading result...</div>
        }
      } @empty {
        <div class="empty-state">
          <span class="empty-icon">🍃</span>
          <p>No results to display.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .results-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1.75rem;
    }

    .result-card {
      position: relative;
      display: flex;
      background: var(--surface);
      border: 2px solid var(--border-strong);
      border-radius: var(--radius);
      box-shadow: var(--shadow-hard);
      overflow: hidden;
      opacity: 0;
      animation: fadeInUp 0.5s ease-out forwards;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .result-card:hover {
      transform: translate(-3px, -3px) rotate(-0.3deg);
      box-shadow: var(--shadow-hover);
      border-color: var(--primary);
    }

    .result-accent {
      width: 8px;
      background: linear-gradient(180deg, var(--primary) 0%, var(--accent) 100%);
      flex-shrink: 0;
    }

    .result-body {
      padding: 1.25rem;
      flex: 1;
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }

    .result-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 800;
      color: var(--secondary);
      background: #d1fae5;
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
      border: 1.5px solid #a7f3d0;
    }

    .result-score {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-family: 'Inter', monospace;
      font-weight: 600;
      background: var(--surface-warm);
      padding: 0.25rem 0.6rem;
      border-radius: 0.375rem;
      border: 1px solid var(--border);
    }

    .result-content {
      margin: 0;
      white-space: pre-wrap;
      color: var(--text);
      line-height: 1.6;
    }

    .placeholder-card,
    .empty-state {
      background: var(--surface);
      border: 2px dashed var(--border-strong);
      border-radius: var(--radius);
      padding: 2rem;
      text-align: center;
      color: var(--text-muted);
    }

    .empty-state .empty-icon {
      display: block;
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
    }

    .empty-state p {
      margin: 0;
      font-size: 1.05rem;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class ResultsListComponent {
  @Input({ required: true }) results: SearchResultModel[] = [];
}
