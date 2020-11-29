export enum Roles {
  mc = 'MC',
  player = 'PLAYER',
}

export enum Stats {
  cool = 'COOL',
  hard ='HARD',
  hot = 'HOT',
  sharp = 'SHARP',
  weird = 'WEIRD',
  hx = 'HX'
}

export enum MoveKinds {
  character = 'CHARACTER',
  basic = 'BASIC',
  peripheral = 'PERIPHERAL',
  battle = 'BATTLE',
  roadWar = 'ROAD_WAR',
}

export enum PlayBooks {
  angel = 'ANGEL',
  battlebabe = 'BATTLEBABE',
  brainer = 'BRAINER',
  chopper = 'CHOPPER',
  driver = 'DRIVER',
  gunlugger = 'GUNLUGGER',
  hardholder = 'HARDHOLDER',
  hocus = 'HOCUS',
  maestroD = 'MAESTRO_D',
  savvyhead = 'SAVVYHEAD',
  skinner = 'SKINNER'
}

export enum WebsocketResponses {
  default = 'DEFAULT_GAME_RESPONSE',
  deleteChannels = 'DELETE_CHANNELS_RESPONSE',
  addChannels = 'ADD_CHANNELS_RESPONSE'
}

export enum WebsocketRequests {
  deleteChannels = 'DELETE_CHANNELS_REQUEST',
  addChannels = 'ADD_CHANNELS_REQUEST'
}

export enum CharacterCreationSteps {
  intro = 0,
  selectPlaybook = 1,
  selectName = 2,
  selectLooks = 3,
  selectStats = 4,
  selectGear = 5
}

export enum LookCategories {
  gender = 'GENDER',
  clothes = 'CLOTHES',
  face = 'FACE',
  eyes = 'EYES',
  body = 'BODY'
}