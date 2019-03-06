import GCSFilter from 'golomb';
import bio from 'bufio';
import assert from 'bsert';

export default class extends GCSFilter {
  fromHex(string) {
    const bw = bio.write();
    const buffer = bw.writeString(string, 'hex');
    const data = buffer.render();
    return super.fromRaw(data);
  }

  // DeriveKey is a utility function that derives a key from a block hash by
  // truncating the bytes of the hash to the appopriate key size.
  deriveKey(hash) {
    assert(typeof hash === 'string');

    // first need to reverse the hash
    // because we need to get the first 16 bytes in
    // little-endian representation
    let rev = '';

    for (let i = hash.length - 2; i >= 0; i -= 2) rev += hash[i] + hash[i + 1];

    const bw = bio.write();
    const buffer = bw.writeString(rev, 'hex');
    let data = buffer.render();
    this.key = data.slice(0, 16);
    return this.key;
  }

  // same as GCSFilter.match except uses class's key
  match(item) {
    assert(
      this.key,
      'Missing key on BlockFilter. Use deriveKey w/ block hash first'
    );

    return super.match(this.key, item);
  }

  // same as GCSFilter.matchAny except uses class's key
  matchAny(items) {
    assert(
      this.key,
      'Missing key on BlockFilter. Use deriveKey w/ block hash first'
    );
    return super.matchAny(this.key, items);
  }

  static fromHex(string) {
    return new this().fromHex(string);
  }
}
