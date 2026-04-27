import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar class="app-toolbar">
      <mat-icon style="color:#6c63ff; font-size:28px; width:28px">sports_esports</mat-icon>
      <span class="toolbar-brand">GStats</span>
      <span class="spacer"></span>
      <a mat-button class="nav-link" routerLink="/dashboard" routerLinkActive="active-link">
        <mat-icon style="font-size:18px;vertical-align:middle;margin-right:4px">dashboard</mat-icon>Dashboard
      </a>
      <a mat-button class="nav-link" routerLink="/players" routerLinkActive="active-link">
        <mat-icon style="font-size:18px;vertical-align:middle;margin-right:4px">people</mat-icon>Players
      </a>
    </mat-toolbar>
    <main><router-outlet /></main>
  `,
  styles: [`:host { display: block; min-height: 100vh; }`]
})
export class AppComponent {}
