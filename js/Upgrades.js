class Upgrade {
    constructor(tier = 1, number, start_cost, cost_scaling, effect_scaling, multiplies_what, costs_what, buyable_times = Infinity, effectl = (eff)=>eff, show = ()=>true)
    {
        this.tier = tier;
        this.number = number;
        this.bought_times = new Decimal('0e0');
        this.start_cost = new Decimal(start_cost);
        this.cost_scaling = new Decimal(cost_scaling);
        this.effect_scaling = new Decimal(effect_scaling);
        this.multiplies_what = multiplies_what;
        this.costs_what = costs_what;
        this.costs_what_lambda = () => player[costs_what];
        this.buyable_times = buyable_times;
        this.effectl = effectl;
        this.show = show;

        this.buy_condition = () => this.costs_what_lambda().gte(this.cost);
        this.takes_currency = true;

        this.upgrade_html = {
            button: String(),
            name: String(),
            info: String(),
            cost: String(),
        };

        this.updateCost();
        this.updateEffect();
    }
    updateCost(offset = new Decimal('0e0'))
    {
        return this.cost = this.start_cost.times(this.cost_scaling.pow(this.bought_times.plus(offset)));
    }
    updateEffect()
    {
        return this.effect = this.effectl(this.effect_scaling.pow(this.bought_times));
    }
    setBoughtTimes(num)
    {
        this.bought_times = num;
        this.updateCost();
        this.updateEffect();
    }
    timesCan()
    {
        return this.bought_times.lt(new Decimal(this.buyable_times))
    }
    updateHTML()
    {
        if (!this.show())
        {
            this.upgrade_html.button.hide();
        }
        else if (this.upgrade_html.button.is(':hidden')) fs.animateAppearance(this.upgrade_html.button, true);
        fs.update( this.upgrade_html.name, `<span class="size-125">Upgrade ${this.number}</span><br><br>`);
        fs.update( this.upgrade_html.info,
            (typeof this.multiplies_what === 'function' ? this.multiplies_what() : `Multiplies your <br>${ fs.abbCurrency(this.multiplies_what) } by <span class="positive">${ abb_abs_int(this.effect_scaling) }</span><br><span class="darker-text">Currently: ${abb_abs_int(this.effect)}x</span><br><br>`));
        fs.update( this.upgrade_html.cost, `Cost: <span class="${ this.buy_condition() && this.timesCan() ? 'positive' : 'negative' }">${ !this.timesCan() ? 'maxed' : abb_abs_int(this.cost)} ${ !this.timesCan() ? '': fs.abbCurrency(this.costs_what)}</span>`);
        if (this.buy_condition() && this.timesCan())
        {
            this.upgrade_html.button.removeClass('button-cannot')
        }
        else this.upgrade_html.button.addClass('button-cannot')
    }
    buy(lambda = ()=>{})
    {
        if (this.timesCan() && this.buy_condition())
        {
            this.bought_times = this.bought_times.plus(new Decimal('1e0'));
            const cost = this.cost;
            this.updateCost();
            this.updateEffect();
            if (this.takes_currency) changeValue(this.costs_what, player[this.costs_what].minus(cost));
            if (this.multiplies_what === "damage") { get.updateDamage(); updates.cubeInfo(); }
            if (this.multiplies_what === "prestige_points") { get.updatePrestigePoints(); updates.prestigeButtonInfo(); }
            if (this.multiplies_what === "light_points") { get.updateLightPoints(); updates.prestigeButtonInfo(); }
            if (this.multiplies_what === "mini_cubes") { get.updateMiniCube(); }
            lambda();
        }
    }
    buy_max(lambda = ()=>{})
    {
        if (this.timesCan() && this.buy_condition())
        {
            let l10 = 0;
            while (player[this.costs_what].gte(this.updateCost(new Decimal('1e1').pow(l10).minus(1))))++l10;++l10;
            while (--l10 + 1)
            {
                while(this.timesCan() && player[this.costs_what].gte(this.updateCost(new Decimal('1e1').pow(l10).minus(1))))
                {
                    if (this.takes_currency) player[this.costs_what] = player[this.costs_what].minus(this.cost);
                    this.bought_times = this.bought_times.plus(new Decimal('1e1').pow(l10));
                }
            }
            this.updateCost();
            this.updateEffect();
            changeValue(this.costs_what, player[this.costs_what]);
            if (this.multiplies_what === "damage") { get.updateDamage(); updates.cubeInfo(); }
            if (this.multiplies_what === "prestige_points") { get.updatePrestigePoints(); updates.prestigeButtonInfo(); }
            if (this.multiplies_what === "light_points") { get.updateLightPoints(); updates.lightButtonInfo(); }
            if (this.multiplies_what === "mini_cubes") { get.updateMiniCube(); }
            lambda();
        }
    }
}