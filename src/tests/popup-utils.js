import assert from 'bsert';
import BlockFilter from '../popup/utils/blockfilter';
import filterTests from './data/filter-valid.json';

describe('popup', () => {
  describe('utils', () => {
    describe('BlockFilter', () => {
      let filter;
      beforeEach(() => {
        filter = new BlockFilter();
      });
      it('should pass', () => {
        console.log('filterTests:', filterTests[1])
        console.log('filter:', filter);
        assert(true);
      });
    });
  });
});
