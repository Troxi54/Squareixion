function restartGame()
{
    get.updateCubeStat();
    gameFunctions.spawnCube(true);
    get.updateAll();
    
    let music = nosave.play_music;
    nosave = {};
    setNosaveValues();
    nosave.play_music = music;

    fs.setUpgradesHTML();
    for (let c in player.upgrades) (player.upgrades[c].forEach(u=>u.upgrade_html.button.show()))
    fs.setMilestonesHTML();
    
    get.updateGcHP();
    gameFunctions.spawnGCube(true);

    fs.update(elements.change_realm_music_text, `Always play normal realm music: ${player.always_play_normal_realm_music ? `yes` : `no`}`);
    fs.update(elements.outside_music_text, `Play music outside the page: ${player.outside_music ? `yes` : `no`}`)

    gameFunctions.hideAndShowContent(false); gameFunctions.hideAndShowContent(false);

    gameFunctions.afkGenerators();
    
}

function floor(num, acc) { return Math.floor(num * 10 ** acc) / 10 ** acc; }

function abb(num, acc = 2, absolute = false)
{
    if (!num && num !== 0) return;
    else if (num instanceof Decimal) if (!num.toNumber() && num.toNumber() !== 0) return;
    if (num instanceof Decimal === false) 
    {
        if (!typeof num === 'number') console.warn(`The value is not Decimal! The type of your value is ${ typeof num } and your value is ${ num }`);
        num = N(num);
    };
    if (absolute && num.lt(N('0e0'))) num = N('0e0');
    // taken and edited from: https://lngi-incremental.glitch.me
    const abbs = ['', 'k', 'M', 'B', 'T', 'Q', 'q', 'S', 's'];
    if (num.eq("0")) {
        return "0";
    } else if (num.lt("1e3")) {
        return num.toNumber().toFixed(acc);
    } else if (num.lt("1e6")) {
        return num.toNumber().toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else if (num.lt(N(1e3).pow(abbs.length))) {
        const log = num.log(1e3).abs().floor();
        const numm = num.div(Decimal.pow(1e3, log));
        return numm.toFixed(3 - +numm.log(10).floor()) + abbs[log.toNumber()];
    } else if(num.lt("ee6"))  {
        let exp = num.log10();
            exp = exp.plus(exp.div(1e9)).floor();
        return num.div(N(10).pow(exp)).toNumber().toFixed(2) + "e" + abb(exp, 0);
    } else {
        return "e" + abb(num.log10(), acc);
    }
    // this causes lags for some reason
    /* else if(num.slog(10).lt(10)) {
        // return "e" + abb(num.log10(), acc);
    } else if(num.slog(10).gte(10)) {
        return "10^^" + abb(num.slog(10), acc);
    } */
}

function abb_int(num) { return abb(num, 0); }

function abb_abs(num) { return abb(num, undefined, true); }

function abb_abs_int(num) { return abb(num, 0, true); }

// taken and edited from: https://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter
function romanize (num) {
    if (num instanceof Decimal)
        num = num.toNumber();
    if (isNaN(num))
        return NaN;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

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
            console.log('Succesfully saved');
        }
    }
}
function load(data = localStorage.getItem(settings.game_name))
{
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
                        const value = N(data[p]).toNumber();
                        if (value != NaN && value != undefined)
                        {
                            data[p] = N(data[p]);
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
                        if (upgrades[container] !== undefined)
                        {
                            data.upgrades[container].forEach(function(upgrade, index)
                            {
                                if (upgrades[container][index] !== undefined) 
                                    upgrade.bought_times = N(upgrades[container][index].bought_times);
                            });
                        }
                    }
                }
                if (p === "isUnlocked")
                {
                    let ie = data.isUnlocked;
                    data.isUnlocked = player.isUnlocked;
                    for (let container in data.isUnlocked)
                    {
                        if (ie[container] !== undefined)
                        {
                            data.isUnlocked[container] = ie[container];
                        }
                    }
                }
            }
        }
    }
    return data;
}

function loadToPlayer(data_)
{
    let data = load(data_);
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
                player[property] = N(0)
            }
        }
    }
    for (let cont in player.upgrades) {
        player.upgrades[cont].forEach(function(upg){
            if (upg.bought_times.gt(upg.buyable_times)) upg.bought_times = upg.buyable_times;
        })
    }
}

/* function setFPS()
{
    let thisLoop = new Date();
    let fps = (thisLoop - nosave.lastLoop);
    nosave.lastLoop = thisLoop;
    settings.fps = fps;
    thisLoop = undefined; // it's manually deleting, right? or i shouldn't
    return fps;
} */

function getLoopInterval()
{
    return 1e3 / settings.fps;
}

function numToTime(num)
{
    if (num instanceof Decimal === false) { num = N(num); }
    const array = ['d', 'h', 'm', 's', 'ms', 'μs', 'ns'],
          second = array.indexOf('s');
    let index = second;
    if (num.gte(1)) {
        let divider = 1;
        if (num.gte(60)) { 
            index--; 
            divider = 60;
        }
        if (num.gte(3600)) {
            index--; 
            divider = 3600;
        }
        if (num.gte(86400)) {
             index--; 
             divider = 86400;
        }
        num = num.div(divider);
    }
    else if (num.lt(1)) {
        let log = num.log(1e3).abs().floor().plus(1);
        //if (JSON.parse(log) === JSON.parse(log.ceil())) log = log;
        index = second + +log;
        if (index >= array.length) index = array.length - 1;
        num = num.times(Decimal.pow(1e3, log.min(array.length - second)));
        if (num.eq(1e3)) {
            num = num.div(1e3); 
            index--;
        }
    }
    return abb_abs(num) + array[index];
}
let textFile = null,
    makeTextFile = function(text) 
    {
        var data = new Blob([text], {type: 'text/plain'});
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }

        textFile = window.URL.createObjectURL(data);

        return textFile;
    },
    downloadFile = function(text, filename)
    {
        const link = document.createElement('a')

        link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
        link.setAttribute('download', filename || 'data.json')
        link.style.display = 'none'

        document.body.appendChild(link)

        link.click()

        document.body.removeChild(link)
        link.remove();
    }

function openFileExplorer() 
{
    document.getElementById('import-file-input').click();
}
let file;
function handleFileSelection(event) 
{
    const selectedFiles = event.target.files,
          file = selectedFiles[0];
    if (!!file) {
        if (file.type === 'text/plain')
        {
            selectedFiles[0].text().then((t) => 
            { 
                player = {};
                player = getDefaultPlayerValues();
                loadToPlayer(t);
                restartGame();
            });
        }
        else console.warn('Your save file is invalid')
    }
    
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
 
// taken from: https://www.delftstack.com/howto/javascript/javascript-random-seed-to-generate-random/
// {
function MurmurHash3(string) {
    let i = 0;
    for (i, hash = 1779033703 ^ string.length; i < string.length; i++) {
      let bitwise_xor_from_character = hash ^ string.charCodeAt(i);
      hash = Math.imul(bitwise_xor_from_character, 3432918353);
      hash = hash << 13 | hash >>> 19;
    }
    return () => {
      // Return the hash that you can use as a seed
      hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
      hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
      return (hash ^= hash >>> 16) >>> 0;
    }
  }
  
  function SimpleFastCounter32(seed_1, seed_2, seed_3, seed_4) {
    return () => {
      seed_1 >>>= 0;
      seed_2 >>>= 0;
      seed_3 >>>= 0;
      seed_4 >>>= 0;
      let cast32 = (seed_1 + seed_2) | 0;
      seed_1 = seed_2 ^ seed_2 >>> 9;
      seed_2 = seed_3 + (seed_3 << 3) | 0;
      seed_3 = (seed_3 << 21 | seed_3 >>> 11);
      seed_4 = seed_4 + 1 | 0;
      cast32 = cast32 + seed_4 | 0;
      seed_3 = seed_3 + cast32 | 0;
      return (cast32 >>> 0) / 4294967296;
    }
  }
  // }

  function Round(num, acc = 4)
  {
    return num.plus(num.div(Decimal.pow(10, acc).round())).floor();
  }

  function isCharNumber(c) {
    return typeof c === 'string' && c.length === 1 && c >= '0' && c <= '9';
  }