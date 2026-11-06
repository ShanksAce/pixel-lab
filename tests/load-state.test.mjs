import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Evaluate the production image loader with controllable browser decoding.
// This reproduces completion order independently of actual image size/timing.
function loaderHarness(){
 const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
 const loader=app.slice(app.indexOf('async function loadBlob'),app.indexOf('function renderChannel'));
 const decodes=new Map(),messages=[];
 const sandbox={
  Uint8ClampedArray,
  document:{createElement(){return {append(){},getContext(){return {drawImage(){},getImageData(){return {data:new Uint8ClampedArray(64*48*4)};}};}};}},
  URL:{createObjectURL:blob=>blob.name,revokeObjectURL(){}},
  Image:class {
   constructor(){this.naturalWidth=64;this.naturalHeight=48;}
   decode(){return new Promise((resolve,reject)=>decodes.set(this.src,{resolve,reject}));}
  },
  $:()=>({replaceChildren(){}}),resetResults(){},draw(){},renderChannel(){},
  status(message,error=false){messages.push({message,error});}
 };
 vm.createContext(sandbox);
 vm.runInContext('let source=null,revision=0,loadRequestId=0;'+loader,sandbox);
 return {decodes,messages,load:name=>vm.runInContext(`safeLoad({size:1,name:${JSON.stringify(name)}},${JSON.stringify(name)})`,sandbox),current:()=>vm.runInContext('source?.name',sandbox)};
}

test('latest selected image wins when an older decode finishes last',async()=>{
 const h=loaderHarness(),older=h.load('older.png'),newer=h.load('newer.png');
 h.decodes.get('newer.png').resolve();assert.equal(await newer,true);
 h.decodes.get('older.png').resolve();assert.equal(await older,false);
 assert.equal(h.current(),'newer.png');
});

test('failure from an abandoned image does not overwrite the current load status',async()=>{
 const h=loaderHarness(),older=h.load('broken.png'),newer=h.load('good.png');
 h.decodes.get('good.png').resolve();await newer;
 h.decodes.get('broken.png').reject(Error('decode failed'));await older;
 assert.equal(h.current(),'good.png');
 assert.equal(h.messages.at(-1).error,false);
 assert.match(h.messages.at(-1).message,/good\.png/);
});
