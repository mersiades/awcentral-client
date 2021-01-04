import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Box,
  Header,
  Menu,
  BoxProps,
  Button,
  Tabs,
  Tab,
  ThemeContext,
  Layer,
  Heading,
  Paragraph,
  Collapsible,
} from 'grommet';
import styled, { css } from 'styled-components';
import { useMutation, useQuery } from '@apollo/client';

import GamePanel from '../components/GamePanel';
import MovesPanel from '../components/MovesPanel';
import { Footer, MainContainer, SidePanel } from '../components/styledComponents';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import DELETE_GAME, { DeleteGameData, DeleteGameVars } from '../mutations/deleteGame';
import GAME, { GameData, GameVars } from '../queries/game';
import ALL_MOVES, { AllMovesData } from '../queries/allMoves';
import { Roles } from '../@types/enums';
import { customDefaultButtonStyles, customTabStyles } from '../config/grommetConfig';
import '../assets/styles/transitions.css';
// import { useWebsocketContext } from '../contexts/websocketContext';
import { useKeycloak } from '@react-keycloak/web';
import GAMEROLES_BY_USER_ID from '../queries/gameRolesByUserId';
import InvitationForm from '../components/InvitationForm';
import ADD_INVITEE, { AddInviteeData, AddInviteeVars } from '../mutations/addInvitee';
import REMOVE_INVITEE, { RemoveInviteeData, RemoveInviteeVars } from '../mutations/removeInvitee';
import CommsFormShort from '../components/CommsFormShort';

interface LeftMainProps {
  readonly rightPanel: number;
}

const LeftMainContainer = styled(Box as React.FC<LeftMainProps & BoxProps & JSX.IntrinsicElements['div']>)(
  ({ rightPanel }) => {
    return css`
      height: calc(100vh - 95px);
      width: 100%;
      transition: width 200ms ease-in-out;
      ${rightPanel !== 2 &&
      css`
        width: 50%;
      `};
    `;
  }
);

interface RightMainProps {
  readonly rightPanel: number;
}
const RightMainContainer = styled(Box as React.FC<RightMainProps & BoxProps & JSX.IntrinsicElements['div']>)(
  ({ rightPanel }) => {
    return css`
      border-left: 1px solid transparent;
      border-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), black, rgba(0, 0, 0, 0)) 1 100%;
      position: absolute;
      height: calc(100vh - 95px);
      opacity: 0;
      transform: translateX(200%);
      transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;
      ${rightPanel !== 2 &&
      css`
        transform: translateX(100%);
        width: 50%;
        opacity: 1;
      `};
    `;
  }
);

export interface ShowInvitation {
  show: boolean;
  showMessageOnly: boolean;
  existingEmail: string;
}

const MCPage = () => {
  const maxSidePanel = 3;
  const sidePanelWidth = 25;
  const resetInvitationForm: ShowInvitation = {
    show: false,
    showMessageOnly: false,
    existingEmail: '',
  };

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
  const [sidePanel, setSidePanel] = useState<number>(3);
  const [showDeleteGameDialog, setShowDeleteGameDialog] = useState(false);
  const [showInvitationForm, setShowInvitationForm] = useState<ShowInvitation>(resetInvitationForm);
  const [showCommsForm, setShowCommsForm] = useState(false);

  const history = useHistory();
  const { keycloak } = useKeycloak();
  const { id: userId } = useKeycloakUser();
  // const { stompClient } = useWebsocketContext();
  const { gameId } = useParams<{ gameId: string }>();
  const [deleteGame] = useMutation<DeleteGameData, DeleteGameVars>(DELETE_GAME);
  const [addInvitee] = useMutation<AddInviteeData, AddInviteeVars>(ADD_INVITEE);
  const [removeInvitee] = useMutation<RemoveInviteeData, RemoveInviteeVars>(REMOVE_INVITEE);
  const { data: allMovesData } = useQuery<AllMovesData>(ALL_MOVES);

  const { data: gameData, loading: loadingGame } = useQuery<GameData, GameVars>(GAME, { variables: { gameId } });

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

  const game = gameData?.game;
  const allMoves = allMovesData?.allMoves;

  useEffect(() => {
    if (!!game && !!userId) {
      if (game.mc.id !== userId) {
        history.push('/menu');
      }
    }
  }, [game, userId, history]);

  if (loadingGame || !game) {
    return <div> Loading </div>;
  }

  console.log('game', game);

  return (
    <>
      {showCommsForm && (
        <Layer onEsc={() => setShowCommsForm(false)} onClickOutside={() => setShowCommsForm(false)}>
          <Box gap="24px" pad="24px">
            <CommsFormShort game={game} setShowCommsForm={setShowCommsForm} />
          </Box>
        </Layer>
      )}
      {showDeleteGameDialog && (
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
      {showInvitationForm.show && (
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
      <Header background="neutral-1">
        <ThemeContext.Extend value={customDefaultButtonStyles}>
          <Menu
            dropBackground="neutral-1"
            label="AW Central"
            items={[
              { label: 'Main menu', onClick: () => history.push('/menu') },
              {
                label: 'Log out',
                onClick: () => {
                  history.push('/');
                  keycloak.logout();
                },
              },
            ]}
          />
          {game.gameRoles
            .filter((gameRole) => gameRole.role === Roles.player)
            .map((gameRole) =>
              gameRole.characters?.map((character) => <Button key={character.name} label={character.name} />)
            )}
          <Button label="Threat map" />
        </ThemeContext.Extend>
      </Header>
      <div>
        <Collapsible direction="horizontal" open={sidePanel < 3}>
          <SidePanel sidePanel={sidePanel} growWidth={sidePanelWidth}>
            {sidePanel === 0 && (
              <GamePanel
                closePanel={setSidePanel}
                setShowDeleteGameDialog={setShowDeleteGameDialog}
                setShowInvitationForm={setShowInvitationForm}
                setShowCommsForm={setShowCommsForm}
                handleRemoveInvitee={handleRemoveInvitee}
                game={game}
              />
            )}
            {sidePanel === 1 && !!allMoves && <MovesPanel closePanel={setSidePanel} allMoves={allMoves} />}
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
      <ThemeContext.Extend value={customTabStyles}>
        <Footer direction="row" justify="between">
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
        </Footer>
      </ThemeContext.Extend>
    </>
  );
};

export default MCPage;
