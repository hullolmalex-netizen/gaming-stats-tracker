import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  template: `
    <div class="container">
      <h1 class="page-title">👥 Players</h1>

      <!-- Loading -->
      <div *ngIf="loading" style="text-align:center;padding:80px">
        <div class="spin-loader"></div>
        <p style="color:var(--text-muted);margin-top:20px;font-size:13px;letter-spacing:2px;text-transform:uppercase">Loading players...</p>
      </div>

      <!-- Player Grid -->
      <div class="players-grid" *ngIf="!loading">
        <div class="player-card" *ngFor="let player of players; let i = index"
             [style.animation-delay]="(i * 0.07) + 's'">
          <div class="player-avatar">{{ player.username[0].toUpperCase() }}</div>
          <div class="player-name">{{ player.username }}</div>
          <div class="player-email">{{ player.email }}</div>
          <div class="player-meta">
            <span class="meta-badge purple">{{ player.Sessions?.length || 0 }} sessions</span>
            <span class="meta-badge cyan">{{ player.Scores?.length || 0 }} scores</span>
          </div>
          <a class="view-btn" [routerLink]="['/players', player.id]">
            <mat-icon style="font-size:15px;width:15px;height:15px">open_in_new</mat-icon>
            View Stats
          </a>
        </div>
      </div>

      <p *ngIf="!loading && players.length === 0"
         style="text-align:center;color:var(--text-muted);padding:80px;font-size:18px">
        No players yet. Click <strong style="color:var(--accent)">+</strong> to add one!
      </p>
    </div>

    <!-- Floating Action Button -->
    <button class="fab" (click)="openModal()" title="Add Player">
      <mat-icon style="font-size:28px;width:28px;height:28px">add</mat-icon>
    </button>

    <!-- Modal Backdrop -->
    <div class="modal-backdrop" [class.visible]="showModal" (click)="onBackdropClick($event)">
      <div class="modal" [class.visible]="showModal">

        <!-- Modal Header -->
        <div class="modal-header">
          <div class="modal-title">🎮 New Player</div>
          <button class="modal-close" (click)="closeModal()">✕</button>
        </div>

        <!-- Step Tabs -->
        <div class="step-tabs">
          <button class="step-tab" [class.active]="step===1" (click)="step=1">
            <span class="step-num">1</span> Profile
          </button>
          <div class="step-line" [class.done]="step>1"></div>
          <button class="step-tab" [class.active]="step===2" (click)="step=2">
            <span class="step-num">2</span> Session
          </button>
          <div class="step-line" [class.done]="step>2"></div>
          <button class="step-tab" [class.active]="step===3" (click)="step=3">
            <span class="step-num">3</span> Score
          </button>
          <div class="step-line" [class.done]="step>3"></div>
          <button class="step-tab" [class.active]="step===4" (click)="step=4">
            <span class="step-num">4</span> Review
          </button>
        </div>

        <!-- STEP 1: Profile -->
        <div class="step-body" *ngIf="step===1">
          <div class="step-icon">👤</div>
          <h3 class="step-heading">Player Info</h3>
          <div class="form-group">
            <label class="form-label">Username</label>
            <input class="form-input" [(ngModel)]="form.username" placeholder="e.g. zied_pro" />
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input class="form-input" type="email" [(ngModel)]="form.email" placeholder="e.g. zied@example.com" />
          </div>
          <button class="next-btn" (click)="step=2" [disabled]="!form.username || !form.email">Next →</button>
        </div>

        <!-- STEP 2: Session -->
        <div class="step-body" *ngIf="step===2">
          <div class="step-icon">🎮</div>
          <h3 class="step-heading">Add a Session</h3>
          <div class="stat-preview-row">
            <div class="stat-pill purple">⏱️ Playtime</div>
            <div class="stat-pill cyan">🏆 Best Score</div>
          </div>
          <div class="form-group">
            <label class="form-label">Game Name</label>
            <input class="form-input" [(ngModel)]="form.gameName" placeholder="e.g. League of Legends" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Duration (minutes)</label>
              <input class="form-input" type="number" [(ngModel)]="form.durationMinutes" min="1" placeholder="45" />
            </div>
            <div class="form-group">
              <label class="form-label">Played On</label>
              <input class="form-input" type="date" [(ngModel)]="form.playedAt" />
            </div>
          </div>
          <div class="form-hint">⏱️ Playtime: <strong style="color:var(--accent)">{{ getPlaytimeDisplay() }}</strong></div>
          <div class="btn-row">
            <button class="back-btn" (click)="step=1">← Back</button>
            <button class="next-btn" (click)="step=3" [disabled]="!form.gameName || !form.durationMinutes">Next →</button>
          </div>
        </div>

        <!-- STEP 3: Score -->
        <div class="step-body" *ngIf="step===3">
          <div class="step-icon">🏆</div>
          <h3 class="step-heading">Add a Score</h3>
          <div class="form-group">
            <label class="form-label">Game (auto-filled)</label>
            <input class="form-input" [(ngModel)]="form.scoreGameName" [placeholder]="form.gameName || 'Game name'" />
          </div>
          <div class="form-group">
            <label class="form-label">Points (Best Score)</label>
            <input class="form-input" type="number" [(ngModel)]="form.points" min="0" placeholder="e.g. 5000" />
          </div>
          <div class="score-preview" *ngIf="form.points">
            <span class="score-glow">{{ form.points | number }} pts</span>
            <span class="score-label">🏆 Best Score</span>
          </div>
          <div class="btn-row">
            <button class="back-btn" (click)="step=2">← Back</button>
            <button class="next-btn" (click)="step=4" [disabled]="!form.points">Next →</button>
          </div>
        </div>

        <!-- STEP 4: Review -->
        <div class="step-body" *ngIf="step===4">
          <div class="step-icon">✅</div>
          <h3 class="step-heading">Review & Create</h3>
          <div class="review-grid">
            <div class="review-card">
              <div class="review-icon">👤</div>
              <div class="review-key">Username</div>
              <div class="review-val">{{ form.username }}</div>
            </div>
            <div class="review-card">
              <div class="review-icon">🎮</div>
              <div class="review-key">Sessions</div>
              <div class="review-val" style="color:var(--primary)">1</div>
            </div>
            <div class="review-card">
              <div class="review-icon">⏱️</div>
              <div class="review-key">Playtime</div>
              <div class="review-val" style="color:var(--accent)">{{ getPlaytimeDisplay() }}</div>
            </div>
            <div class="review-card">
              <div class="review-icon">🏆</div>
              <div class="review-key">Best Score</div>
              <div class="review-val" style="color:var(--warning)">{{ form.points | number }}</div>
            </div>
            <div class="review-card" style="grid-column:1/-1">
              <div class="review-icon">📧</div>
              <div class="review-key">Email</div>
              <div class="review-val">{{ form.email }}</div>
            </div>
          </div>
          <div class="btn-row">
            <button class="back-btn" (click)="step=3">← Back</button>
            <button class="submit-btn" (click)="submit()" [disabled]="saving">
              {{ saving ? 'Creating...' : '🚀 Create Player' }}
            </button>
          </div>
          <div class="error-msg" *ngIf="error">⚠️ {{ error }}</div>
        </div>

        <!-- Success -->
        <div class="success-overlay" *ngIf="success">
          <div class="success-content">
            <div class="success-anim">🎉</div>
            <div class="success-title">Player Created!</div>
            <div class="success-name">{{ form.username }}</div>
            <button class="next-btn" (click)="closeModal()">Back to Players</button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .spin-loader { width:56px;height:56px;border:4px solid rgba(108,99,255,0.2);border-top-color:#6c63ff;border-radius:50%;margin:0 auto;animation:spin 0.8s linear infinite; }
    @keyframes spin { to { transform:rotate(360deg); } }

    /* Meta badges on player cards */
    .player-meta { display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap; }
    .meta-badge { font-size:12px;padding:4px 10px;border-radius:20px;font-weight:600;letter-spacing:0.5px; }
    .meta-badge.purple { background:rgba(108,99,255,0.15);color:#a78bfa;border:1px solid rgba(108,99,255,0.3); }
    .meta-badge.cyan   { background:rgba(0,212,255,0.1);color:#67e8f9;border:1px solid rgba(0,212,255,0.25); }

    /* FAB */
    .fab {
      position:fixed;bottom:36px;right:36px;
      width:64px;height:64px;border-radius:50%;
      background:linear-gradient(135deg,#6c63ff,#00d4ff);
      border:none;color:white;cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 8px 32px rgba(108,99,255,0.5);
      z-index:200;
      transition:transform 0.25s ease,box-shadow 0.25s ease;
      animation:fabPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    .fab:hover { transform:scale(1.12) rotate(90deg);box-shadow:0 12px 48px rgba(108,99,255,0.7); }
    @keyframes fabPop { from{transform:scale(0) rotate(-90deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }

    /* Backdrop */
    .modal-backdrop {
      position:fixed;inset:0;z-index:300;
      background:rgba(0,0,0,0.75);
      backdrop-filter:blur(6px);
      display:flex;align-items:center;justify-content:center;
      opacity:0;pointer-events:none;
      transition:opacity 0.3s ease;
      padding:16px;
    }
    .modal-backdrop.visible { opacity:1;pointer-events:all; }

    /* Modal */
    .modal {
      width:100%;max-width:540px;
      background:linear-gradient(135deg,#0f0f2e,#151535);
      border:1px solid rgba(108,99,255,0.35);
      border-radius:20px;
      overflow:hidden;
      position:relative;
      transform:translateY(32px) scale(0.96);
      transition:transform 0.35s cubic-bezier(0.34,1.2,0.64,1);
      max-height:90vh;overflow-y:auto;
    }
    .modal.visible { transform:translateY(0) scale(1); }

    /* Modal Header */
    .modal-header {
      display:flex;align-items:center;justify-content:space-between;
      padding:20px 24px 0;
    }
    .modal-title {
      font-family:'Orbitron',monospace;font-size:18px;font-weight:700;
      background:linear-gradient(135deg,#6c63ff,#00d4ff);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
      letter-spacing:1.5px;
    }
    .modal-close {
      background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);
      color:#8888aa;width:32px;height:32px;border-radius:50%;
      font-size:14px;cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      transition:background 0.2s,color 0.2s;
    }
    .modal-close:hover { background:rgba(255,71,87,0.2);color:#ff4757; }

    /* Step Tabs */
    .step-tabs {
      display:flex;align-items:center;
      padding:20px 24px 0;
      gap:0;
    }
    .step-tab {
      display:flex;align-items:center;gap:6px;
      background:none;border:none;cursor:pointer;
      color:#8888aa;font-family:'Rajdhani',sans-serif;
      font-size:13px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;
      padding:6px 10px;border-radius:8px;
      transition:color 0.2s,background 0.2s;
      white-space:nowrap;
    }
    .step-tab.active { color:#00d4ff;background:rgba(0,212,255,0.1); }
    .step-num {
      width:22px;height:22px;border-radius:50%;
      background:rgba(108,99,255,0.2);color:#8888aa;
      display:inline-flex;align-items:center;justify-content:center;
      font-size:12px;font-weight:700;
    }
    .step-tab.active .step-num { background:#6c63ff;color:white; }
    .step-line { flex:1;height:1px;background:rgba(108,99,255,0.2);margin:0 4px; }
    .step-line.done { background:linear-gradient(90deg,#6c63ff,#00d4ff); }

    /* Step Body */
    .step-body { padding:24px; }
    .step-icon { font-size:40px;text-align:center;margin-bottom:8px;animation:fadeSlideUp 0.4s ease both; }
    .step-heading {
      font-family:'Orbitron',monospace;font-size:16px;font-weight:700;
      color:white;text-align:center;margin-bottom:24px;
      animation:fadeSlideUp 0.4s ease 0.05s both;
    }
    @keyframes fadeSlideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

    /* Form */
    .form-group { margin-bottom:16px; }
    .form-label { display:block;font-size:12px;color:#8888aa;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;font-weight:600; }
    .form-input {
      width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(108,99,255,0.25);
      border-radius:10px;padding:12px 14px;color:white;
      font-family:'Rajdhani',sans-serif;font-size:16px;
      transition:border-color 0.2s,box-shadow 0.2s;
      outline:none;
    }
    .form-input:focus { border-color:#6c63ff;box-shadow:0 0 0 3px rgba(108,99,255,0.15); }
    .form-input::placeholder { color:#555566; }
    .form-row { display:grid;grid-template-columns:1fr 1fr;gap:16px; }
    .form-hint { font-size:13px;color:#8888aa;margin-bottom:16px; }

    /* Score preview */
    .score-preview {
      display:flex;align-items:center;justify-content:space-between;
      background:rgba(255,145,0,0.1);border:1px solid rgba(255,145,0,0.3);
      border-radius:12px;padding:12px 16px;margin-bottom:16px;
    }
    .score-glow { font-family:'Orbitron',monospace;font-size:20px;font-weight:700;color:#ff9100; }
    .score-label { font-size:13px;color:#8888aa; }

    /* Review grid */
    .review-grid { display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px; }
    .review-card {
      background:rgba(255,255,255,0.04);border:1px solid rgba(108,99,255,0.2);
      border-radius:12px;padding:14px;text-align:center;
    }
    .review-icon { font-size:20px;margin-bottom:4px; }
    .review-key { font-size:11px;color:#8888aa;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px; }
    .review-val { font-family:'Orbitron',monospace;font-size:15px;font-weight:700;color:white;word-break:break-all; }

    /* Stat pills */
    .stat-preview-row { display:flex;gap:10px;margin-bottom:20px;justify-content:center;flex-wrap:wrap; }
    .stat-pill { padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600;letter-spacing:0.5px; }
    .stat-pill.purple { background:rgba(108,99,255,0.15);color:#a78bfa;border:1px solid rgba(108,99,255,0.3); }
    .stat-pill.cyan   { background:rgba(0,212,255,0.1);color:#67e8f9;border:1px solid rgba(0,212,255,0.25); }

    /* Buttons */
    .btn-row { display:flex;gap:12px;margin-top:8px; }
    .next-btn {
      flex:1;padding:14px;background:linear-gradient(135deg,#6c63ff,#00d4ff);
      border:none;border-radius:10px;color:white;
      font-family:'Rajdhani',sans-serif;font-size:16px;font-weight:700;
      letter-spacing:1px;cursor:pointer;
      transition:opacity 0.2s,transform 0.2s;
    }
    .next-btn:hover:not(:disabled) { opacity:0.85;transform:translateY(-1px); }
    .next-btn:disabled { opacity:0.4;cursor:not-allowed; }
    .back-btn {
      padding:14px 20px;background:rgba(255,255,255,0.06);
      border:1px solid rgba(255,255,255,0.1);border-radius:10px;
      color:#8888aa;font-family:'Rajdhani',sans-serif;font-size:15px;
      font-weight:600;cursor:pointer;
      transition:background 0.2s,color 0.2s;
    }
    .back-btn:hover { background:rgba(255,255,255,0.1);color:white; }
    .submit-btn {
      flex:1;padding:14px;
      background:linear-gradient(135deg,#00e676,#00b248);
      border:none;border-radius:10px;color:#000;
      font-family:'Rajdhani',sans-serif;font-size:16px;font-weight:700;
      letter-spacing:1px;cursor:pointer;
      transition:opacity 0.2s,transform 0.2s;
    }
    .submit-btn:hover:not(:disabled) { opacity:0.85;transform:translateY(-1px); }
    .submit-btn:disabled { opacity:0.5;cursor:not-allowed; }
    .error-msg { margin-top:12px;color:#ff4757;font-size:13px;text-align:center; }

    /* Success Overlay */
    .success-overlay {
      position:absolute;inset:0;
      background:linear-gradient(135deg,#0f0f2e,#151535);
      display:flex;align-items:center;justify-content:center;
      animation:fadeSlideUp 0.4s ease both;
    }
    .success-content { text-align:center;padding:32px; }
    .success-anim { font-size:72px;animation:bounce 0.6s cubic-bezier(0.34,1.56,0.64,1) both; }
    @keyframes bounce { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
    .success-title { font-family:'Orbitron',monospace;font-size:22px;font-weight:700;color:white;margin:16px 0 8px; }
    .success-name { font-size:18px;color:#00d4ff;margin-bottom:28px;font-weight:600; }
  `]
})
export class PlayersComponent implements OnInit {
  players: any[] = [];
  loading = true;
  showModal = false;
  step = 1;
  saving = false;
  success = false;
  error = '';

  form = {
    username: '',
    email: '',
    gameName: '',
    durationMinutes: null as number | null,
    playedAt: new Date().toISOString().split('T')[0],
    scoreGameName: '',
    points: null as number | null
  };

  constructor(private api: ApiService) {}

  ngOnInit() { this.loadPlayers(); }

  loadPlayers() {
    this.loading = true;
    this.api.getPlayers().subscribe({
      next: (d) => { this.players = d; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openModal() {
    this.step = 1;
    this.saving = false;
    this.success = false;
    this.error = '';
    this.form = { username:'', email:'', gameName:'', durationMinutes:null, playedAt: new Date().toISOString().split('T')[0], scoreGameName:'', points:null };
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.showModal = false;
    document.body.style.overflow = '';
    if (this.success) this.loadPlayers();
  }

  onBackdropClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) this.closeModal();
  }

  getPlaytimeDisplay(): string {
    if (!this.form.durationMinutes) return '—';
    const m = Number(this.form.durationMinutes);
    return m >= 60 ? `${(m/60).toFixed(1)}h` : `${m}min`;
  }

  submit() {
    this.saving = true;
    this.error = '';
    const gameName = this.form.scoreGameName || this.form.gameName;

    // Step 1: Create player
    this.api.createPlayer({ username: this.form.username, email: this.form.email }).subscribe({
      next: (player) => {
        const playerId = player.id;

        // Step 2: Create session
        this.api.createSession({ playerId, gameName: this.form.gameName, durationMinutes: this.form.durationMinutes, playedAt: this.form.playedAt }).subscribe({
          next: () => {
            // Step 3: Create score
            this.api.createScore({ playerId, gameName, points: this.form.points, scoredAt: this.form.playedAt }).subscribe({
              next: () => { this.saving = false; this.success = true; },
              error: () => { this.saving = false; this.error = 'Player created but score failed. Try again.'; }
            });
          },
          error: () => { this.saving = false; this.error = 'Player created but session failed. Try again.'; }
        });
      },
      error: (e) => { this.saving = false; this.error = e?.error?.error || 'Failed to create player.'; }
    });
  }
}
