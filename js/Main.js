// setting player values, that was not supposed to be saved {
    nosave.damage_multi = BigNumber('1e0');
    nosave.prestige_points_multi = BigNumber('1e0');
    nosave.light_points_multi = BigNumber('1e0');

    nosave.lastLoop = Date.now();
    nosave.lastSave = Date.now();
    nosave.autoSaveRate = 10;
//}

function changeValue(name, value)
{
    player[name] = value;
    if (name === "prestige_points") { updates.prestigeAmount(); updates.prestigeUpgrades(); }
    if (name === "light_points") { updates.lightAmount(); updates.lightUpgrades(); }
}

fs = {
    update(element, text)
    {
        element.innerHTML = text;
    },
    reset(tier, condition, lambda)
    {
        if (condition())
        {
            lambda();

            gameFunctions.updatePrestigePart();

            gameFunctions.updateLightPart();

            get.updateDamage();
        }
    },
    setUpgradesHTML()
    {
        const containers = document.getElementsByClassName('upgrades-container');

        for (let container of containers)
        {
            const upgr_cont = container.id === "prestige-upgrades-container" ? player.upgrades.prestige_upgrades : player.upgrades.light_upgrades;
            for (let i = 0; i < container.getElementsByTagName('button').length; i+=1)
            {
                const upgrade = container.getElementsByTagName('button')[i];
                upgr_cont[i].upgrade_html.name = upgrade.getElementsByClassName('upgrade-name')[0];
                upgr_cont[i].upgrade_html.info = upgrade.getElementsByClassName('upgrade-info')[0];
                upgr_cont[i].upgrade_html.cost = upgrade.getElementsByClassName('upgrade-cost')[0];
                upgrade.addEventListener("click", function()
                {
                    upgr_cont[i].buy_max();
                })
            }
        }
    },
    abbCurrency(currencyName)
    {
        const array = {
            'damage' : 'damage',
            'prestige_points' : 'PP',
            'light_points' : 'LP'
        }
        return array[currencyName];
    },
    upgradesEffect(currencyName)
    {
        let effect = BigNumber('1e0');
        
        for (const cont in player.upgrades)
        {
            player.upgrades[cont].forEach(function(upgrade)
            {
                if (upgrade.multiplies_what === currencyName)
                {
                    effect = effect.times(upgrade.effect);
                }
            })
        }
        return effect;
    }
}

main_functions = {
    get: { // Update and get non-player values
        updateCubeStat()
        {
            const index = Math.floor((player.stage.toNumber() - 1) / setting.cube_name_postfixes.length);
            this.cube_stat = cubes[index < cubes.length - 1 ? index : cubes.length - 1];

            
            this.cube_total_hp = gameFunctions.getCubeHP(BigNumber('0e0'));
            this.cube_name = gameFunctions.getCubeName(player.stage);
            this.cube_style = gameFunctions.getCubeStyleName(player.stage);
        },
        cube_stat: new Cube(),
        cube_total_hp: BigNumber('0e0'),
        cube_name: "",
        cube_style: "",

        updateDamage()
        {
            this.damage = nosave.damage_multi.times(fs.upgradesEffect('damage'));
        },
        damage: BigNumber('0e0'),

        updatePrestigePoints()
        {
            this.prestige_points = BigNumber(+player.stage.ge(unlocks.prestige))
                                                                    .times(nosave.prestige_points_multi
                                                                    .times(player.prestige_points_base.topow(player.stage.minus(unlocks.prestige))))
                                                                    .times(fs.upgradesEffect('prestige_points'));
        },
        prestige_points: BigNumber('0e0'),

        updatePrestigeUpgradesValues()
        {
            player.upgrades.prestige_upgrades.forEach((upgrade) => 
            {
                upgrade.updateCost();
                upgrade.updateEffect();
            });
        },

        updateLightPoints()
        {
            this.light_points = BigNumber(+player.stage.ge(unlocks.light)).times(nosave.light_points_multi).times(fs.upgradesEffect('light_points'));
        },
        light_points: BigNumber('0e0'),

        updateLightUpgradesValues()
        {
            player.upgrades.light_upgrades.forEach((upgrade) => 
            {
                upgrade.updateCost();
                upgrade.updateEffect();
            });
        },

        updateAll()
        {
            this.updateCubeStat()
            this.updateDamage();
            this.updatePrestigePoints();
            this.updatePrestigeUpgradesValues();
            this.updateLightPoints();
            this.updateLightUpgradesValues();
        }
    },
    updates: {  // update HTML
        stage()
        {
            fs.update(elements.stage, `<span class="darker-text">Stage:</span> ${ abb_abs_int(player.stage) }`);
        },
        cubeInfo()
        {
            fs.update(elements.cube_info, `<span class="white-text">Rank: </span><span class="cube-text ${ get.cube_style + setting.cube_text_plus_style }">${ get.cube_name }</span><br>
                                           <span class="white-text">HP: ${ abb_abs(player.cube_hp) }/${ abb_abs(get.cube_total_hp) } </span><br>
                                           <span class="damage">Damage:</span> ${ abb(get.damage) }`);
            this.stage();
        },
        prestigeButtonInfo()
        {
            fs.update(elements.prestige_button_text, get.prestige_points.le(BigNumber('0e0')) ? `Required square: <span class=
                                                                                                    "cube-text ${ gameFunctions.getCubeStyleName(unlocks.prestige) + setting.cube_text_plus_style }">
                                                                                                                              ${gameFunctions.getCubeName(unlocks.prestige)}</span>`
                                                                    : `You can earn <span class="prestige">${ abb_abs(get.prestige_points) }</span> prestige points`);
            if (get.prestige_points.le(BigNumber('0e0'))) { elements.prestige_button_text.classList.add('layer-button-text-cannot'); }
            else { elements.prestige_button_text.classList.remove('layer-button-text-cannot'); }
        },
        prestigeAmount()
        {
            fs.update(elements.prestige_points_amount, `<span class="prestige">Prestige points: </span>${ abb_abs(player.prestige_points) }`);
        },
        prestigeUpgrades()
        {
            player.upgrades.prestige_upgrades.forEach((upgrade) =>
            {
                upgrade.updateHTML();
            })
        },
        lightButtonInfo()
        {
            fs.update(elements.light_button_text, get.light_points.le(BigNumber('0e0')) ? `Required square: <span class=
                                                                                              "cube-text ${ gameFunctions.getCubeStyleName(unlocks.light) + setting.cube_text_plus_style }">
                                                                                                                                      ${gameFunctions.getCubeName(unlocks.light)}</span>`
                                                                                           : `You can earn <span class="light">${ abb_abs(get.light_points) }</span> light points`);
            if (get.light_points.le(BigNumber('0e0'))) { elements.light_button_text.classList.add('layer-button-text-cannot'); }
            else { elements.light_button_text.classList.remove('layer-button-text-cannot'); }
        },
        lightAmount()
        {
            fs.update(elements.light_points_amount, `<span class="light">Light points: </span>${ abb_abs(player.light_points) }`);
        },
        lightUpgrades()
        {
            player.upgrades.light_upgrades.forEach((upgrade) =>
            {
                upgrade.updateHTML();
            })
        },
        updateAll()
        {
            this.stage();
            this.cubeInfo();
            this.prestigeButtonInfo();
            this.prestigeAmount();
            this.prestigeUpgrades();
            this.lightButtonInfo();
            this.lightAmount();
            this.lightUpgrades();
        }
    },
    buys: {
    },
    add_events() {
        
        elements.cube.addEventListener('click', function()
        {
            gameFunctions.damageCube();
        })
        elements.cube.addEventListener('mousedown', ()=>events.isCubeHeld = true); elements.cube.addEventListener('touchstart', ()=>events.isCubeHeld = true);
        document.body.addEventListener('mouseup', ()=>events.isCubeHeld = false); document.body.addEventListener('touchend', ()=>events.isCubeHeld = false);
        document.body.addEventListener('mouseleave', ()=>events.isCubeHeld = false);
        elements.prestige_button.addEventListener('click', function()
        {
            gameFunctions.prestige();
        })
        document.addEventListener('keydown', (k)=>{if (k.key === hotkeys.prestige) events.isPrestigeHeld = true}); 
        document.addEventListener('keyup', (k)=>{if (k.key === hotkeys.prestige) events.isPrestigeHeld = false});
        elements.light_button.addEventListener('click', function()
        {
           gameFunctions.light();
        })
        document.addEventListener('keydown', (k)=>{if (k.key === hotkeys.light) events.isLightHeld = true}); 
        document.addEventListener('keyup', (k)=>{if (k.key === hotkeys.light) events.isLightHeld = false});
    },
    gameFunctions: {
        spawnStar()
        {
            let star = document.createElement('div');
            star.classList.add('star');
            const rand = Math.random() * 255;
            star.style.backgroundColor = `rgb(${rand}, ${rand}, ${rand}, .5)`;
            star.style.width = `${rand / 100}px`
            star.style.left = "calc(" + Math.random() * 100 + `%)`;
            star.style.top = "calc(" + Math.random() * 100 + `%)`;
            elements.star_container.append(star);
        },
        spawnCube()
        {
            elements.cube.className = "";
            elements.cube.classList.add('cube');
            
            elements.cube.classList.add(get.cube_style);
            elements.cube.style.width = this.getCubeSize() + 'px';
            player.cube_hp = get.cube_total_hp;

            updates.cubeInfo();
        },
        resetCube()
        {
            player.stage = BigNumber('1e0');
            gameFunctions.updateCubePart();
            gameFunctions.spawnCube();
        },
        getCubeSize(stage = player.stage)
        {
            return size = setting.cube_size_start * (1 + stage.log(BigNumber('1e2')).toNumber());
        },
        getCubeHP(stage)
        {
            stage = player.stage.plus(stage);
            let hp = BigNumber(hps[stage.toNumber() < hps.length ? stage.toNumber() - 1 : hps.length - 1]);
            if (stage.gt(hps.length))
            {
                hps_scalings.forEach(function(scaling, index)
                {
                    const els = () => { if (stage.ge(BigNumber(scaling[0])))
                                        {
                                            hp = hp.times(BigNumber(scaling[1]).topow(stage.minus(BigNumber(scaling[0]))));
                                        } 
                                      }
                    if (index < hps_scalings.length - 1)
                    {
                        if (stage.ge(BigNumber(hps_scalings[index + 1][0])))
                        {
                            hp = hp.times(BigNumber(scaling[1]).topow(
                                                BigNumber(hps_scalings[index + 1][0]).minus(BigNumber(scaling[0]))))
                        }
                        else els();
                    }
                    else els();                                               
                })
            }
            return hp;
        },
        getCubeName(stage)
        {
            const index = Math.floor((stage.toNumber() - 1) / setting.cube_name_postfixes.length),
                  cube_stat = cubes[index < cubes.length - 1 ? index : cubes.length - 1],
                  st = stage.toNumber(), 
                  postfixes = setting.cube_name_postfixes.length;

            return cube_stat.name + ( stage.gt(cubes.length * postfixes) ? ` ${ abb_abs_int(stage.minus(BigNumber((cubes.length - 1) * postfixes))) }`
                                : setting.cube_name_postfixes[ st - Math.floor((st - 1) / postfixes) * postfixes - 1 ] );
        },
        getCubeStyleName(stage)
        {
            const index = Math.floor((stage.toNumber() - 1) / setting.cube_name_postfixes.length),
                  cube_stat = cubes[index < cubes.length - 1 ? index : cubes.length - 1];
            return cube_stat.name.toLowerCase().replace(/ /g, '-');
        },
        damageCube()
        {
            player.cube_hp = player.cube_hp.minus(get.damage);
            if (player.cube_hp.le(BigNumber('0e0')))
            {
                let l10 = 0;
                while (get.damage.ge(gameFunctions.getCubeHP(BigNumber('1e1').topow(l10))))++l10;++l10;
                while (--l10 + 1)
                {
                    while(get.damage.ge(gameFunctions.getCubeHP(BigNumber('1e1').topow(l10))))
                    {
                        player.stage = player.stage.plus(BigNumber('1e1').topow(l10));
                    }
                }
                player.stage = player.stage.plus(1)
                
                get.updateCubeStat();
                gameFunctions.updatePrestigePart();
                gameFunctions.updateLightPart();
                gameFunctions.spawnCube();
            }
            updates.cubeInfo();
        },
        prestige()
        {
            fs.reset(
                1, 
                () => player.stage.ge(unlocks.prestige),
                function()
                {
                    player.isUnlocked.prestige = true;
                    changeValue('prestige_points', player.prestige_points.plus(get.prestige_points));
                    gameFunctions.resetCube();
                }
            );
        },
        light()
        {
            fs.reset(
                2, 
                () => player.stage.ge(unlocks.light),
                function()
                {
                    player.isUnlocked.light = true;
                    changeValue('light_points', player.light_points.plus(get.light_points));
                    player.upgrades.prestige_upgrades.forEach(function(upgr, index)
                    {
                       upgr.setBoughtTimes(BigNumber('0e0'));
                    });
                    changeValue('prestige_points', BigNumber('0e0'));
                    
                    gameFunctions.resetCube();
                }
            );
        },
        updateCubePart()
        {
            get.updateCubeStat();
            updates.cubeInfo();
        },
        updatePrestigePart()
        {
            get.updatePrestigePoints();
            updates.prestigeButtonInfo();
        },
        updateLightPart()
        {
            get.updateLightPoints();
            updates.lightButtonInfo();
        }
    }
};

get = main_functions.get;
updates = main_functions.updates;
buys = main_functions.buys;
gameFunctions = main_functions.gameFunctions;

function mainLoop()
{
    nosave.Autoclickers.forEach((auto)=>{
        auto.do();
    })
    if (Date.now() >= nosave.lastSave + setting.auto_save * 1e3)
    {
        save();
        nosave.lastSave = Date.now();
    }
    if (events.isCubeHeld && player.isUnlocked.light)
    {
        gameFunctions.damageCube();
    }
    if (events.isPrestigeHeld)
    {
        gameFunctions.prestige();
    }
    if (events.isLightHeld)
    {
        gameFunctions.light();
    }
}

document.addEventListener("DOMContentLoaded", function()
{
    elements = {
        wrapper: document.querySelector('#wrapper'),
        stage: document.querySelector('#stage'),
        cube: document.querySelector('.cube'),
        cube_info: document.querySelector('#cube-info-text'),
        star_container: document.querySelector('#background'),
        prestige_button: document.querySelector('#prestige-button'),
        prestige_button_text: document.querySelector('#prestige-button-text'),
        prestige_points_amount: document.querySelector('#prestige-upgrades-info'),
        prestige_upgrades: document.querySelector('#prestige-upgrades-container').getElementsByTagName('button'),
        light_button: document.querySelector('#light-button'),
        light_button_text: document.querySelector('#light-button-text'),
        light_points_amount: document.querySelector('#light-upgrades-info')
    };  
    
    loadToPlayer();

    fs.setUpgradesHTML();

    get.updateAll();
    main_functions.add_events();
    gameFunctions.spawnCube();
    updates.updateAll();

    for (let i = 0; i < setting.star_count; ++i) gameFunctions.spawnStar();

    // place for console logs
    //


    setInterval(mainLoop, getLoopInterval())
});