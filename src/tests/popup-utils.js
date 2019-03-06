import assert from 'bsert';
import GCSFilter from 'golomb';
import { Block } from 'bcoin';

import BlockFilter from '../popup/utils/blockfilter';
import filterTests from './data/filter-valid.json';
import blockJson from './data/mainnet-block.json';
const data = blockJson[1];

describe('popup', () => {
  describe('utils', () => {
    describe('BlockFilter', () => {
      it('filters should match when converting to and from raw', async () => {
        const hex1 = data[3];
        const filter = BlockFilter.fromHex(hex1);
        const hex2 = filter.toRaw().toString('hex');
        assert.strictEqual(hex1, hex2);
      });

      it('should verify transactions in a mainnet block', async () => {
        const rawBlock = data[2];
        const hex = data[3];

        const block = Block.fromRaw(Buffer.from(rawBlock, 'hex'));
        const scripts = block.txs[5].outputs.map(output => output.script);
        const filter = BlockFilter.fromHex(hex);
        filter.deriveKey(block.rhash());

        // confirm that we can find the output scripts in the block's filter
        scripts.forEach(script => assert(filter.match(script.raw)));
      });

      // this tests our BlockFilter class against BIP-158 test vectors
      // and confirms basic matching functionality
      it('should create an instanceof GCSFilter with helper methods', () => {
        for (let json of filterTests) {
          if (json.length === 1) continue;
          const height = json[0];
          const hash = json[1];
          const raw = json[2];
          const filterHex = json[5];
          const scripts = json[3];
          const notes = json[json.length - 1];

          const block = Block.fromRaw(raw, 'hex');

          assert.strictEqual(hash, block.rhash());
          const filter = BlockFilter.fromHex(filterHex);

          assert(
            filter instanceof GCSFilter,
            `Expected to get an instance of a GCSFilter for block ${height}`
          );

          assert.strictEqual(
            filter.toNBytes().toString('hex'),
            filterHex,
            `Expected BlockFilter NBytes data to match the filterHex from test data for block ${height}`
          );

          filter.deriveKey(hash);
          const expected = block.hash().slice(0, 16);

          // test that we create the right key for decoding
          assert.strictEqual(
            filter.key.toString('hex'),
            expected.toString('hex'),
            `Expected filter key to be first 16 bytes of little endian rep. of hash for block ${height}`
          );

          describe('filter matching', () => {
            it(`should check prevout scripts in block where ${notes}`, () => {
              // check that prevout scripts confirm against the filter
              if (scripts.length) {
                for (let script of scripts) {
                  const prevOutScript = Buffer.from(script, 'hex');
                  if (prevOutScript.length) {
                    assert(
                      filter.match(prevOutScript),
                      `Failed for block ${height} on prevOutScript ${script}`
                    );
                  }
                }
              }
            });

            it(`should outputs in block where ${notes}`, () => {
              // test that we can match outputs from the block's txs
              for (let tx of block.txs) {
                for (let { script } of tx.outputs) {
                  // skip empty scripts and OP_RETURNS
                  if (script.length && script.raw[0] !== 106) {
                    assert(
                      filter.match(script.raw),
                      `Filter match against outputs for tx ${tx.txid()} failed for block ${height}`
                    );
                  }
                }
              }
            });
          });
        }
      });
    });
  });
});
