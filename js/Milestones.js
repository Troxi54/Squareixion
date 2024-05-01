class Milestone {
    constructor (requirement, boost, boosts_what, required_what, text)
    {
        this.requirement = new Decimal(requirement);
        this.boost = boost;
        this.boosts_what = boosts_what;
        this.required_what = required_what;
        this.text = text;

        this.always_works = false;

        this.html = {
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
        this.html[of_what].innerHTML = `Master level ${abb_abs_int(this.requirement)}`;
    }
    updateHTML()
    {
        fs.update(this.html.info, this.text());
    }
}