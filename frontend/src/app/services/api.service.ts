import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getPlayers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/players`);
  }

  getPlayer(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/players/${id}`);
  }

  createPlayer(data: { username: string; email: string }): Observable<any> {
    return this.http.post<any>(`${this.base}/players`, data);
  }

  createSession(data: { playerId: number; gameName: string; durationMinutes: any; playedAt: string }): Observable<any> {
    return this.http.post<any>(`${this.base}/sessions`, data);
  }

  createScore(data: { playerId: number; gameName: string; points: any; scoredAt: string }): Observable<any> {
    return this.http.post<any>(`${this.base}/scores`, data);
  }

  getAnalytics(): Observable<any> {
    return this.http.get<any>(`${this.base}/analytics`);
  }
}
