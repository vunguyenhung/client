/**
 * Created by vunguyenhung on 4/8/18.
 */

/**
 * 3rd Party library imports
 */
import { createReadStream } from 'fs';
import { createGzip } from 'zlib';
import Webtorrent from 'webtorrent';

/**
 * Project file imports
 */
import { createCipher } from '../composer/crypto';

// UPLOAD FILE
// [ ] choose file
// [ ] encrypt file (using secret key) => generate secret key (prefer ether)
// [ ] shard file
// [ ] feed to webtorrent

const zip = createGzip();

const encrypt = createCipher('123');

const client = new Webtorrent();

const fileStream = filePath => createReadStream(filePath).pipe(zip).pipe(encrypt);


// TODO: finish this
export const uploadFile = (filePath) =>
  client.seed(fileStream(filePath), { name: 'test' }, (torrent) => {
    // got fired when the client starts seeding
    console.log('seeding started: ', torrent.magnetURI);
  });
