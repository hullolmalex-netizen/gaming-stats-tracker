import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, MatIconModule],
  template: `
    <div class="container">
      <h1 class="page-title">📊 Dashboard</h1>

      <div *ngIf="loading" style="text-align:center; padding: 40px">
        <mat-spinner diameter="48" style="margin: 0 auto"></mat-spinner>
        <p style="margin-top: 16px; color: #666">Loading analytics...</p>
      </div>

      <div *ngIf="!loading">

        <!-- KPI Cards -->
        <div class="card-grid">
          <mat-card class="kpi-card">
            <mat-card-content>
              <div class="kpi-icon"><mat-icon color="primary">people</mat-icon></div>
              <div class="kpi-value">{{ analytics?.topScorers?.length || 0 }}</div>
              <div class="kpi-label">Active Players</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="kpi-card">
            <mat-card-content>
              <div class="kpi-icon"><mat-icon color="accent">videogame_asset</mat-icon></div>
              <div class="kpi-value">{{ getTotalSessions() }}</div>
              <div class="kpi-label">Total Sessions</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="kpi-card">
            <mat-card-content>
              <div class="kpi-icon"><mat-icon style="color:#f44336">timer</mat-icon></div>
              <div class="kpi-value">{{ getTotalMinutes() }}h</div>
              <div class="kpi-label">Total Playtime</div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Top Players Table -->
        <mat-card class="mb-16">
          <mat-card-header>
            <mat-card-title>🏆 Top Players by Score</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table class="stats-table" *ngIf="analytics?.topScorers?.length">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Total Score</th>
                  <th>Avg Score</th>
                  <th>Games Played</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of analytics.topScorers; let i = index">
                  <td>{{ i + 1 }}</td>
                  <td><strong>{{ p.Player?.username }}</strong></td>
                  <td>{{ p.dataValues?.totalScore | number }}</td>
                  <td>{{ p.dataValues?.avgScore | number:'1.0-0' }}</td>
                  <td>{{ p.dataValues?.gamesPlayed }}</td>
                </tr>
              </tbody>
            </table>
          </mat-card-content>
        </mat-card>

        <!-- Game Activity -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>🎮 Activity by Game</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table class="stats-table" *ngIf="analytics?.gameActivity?.length">
              <thead>
                <tr>
                  <th>Game</th>
                  <th>Sessions</th>
                  <th>Total Minutes</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let g of analytics.gameActivity">
                  <td><strong>{{ g.gameName }}</strong></td>
                  <td>{{ g.dataValues?.sessionCount }}</td>
                  <td>{{ g.dataValues?.totalMinutes | number }}</td>
                </tr>
              </tbody>
            </table>
          </mat-card-content>
        </mat-card>

      </div>
    </div>
  `,
  styles: [`
    .kpi-card { text-align: center; padding: 8px; }
    .kpi-icon { margin-bottom: 8px; }
    .kpi-icon mat-icon { font-size: 36px; width: 36px; height: 36px; }
    .kpi-value { font-size: 32px; font-weight: 700; color: #3f51b5; }
    .kpi-label { font-size: 14px; color: #666; margin-top: 4px; }
    .stats-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    .stats-table th { background: #3f51b5; color: white; padding: 10px 14px; text-align: left; font-weight: 500; }
    .stats-table td { padding: 10px 14px; border-bottom: 1px solid #e0e0e0; }
    .stats-table tr:hover td { background: #f5f5f5; }
  `]
})
export class DashboardComponent implements OnInit {
  analytics: any = null;
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getAnalytics().subscribe({
      next: (data) => { this.analytics = data; this.loading = false; },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  getTotalSessions(): number {
    return this.analytics?.gameActivity?.reduce(
      (sum: number, g: any) => sum + Number(g.dataValues?.sessionCount || 0), 0
    ) || 0;
  }

  getTotalMinutes(): string {
    const mins = this.analytics?.playtime?.reduce(
      (sum: number, p: any) => sum + Number(p.dataValues?.totalMinutes || 0), 0
    ) || 0;
    return (mins / 60).toFixed(0);
  }
}
