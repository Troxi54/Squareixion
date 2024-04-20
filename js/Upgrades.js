class Upgrade {
    constructor(tier = 1, number, start_cost, cost_scaling, effect_scaling, multiplies_what, costs_what, buyable_times = Infinity, effectl = (eff)=>eff)
    {
        this.tier = tier;
        this.number = number;
        this.bought_times = BigNumber('0e0');
        this.start_cost = BigNumber(start_cost);
        this.cost_scaling = BigNumber(cost_scaling);
        this.effect_scaling = BigNumber(effect_scaling);
        this.multiplies_what = multiplies_what;
        this.costs_what = costs_what;
        this.costs_what_lambda = () => player[costs_what];
        this.buyable_times = buyable_times;
        this.effectl = effectl;

        this.buy_condition = () => this.costs_what_lambda().ge(this.cost);

        this.upgrade_html = {
            name: String(),
            info: String(),
            cost: String()
        };

        this.updateCost();
        this.updateEffect();
    }
    updateCost(offset = BigNumber('0e0'))
    {
        return this.cost = this.start_cost.times(this.cost_scaling.topow(this.bought_times.plus(offset)));
    }
    updateEffect()
    {
        return this.effect = this.effectl(this.effect_scaling.topow(this.bought_times));
    }
    setBoughtTimes(num)
    {
        this.bought_times = num;
        this.updateCost();
        this.updateEffect();
    }
    timesCan()
    {
        return this.bought_times.lt(BigNumber(this.buyable_times))
    }
    updateHTML()
    {
        const value_iter = Upgrade.tierToUpgrade(this.tier, this.number - 1);
        fs.update( this.upgrade_html.name, `<span class="size-125">Upgrade ${this.number}</span> <br><br>`);
        fs.update( this.upgrade_html.info,
            (typeof this.multiplies_what === 'function' ? this.multiplies_what() :
            `Multiplies your <br>${ fs.abbCurrency(this.multiplies_what) } by <span class="positive">${ abb_abs_int(value_iter.effect_scaling) }</span>
                                <br><span class="darker-text">Currently: ${abb_abs_int(value_iter.effect)}x</span> <br><br><span class="size-125">`));
        fs.update( this.upgrade_html.cost, `Cost: <span class="${ this.buy_condition() && this.timesCan() ? 'positive' : 'negative' }">${ !this.timesCan() ? 'maxed' : abb_abs_int(value_iter.cost)} ${ this.timesCan() ? fs.abbCurrency(this.costs_what) : ''}</span></span>`);
    }
    buy(lambda = ()=>{})
    {
        if (this.timesCan() && this.buy_condition())
        {
            this.bought_times = this.bought_times.plus(BigNumber('1e0'));
            const cost = this.cost;
            this.updateCost();
            this.updateEffect();
            changeValue(this.costs_what, player[this.costs_what].minus(cost));
            if (this.multiplies_what === "damage") { get.updateDamage(); updates.cubeInfo(); }
            lambda();
        }
    }
    buy_max(lambda = ()=>{})
    {
        let l10 = 0;
        while (player[this.costs_what].ge(this.updateCost(BigNumber('1e1').topow(l10).minus(1))))++l10;++l10;
        while (--l10 + 1)
        {
            while(this.timesCan() && player[this.costs_what].ge(this.updateCost(BigNumber('1e1').topow(l10).minus(1))))
            {
                player[this.costs_what] = player[this.costs_what].minus(this.cost)
                this.bought_times = this.bought_times.plus(BigNumber('1e1').topow(l10))
            }
        }
        this.updateCost();
        this.updateEffect();
        changeValue(this.costs_what, player[this.costs_what]);
        if (this.multiplies_what === "damage") { get.updateDamage(); updates.cubeInfo(); }
        lambda();
    }
    static tierToUpgrade(tier, number)
    {
        return (tier === 1 ? player.upgrades.prestige_upgrades : player.upgrades.light_upgrades)[number];
    }
}



player = getDefaultPlayerValues();