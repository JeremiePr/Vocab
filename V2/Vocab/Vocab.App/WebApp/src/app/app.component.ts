import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { EventService } from './services/event.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, OnDestroy {

    title = 'Vocab';
    isAlive = true;
    isDarkTheme = false;

    constructor(private eventService: EventService) { }

    ngOnInit(): void {
        this.eventService.toggleLightTheme.event.pipe(takeWhile(() => this.isAlive)).subscribe(() => this.isDarkTheme = false);
        this.eventService.toggleDarkTheme.event.pipe(takeWhile(() => this.isAlive)).subscribe(() => this.isDarkTheme = true);
    }

    ngOnDestroy(): void {
        this.isAlive = false;
    }
}
