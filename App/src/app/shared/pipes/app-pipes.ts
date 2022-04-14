import { filter, map, Observable } from 'rxjs';

export const filterNil = () => <T>(source$: Observable<T>): Observable<NonNullable<T>> => source$.pipe(
    filter(x => !!x),
    map(x => x!)
);