import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AllTeamsList, SelectedTeamInfo } from '../models/score-tracker';

@Injectable()
export class ScoreTrackerService {
  _apiBaseUrl: string = 'https://free-nba.p.rapidapi.com/';
  daysList: string[] = [...Array(12).keys()].map((index) => {
    const date: Date = new Date();
    date.setDate(date.getDate() - index);
    return new Date(date).toISOString().slice(0, 10);
  });
  constructor(private readonly http: HttpClient) {}

  getTeamsList(): Observable<AllTeamsList> {
    return this.http.get<AllTeamsList>(`${this._apiBaseUrl}teams`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getSelectedTeamInformation(teamId: number): Observable<SelectedTeamInfo> {
    let daysList: string = '';
    for (const i of this.daysList) {
      daysList += `dates[]=${i}&`;
    }
    return this.http.get<SelectedTeamInfo>(
      `${this._apiBaseUrl}games?page=0&${daysList}per_page=12&team_ids[]=${teamId}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  createAuthorizationHeader(): HttpHeaders {
    const headerDict = {
      'X-RapidAPI-Key': '2QMXSehDLSmshDmRQcKUIAiQjIZAp1UvKUrjsnewgqSP6F5oBX',
      'X-RapidAPI-Host': 'free-nba.p.rapidapi.com',
    };
    return new HttpHeaders(headerDict);
  }
}
