import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../core/services/search.service';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="upload-header">
      <h2>Ingest document</h2>
      <p>Add text to the semantic index so it can be discovered.</p>
    </div>

    <textarea
      [(ngModel)]="content"
      rows="5"
      placeholder="Paste document content here to ingest it..."
      class="upload-textarea"
    ></textarea>

    <div class="upload-actions">
      <span class="char-count" [class.limit]="content.length > 9000">
        {{ content.length }} / 10000
      </span>
      <button
        (click)="onUpload()"
        [disabled]="!content.trim() || uploading"
        class="upload-button"
      >
        {{ uploading ? 'Ingesting...' : 'Ingest document' }}
      </button>
    </div>

    @if (message) {
      <div class="upload-message" [class.error]="isError" role="status">
        @if (isError) {
          <span class="message-icon">⚠️</span>
        }
        {{ message }}
      </div>
    }
  `,
  styles: [`
    .upload-header h2 {
      font-size: 1.75rem;
      color: var(--secondary);
      margin-bottom: 0.25rem;
    }

    .upload-header p {
      margin: 0 0 1.25rem 0;
      color: var(--text-muted);
    }

    .upload-textarea {
      width: 100%;
      padding: 1rem;
      border: 2px solid var(--border-strong);
      border-radius: var(--radius);
      font-size: 1rem;
      background: var(--surface-warm);
      color: var(--text);
      resize: vertical;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    }

    .upload-textarea:focus {
      border-color: var(--secondary);
      background: var(--surface);
      box-shadow: 4px 4px 0px 0px rgba(6, 95, 70, 0.12);
      transform: translateY(-1px);
    }

    .upload-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .char-count {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .char-count.limit {
      color: var(--accent);
      font-weight: 700;
    }

    .upload-button {
      padding: 0.9rem 1.75rem;
      background: var(--secondary);
      color: #fff;
      border: 2px solid #064e3b;
      border-radius: var(--radius);
      font-size: 1rem;
      font-weight: 700;
      box-shadow: 4px 4px 0px 0px #064e3b;
      transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    }

    .upload-button:hover:not(:disabled) {
      background: #064e3b;
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0px 0px rgba(6, 78, 59, 0.5);
    }

    .upload-button:active:not(:disabled) {
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0px 0px #064e3b;
    }

    .upload-button:disabled {
      opacity: 0.55;
      cursor: not-allowed;
      box-shadow: none;
    }

    .upload-message {
      margin-top: 1.25rem;
      padding: 1rem;
      border-radius: var(--radius);
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      animation: fadeInUp 0.35s ease-out;
    }

    .upload-message:not(.error) {
      background: #ecfdf5;
      border: 1.5px solid #a7f3d0;
      color: var(--secondary);
    }

    .upload-message.error {
      background: #fef2f2;
      border: 1.5px solid #fecaca;
      color: #b91c1c;
    }

    .message-icon {
      font-size: 1.25rem;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class DocumentUploadComponent {
  content = '';
  uploading = false;
  message: string | null = null;
  isError = false;

  constructor(private readonly searchService: SearchService) {}

  onUpload(): void {
    const trimmed = this.content.trim();
    if (!trimmed) {
      return;
    }

    this.uploading = true;
    this.message = null;
    this.isError = false;

    this.searchService.ingest(trimmed).subscribe({
      next: (doc) => {
        this.uploading = false;
        this.content = '';
        this.message = `Document #${doc.id} successfully ingested.`;
      },
      error: (err) => {
        this.uploading = false;
        this.isError = true;
        this.message = err?.error?.message ?? 'Error ingesting the document.';
      }
    });
  }
}
