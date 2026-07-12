export type RiskInputs={verified:number;sos:number;ledger:number;locationRepeat:number;ruleMatches:number;trendAcceleration:number};
const normalize=(value:number,max:number)=>Math.min(1,Math.max(0,value/max));
export function calculateRiskScore(i:RiskInputs){return Math.round(Math.min(100,normalize(i.verified,10)*30+normalize(i.sos,8)*20+normalize(i.ledger,10)*15+normalize(i.locationRepeat,8)*15+normalize(i.ruleMatches,8)*10+normalize(i.trendAcceleration,1)*10))}
export const riskLevel=(score:number)=>score>=80?"critical":score>=60?"high":score>=30?"moderate":"low";
export function trendDirection(current:number,previous:number){if(previous===0)return current>0?"increasing":"stable";const change=(current-previous)/previous;return change>.15?"increasing":change<-.15?"decreasing":"stable"}
