function add_zeros(num, zeros = 1)
{
    let str = num.toString();
    const search = str.search(/[.]/);

    if (search === -1)
    {
        str += ".";
        for (i = 0; i < zeros; ++i)
        {
            str += "0";
        }
    }
    else if (search > -1)
    {
        if (str.length - search > zeros)
        {
            str = str.substr(0, search + zeros + 1);
        }
    }
    
    return str;
}

function floor(num, acc) { return Math.floor(num * 10 ** acc) / 10 ** acc; }

function abb(num, acc = 2, absolute = false) // pretty bad
{
    if (typeof num === 'number') { num = new Decimal(num); }
    if (num instanceof Decimal === false) throw new Error(`The value is not Decimal! The type of your value is ${ typeof num } and your value is ${ num }`);
    if (absolute && num.lt(new Decimal('0e0'))) num = new Decimal('0e0');
    const default_acc = 2,
          postFixes = ['', 'k', 'M', 'B', 'T', 'Qa', 'Qn', 'Sx', 'Sp', 'Oc', 'No'],
          log = num.neq(new Decimal(0)) ? Decimal.abs(num).log(new Decimal('1e3')).abs().floor() : new Decimal(0)
          postFix = postFixes[num.lt(settings.to_exp) ? log.toNumber() : 0]
          numm = num;
    if (postFix != '') { num = num.div(new Decimal('1e3').pow(log)); }
    if (acc === undefined || numm.gte(settings.int_to_float)) { acc = default_acc; }
    let e = new Decimal(num.e);
    if (Decimal.gte(e, new Decimal('1e3')))
    {
        if (Decimal.gte(e, settings.to_exp))
        {
            return ('e' + floor(e, acc)).replace(/[+]/, '');
        }
        let loge = Decimal.abs(e).log(new Decimal('1e3')).abs().floor();
        postFix = postFixes[e.lt(settings.to_exp) ? loge.toNumber() : 0];
        e = e.div(new Decimal('1e3').pow(loge)).toNumber();
        return ('e' + floor(e, acc) + postFix).replace(/[+]/, '');
    }
    let str = numm.gte(settings.to_exp) ? num.toExponential(acc) : num.toFixed(acc);
    return (str + postFix).replace(/[+]/, '');
}

function abb_int(num) { return abb(num, 0); }

function abb_abs(num) { return abb(num, undefined, true); }

function abb_abs_int(num) { return abb(num, 0, true); }

function save()
{
    if (settings.save)
    {
        if (player != getDefaultPlayerValues())
        {
            let Player = {};
            for (const prop in player) Player[prop] = player[prop]
            for (let prop in Player)
            {
                if (Player[prop] instanceof Decimal)
                {
                    Player[prop] = Player[prop].toString();
                }
            }
            localStorage.setItem(settings.game_name, btoa(JSON.stringify(Player)));
            console.log('Succesfully saved')
        }
    }
}
function load()
{
    let data = localStorage.getItem(settings.game_name);
    let isValid = false;
    try { JSON.parse(data); isValid = true } catch { isValid = false; }
    if ( isValid )
    {
        save();
        data = btoa(data);
    }
    if (data)
    {
        data = JSON.parse(atob(data));
        for (let p in data)
        {
            if (data.hasOwnProperty(p))
            {
                if (typeof data[p] === 'string')
                {
                    if (data[p].includes('e') || /\d/.test(data[p]))
                    {
                        const value = new Decimal(data[p]).toNumber();
                        if (value != NaN && value != undefined)
                        {
                            data[p] = new Decimal(data[p]);
                        } 
                        else 
                        {
                            console.warn(`Load value failed: value is ${value} for ${p}`);
                        }
                    }
                }
                if (p === "upgrades")
                {
                    let upgrades = data.upgrades;
                    data.upgrades = player.upgrades;
                    for (let container in data.upgrades)
                    {
                        data.upgrades[container].forEach(function(upgrade, index)
                        {
                            upgrade.bought_times = new Decimal(upgrades[container][index].bought_times);
                        });
                    }
                }
            }
        }
    }
    return data;
}

function loadToPlayer()
{
    let data = load();
    if (data)
    {
        for (let property in data)
        {
            player[property] = data[property];
        }
    }
}

function fixValues()
{
    for (let property in player)
    {
        if (player[property] instanceof Decimal)
        {
            if (player[property].isNan())
            {
                player[property] = new Decimal(0)
            }
        }
    }
}

function setFPS(set)
{
    let thisLoop = new Date();
    let fps = 1e3 / (thisLoop - nosave.lastLoop);
    if (set) nosave.lastLoop = thisLoop;
    thisLoop = undefined; // it's manually deleting, right? or i shouldn't
    return fps;
}

function getLoopIntervalBN()
{
    return settings.update_time_s.times(new Decimal('1e3')).div((
        setFPS(false) == 0 ? new Decimal(setFPS()) : new Decimal('1e0').times(new Decimal('6e1'))));
}
function intervalS() { return getLoopIntervalBN().div(new Decimal('1e3')); }

function getLoopInterval() { return getLoopIntervalBN().toNumber(); }

function numToTime(num)
{
    if (num instanceof Decimal) { num = num.toNumber(); }
    if (typeof num === 'number')
    {
        const array = ['s', 'ms'],
              log = Math.floor(Math.log10(num) / Math.log10(1e3));
        return num / 1e3 ** log + array[array.length - log - 1];
    }
    else
    {
        throw Error(`Your value is not number. The type of value is ${typeof num}`)
    }
}