import {context} from 'esbuild';
const ctx=await context({entryPoints:[],write:false});
const {port}=await ctx.serve({servedir:'dist',host:'127.0.0.1',port:4173});
console.log(`Open http://localhost:${port}. Run npm run build again after editing.`);
