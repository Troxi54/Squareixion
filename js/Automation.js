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
    isWorking() { return this.work && this.condition(); }
    do()
    {
        if (this.isWorking() && Date.now() >= this.lastLoop + this.rate())
        {
            this.lambda((Date.now() - this.lastLoop) / this.rate());
            this.lastLoop = Date.now();
        }
        else if (!this.isWorking()) {
            this.lastLoop = Date.now();
        }
    }
}