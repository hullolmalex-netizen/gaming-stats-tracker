import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ApiService } from '../../services/api.service';
import { BarChartComponent } from '../../components/bar-chart/bar-chart.component';
import { PieChartComponent } from '../../components/pie-chart/pie-chart.component';
import { LineChartComponent } from '../../components/line-chart/line-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatProgressSpinnerModule,
    MatIconModule, MatTabsModule,
    BarChartComponent, PieChartComponent, LineChartComponent
  ],
  template: `
    <div class="container">
      <h1 class="page-title">📊 Dashboard</h1>

      <div *ngIf="loading" style="text-align:center; padding:40px">
        <mat-spinner diameter="48" style="margin:0 auto"></mat-spinner>
        <p style="margin-top:16px; color:#666">Loading analytics...</p>
      </div>

      <ng-container *ngIf="!loading">

        <!-- KPI Cards -->
        <div class="card-grid">
          <mat-card class="kpi-card">
            <mat-card-content>
              <mat-icon color="primary" class="kpi-icon">people</mat-icon>
              <div class="kpi-value">{{ analytics?.topScorers?.length || 0 }}</div>
              <div class="kpi-label">Active Players</div>
            </mat-card-content>
          </mat-card>
          <mat-card class="kpi-card">
            <mat-card-content>
              <mat-icon color="accent" class="kpi-icon">videogame_asset</mat-icon>
              <div class="kpi-value">{{ getTotalSessions() }}</div>
              <div class="kpi-label">Total Sessions</div>
            </mat-card-content>
          </mat-card>
          <mat-card class="kpi-card">
            <mat-card-content>
              <mat-icon style="color:#f44336" class="kpi-icon">timer</mat-icon>
              <div class="kpi-value">{{ getTotalHours() }}h</div>
              <div class="kpi-label">Total Playtime</div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Charts Row -->
        <div class="chart-row">

          <!-- Bar Chart: Top Players -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>🏆 Top Players by Score</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="chart-container">
                <app-bar-chart
                  [labels]="barLabels"
                  [data]="barData"
                  title="Total Score">
                </app-bar-chart>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Pie Chart: Activity per game -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>🎮 Activity by Game</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="chart-container">
                <app-pie-chart
                  [labels]="pieLabels"
                  [data]="pieData"
                  title="Sessions per Game">
                </app-pie-chart>
              </div>
            </mat-card-content>
          </mat-card>

        </div>

        <!-- Line Chart: Playtime trend -->
        <mat-card class="mt-16">
          <mat-card-header>
            <mat-card-title>⏱️ Playtime per Player (minutes)</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-container">
              <app-line-chart
                [labels]="lineLabels"
                [datasets]="lineDatasets">
              </app-line-chart>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Top Players Table -->
        <mat-card class="mt-16">
          <mat-card-header>
            <mat-card-title>📝 Leaderboard</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table class="stats-table">
              <thead>
                <tr><th>#</th><th>Player</th><th>Total Score</th><th>Avg Score</th><th>Games</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of analytics?.topScorers; let i = index">
                  <td><strong>{{ i + 1 }}</strong></td>
                  <td>{{ p.Player?.username }}</td>
                  <td>{{ p.dataValues?.totalScore | number }}</td>
                  <td>{{ p.dataValues?.avgScore | number:'1.0-0' }}</td>
                  <td>{{ p.dataValues?.gamesPlayed }}</td>
                </tr>
              </tbody>
            </table>
          </mat-card-content>
        </mat-card>

      </ng-container>
    </div>
  `,
  styles: [`
    .kpi-card { text-align: center; padding: 8px; }
    .kpi-icon { font-size: 36px !important; width: 36px !important; height: 36px !important; margin-bottom: 8px; }
    .kpi-value { font-size: 32px; font-weight: 700; color: #3f51b5; }
    .kpi-label { font-size: 13px; color: #888; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    .chart-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
    @media (max-width: 768px) { .chart-row { grid-template-columns: 1fr; } }
    .chart-container { position: relative; height: 300px; padding: 8px 0; }
    .stats-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    .stats-table th { background: #3f51b5; color: white; padding: 10px 14px; text-align: left; }
    .stats-table td { padding: 10px 14px; border-bottom: 1px solid #e0e0e0; }
    .stats-table tr:hover td { background: #f5f5f5; }
  `]
})
export class DashboardComponent implements OnInit {
  analytics: any = null;
  loading = true;

  // Chart data
  barLabels: string[] = [];
  barData: number[] = [];
  pieLabels: string[] = [];
  pieData: number[] = [];
  lineLabels: string[] = [];
  lineDatasets: { label: string; data: number[]; color: string }[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getAnalytics().subscribe({
      next: (data) => {
        this.analytics = data;
        this.buildChartData();
        this.loading = false;
      },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  buildChartData() {
    // Bar chart — top players by score
    this.barLabels = this.analytics.topScorers.map((p: any) => p.Player?.username || 'Unknown');
    this.barData   = this.analytics.topScorers.map((p: any) => Number(p.dataValues?.totalScore || 0));

    // Pie chart — sessions per game
    this.pieLabels = this.analytics.gameActivity.map((g: any) => g.gameName);
    this.pieData   = this.analytics.gameActivity.map((g: any) => Number(g.dataValues?.sessionCount || 0));

    // Line chart — playtime per player
    this.lineLabels = this.analytics.playtime.map((p: any) => p.Player?.username || 'Unknown');
    this.lineDatasets = [{
      label: 'Total Minutes',
      data: this.analytics.playtime.map((p: any) => Number(p.dataValues?.totalMinutes || 0)),
      color: '#3f51b5'
    }];
  }

  getTotalSessions(): number {
    return this.analytics?.gameActivity?.reduce(
      (s: number, g: any) => s + Number(g.dataValues?.sessionCount || 0), 0) || 0;
  }

  getTotalHours(): string {
    const mins = this.analytics?.playtime?.reduce(
      (s: number, p: any) => s + Number(p.dataValues?.totalMinutes || 0), 0) || 0;
    return (mins / 60).toFixed(0);
  }
}
