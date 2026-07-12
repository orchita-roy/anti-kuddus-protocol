import { createHash } from "node:crypto";import sharp from "sharp";
export const sha256Fingerprint=(data:Buffer)=>createHash("sha256").update(data).digest("hex");
export async function perceptualHash(data:Buffer){const pixels=await sharp(data).greyscale().resize(8,8,{fit:"fill"}).raw().toBuffer();const avg=pixels.reduce((a,b)=>a+b,0)/pixels.length;return Array.from(pixels,v=>v>=avg?"1":"0").join("")}
export const hammingDistance=(a:string,b:string)=>a.length===b.length?Array.from(a).reduce((n,c,i)=>n+(c!==b[i]?1:0),0):Infinity;
