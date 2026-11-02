import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
test('channel menu declares all seven independently selectable options',()=>{
 const menu=html.match(/<select id="channel">([\s\S]*?)<\/select>/)[1];
 const values=[...menu.matchAll(/<option\s+value="([^"]+)"[^>]*>/g)].map(m=>m[1]);
 assert.deepEqual(values,['original','R','G','B','Y','U','V']);
 assert.equal([...menu.matchAll(/<\/option>/g)].length,7);
});
test('HTML closing tags do not carry attributes that discard option elements',()=>{
 assert.equal(html.match(/<\/[a-zA-Z]+\s+[^>]+>/g),null);
});
