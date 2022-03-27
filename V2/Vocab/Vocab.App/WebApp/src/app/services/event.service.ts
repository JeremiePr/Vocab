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
    startProgressBarEvent = new EventContainer<{ mode: 'determinate' | 'indeterminate', value: number }>();
    stopProgressBarEvent = new EventContainer<void>();
}
