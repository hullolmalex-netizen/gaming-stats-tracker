import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatTabsModule, MatProgressSpinnerModule],
  template: `
    <div class="container">
      <a mat-button routerLink="/players" style="margin-bottom:16px; display:inline-flex; align-items:center">
        <mat-icon>arrow_back</mat-icon> Back to Players
      </a>

      <div *ngIf="loading" style="text-align:center; padding:40px">
        <mat-spinner diameter="48" style="margin:0 auto"></mat-spinner>
      </div>

      <div *ngIf="!loading && player">
        <mat-card class="mb-16">
          <mat-card-header>
            <div mat-card-avatar class="player-avatar">{{ player.username[0].toUpperCase() }}</div>
            <mat-card-title style="font-size:22px">{{ player.username }}</mat-card-title>
            <mat-card-subtitle>{{ player.email }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="stats-row">
              <div class="stat">
                <span class="stat-value">{{ player.Sessions?.length || 0 }}</span>
                <span class="stat-label">Sessions</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ player.Scores?.length || 0 }}</span>
                <span class="stat-label">Scores</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ getTotalMinutes() }}h</span>
                <span class="stat-label">Playtime</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ getBestScore() }}</span>
                <span class="stat-label">Best Score</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-tab-group>
          <mat-tab label="🎮 Sessions">
            <table class="stats-table" *ngIf="player.Sessions?.length">
              <thead><tr><th>Game</th><th>Duration</th><th>Date</th></tr></thead>
              <tbody>
                <tr *ngFor="let s of player.Sessions">
                  <td>{{ s.gameName }}</td>
                  <td>{{ s.durationMinutes }} min</td>
                  <td>{{ s.playedAt | date:'mediumDate' }}</td>
                </tr>
              </tbody>
            </table>
          </mat-tab>

          <mat-tab label="🏆 Scores">
            <table class="stats-table" *ngIf="player.Scores?.length">
              <thead><tr><th>Game</th><th>Points</th><th>Date</th></tr></thead>
              <tbody>
                <tr *ngFor="let s of player.Scores">
                  <td>{{ s.gameName }}</td>
                  <td><strong>{{ s.points | number }}</strong></td>
                  <td>{{ s.scoredAt | date:'mediumDate' }}</td>
                </tr>
              </tbody>
            </table>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .player-avatar {
      background: #3f51b5; color: white;
      width: 48px; height: 48px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; font-weight: bold;
    }
    .stats-row { display: flex; gap: 32px; padding: 16px 0; flex-wrap: wrap; }
    .stat { display: flex; flex-direction: column; align-items: center; }
    .stat-value { font-size: 28px; font-weight: 700; color: #3f51b5; }
    .stat-label { font-size: 12px; color: #666; text-transform: uppercase; }
    .stats-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    .stats-table th { background: #3f51b5; color: white; padding: 10px 14px; text-align: left; }
    .stats-table td { padding: 10px 14px; border-bottom: 1px solid #e0e0e0; }
    .stats-table tr:hover td { background: #f5f5f5; }
  `]
})
export class PlayerDetailComponent implements OnInit {
  player: any = null;
  loading = true;

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getPlayer(id).subscribe({
      next: (data) => { this.player = data; this.loading = false; },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  getTotalMinutes(): string {
    const mins = this.player?.Sessions?.reduce((s: number, x: any) => s + x.durationMinutes, 0) || 0;
    return (mins / 60).toFixed(1);
  }

  getBestScore(): number {
    return Math.max(...(this.player?.Scores?.map((s: any) => s.points) || [0]));
  }
}
