import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

class EventContainer<T> {
    private source = new Subject<T>();
    event = this.source.asObservable();
    emit = (obj: T) => this.source.next(obj);
}

@Injectable({
    providedIn: 'root'
})
export class EventService
{
    public readonly startProgressBarEvent = new EventContainer<{ mode: 'determinate' | 'indeterminate', value: number }>();
    public readonly stopProgressBarEvent = new EventContainer<void>();
}
