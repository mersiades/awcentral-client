import React, { ChangeEvent, FC, useState } from 'react';
import { Box, TextArea } from 'grommet';

import CollapsiblePanelBox from '../CollapsiblePanelBox';
import { ButtonWS, CustomUL, HeadingWS, RedBox, TextInputWS, TextWS } from '../../config/grommetConfig';
import { Project } from '../../@types/dataInterfaces';
import { useGame } from '../../contexts/gameContext';
import { StyledMarkdown } from '../styledComponents';
import { useFonts } from '../../contexts/fontContext';
import { AddCircle, Edit, SubtractCircle, Trash } from 'grommet-icons';
import { useMutation } from '@apollo/client';
import ADD_PROJECT, { AddProjectData, AddProjectVars } from '../../mutations/addProject';
import { ProjectInput } from '../../@types';
import { UniqueTypes } from '../../@types/enums';
import WarningDialog from '../dialogs/WarningDialog';
import REMOVE_PROJECT, { RemoveProjectData, RemoveProjectVars } from '../../mutations/removeProject';

interface WorkShopBoxProps {
  navigateToCharacterCreation: (step: string) => void;
}

const WorkshopBox: FC<WorkShopBoxProps> = ({ navigateToCharacterCreation }) => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [showAddProject, setShowAddProject] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { character, userGameRole } = useGame();
  const { crustReady } = useFonts();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //

  const [addProject, { loading: addingProject }] = useMutation<AddProjectData, AddProjectVars>(ADD_PROJECT);
  const [removeProject, { loading: removingProject }] = useMutation<RemoveProjectData, RemoveProjectVars>(REMOVE_PROJECT);

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const workspace = character?.playbookUnique?.workspace;

  const resetProject = () => {
    setProjectId('');
    setProjectName('');
    setProjectNotes('');
  };

  const handleAddProject = async () => {
    if (!!character && !!userGameRole && !!projectName && !!workspace) {
      const projectInput: ProjectInput = {
        id: !!projectId ? projectId : undefined,
        name: projectName,
        notes: projectNotes,
      };

      const optimisticPlaybookUnique = {
        id: 'temporary-id',
        type: UniqueTypes.workspace,
        workspace: {
          ...workspace,
          projects: [...workspace.projects, { ...projectInput, id: projectInput.id || 'temporary-id' }],
        },
      };

      try {
        await addProject({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, project: projectInput },
          optimisticResponse: {
            __typename: 'Mutation',
            addProject: {
              __typename: 'Character',
              ...character,
              playbookUnique: optimisticPlaybookUnique,
            },
          },
        });
        resetProject();
        setShowAddProject(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleRemoveProject = async () => {
    if (!!character && !!userGameRole && !!projectName && !!projectId && !!workspace && !removingProject) {
      const projectInput: ProjectInput = {
        id: projectId,
        name: projectName,
        notes: projectNotes,
      };

      const optimisticPlaybookUnique = {
        id: 'temporary-id',
        type: UniqueTypes.workspace,
        workspace: {
          ...workspace,
          projects: workspace.projects.filter((project) => project.id !== projectId),
        },
      };

      try {
        await removeProject({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, project: projectInput },
          optimisticResponse: {
            __typename: 'Mutation',
            removeProject: {
              __typename: 'Character',
              ...character,
              playbookUnique: optimisticPlaybookUnique,
            },
          },
        });
        resetProject();
        setShowWarningDialog(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // -------------------------------------------------- Render component  ---------------------------------------------------- //
  return (
    <CollapsiblePanelBox
      open
      title="Workspace"
      navigateToCharacterCreation={navigateToCharacterCreation}
      targetCreationStep="6"
    >
      <Box fill="horizontal" align="start" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
        {showWarningDialog && (
          <WarningDialog
            title="Delete project?"
            buttonTitle="DELETE"
            text={`Are you sure you want to delete the project "${projectName}"? This cannot be undone.`}
            handleClose={() => {
              setShowWarningDialog(false);
              resetProject();
            }}
            handleConfirm={() => handleRemoveProject()}
          />
        )}
        <div>
          <Box align="center" style={{ float: 'right' }} margin={{ left: '12px', bottom: '12px' }} width="50%">
            <RedBox pad="12px">
              <CustomUL>
                {workspace?.workspaceItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </CustomUL>
            </RedBox>
            <TextWS weight={600}>Workshop items</TextWS>
          </Box>
          <StyledMarkdown>{workspace?.workspaceInstructions}</StyledMarkdown>
        </div>
        <Box direction="row">
          <HeadingWS crustReady={crustReady} level={3}>
            Projects
          </HeadingWS>
          <Box margin={{ horizontal: '24px' }} justify="center" align="center">
            {showAddProject && !projectId ? (
              <SubtractCircle color="brand" style={{ cursor: 'pointer' }} onClick={() => setShowAddProject(false)} />
            ) : (
              <AddCircle
                color="brand"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  resetProject();
                  setShowAddProject(true);
                }}
              />
            )}
          </Box>
        </Box>
        {showAddProject && (
          <Box fill="horizontal" gap="12px" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
            <Box direction="row" fill="horizontal" align="center" gap="12px">
              <TextInputWS
                placeholder="Name"
                value={projectName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)}
                style={{ flex: 1 }}
              />
              <ButtonWS
                secondary
                label={!!projectId ? 'UPDATE' : 'ADD'}
                disabled={!projectName || !!addingProject}
                fill="horizontal"
                style={{ outline: 'none', boxShadow: 'none', width: !!projectId ? '128px' : '100px', flex: 'grow' }}
                onClick={() => !addingProject && handleAddProject()}
              />
            </Box>
            <TextArea
              placeholder="Notes"
              value={projectNotes}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setProjectNotes(e.target.value)}
            />
          </Box>
        )}
        {workspace?.projects.map((project: Project) => (
          <Box key={project.id} fill="horizontal" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
            <Box direction="row" fill="horizontal" justify="between" align="end" gap="12px">
              <HeadingWS level={4} margin={{ bottom: '3px' }}>
                {project.name}
              </HeadingWS>
              <Box direction="row" gap="12px" margin={{ bottom: '3px' }}>
                <Edit
                  color="accent-1"
                  onClick={() => {
                    if (projectId === project.id) {
                      resetProject();
                      setShowAddProject(false);
                    } else {
                      setProjectId(project.id);
                      setProjectName(project.name);
                      setProjectNotes(project.notes || '');
                      setShowAddProject(true);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                />
                <Trash
                  color="accent-1"
                  onClick={() => {
                    setProjectName(project.name);
                    setProjectId(project.id);
                    setProjectNotes(project.notes || '');
                    setShowWarningDialog(true);
                  }}
                  style={{ cursor: 'pointer' }}
                />
              </Box>
            </Box>
            {!!project.notes && <TextWS>{project.notes}</TextWS>}
          </Box>
        ))}
      </Box>
    </CollapsiblePanelBox>
  );
};

export default WorkshopBox;
