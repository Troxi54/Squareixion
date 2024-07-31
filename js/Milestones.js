class Milestone {
    constructor (requirement, boost, boosts_what, required_what, text, index, container, requirement_text = 'Master level', show = ()=>true)
    {
        this.requirement = typeof requirement === "function" ? requirement : new Decimal(requirement);
        this.boost = boost;
        this.boosts_what = boosts_what;
        this.required_what = required_what;
        this.text = text;
        this.index = index;
        this.container = container;
        this.requirement_text = requirement_text;
        this.show = show;

        this.always_works = false;

        this.html = {
            div: String(),
            requirement: String(),
            info: String(),
        }
        this.hidden = false;
    }
    isEnough()
    {
        const previous = this.index ? this.container()[this.index - 1].isEnough() : true;
        return this.enough = (previous || this.always_works)  && (!this.always_works ? typeof this.requirement === "function" ? this.requirement() : player[this.required_what].gte(this.requirement) : true);
    }
    updateEffect()
    {
        return this.effect = this.enough ? this.boost() : new Decimal(1);
    }
    setHTML(of_what, value)
    {
        this.html[of_what] = value;
        fs.update(this.html[of_what], (this.requirement_text === 'Master level' ? `${this.requirement_text} ${abb_abs_int(this.requirement)}` : `${this.requirement_text}`));
    }
    updateHTML()
    {
        if (((this.container()[this.index ? this.index - 1 : 0].isEnough() || this.container()[this.index ? this.index - 1 : 0].always_works) && this.show())) {
            //console.log(this.hidden)
            if (this.hidden) {
                fs.animateAppearance(this.html.div, true);
                this.hidden = false;
            }
        } else if (!this.hidden) {
            this.html.div.hide();
            this.hidden = true;
            //console.log(this.hidden)
        }
        /* if (!(this.container()[this.index ? this.index - 1 : 0].isEnough() && !this.container()[this.index ? this.index - 1 : 0].always_works)  || !this.show())
        {
            
        }
        else if (this.hidden) {
            
        } */
        fs.update(this.html.info, this.text());
    }
}