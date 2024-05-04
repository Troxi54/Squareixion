class Milestone {
    constructor (requirement, boost, boosts_what, required_what, text, index, container)
    {
        this.requirement = new Decimal(requirement);
        this.boost = boost;
        this.boosts_what = boosts_what;
        this.required_what = required_what;
        this.text = text;
        this.index = index;
        this.container = container;

        this.always_works = false;

        this.html = {
            div: String(),
            requirement: String(),
            info: String(),
        }
    }
    isEnough()
    {
        return this.enough = !this.always_works ? player[this.required_what].gte(this.requirement) : true;
    }
    updateEffect()
    {
        return this.effect = this.enough ? this.boost() : new Decimal(1);
    }
    setHTML(of_what, value)
    {
        this.html[of_what] = value;
        this.html[of_what].html(`Master level ${abb_abs_int(this.requirement)}`);
    }
    updateHTML()
    {
        if (!this.container()[this.index ? this.index - 1 : 0].isEnough())
        {
            this.html.div.hide();
        }
        else if (this.html.div.is(':hidden')) fs.animateAppearance(this.html.div, true);
        fs.update(this.html.info, this.text());
    }
}