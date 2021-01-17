import React, { FC, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { Box, Header, Menu, Button, Tabs, Tab, ThemeContext, Layer, Heading, Paragraph, Collapsible } from 'grommet';
import { useMutation, useQuery } from '@apollo/client';

import GamePanel from '../components/GamePanel/GamePanel';
import MovesPanel from '../components/MovesPanel';
import CommsFormShort from '../components/CommsFormShort';
import InvitationForm from '../components/InvitationForm';
import { Footer, LeftMainContainer, MainContainer, RightMainContainer, SidePanel } from '../components/styledComponents';
import ALL_MOVES, { AllMovesData } from '../queries/allMoves';
import GAMEROLES_BY_USER_ID from '../queries/gameRolesByUserId';
import DELETE_GAME, { DeleteGameData, DeleteGameVars } from '../mutations/deleteGame';
import ADD_INVITEE, { AddInviteeData, AddInviteeVars } from '../mutations/addInvitee';
import REMOVE_INVITEE, { RemoveInviteeData, RemoveInviteeVars } from '../mutations/removeInvitee';
import { Roles } from '../@types/enums';
import { GameRole } from '../@types/dataInterfaces';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import { useGame } from '../contexts/gameContext';
import { accentColors, customDefaultButtonStyles, customTabStyles } from '../config/grommetConfig';
import '../assets/styles/transitions.css';

export const background = {
  color: 'black',
  dark: true,
  size: 'contain',
  image: 'url(/images/background-image-9.jpg)',
  position: 'bottom center',
};

export interface ShowInvitation {
  show: boolean;
  showMessageOnly: boolean;
  existingEmail: string;
}

const MCPage: FC = () => {
  const maxSidePanel = 3;
  const sidePanelWidth = 25;
  const resetInvitationForm: ShowInvitation = {
    show: false,
    showMessageOnly: false,
    existingEmail: '',
  };

  // -------------------------------------------------- Component state ---------------------------------------------------- //
  /**
   * Number that indicates what should be shown in the right panel
   * 0 - ThreatsPanel
   * 1 - NpcPanel
   * 2 - None, right panel is closed
   */
  const [rightPanel, setRightPanel] = useState<number>(2);

  /**
   * Number that indicates what should be shown in the side panel
   * 0 - GamePanel
   * 1 - MovesPanel
   * 2 - MCMovesPanel
   * 3 - None, side panel is closed
   */
  const [sidePanel, setSidePanel] = useState<number>(0);
  const [showDeleteGameDialog, setShowDeleteGameDialog] = useState(false);
  const [showInvitationForm, setShowInvitationForm] = useState<ShowInvitation>(resetInvitationForm);
  const [showCommsForm, setShowCommsForm] = useState(false);

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //

  const { gameId } = useParams<{ gameId: string }>();
  const history = useHistory();
  const { keycloak } = useKeycloak();

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, setGameContext } = useGame();
  const { id: userId } = useKeycloakUser();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const { data: allMovesData } = useQuery<AllMovesData>(ALL_MOVES);
  const allMoves = allMovesData?.allMoves;
  const [deleteGame] = useMutation<DeleteGameData, DeleteGameVars>(DELETE_GAME);
  const [addInvitee] = useMutation<AddInviteeData, AddInviteeVars>(ADD_INVITEE);
  const [removeInvitee] = useMutation<RemoveInviteeData, RemoveInviteeVars>(REMOVE_INVITEE);

  // ------------------------------------------------- Component functions -------------------------------------------------- //

  const handleDeleteGame = () => {
    console.log('handleDeleteGame', handleDeleteGame);
    deleteGame({ variables: { gameId }, refetchQueries: [{ query: GAMEROLES_BY_USER_ID, variables: { id: userId } }] });
    history.push('/menu');
  };

  const handleAddInvitee = (email: string) => {
    if (!game?.invitees.includes(email)) {
      addInvitee({ variables: { gameId, email } });
    }
  };

  const handleRemoveInvitee = (email: string) => {
    if (game?.invitees.includes(email)) {
      removeInvitee({ variables: { gameId, email } });
    }
  };

  // ------------------------------------------------------- Effects -------------------------------------------------------- //

  // Kick the User off the page if they are not a mc of the game
  useEffect(() => {
    if (!!game && !!userId) {
      if (game.mc.id !== userId) {
        history.push('/menu');
      }
    }
  }, [game, userId, history]);

  // Sets the GameContext
  useEffect(() => {
    if (!!gameId && !!userId && !!setGameContext) {
      setGameContext(gameId, userId);
    }
  }, [gameId, userId, setGameContext]);

  return (
    <>
      {showCommsForm && (
        <Layer onEsc={() => setShowCommsForm(false)} onClickOutside={() => setShowCommsForm(false)}>
          <Box gap="24px" pad="24px">
            {!!game && <CommsFormShort game={game} setShowCommsForm={setShowCommsForm} />}
          </Box>
        </Layer>
      )}
      {!!game && showDeleteGameDialog && (
        <Layer onEsc={() => setShowDeleteGameDialog(false)} onClickOutside={() => setShowDeleteGameDialog(false)}>
          <Box gap="24px" pad="24px">
            <Heading level={3}>Delete game?</Heading>
            <Paragraph>{`Are you sure you want to delete ${game.name}? This can't be undone.`}</Paragraph>
            <Box direction="row" align="end" justify="end" gap="6px">
              <Button label="CANCEL" secondary size="large" onClick={() => setShowDeleteGameDialog(false)} />
              <Button label="DELETE" primary size="large" onClick={() => handleDeleteGame()} />
            </Box>
          </Box>
        </Layer>
      )}
      {!!game && showInvitationForm.show && (
        <Layer
          onEsc={() => setShowInvitationForm(resetInvitationForm)}
          onClickOutside={() => setShowInvitationForm(resetInvitationForm)}
        >
          <Box gap="24px" pad="24px">
            <InvitationForm
              gameName={game.name}
              gameId={game.id}
              setShowInvitationForm={setShowInvitationForm}
              handleAddInvitee={handleAddInvitee}
              existingEmail={showInvitationForm.existingEmail}
              showMessageOnly={showInvitationForm.showMessageOnly}
            />
          </Box>
        </Layer>
      )}
      <Box fill background={background}>
        <Header
          background={{ color: 'rgba(76, 104, 76, 0.5)' }}
          style={{ borderBottom: `1px solid ${accentColors[0]}` }}
          height="4vh"
        >
          <ThemeContext.Extend value={customDefaultButtonStyles}>
            <Menu
              style={{ backgroundColor: 'transparent' }}
              dropBackground={{ color: 'rgba(76, 104, 76, 0.5)' }}
              label="AW Central"
              items={[
                { label: 'Main menu', onClick: () => history.push('/menu') },
                {
                  label: 'Log out',
                  onClick: () => keycloak.logout(),
                },
              ]}
            />
            {game?.gameRoles
              .filter((gameRole: GameRole) => gameRole.role === Roles.player)
              .map((gameRole: GameRole) =>
                gameRole.characters?.map((character: any) => (
                  <Button
                    key={character.name}
                    label={character.name}
                    style={{ backgroundColor: 'transparent', height: '4vh', lineHeight: '16px' }}
                  />
                ))
              )}
            <Button label="THREAT MAP" style={{ backgroundColor: 'transparent', height: '4vh', lineHeight: '16px' }} />
            {!!game && !game?.hasFinishedPreGame && (
              <Button
                label="PRE-GAME"
                onClick={() => history.push(`/pre-game/${game.id}`)}
                style={{ backgroundColor: 'transparent', height: '4vh', lineHeight: '16px' }}
              />
            )}
          </ThemeContext.Extend>
        </Header>
        <div data-testid="mc-page">
          <Collapsible direction="horizontal" open={sidePanel < 3}>
            <SidePanel sidePanel={sidePanel} growWidth={sidePanelWidth}>
              {!!game && sidePanel === 0 && (
                <GamePanel
                  setShowDeleteGameDialog={setShowDeleteGameDialog}
                  setShowInvitationForm={setShowInvitationForm}
                  setShowCommsForm={setShowCommsForm}
                  handleRemoveInvitee={handleRemoveInvitee}
                />
              )}
              {sidePanel === 1 && !!allMoves && <MovesPanel allMoves={allMoves} />}
              {sidePanel === 2 && <p onClick={() => setSidePanel(3)}>MCMovesPanel</p>}
            </SidePanel>
          </Collapsible>
          <MainContainer sidePanel={sidePanel} maxPanels={maxSidePanel} shinkWidth={sidePanelWidth}>
            <LeftMainContainer rightPanel={rightPanel}>
              <p>Centre Centre Centre Centre Centre Centre Centre Centre Centre Centre Centre Centre Centre</p>
            </LeftMainContainer>
            <RightMainContainer rightPanel={rightPanel}>
              {rightPanel === 0 && <p>Threats</p>}
              {rightPanel === 1 && <p>NPCs</p>}
            </RightMainContainer>
          </MainContainer>
        </div>
        <Footer direction="row" justify="between" align="center" height="10vh">
          <ThemeContext.Extend value={customTabStyles}>
            <Tabs
              activeIndex={sidePanel}
              onActive={(tab) => {
                console.log('clicked', tab);
                tab === sidePanel ? setSidePanel(3) : setSidePanel(tab);
              }}
            >
              <Tab title="Game" />
              {allMoves && <Tab title="Moves" />}
              <Tab title="MC Moves" />
            </Tabs>
            <Tabs
              activeIndex={rightPanel}
              onActive={(tab) => {
                console.log('clicked', tab);
                tab === rightPanel ? setRightPanel(2) : setRightPanel(tab);
              }}
            >
              <Tab title="Threats" />
              <Tab title="NPCs" />
            </Tabs>
          </ThemeContext.Extend>
        </Footer>
      </Box>
    </>
  );
};

export default MCPage;
