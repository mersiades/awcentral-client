export enum CharacterCreationSteps {
  intro = 0,
  selectPlaybook = 1,
  selectName = 2,
  selectLooks = 3,
  selectStats = 4,
  selectGear = 5,
  setUnique = 6,
  selectMoves = 7,
  setHx = 8,
}

export enum RoleType {
  mc = 'MC',
  player = 'PLAYER',
}

export enum StatType {
  cool = 'COOL',
  hard = 'HARD',
  hot = 'HOT',
  sharp = 'SHARP',
  weird = 'WEIRD',
  hx = 'HX',
}

export enum MoveType {
  character = 'CHARACTER',
  default = 'DEFAULT_CHARACTER',
  basic = 'BASIC',
  peripheral = 'PERIPHERAL',
  battle = 'BATTLE',
  roadWar = 'ROAD_WAR',
}

export enum PlayBookType {
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
  skinner = 'SKINNER',
}

export enum LookType {
  gender = 'GENDER',
  clothes = 'CLOTHES',
  face = 'FACE',
  eyes = 'EYES',
  body = 'BODY',
}

export enum UniqueTypes {
  angelKit = 'ANGEL_KIT',
  customWeapons = 'CUSTOM_WEAPONS',
  brainerGear = 'BRAINER_GEAR',
  gang = 'GANG',
  car = 'CAR',
  weapons = 'WEAPONS',
  holding = 'HOLDING',
  followers = 'FOLLOWERS',
  establishment = 'ESTABLISHMENT',
  workspace = 'WORKSPACE',
  skinnerGear = 'SKINNER_GEAR',
}

export enum Threats {
  'WARLORD',
  'GROTESQUE',
  'BRUTE',
  'AFFLICTION',
  'LANDSCAPE',
  'TERRAIN',
  'VEHICLE',
}

export enum MoveActionType {
  roll = 'ROLL',
  print = 'PRINT',
  barter = 'BARTER',
  adjustHx = 'ADJUST_HX',
  stock = 'STOCK',
}

export enum RollType {
  stat = 'STAT',
  hx = 'HX',
  harm = 'HARM',
  barter = 'BARTER',
  speed = 'SPEED',
  handling = 'HANDLING',
  stock = 'STOCK',
}

export enum MessageType {
  printMove = 'PRINT_MOVE',
  rollStatMove = 'ROLL_STAT_MOVE',
  rollHxMove = 'ROLL_HX_MOVE',
  barterMove = 'BARTER_MOVE',
  rollBarterMove = 'ROLL_BARTER_MOVE',
}
