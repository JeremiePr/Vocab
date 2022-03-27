import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { takeWhile } from 'rxjs/operators';

@Component({
    selector: 'app-progress',
    templateUrl: './progress.component.html',
    styleUrls: ['./progress.component.sass']
})
export class ProgressComponent implements OnInit, OnDestroy
{
    public isActive = false;
    public mode: ProgressBarMode = 'indeterminate';
    public value = 0;

    private isAlive = true;

    public constructor(private readonly _eventService: EventService) { }

    public ngOnInit(): void
    {
        this.subscribeEvents();
    }

    public subscribeEvents(): void
    {
        this._eventService.startProgressBarEvent.event
            .pipe(takeWhile(_ => this.isAlive))
            .subscribe(container =>
            {
                this.isActive = true;
                this.mode = container.mode;
                this.value = container.value;
            });
        this._eventService.stopProgressBarEvent.event
            .pipe(takeWhile(_ => this.isActive))
            .subscribe(() =>
            {
                this.isActive = false;
                this.mode = 'indeterminate';
                this.value = 0;
            });
    }

    public ngOnDestroy(): void
    {
        this.isAlive = false;
    }
}
