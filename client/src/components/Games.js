import React from 'react';
import moment from 'moment';
import styled from 'styled-components';

import {
  Main,
  Div,
} from './StyledComponents';

const ResDiv = styled('div')`
  color: ${props => (props.winteam === 'resistance' ? 'blue' : '#aaa')};
`;

const SpyDiv = styled('div')`
  color: ${props => (props.winteam === 'spies' ? 'blue' : '#aaa')};
`;

const Games = ({ gameData }) => (
  <Main>
    <h3>Latest Games</h3>
    { gameData.length && gameData.map((el) => {
      const {
        resistanceTeam,
        spyTeam,
        title,
        startDate,
        winningTeam,
      } = el;

      const resistance = resistanceTeam.map(player => player.playerName);
      const spies = spyTeam.map(player => player.playerName);
      return (
        <Div>
          <div>Title: {title ? title : 'Untitled Game'}</div>
          <div>Date: {moment(startDate).format('MM-DD-YYYY')}</div>
          <ResDiv winteam={winningTeam}>Resistance: {resistance.join(', ')}</ResDiv>
          <SpyDiv winteam={winningTeam}>Spies: {spies.join(', ')}</SpyDiv>
        </Div>
      );
    })}
    {/* {gameData.map(el => <span>{el.title}</span>)} */}
  </Main>
);

export default Games;
