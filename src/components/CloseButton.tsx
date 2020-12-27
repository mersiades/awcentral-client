import { Close } from 'grommet-icons';
import React, { FC } from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  padding: 6px;
  cursor: pointer;
  & svg {
    &:hover {
      stroke: #fff;
    }
  }
`;

interface CloseButtonProps {
  handleClose: () => void;
}

const CloseButton: FC<CloseButtonProps> = ({ handleClose }) => {
  return (
    <StyledDiv>
      <Close color="accent-1" onClick={handleClose} />
    </StyledDiv>
  );
};

export default CloseButton;
