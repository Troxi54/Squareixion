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

function abb(num, acc, absolute = false)
{
    if (num instanceof BigNumber === false) throw new Error(`The number is not BigNumber! The type is ${ typeof num }`);
    if (absolute && num.lt(BigNumber('0e0'))) num = BigNumber('0e0');
    const default_acc = 2,
          postFixes = ['', 'k', 'M', 'B', 'T', 'Qa', 'Qn', 'Sx', 'Sp', 'Oc', 'No'],
          log = num.log(BigNumber('1e3')).abs().floor()
          postFix = postFixes[num.lt(setting.to_exp) ? log.toNumber() : 0]
          numm = num;
    if (postFix != '') { num = num.div(BigNumber('1e3').topow(log)); }
    if (acc === undefined || numm.ge(setting.int_to_float)) { acc = default_acc } ;
    let str = numm.ge(setting.to_exp) ? num.toExponential(acc) : num.toFixed(acc);
    return (str + postFix).replace(/[+]/, '');
}

function abb_int(num) { return abb(num, 0); }

function abb_abs(num) { return abb(num, undefined, true); }

function abb_abs_int(num) { return abb(num, 0, true); }

function save()
{
    if (setting.save)
    {
        if (player != getDefaultPlayerValues())
        {
            localStorage.setItem(setting.game_name, btoa(JSON.stringify(player)));
        }
            
    }
}
function load()
{
    let data = localStorage.getItem(setting.game_name);
    let isValid = false;
    try { JSON.parse(data); isValid = true } catch { isValid = false; }
    if ( isValid )
    {
        console.log('y')
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
                    if (data[p].includes('e+') || data[p].includes('e-'))
                    {
                        data[p] = BigNumber(data[p]);
                    }
                }
                if (p === "upgrades")
                {
                    let upgrades = player.upgrades;
                    for (let container in upgrades)
                    {
                        upgrades[container].forEach(function(upgrade, index)
                        {
                            upgrade.setBoughtTimes(BigNumber(data['upgrades'][container][index].bought_times));
                        });
                    }
                    data['upgrades'] = upgrades;
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

function getDefaultPlayerValues()
{
    let Player = {};
    Player.upgrades = {
        prestige_upgrades: [
            new Upgrade(1, 1, '1e0', '4e0', '2e0', 'damage', 'prestige_points'),
            new Upgrade(1, 2, '3e0', '1e1', '4e0', 'damage', 'prestige_points'),
            new Upgrade(1, 3, '5e0', '2.5e1', '8e0', 'damage', 'prestige_points'),
            new Upgrade(1, 4, '5e6', '5e3', '2e0', 'light_points', 'prestige_points'),
        ],
        light_upgrades: [
            new Upgrade(2, 1, '1e0', '2e0', '2.5e1', 'damage', 'light_points'),
            new Upgrade(2, 2, '1e0', '2e0', '5e0', 'prestige_points', 'light_points'),
            new Upgrade(2, 3, '1e0', '3e0', '2e0', function(){ return `<span class="positive">Autoclicker</span> and <span class="positive">${ abb_abs_int(this.effect_scaling) }x</span> its speed <br><span class="darker-text">Currently: ${this.bought_times.le(0) ? 'no' : numToTime(this.effect.toNumber() * 1e3)}</span> <br><br><span class="size-125">`; }, 'light_points', 10, function(eff){return BigNumber(setting.autoclickers_start).div(eff).times(this.effect_scaling)}),
        ]
    }
    Player.stage = BigNumber('1e0');
    Player.cube_hp = BigNumber('0e0');
    Player.prestige_points = BigNumber('0e0');
    Player.prestige_points_base = BigNumber('2e0');
    Player.light_points = BigNumber('0e0');

    Player.isUnlocked = {
        prestige: false,
        light: false,
    };

    return Player;
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
    return setting.update_time_s.times(BigNumber('1e3')).div((
        setFPS(false) == 0 ? BigNumber(setFPS()) : BigNumber('1e0').times(BigNumber('6e1'))));
}
function intervalS() { return getLoopIntervalBN().div(BigNumber('1e3')); }

function getLoopInterval() { return getLoopIntervalBN().toNumber(); }

function numToTime(num)
{
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