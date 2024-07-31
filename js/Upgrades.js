class Upgrade {
    constructor(index, start_cost, cost_scaling, effect_formula, multiplies_what, costs_what, buyable_times = N(Infinity), show = ()=>true, html_int = true,
        info = ()=> !raises ? `Multiplies your <br>${ fs.abbCurrency(this.multiplies_what) } by <span class="positive">${ this.html_int ? abb_abs_int(this.effect_formula(1)) : abb_abs(this.effect_formula(1))}</span><br><span class="darker-text italic">Currently: ${ this.html_int ? abb_abs_int(this.effect) : abb_abs(this.effect)}x</span><br><br>`
                    : `Raises your <br>${ fs.abbCurrency(this.multiplies_what) } by <span class="pow">${ this.html_int ? abb_abs_int(this.effect_formula(1)) : abb_abs(this.effect_formula(1)) }</span><br><span class="darker-text italic">Currently: x<sup>${ this.html_int ? abb_abs_int(this.effect) : abb_abs(this.effect)}</sup></span><br><br>`, 
            raises = false)
    {
        this.index = index;
        this.bought_times = N('0e0');
        this.start_cost = N(start_cost);
        this.cost_scaling = N(cost_scaling);
        this.effect_formula = effect_formula;
        this.multiplies_what = multiplies_what;
        this.costs_what = costs_what;
        this.costs_what_lambda = () => player[costs_what];
        this.buyable_times = buyable_times;
        this.show = show;
        this.html_int = html_int;
        this.info = info;
        this.raises = raises;
        this.hidden = false;


        this.buy_condition = () => this.costs_what_lambda().gte(this.cost);
        this.takes_currency = true;

        this.upgrade_html = {
            button: '',
            name: '',
            info: '',
            cost: ''
        };

        //this.updateCost();
        //this.updateEffect();
        this.hidden = false;
    }
    updateCost(offset = N('0e0'))
    {
        return this.cost = this.start_cost.times(this.cost_scaling.pow(this.bought_times.plus(offset))).times(1e11).round().div(1e11);
    }
    updateEffect()
    {
        return this.effect = this.effect_formula(this.bought_times);
    }
    setBoughtTimes(num)
    {
        this.bought_times = num;
        //this.updateCost();
        //this.updateEffect();
    }
    timesCan()
    {
        return this.bought_times.lt(N(this.buyable_times))
    }
    updateHTML()
    {
        if (!this.show() || (this.bought_times.gte(this.buyable_times) && player.hide_maxed_upgrades))
        {
            this.upgrade_html.button.hide();
            this.hidden = true;
        }
        else if (this.hidden)
        {
            fs.animateAppearance(this.upgrade_html.button, true);
            this.hidden = false;
        }
        
        fs.update( this.upgrade_html.name, `<span class="size-125">Upgrade ${this.index}</span><br><br>`);
        fs.update( this.upgrade_html.info, this.info())
        fs.update( this.upgrade_html.cost, `Cost: <span class="${ this.buy_condition() && this.timesCan() ? 'positive' : 'negative' }">${ !this.timesCan() ? 'maxed' 
                                                    : abb_abs_int(this.cost)} ${ !this.timesCan() ? '': fs.abbCurrency(this.costs_what)}</span>`);
        /* if (this.buy_condition() && this.timesCan() && this.upgrade_html.button.hasClass('button-cannot'))
        {
            this.upgrade_html.button.removeClass('button-cannot')
        }
        else this.upgrade_html.button.addClass('button-cannot') */
    }
    buy()
    {
        if (this.timesCan() && this.buy_condition())
        {
            this.bought_times = this.bought_times.plus(N('1e0'));
            const cost = this.cost;
            //this.updateCost();
            //this.updateEffect();
            if (this.takes_currency) changeValue(this.costs_what, player[this.costs_what].minus(cost));
            /* if (this.multiplies_what === "damage") { get.updateDamage(); updates.cubeInfo(); }
            if (this.multiplies_what === "prestige_points") { get.updatePrestigePoints(); updates.prestigeButtonInfo(); }
            if (this.multiplies_what === "light_points") { get.updateLightPoints(); updates.prestigeButtonInfo(); }
            if (this.multiplies_what === "mini_cubes") { get.updateMiniCube(); }
            if (this.multiplies_what === "giant_cube_damage") { get.updateGcDamage(); updates.giantcubeInfo(); }
            if (this.multiplies_what === "ruby") { get.updateRubyGain(); updates.rubyAmount(); }
            if (this.multiplies_what === "giga_squares") { get.updateGigaSquareGain(); updates.gigaButtonInfo(); updates.gigaAmount(); }
            if (this.multiplies_what === "neon_luck") { get.updateNeonLuck(); update.neonButtonInfo(); } */
        }
    }
    buy_max()
    {
        if (this.timesCan() && this.buy_condition())
        {
            //let ms = Date.now();
            let bulk = player[this.costs_what].div(this.cost).log(this.cost_scaling).plus(1).floor().max(1)
            //if (this.index === 1) console.log(this, bulk);
            bulk = Round(bulk)
            
            let remaining_levels = this.buyable_times.minus(this.bought_times);
            if (bulk.gt(remaining_levels)) bulk = remaining_levels;
            if (this.takes_currency)
            {
                // i don't know what it means, but it works lol. (this code was written by me)
                const acc = 8;
                
                let accuracy = bulk.lte(remaining_levels) ? (bulk.lte(acc - 1) ? +bulk : acc) : +remaining_levels;
                
                let sum = N(0);
                let was = bulk;
                for (let i = 0; i < accuracy; i += 1)
                {
                    sum = sum.plus(this.updateCost(bulk.minus(accuracy - i)));
                    if (player[this.costs_what].lt(sum)) 
                    {
                        bulk = bulk.minus(accuracy - i);
                        break;
                    }
                }
                //accuracy = accuracy - +was.minus(bulk);
                accuracy = bulk.lte(acc - 1) ? +bulk : acc;
                //console.log(bulk, accuracy)
                if (bulk.gt(remaining_levels)) bulk = bulk.minus(bulk.minus(remaining_levels));
                for (let i = 0; i < accuracy; i += 1)
                {
                    player[this.costs_what] = player[this.costs_what].minus(this.updateCost(bulk.minus(i + 1)));
                }
            }
            
            this.bought_times = this.bought_times.plus(bulk);
            /*let l10 = 0;
            while (player[this.costs_what].gte(this.updateCost(N('1e1').pow(l10).minus(1))))++l10;++l10;
            while (--l10 + 1)
            {
                while(this.timesCan() && player[this.costs_what].gte(this.updateCost(N('1e1').pow(l10).minus(1))))
                {
                    if (this.takes_currency) player[this.costs_what] = player[this.costs_what].minus(this.cost);
                    this.bought_times = this.bought_times.plus(N('1e1').pow(l10));
                }
            }  */
            this.updateCost();
            this.updateEffect();
            this.updateHTML();
            //changeValue(this.costs_what, player[this.costs_what]);
            /* if (this.multiplies_what === "damage") { get.updateDamage(); updates.cubeInfo(); }
            if (this.multiplies_what === "prestige_points") { get.updatePrestigePoints(); updates.prestigeButtonInfo(); }
            if (this.multiplies_what === "light_points") { get.updateLightPoints(); updates.lightButtonInfo(); }
            if (this.multiplies_what === "mini_cubes") { get.updateMiniCube(); }
            if (this.multiplies_what === "giant_cube_damage") { get.updateGcDamage(); updates.giantcubeInfo(); }
            if (this.multiplies_what === "ruby") { get.updateRubyGain(); updates.rubyAmount(); }
            if (this.multiplies_what === "giga_squares") { get.updateGigaSquareGain(); updates.gigaButtonInfo(); updates.gigaAmount(); }
            if (this.multiplies_what === "neon_luck") { get.updateNeonLuck(); update.neonButtonInfo(); } */
            //console.log(Date.now() - ms + 'ms')
        }
    }
}