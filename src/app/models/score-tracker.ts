export interface TeamsList {
  abbreviation: string;
  city: string;
  conference: string;
  division: string;
  full_name: string;
  id: number;
  name: string;
}

export interface PageInformation {
  current_page: number;
  next_page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
}

export interface TeamType {
  id: number;
  abbreviation: string;
  city: string;
  conference: string;
  division: string;
  full_name: string;
  name: string;
}

export interface SelctedTeam {
  id: number;
  date: string;
  home_team: TeamType;
  home_team_score: number;
  period: number;
  postseason: false;
  season: number;
  status: string;
  time: string;
  visitor_team: TeamType;
  visitor_team_score: number;
}

export interface AllTeamsList {
  data: TeamsList[];
  meta: PageInformation;
}

export interface SelectedTeamInfo {
  data: SelctedTeam[];
  meta: PageInformation;
  team_logo: string;
  team_name: string;
  team_abbreviation: string;
  team_conference: string;
  team_id: number;
}

export interface Team {
  team_name: string;
  team_abbreviation: string;
  team_conference: string;
}
