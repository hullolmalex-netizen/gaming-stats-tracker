import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { RefreshService } from '../../services/refresh.service';
import { BarChartComponent } from '../../components/bar-chart/bar-chart.component';
import { PieChartComponent } from '../../components/pie-chart/pie-chart.component';
import { LineChartComponent } from '../../components/line-chart/line-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, BarChartComponent, PieChartComponent, LineChartComponent],
  template: `
    <div class="container">
      <h1 class="page-title">🎮 Analytics Dashboard</h1>

      <!-- Loading -->
      <div *ngIf="loading" style="text-align:center;padding:80px 0">
        <div class="loader-ring"></div>
        <p style="color:var(--text-muted);margin-top:20px;font-size:14px;letter-spacing:2px;text-transform:uppercase">Loading data...</p>
      </div>

      <ng-container *ngIf="!loading">

        <!-- KPI Cards -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-icon-wrap purple">👥</div>
            <div class="kpi-value">{{ getActivePlayers() }}</div>
            <div class="kpi-label">Active Players</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon-wrap cyan">🎮</div>
            <div class="kpi-value">{{ getTotalSessions() }}</div>
            <div class="kpi-label">Total Sessions</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon-wrap pink">&#9200;</div>
            <div class="kpi-value">{{ getTotalHours() }}h</div>
            <div class="kpi-label">Total Playtime</div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="chart-row">
          <div class="glass-card">
            <div class="card-title"><span>🏆</span> Top Players by Score</div>
            <div class="chart-container">
              <app-bar-chart [labels]="barLabels" [data]="barData" title="Total Score"></app-bar-chart>
            </div>
          </div>
          <div class="glass-card">
            <div class="card-title"><span>🎮</span> Activity by Game</div>
            <div class="chart-container">
              <app-pie-chart [labels]="pieLabels" [data]="pieData"></app-pie-chart>
            </div>
          </div>
        </div>

        <!-- Line Chart -->
        <div class="glass-card mt-20">
          <div class="card-title"><span>⏱️</span> Playtime per Player</div>
          <div class="chart-container">
            <app-line-chart [labels]="lineLabels" [datasets]="lineDatasets"></app-line-chart>
          </div>
        </div>

        <!-- Empty state -->
        <div *ngIf="isEmpty" class="glass-card mt-20" style="text-align:center;padding:48px">
          <div style="font-size:48px;margin-bottom:16px">🎮</div>
          <p style="color:var(--text-muted);font-size:16px">No data yet. Add players and sessions to see analytics.</p>
        </div>

        <!-- Leaderboard -->
        <div class="glass-card mt-20" *ngIf="!isEmpty">
          <div class="card-title"><span>📝</span> Leaderboard</div>
          <table class="stats-table">
            <thead>
              <tr><th>#</th><th>Player</th><th>Total Score</th><th>Avg Score</th><th>Games</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of analytics?.topScorers; let i = index">
                <td>
                  <span class="rank-badge" [ngClass]="i===0?'rank-1':i===1?'rank-2':i===2?'rank-3':'rank-other'">{{i+1}}</span>
                </td>
                <td><strong>{{ p.Player?.username }}</strong></td>
                <td style="color:var(--accent)">{{ p.dataValues?.totalScore | number }}</td>
                <td>{{ p.dataValues?.avgScore | number:'1.0-0' }}</td>
                <td>{{ p.dataValues?.gamesPlayed }}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </ng-container>
    </div>
  `,
  styles: [`
    .loader-ring {
      width:56px;height:56px;
      border:4px solid rgba(108,99,255,0.2);
      border-top-color:#6c63ff;
      border-radius:50%;
      margin:0 auto;
      animation:spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform:rotate(360deg); } }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  analytics: any = null;
  loading = true;
  isEmpty = false;

  barLabels: string[] = [];
  barData:   number[] = [];
  pieLabels: string[] = [];
  pieData:   number[] = [];
  lineLabels: string[] = [];
  lineDatasets: { label: string; data: number[]; color: string }[] = [];

  private sub?: Subscription;

  constructor(
    private api: ApiService,
    private refreshService: RefreshService
  ) {}

  ngOnInit() {
    this.loadAnalytics();
    // Re-fetch every time a player is created from Players page
    this.sub = this.refreshService.refresh$.subscribe(() => this.loadAnalytics());
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  loadAnalytics() {
    this.loading = true;
    this.api.getAnalytics().subscribe({
      next: (data) => {
        this.analytics = data;
        this.isEmpty = !data.topScorers?.length && !data.gameActivity?.length;
        this.buildChartData();
        this.loading = false;
      },
      error: (err) => {
        console.error('Analytics error:', err);
        this.loading = false;
      }
    });
  }

  buildChartData() {
    // Bar — top players by score
    this.barLabels = this.analytics?.topScorers?.map((p: any) => p.Player?.username || '?') ?? [];
    this.barData   = this.analytics?.topScorers?.map((p: any) => Number(p.dataValues?.totalScore ?? 0)) ?? [];

    // Pie — sessions per game
    this.pieLabels = this.analytics?.gameActivity?.map((g: any) => g.gameName) ?? [];
    this.pieData   = this.analytics?.gameActivity?.map((g: any) => Number(g.dataValues?.sessionCount ?? 0)) ?? [];

    // Line — playtime per player
    this.lineLabels   = this.analytics?.playtime?.map((p: any) => p.Player?.username || '?') ?? [];
    this.lineDatasets = [{
      label: 'Minutes Played',
      data:  this.analytics?.playtime?.map((p: any) => Number(p.dataValues?.totalMinutes ?? 0)) ?? [],
      color: '#6c63ff'
    }];
  }

  getActivePlayers(): number {
    // Use playtime list length — every player who has at least 1 session
    return this.analytics?.playtime?.length ?? 0;
  }

  getTotalSessions(): number {
    return this.analytics?.gameActivity?.reduce(
      (sum: number, g: any) => sum + Number(g.dataValues?.sessionCount ?? 0), 0
    ) ?? 0;
  }

  getTotalHours(): string {
    const minutes = this.analytics?.playtime?.reduce(
      (sum: number, p: any) => sum + Number(p.dataValues?.totalMinutes ?? 0), 0
    ) ?? 0;
    return (minutes / 60).toFixed(1);
  }
}
