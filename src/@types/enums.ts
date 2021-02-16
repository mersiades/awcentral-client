export enum CharacterCreationSteps {
  intro = 0,
  selectPlaybook = 1,
  selectName = 2,
  selectLooks = 3,
  selectStats = 4,
  selectGear = 5,
  setUnique = 6,
  selectMoves = 7,
  setVehicle = 8,
  setBattleVehicle = 9,
  setHx = 10,
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

export enum PlaybookType {
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
  weapons = 'WEAPONS',
  holding = 'HOLDING',
  followers = 'FOLLOWERS',
  establishment = 'ESTABLISHMENT',
  workspace = 'WORKSPACE',
  skinnerGear = 'SKINNER_GEAR',
}

export enum ThreatType {
  warlord = 'WARLORD',
  grotesque = 'GROTESQUE',
  brute = 'BRUTE',
  affliction = 'AFFLICTION',
  landscape = 'LANDSCAPE',
  terrain = 'TERRAIN',
  vehicle = 'VEHICLE',
}

export enum MoveActionType {
  roll = 'ROLL',
  print = 'PRINT',
  barter = 'BARTER',
  adjustHx = 'ADJUST_HX',
  stock = 'STOCK',
  gunlugger = 'GUNLUGGER_SPECIAL',
  hocus = 'HOCUS_SPECIAL',
  skinner = 'SKINNER_SPECIAL',
}

export enum RollType {
  stat = 'STAT',
  hx = 'HX',
  harm = 'HARM',
  barter = 'BARTER',
  speed = 'SPEED',
  handling = 'HANDLING',
  stock = 'STOCK',
  fortune = 'FORTUNE',
  choice = 'CHOICE',
}

export enum MessageType {
  printMove = 'PRINT_MOVE',
  rollStatMove = 'ROLL_STAT_MOVE',
  rollHxMove = 'ROLL_HX_MOVE',
  barterMove = 'BARTER_MOVE',
  rollBarterMove = 'ROLL_BARTER_MOVE',
  sufferHarmMove = 'SUFFER_HARM_MOVE',
  adjustHxMove = 'ADJUST_HX_MOVE',
  rollStockMove = 'ROLL_STOCK_MOVE',
  stockMove = 'STOCK_MOVE',
}

export enum VehicleFrameType {
  bike = 'BIKE',
  small = 'SMALL',
  medium = 'MEDIUM',
  large = 'LARGE',
}

export enum BattleOptionType {
  speed = 'SPEED',
  handling = 'HANDLING',
  massive = 'MASSIVE',
  armor = 'ARMOR',
  weapon = 'WEAPON',
}

export enum VehicleType {
  bike = 'BIKE',
  car = 'CAR',
  battle = 'BATTLE',
}

export enum GangSize {
  small = 'SMALL',
  medium = 'MEDIUM',
  large = 'LARGE',
}

export enum HoldingSize {
  small = 'SMALL',
  medium = 'MEDIUM',
  large = 'LARGE',
}
