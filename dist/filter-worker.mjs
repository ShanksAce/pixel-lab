import {convolve,quality} from './core.mjs';
self.onmessage=({data:m})=>{try{const result=convolve(m.data,m.width,m.height,m.kernel,m.options);self.postMessage({id:m.id,result,metrics:quality(m.data,result)},[result.buffer]);}catch(e){self.postMessage({id:m.id,error:e.message});}};
