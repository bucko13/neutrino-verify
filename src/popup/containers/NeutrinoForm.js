import React from 'react';
import { Form } from 'semantic-ui-react';
import { TX } from 'bcoin';

import BlockFilter from '../utils/blockfilter';

export default class NeutrinoForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      filter: '',
      tx: '',
      block: 'hash',
    };
  }

  handleChange(e, { name, value }) {
    this.setState({ valid: undefined });
    this.setState({ [name]: value });
  }

  handleSubmit() {
    const filter = BlockFilter.fromHex(this.state.filter);
    filter.deriveKey(this.state.blockHash);
    const tx = TX.fromRaw(this.state.tx, 'hex');
    const scripts = tx.outputs
      .filter(
        output => output.script.length !== 0 && output.script.raw[0] !== 106
      )
      .map(output => output.script.raw);

    const valid = scripts.every(script => filter.match(script));
    if (valid) alert(`Tx was found in the block!`);
    else alert(`Tx was not found in the block`);
  }

  render() {
    const { filter, tx, blockHash } = this.state;

    return (
      <Form>
        <Form.TextArea
          label="Neutrino Filter"
          name="filter"
          value={filter}
          placeholder="Input a filter to use to verify a transaction"
          onChange={(e, { name, value }) =>
            this.handleChange(e, { name, value })
          }
        />
        <Form.TextArea
          label="Block hash"
          name="blockHash"
          value={blockHash}
          placeholder="Hash of block to verify"
          onChange={(e, { name, value }) =>
            this.handleChange(e, { name, value })
          }
        />
        <Form.TextArea
          label="Transaction"
          name="tx"
          value={tx}
          onChange={(e, { name, value }) =>
            this.handleChange(e, { name, value })
          }
          placeholder="Input the transaction you would like to test against"
        />
        <Form.Button onClick={() => this.handleSubmit()}>Submit</Form.Button>
      </Form>
    );
  }
}
