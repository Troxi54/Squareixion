class Upgrade {
    constructor(index, start_cost, cost_scaling, effect_formula, multiplies_what, costs_what, buyable_times = N(Infinity), show = ()=>true, html_int = true,
        info = ()=> !raises ? `Multiplies your <br>${ fs.abbCurrency(this.multiplies_what) } by <span class="positive">${ this.html_int ? abb_abs_int(this.effect_formula(1)) : abb_abs(this.effect_formula(1))}</span><br><span class="darker-text italic">Currently: ${ this.html_int ? abb_abs_int(this.effect) : abb_abs(this.effect)}x</span>`
                    : `Raises your <br>${ fs.abbCurrency(this.multiplies_what) } by <span class="pow">${ this.html_int ? abb_abs_int(this.effect_formula(1)) : abb_abs(this.effect_formula(1)) }</span><br><span class="darker-text italic">Currently: x<sup>${ this.html_int ? abb_abs_int(this.effect) : abb_abs(this.effect)}</sup></span>`, 
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
    size(p, div, padding = 2, direction = 'horizontal', partOfDiv = 1) {
      const decreasedSize = p.style.getPropertyValue('--decreasedSize');
      if (direction === 'horizontal') {
        const width = p.clientWidth + padding * 2, parentWidth = div.clientWidth * partOfDiv;
        if (width > parentWidth) {
          const by = (width / parentWidth);
          p.style.fontSize = getComputedStyle(p).fontSize.slice(0, -2) / by + 'px';
          p.style.setProperty('--decreasedSize', by);
        } else if (decreasedSize && width * decreasedSize <= parentWidth) {
          p.style = '';
        }
      } else if (direction === 'vertical') {
        const height = p.clientHeight + padding * 2, parentHeight = div.clientHeight * partOfDiv;
        if (height > parentHeight) {
          const by = (height / parentHeight);
          p.style.fontSize = getComputedStyle(p).fontSize.slice(0, -2) / by + 'px';
          p.style.setProperty('--decreasedSize', by);
        }/* else if (decreasedSize && height * decreasedSize <= parentHeight) {
          p.style = '';
        }*/
      }
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
        
        if (this.upgrade_html.button[0].clientWidth > 0) {
          fs.update( this.upgrade_html.name, `<span class="size-125">Upgrade ${this.index}</span><br><br>`);
          fs.update( this.upgrade_html.info, this.info());
          this.size(this.upgrade_html.info[0], this.upgrade_html.button[0], 0, 'vertical', 0.6);
          fs.update( this.upgrade_html.cost, this.timesCan() ? `Cost: <span class="${ this.buy_condition() ? 'positive' : 'negative' }">${abb_abs_int(this.cost)} ${fs.abbCurrency(this.costs_what)}</span>` : '<span class="negative">Maxed</span>');
          this.size(this.upgrade_html.cost[0], this.upgrade_html.button[0]);
        }
        
        
        if (this.buy_condition() && this.timesCan())
        {
            this.upgrade_html.button.removeClass('button-cannot');
        }
        else this.upgrade_html.button.addClass('button-cannot');
    }
    buy()
    {
        if (this.timesCan() && this.buy_condition())
        {
            this.bought_times = this.bought_times.plus(N('1e0'));
            const cost = this.cost;
            if (this.takes_currency) changeValue(this.costs_what, player[this.costs_what].minus(cost));
        }
    }
    buy_max()
    {
        if (this.timesCan() && this.buy_condition())
        {
            if (this.takes_currency) console.log(this)
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
            this.updateCost();
            this.updateEffect();
            this.updateHTML();
        }
    }
}