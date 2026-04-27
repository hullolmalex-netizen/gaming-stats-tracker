import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatTabsModule, MatIconModule],
  template: `
    <div class="container">
      <a class="view-btn" routerLink="/players" style="margin-bottom:24px;display:inline-flex">
        <mat-icon style="font-size:16px;width:16px;height:16px">arrow_back</mat-icon>
        Back
      </a>

      <div *ngIf="loading" style="text-align:center;padding:80px">
        <div style="width:56px;height:56px;border:4px solid rgba(108,99,255,0.2);border-top-color:#6c63ff;border-radius:50%;margin:0 auto;animation:spin 0.8s linear infinite"></div>
      </div>

      <ng-container *ngIf="!loading && player">

        <!-- Player Header -->
        <div class="glass-card mb-20" style="display:flex;align-items:center;gap:24px;flex-wrap:wrap">
          <div class="player-avatar" style="width:72px;height:72px;font-size:28px">{{ player.username[0].toUpperCase() }}</div>
          <div style="flex:1">
            <div class="player-name" style="font-size:22px">{{ player.username }}</div>
            <div class="player-email">{{ player.email }}</div>
          </div>
          <div style="display:flex;gap:32px;flex-wrap:wrap">
            <div style="text-align:center">
              <div class="kpi-value" style="font-size:28px">{{ player.Sessions?.length || 0 }}</div>
              <div class="kpi-label">Sessions</div>
            </div>
            <div style="text-align:center">
              <div class="kpi-value" style="font-size:28px">{{ player.Scores?.length || 0 }}</div>
              <div class="kpi-label">Scores</div>
            </div>
            <div style="text-align:center">
              <div class="kpi-value" style="font-size:28px">{{ getTotalMinutes() }}h</div>
              <div class="kpi-label">Playtime</div>
            </div>
            <div style="text-align:center">
              <div class="kpi-value" style="font-size:28px;color:var(--warning)">{{ getBestScore() | number }}</div>
              <div class="kpi-label">Best Score</div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="glass-card">
          <mat-tab-group mat-stretch-tabs="false" animationDuration="300ms">
            <mat-tab label="🎮 Sessions ({{ player.Sessions?.length }})">
              <table class="stats-table" style="margin-top:16px">
                <thead><tr><th>Game</th><th>Duration</th><th>Date</th></tr></thead>
                <tbody>
                  <tr *ngFor="let s of player.Sessions">
                    <td><strong>{{ s.gameName }}</strong></td>
                    <td style="color:var(--accent)">{{ s.durationMinutes }} min</td>
                    <td style="color:var(--text-muted)">{{ s.playedAt | date:'mediumDate' }}</td>
                  </tr>
                </tbody>
              </table>
            </mat-tab>
            <mat-tab label="🏆 Scores ({{ player.Scores?.length }})">
              <table class="stats-table" style="margin-top:16px">
                <thead><tr><th>Game</th><th>Points</th><th>Date</th></tr></thead>
                <tbody>
                  <tr *ngFor="let s of player.Scores">
                    <td><strong>{{ s.gameName }}</strong></td>
                    <td style="color:var(--warning);font-family:'Orbitron',monospace;font-size:14px">{{ s.points | number }}</td>
                    <td style="color:var(--text-muted)">{{ s.scoredAt | date:'mediumDate' }}</td>
                  </tr>
                </tbody>
              </table>
            </mat-tab>
          </mat-tab-group>
        </div>

      </ng-container>
    </div>
  `,
  styles: [`
    @keyframes spin { to { transform: rotate(360deg); } }
    .mb-20 { margin-bottom: 20px; }
    ::ng-deep .mat-mdc-tab .mdc-tab__text-label { color: var(--text-muted) !important; font-family: 'Rajdhani',sans-serif; font-size:15px; font-weight:600; letter-spacing:1px; }
    ::ng-deep .mat-mdc-tab.mdc-tab--active .mdc-tab__text-label { color: var(--accent) !important; }
    ::ng-deep .mat-mdc-tab-indicator__content--underline { border-color: var(--accent) !important; }
  `]
})
export class PlayerDetailComponent implements OnInit {
  player: any = null;
  loading = true;
  constructor(private api: ApiService, private route: ActivatedRoute) {}
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getPlayer(id).subscribe({
      next: (d) => { this.player = d; this.loading = false; },
      error: (e) => { console.error(e); this.loading = false; }
    });
  }
  getTotalMinutes(): string {
    const m = this.player?.Sessions?.reduce((s: number, x: any) => s + x.durationMinutes, 0) || 0;
    return (m / 60).toFixed(1);
  }
  getBestScore(): number {
    return Math.max(...(this.player?.Scores?.map((s: any) => s.points) || [0]));
  }
}
