class Auto {
    constructor(condition = ()=>true, lambda = ()=>{}, rate = ()=>1, work = true)
    {
        this.condition = condition;
        this.lambda = lambda;
        this.rate = rate;
        this.work = work;

        this.lastLoop = 0;

        this.lastLoop = Date.now();
    }
    isWork() { return this.work && this.condition(); }
    do()
    {
        if (this.work && this.condition())
        {
            if (Date.now() >= this.lastLoop + this.rate() * 1e3)
            {
                this.lambda();
                this.lastLoop = Date.now()
            }
        }
    }
}