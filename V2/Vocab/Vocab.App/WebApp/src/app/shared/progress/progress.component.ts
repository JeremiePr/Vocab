import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { takeWhile } from 'rxjs/operators';

@Component({
    selector: 'app-progress',
    templateUrl: './progress.component.html',
    styleUrls: ['./progress.component.sass']
})
export class ProgressComponent implements OnInit, OnDestroy {

    isAlive = true;
    isActive = false;
    mode: ProgressBarMode = 'indeterminate';
    value = 0;

    constructor(private eventService: EventService) { }

    ngOnInit(): void {
        this.subscribeEvents();
    }

    subscribeEvents(): void {
        this.eventService.startProgressBarEvent.event
        .pipe(takeWhile(_ => this.isAlive))
        .subscribe(container => {
            this.isActive = true;
            this.mode = container.mode;
            this.value = container.value;
        });
        this.eventService.stopProgressBarEvent.event
        .pipe(takeWhile(_ => this.isActive))
        .subscribe(() => {
            this.isActive = false;
            this.mode = 'indeterminate';
            this.value = 0;
        });
    }

    ngOnDestroy(): void {
        this.isAlive = false;
    }
}
