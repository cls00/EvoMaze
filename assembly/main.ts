import { context, storage, logging, RNG, PersistentMap, PersistentVector } from "near-sdk-as";

export class Relation{
   _0: i32;
   _1: i32;
   constructor(_0: i32, _1: i32) {
    this._0 = _0;
    this._1 = _1;
  }
  
  GetPair(): string{
    return this._0.toString() + "-" + this._1.toString();
  }
};

let spawnedby: i32 = 0;

let population = new PersistentVector<Relation>("pop");


// --- contract code goes below

export function saveSeed(value: i32): void {
  const newSeed = storage.getPrimitive<i32>("seed", 0) + value;
  storage.set<i32>("seed", newSeed);  
}


export function addChild(child: i32): void {
    assert(child != getParent(), "Not a variant!");
    const relation = new Relation(child,getParent());
    population.push(relation);
    logging.log("New relation created by " + context.sender);
}


export function getPopulation(): PersistentVector<Relation> {
    return population;
}

export function getSeed(): i32 {
  return storage.getPrimitive<i32>("seed", 0);
}

export function getVariant(): i32 {
  let rng = new RNG<i32>(1, u8.MAX_VALUE);
  let variant = rng.next();
  assert(variant != getParent(), "Not a variant!");
  return variant;
}

export function getTestString(): string {
    logging.log("test was called");
    return "testCopyString";
}

export function getParent(): i32 {
    return spawnedby;
}

export function setParent(parent: i32): void {
    spawnedby = parent;
}

let contractPart1: string = " import { context, storage, logging, RNG, PersistentMap, PersistentVector } from \"near-sdk-as\"; \n export class Relation{ _0: i32;    _1: i32;    constructor(_0: i32, _1: i32) {     this._0 = _0;     this._1 = _1;   } \n  GetPair(): string{ return this._0.toString() + \"-\" + this._1.toString();  } }; \n let spawnedby: i32 = 0; \n let population = new PersistentVector<Relation>(\"pop\"); \n // --- contract code goes below \n export function saveSeed(value: i32): void { const newSeed = storage.getPrimitive<i32>(\"seed\", 0) + value; storage.set<i32>(\"seed\", newSeed); \n logging.log(\"Seed has been changed to \" + newSeed.toString() + \" by \" + context.sender); } \n export function addChild(child: i32): void {   assert(child != getParent(), \"Not a variant!\"); const relation = new Relation(child,getParent()); population.push(relation); } \n export function getPopulation(): PersistentVector<Relation> { return population; } \n export function getSeed(): i32 { return storage.getPrimitive<i32>(\"seed\", 0);} \n export function getVariant(): i32 {   let rng = new RNG<i32>(1, u8.MAX_VALUE); let variant = rng.next(); assert(variant != getParent(), \"Not avariant!\");   return variant; } \n export function getTestString(): string { logging.log(\"test was called\"); return \"testCopyString\"; } \n export function getParent(): i32 {  return spawnedby; } \n export function setParent(parent: i32): void {  spawnedby = parent; }\"; ";

export function getContractSource(): string {
    let contract = contractPart1 + "let contractPart1: string = \" " + contractPart1 + "\";\n" + 
    contractPart2 + "\n let contractPart2: string = \" " + contractPart2 + "\";";
    
    return contract;
}

let contractPart2: string = "export function getContractSource(): void { let contract = contractPart1 + \"let contractPart1: string = \\\" \" + contractPart1 + \"\\\";\n\" +  contractPart2 + \"\n let contractPart2: string = \\\" \" + contractPart2 + \"\\\";\"; return contract; }";




