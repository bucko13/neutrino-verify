import React from 'react';
import { Container } from 'semantic-ui-react';

import NeutrinoForm from './NeutrinoForm';

export default class App extends React.PureComponent {
  render() {
    return (
      <Container>
        <h1>Neutrino Verify</h1>
        <NeutrinoForm />
      </Container>
    );
  }
}
