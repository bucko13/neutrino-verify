import GCSFilter from 'golomb';
import bio from 'bufio';
import assert from 'bsert';

export default class extends GCSFilter {
  fromHex(string) {
    const bw = bio.write();
    const buffer = bw.writeString(string, 'hex');
    const data = buffer.render();
    return this.fromRaw(data);
  }

  // need the first 16 bytes of block hash
  // to use as key for decoding filter
  addKey(hash) {
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
  }

  static fromHex(string) {
    return new this().fromHex(string);
  }
}
