import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * RefreshService — a simple broadcast bus.
 * Any component can call triggerRefresh().
 * Any other component that subscribed will reload its data.
 */
@Injectable({ providedIn: 'root' })
export class RefreshService {
  private _refresh$ = new Subject<void>();
  readonly refresh$ = this._refresh$.asObservable();

  triggerRefresh(): void {
    this._refresh$.next();
  }
}
