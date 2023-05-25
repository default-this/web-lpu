import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, startWith } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScreenSizeObserverService {
    public readonly isSmallScreen$ = this.breakpointObserver.observe([
        Breakpoints.Small,
        Breakpoints.XSmall
    ]).pipe(
        map((breakpointState) => breakpointState.matches),
        startWith(this.breakpointObserver.isMatched([
            Breakpoints.Small,
            Breakpoints.XSmall
        ]))
    );

    constructor(
        private readonly breakpointObserver: BreakpointObserver
    ) {
    }
}
