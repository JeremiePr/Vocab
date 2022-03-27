import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Word } from '../models/word';

const baseUrl = environment.baseUrl + "/Word"

@Injectable({
    providedIn: 'root'
})
export class WordService
{
    public constructor(private readonly _http: HttpClient) { }

    public get(search: string): Observable<Array<Word>>
    {
        return this._http.get<Array<Word>>(baseUrl, {
            params: {
                search
            }
        });
    }

    public getOneById(id: number): Observable<Word>
    {
        return this._http.get<Word>(baseUrl + "/" + id);
    }

    public create(word: Word): Observable<Word>
    {
        return this._http.post<Word>(baseUrl, word);
    }

    public update(word: Word): Observable<Word>
    {
        return this._http.put<Word>(baseUrl, word);
    }

    public delete(id: number): Observable<void>
    {
        return this._http.delete<void>(baseUrl, {
            params: {
                id: id.toString()
            }
        });
    }
}
