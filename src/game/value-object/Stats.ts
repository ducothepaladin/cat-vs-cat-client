export class Stats {
  private attack: number;
  public defense: number;
  private critRate: number;

  constructor(atk: number, def: number, crit: number) {
    this.attack = atk;
    this.defense = def;
    this.critRate = crit;
  }

  buffDmg(amount: number) {}

  nerfDmg(amount: number) {}

  damgae(defenderDef: number) {
    let base = Math.floor(this.attack * (100 / (100 + defenderDef)));

    if (base < 1) base = 1;

    const isCrit = Math.random() < this.critRate;
    if (isCrit) base = Math.floor(base * 1.5);

    return base;
  }
}
