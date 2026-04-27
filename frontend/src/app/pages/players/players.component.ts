import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <div class="container">
      <h1 class="page-title">👥 Players</h1>

      <div *ngIf="loading" style="text-align:center;padding:80px">
        <div style="width:56px;height:56px;border:4px solid rgba(108,99,255,0.2);border-top-color:#6c63ff;border-radius:50%;margin:0 auto;animation:spin 0.8s linear infinite"></div>
      </div>

      <div class="players-grid" *ngIf="!loading">
        <div class="player-card" *ngFor="let player of players; let i = index" [style.animation-delay]="(i * 0.1) + 's'">
          <div class="player-avatar">{{ player.username[0].toUpperCase() }}</div>
          <div class="player-name">{{ player.username }}</div>
          <div class="player-email">{{ player.email }}</div>
          <a class="view-btn" [routerLink]="['/players', player.id]">
            <mat-icon style="font-size:16px;width:16px;height:16px">open_in_new</mat-icon>
            View Stats
          </a>
        </div>
      </div>

      <p *ngIf="!loading && players.length === 0"
         style="text-align:center;color:var(--text-muted);padding:80px;font-size:18px">
        No players found. Run <code style='color:var(--accent)'>node db/seed.js</code> to add test data.
      </p>
    </div>
  `,
  styles: [`@keyframes spin { to { transform: rotate(360deg); } }`]
})
export class PlayersComponent implements OnInit {
  players: any[] = [];
  loading = true;
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.getPlayers().subscribe({
      next: (d) => { this.players = d; this.loading = false; },
      error: (e) => { console.error(e); this.loading = false; }
    });
  }
}
