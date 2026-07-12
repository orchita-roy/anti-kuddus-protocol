export function correlationStrength(overlap:number,base:number){const ratio=base?overlap/base:0;return ratio>=.6?"strong":ratio>=.3?"moderate":"weak"}
export function timeWindowOverlap(a:Date[],b:Date[],windowMs=86400000){return a.filter(x=>b.some(y=>Math.abs(+x-+y)<=windowMs)).length}
