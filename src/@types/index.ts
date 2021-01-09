export interface KeycloakUser {
  id?: string;
  username?: string;
  email?: string;
}

export interface KeycloakUserInfo {
  email: string
  email_verified: boolean
  family_name: string
  given_name: string
  name: string
  preferred_username: string
  sub: string
}

export interface TaggedItem {
  id: string
  description: string
  tags: string[]
}

export interface ItemCharacteristic {
  id: string
  description: string
  tag: string
}

export interface HxInput {
  characterId: string
  characterName: string
  hxValue: number
}
