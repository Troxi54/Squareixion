class Auto {
    constructor(condition = ()=>true, lambda = ()=>{}, rate = ()=>1, work = true)
    {
        this.condition = condition;
        this.lambda = lambda;
        this.rate = rate;
        this.work = work;

        this.lastLoop = 0;
        this.do();
        this.lastLoop = Date.now();
    }
    do()
    {
        if (this.work && this.condition())
        {
            if (Date.now() >= this.lastLoop + this.rate() * 1e3)
            {
                console.log(this.rate())
                this.lambda();
                this.lastLoop = Date.now()
            }
        }
    }
}

nosave.Autoclickers = [
    new Auto(()=>player.upgrades.light_upgrades[2].bought_times.ge(1), function(){gameFunctions.damageCube();}, ()=>player.upgrades.light_upgrades[2].effect.toNumber())
];