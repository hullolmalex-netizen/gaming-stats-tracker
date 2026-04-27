import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Players
  getPlayers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/players`);
  }

  getPlayer(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/players/${id}`);
  }

  createPlayer(data: { username: string; email: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/players`, data);
  }

  // Sessions
  getSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/sessions`);
  }

  createSession(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/sessions`, data);
  }

  // Scores
  getScores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/scores`);
  }

  createScore(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/scores`, data);
  }

  // Analytics
  getAnalytics(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics`);
  }
}
