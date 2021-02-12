import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface GameData {
  game: Game;
}

export interface GameVars {
  gameId: string;
}

const GAME = gql`
  query Game($gameId: String!) {
    game(gameId: $gameId) {
      id
      name
      invitees
      commsApp
      commsUrl
      hasFinishedPreGame
      gameMessages {
        id
        gameId
        gameroleId
        messageType
        title
        content
        sentOn
        roll1
        roll2
        rollModifier
        usedPlusOneForward
        rollResult
        modifierStatName
        additionalModifierValue
        additionalModifierName
        barterSpent
        currentBarter
        harmSuffered
        currentHarm
        stockSpent
        currentStock
      }
      mc {
        id
        displayName
      }
      players {
        id
        displayName
      }
      gameRoles {
        id
        role
        userId
        npcs {
          id
          name
          description
        }
        threats {
          id
          name
          threatKind
          impulse
          description
          stakes
        }
        characters {
          id
          name
          playbook
          hasCompletedCharacterCreation
          hasPlusOneForward
          holds
          gear
          barter
          vehicleCount
          harm {
            id
            value
            isStabilized
            hasComeBackHard
            hasComeBackWeird
            hasChangedPlaybook
            hasDied
          }
          statsBlock {
            id
            statsOptionId
            stats {
              id
              stat
              value
              isHighlighted
            }
          }
          hxBlock {
            id
            characterId
            characterName
            hxValue
          }
          looks {
            look
            category
          }
          characterMoves {
            id
            isSelected
            name
            kind
            description
            playbook
            stat
            moveAction {
              id
              actionType
              rollType
              statToRollWith
            }
          }
          vehicles {
            id
            name
            vehicleType
            vehicleFrame {
              id
              frameType
              massive
              examples
              battleOptionCount
            }
            speed
            handling
            armor
            massive
            strengths
            weaknesses
            looks
            battleOptions {
              id
              battleOptionType
              name
            }
          }
          playbookUnique {
            id
            type
            brainerGear {
              id
              brainerGear
            }
            angelKit {
              id
              description
              stock
              angelKitMoves {
                id
                name
                kind
                description
                playbook
                stat
                moveAction {
                  id
                  actionType
                  rollType
                  statToRollWith
                }
              }
              hasSupplier
              supplierText
            }
            customWeapons {
              id
              weapons
            }
            weapons {
              id
              weapons
            }
            gang {
              id
              size
              harm
              armor
              strengths {
                id
                description
                modifier
                tag
              }
              weaknesses {
                id
                description
                modifier
                tag
              }
              tags
            }
            holding {
              id
              holdingSize
              gangSize
              souls
              surplus
              barter
              gangHarm
              gangArmor
              gangDefenseArmorBonus
              wants
              gigs
              gangTags
              selectedStrengths {
                id
                description
                surplusChange
                wantChange
                newHoldingSize
                gigChange
                newGangSize
                gangTagChange
                gangHarmChange
                newVehicleCount
                newBattleVehicleCount
                newArmorBonus
              }
              selectedWeaknesses {
                id
                description
                surplusChange
                wantChange
                newHoldingSize
                gigChange
                newGangSize
                gangTagChange
                gangHarmChange
                newVehicleCount
                newBattleVehicleCount
                newArmorBonus
              }
            }
            followers {
              id
              description
              travelOption
              characterization
              followers
              fortune
              barter
              surplusBarter
              surplus
              wants
              selectedStrengths {
                id
                description
                newNumberOfFollowers
                surplusBarterChange
                fortuneChange
                surplusChange
                wantChange
              }
              selectedWeaknesses {
                id
                description
                newNumberOfFollowers
                surplusBarterChange
                fortuneChange
                surplusChange
                wantChange
              }
            }
          }
        }
      }
    }
  }
`;

export default GAME;
