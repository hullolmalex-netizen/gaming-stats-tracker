import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatChipsModule],
  template: `
    <div class="container">
      <h1 class="page-title">👥 Players</h1>

      <div *ngIf="loading" style="text-align:center; padding:40px">
        <mat-spinner diameter="48" style="margin:0 auto"></mat-spinner>
      </div>

      <div class="card-grid" *ngIf="!loading">
        <mat-card *ngFor="let player of players" class="player-card">
          <mat-card-header>
            <div mat-card-avatar class="player-avatar">{{ player.username[0].toUpperCase() }}</div>
            <mat-card-title>{{ player.username }}</mat-card-title>
            <mat-card-subtitle>{{ player.email }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-actions>
            <a mat-button color="primary" [routerLink]="['/players', player.id]">
              <mat-icon>visibility</mat-icon> View Stats
            </a>
          </mat-card-actions>
        </mat-card>
      </div>

      <p *ngIf="!loading && players.length === 0" style="color:#666; text-align:center; padding:40px">
        No players found. Run the seed script to add test data.
      </p>
    </div>
  `,
  styles: [`
    .player-card { cursor: pointer; transition: box-shadow 0.2s; }
    .player-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
    .player-avatar {
      background: #3f51b5; color: white;
      width: 40px; height: 40px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: bold;
    }
  `]
})
export class PlayersComponent implements OnInit {
  players: any[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getPlayers().subscribe({
      next: (data) => { this.players = data; this.loading = false; },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }
}
