import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamResultsComponent } from './components/team-results/team-results.component';
import { TrackTeamComponent } from './components/track-team/track-team.component';

const scoreTrackingRoutes: Routes = [
  { path: '', component: TrackTeamComponent, pathMatch: 'full' },
  { path: 'results/:teamCode ', component: TeamResultsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(scoreTrackingRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
