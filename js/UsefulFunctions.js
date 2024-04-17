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
        console.log(player)
        console.log(JSON.stringify(player))
        localStorage.setItem('Data', (JSON.stringify(player)));
    }
}
function load()
{
    let data = localStorage.getItem('Data');
    if (data)
    {
        data = JSON.parse((data));
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
                            console.log(upgrade)
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
    console.log(data)
    if (data)
    {
        console.log('y')
        for (let property in data)
        {
            player[property] = data[property];
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