import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  TeamsList,
  AllTeamsList,
  SelctedTeam,
  SelectedTeamInfo,
} from '../../models/score-tracker';
import { ScoreTrackerService } from '../../services/score-tracker.service';

@Component({
  selector: 'app-track-team',
  templateUrl: './track-team.component.html',
  styleUrls: ['./track-team.component.css'],
})
export class TrackTeamComponent implements OnInit, OnDestroy {
  scoreTrackerFormGroup: FormGroup = new FormGroup({});
  teamsList: TeamsList[] = [];
  selectedTeamInfo: SelectedTeamInfo[] = [];
  teamLogoUrl: string = 'https://interstate21.com/nba-logos/';
  loading: boolean = false;
  subscription: Subscription = new Subscription();

  constructor(private readonly scoreTrackerService: ScoreTrackerService) {}

  ngOnInit(): void {
    this.getInititalData();
    this.createForm();
    this.getTeamsList();
  }

  createForm(): void {
    this.scoreTrackerFormGroup = new FormGroup({
      teamName: new FormControl('', [Validators.required]),
    });
  }

  getTeamsList(): void {
    this.loading = true;
    const getTeams$: Observable<AllTeamsList> =
      this.scoreTrackerService.getTeamsList();
    getTeams$
      .pipe(
        map((response: AllTeamsList) => {
          this.teamsList = response.data;
          this.loading = false;
        })
      )
      .subscribe();
  }

  submit(): void {
    this.trackTeams();
  }

  setTeamData(team: SelctedTeam, key: string, id: number): string {
    return team.home_team.id === id
      ? team.home_team[key]
      : team.visitor_team[key];
  }

  trackTeams(): void {
    this.loading = true;
    const { teamName } = this.scoreTrackerFormGroup.value;
    if (!teamName) {
      return;
    }
    const getSelectedTeamInformation$ =
      this.scoreTrackerService.getSelectedTeamInformation(teamName);
    getSelectedTeamInformation$
      .pipe(
        map((response: SelectedTeamInfo) => {
          if (response && response.data.length) {
            const teamInfo: SelctedTeam[] = response.data.filter(
              (element: SelctedTeam) =>
                element.home_team.id === teamName ||
                element.visitor_team.id === teamName
            );
            const selectedTeam: SelectedTeamInfo = {
              ...response,
              team_logo:
                `${this.teamLogoUrl}${this.setTeamData(
                  teamInfo[0],
                  'abbreviation',
                  teamName
                )}.png` || '',
              team_name: this.setTeamData(teamInfo[0], 'full_name', teamName),
              team_abbreviation: this.setTeamData(
                teamInfo[0],
                'abbreviation',
                teamName
              ),
              team_conference: this.setTeamData(
                teamInfo[0],
                'conference',
                teamName
              ),
              team_id: Number(this.setTeamData(teamInfo[0], 'id', teamName)),
            };
            this.selectedTeamInfo.push(selectedTeam);
            this.loading = false;
            localStorage.setItem(
              'scoreTrackerData',
              JSON.stringify(this.selectedTeamInfo)
            );
          }
          this.loading = false;
        })
      )
      .subscribe();
  }

  getInititalData(): void {
    this.selectedTeamInfo = JSON.parse(
      localStorage.getItem('scoreTrackerData')!
    );
  }

  removeTeam(indx: number): void {
    this.selectedTeamInfo.splice(indx, 1);
    localStorage.setItem(
      'scoreTrackerData',
      JSON.stringify(this.selectedTeamInfo)
    );
  }

  getAvgPoints(teamData: SelctedTeam[], teamId: number, type: string): string {
    let totalPoints: number = 0;
    let numberOfGames: number = 0;
    let totalConcededPoints: number = 0;
    for (const game of teamData) {
      if (teamId === game.home_team.id) {
        totalPoints += game.home_team_score;
        totalConcededPoints += game.visitor_team_score;
      } else if (teamId === game.visitor_team.id) {
        totalPoints += game.visitor_team_score;
        totalConcededPoints += game.home_team_score;
      }
      numberOfGames++;
    }
    const averagePoints: number = totalPoints / numberOfGames;
    const averagePointsConceded: number = totalConcededPoints / numberOfGames;
    return type === 'scored'
      ? averagePoints.toFixed(0)
      : averagePointsConceded.toFixed(0);
  }

  getResultInfo(teamData: SelctedTeam, teamId: number): string {
    if (teamId === teamData.home_team.id) {
      return teamData.home_team_score > teamData.visitor_team_score ? 'W' : 'L';
    } else if (teamId === teamData.visitor_team.id) {
      return teamData.visitor_team_score > teamData.home_team_score ? 'W' : 'L';
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
