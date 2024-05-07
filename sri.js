//Based on https://github.com/vitejs/vite/discussions/11043#discussioncomment-4233645 and rollup-sri-plugin
//These is discussion around making this fn native to vite: https://github.com/vitejs/vite/issues/2377

import * as cheerio from 'cheerio';
import { createHash } from 'crypto';
import fs from 'fs';
import fetch from 'node-fetch';

const invalidHashAlgorithms = ['sha1', 'md5'];

export default function subresourceIntegrity(options) {
  const selectors = options?.selectors || ['script', 'link[rel=stylesheet]'];
  const hashAlgorithms = options?.algorithms || ['sha384'];
  const crossorigin = options?.crossorigin || 'anonymous';
  const publicPath = options?.publicPath ?? '';
  let active = options?.active ?? true;

  return {
    name: 'subresource-integrity',
    buildStart() {
      hashAlgorithms
        .filter((alg) => invalidHashAlgorithms.includes(alg.toLowerCase()))
        .forEach((alg) => this.warn(`Insecure hashing algorithm "${alg}" will be rejected by browsers!`));
    },
    async closeBundle() {
      if (!active) return;

      const buildDir = 'S3'; //TBD get this from vite config
      for(const file of ['/index.html']) { //TBD get these from vite config
          let content = fs.readFileSync(buildDir + file);
          const $ = cheerio.load(content);
          const elements = $(selectors.join()).get();
    
          for (const el of elements) {
            const integrityAlreadyHardCoded = $(el).attr('integrity');
            if (integrityAlreadyHardCoded) continue;
            // const url = ($(el).attr('href') || $(el).attr('src'))?.replace(publicPath, '');
            const url = $(el).attr('src')?.replace(publicPath, ''); //only generate hash for script src
            if (!url) continue;
    
            let buf;
            if (fs.existsSync(buildDir + '/' + url)) {
              //@ts-ignore
              buf = Buffer.from(fs.readFileSync(buildDir + '/' + url));
            } else if (url.startsWith('http')) {
              buf = await (await fetch(url)).buffer();
            } else {
              this.warn(`could not resolve resource "${url}"!`);
              continue;
            }
    
            const hashes = hashAlgorithms.map((algorithm) => generateIdentity(buf, algorithm));
    
            $(el).attr('integrity', hashes.join(' '));
            $(el).attr('crossorigin', crossorigin);
          }
    
          fs.writeFileSync(buildDir + file, $.html());
      }
    },
  };
}

function generateIdentity(source, alg) {
  const hash = createHash(alg).update(source).digest().toString('base64');
  return `${alg.toLowerCase()}-${hash}`;
}

function isHtmlAsset(obj) {
  return obj.fileName.endsWith('.html') && obj.type === 'asset';
}