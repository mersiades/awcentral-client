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
}

export interface GameContext {
  game?: Game;
  setGame: (game: Game) => void;
}

export interface GameRole {
  id: string;
  role: Roles;
  game: Game;
}
