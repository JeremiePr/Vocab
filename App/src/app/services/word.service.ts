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
    constructor(private http: HttpClient) { }

    get(search: string): Observable<Array<Word>>
    {
        return this.http.get<Array<Word>>(baseUrl, {
            params: {
                search
            }
        });
    }

    getOneById(id: number): Observable<Word>
    {
        return this.http.get<Word>(baseUrl + "/" + id);
    }

    create(word: Word): Observable<Word>
    {
        return this.http.post<Word>(baseUrl, word);
    }

    update(word: Word): Observable<Word>
    {
        return this.http.put<Word>(baseUrl, word);
    }

    delete(id: number): Observable<void>
    {
        return this.http.delete<void>(baseUrl, {
            params: {
                id: id.toString()
            }
        });
    }
}
