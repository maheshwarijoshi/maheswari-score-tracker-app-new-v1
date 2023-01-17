import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { TeamResultsComponent } from './components/team-results/team-results.component';
import { TrackTeamComponent } from './components/track-team/track-team.component';
import { ScoreTrackerService } from './services/score-tracker.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  declarations: [AppComponent, TrackTeamComponent, TeamResultsComponent],
  providers: [ScoreTrackerService],
  bootstrap: [AppComponent],
})
export class AppModule {}
