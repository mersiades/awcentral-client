import { Roles } from './enums';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface DiscordUser {
  discordId?: string;
  username?: string;
  avatarHash?: string;
}

export interface Game {
  id: string;
  name: string;
  textChannelId: string;
  voiceChannelId?: string;
  gameRoles: GameRole[]
}

export interface GameContext {
  game?: Game;
  setGame: (game: Game) => void;
}

export interface Character {
  id: string
  name: string
}

export interface GameRole {
  id: string;
  role: Roles;
  game?: Game;
  characters?: Character[]
}

export interface NewGameRequestBody {
  discordId: string
  name: string
}

export interface NewGame extends NewGameRequestBody {
  textChannelId: string;
  voiceChannelId: string;
}