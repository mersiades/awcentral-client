export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface User {
  id?: string;
  username?: string;
}

export interface Game {
  name: string;
  textChannelID: string;
  voiceChannelID: string;
}

export interface GameContext {
  game?: Game;
  setGame: (game: Game) => void;
}
