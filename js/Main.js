function getDefaultPlayerValues()
{
    let Player = {};
    Player.upgrades = {
        prestige_upgrades: [
            new Upgrade(1, 1, '1e0', '4e0', '2e0', 'damage', 'prestige_points'),
            new Upgrade(1, 2, '3e0', '1e1', '4e0', 'damage', 'prestige_points'),
            new Upgrade(1, 3, '5e0', '2.5e1', '8e0', 'damage', 'prestige_points'),
            new Upgrade(1, 4, '5e6', '5e3', '2e0', 'light_points', 'prestige_points'),
            new Upgrade(1, 5, '1e12', '2.5e4', '2e0', 'mini_cubes', 'prestige_points'),
        ],
        light_upgrades: [
            new Upgrade(2, 1, '1e0', '2e0', '2.5e1', 'damage', 'light_points'),
            new Upgrade(2, 2, '1e0', '2e0', '5e0', 'prestige_points', 'light_points'),
            new Upgrade(2, 3, '1e0', '3e0', '2e0', function(){ return `<span class="positive">Autoclicker</span> and <span class="positive">${ abb_abs_int(this.effect_scaling) }x</span> its speed <br><span class="darker-text">Currently: ${this.bought_times.lte(0) ? 'no' : numToTime(floor(this.effect.toNumber() * 1e3, 2))}</span> <br><br><span class="size-125">`; }, 'light_points', 10, function(eff){return new Decimal(settings.autoclickers_start).div(eff).times(this.effect_scaling)}),
            new Upgrade(2, 4, '8e1', '4e0', '3e0', 'mini_cubes', 'light_points'),
        ]
    }
    
    Player.stage = new Decimal('1e0');
    Player.cube_hp = new Decimal('0e0');
    Player.prestige_points = new Decimal('0e0');
    Player.prestige_points_base = new Decimal('2e0');
    Player.light_points = new Decimal('0e0');
    Player.mini_cubes = new Decimal('0e0');
    Player.master_level = new Decimal('0e0');

    
    Player.isUnlocked = {
        prestige: false,
        light: false,
        minicubes: false,
        master: false
    };

    return Player;
}

// setting player values, that was not supposed to be saved {
    nosave.damage_multi = new Decimal('1e0');
    nosave.prestige_points_multi = new Decimal('1e0');
    nosave.light_points_multi = new Decimal('1e0');
    nosave.mini_cubes_multi = new Decimal('1e0');
    nosave.milestones = {
        master_milestones: [
            new Milestone(1, function(){ return Decimal.pow(5, player.master_level); }, 'prestige_points', 'master_level', function() { return `Multiplies your ${fs.abbCurrency(this.boosts_what)} by ${abb_abs_int(5)} each master level` }),
            new Milestone(2, function(){ return Decimal.pow(2, player.master_level); }, 'light_points', 'master_level', function() { return `Multiplies your ${fs.abbCurrency(this.boosts_what)} by ${abb_abs_int(2)} each master level` }),
            new Milestone(3, function(){ return Decimal.pow('3.5e2', player.master_level); }, 'damage', 'master_level', function() { return `Multiplies your ${fs.abbCurrency(this.boosts_what)} by ${abb_abs_int(350)} each master level` }),
            new Milestone(4, function(){ return Decimal.pow('2.5e1', player.master_level); }, 'mini_cubes', 'master_level', function() { return `Multiplies your ${fs.abbCurrency(this.boosts_what)} by ${abb_abs_int(25)} each master level and prestige upgrades no longer take ${fs.abbCurrency('prestige_points')}` }),
            new Milestone(5, function(){ return new Decimal(25) }, 'light_points', 'master_level', function() { return `Multiplies your ${fs.abbCurrency(this.boosts_what)} by ${abb_abs_int(10)} and unlock Autobuyer for prestige upgrades` }),
            new Milestone(7, function(){ return player.stage.gte(101) ? Decimal.pow(1.5, Decimal.sub(player.stage, 100)) : 1 }, 'prestige_points', 'master_level', function() { return `<span class="size-75">Multiplies your ${fs.abbCurrency(this.boosts_what)} by ${abb_abs(1.5)} per stage after 100 and generates ${abb_abs_int(Decimal.mul(1, 100))}% of prestige points that can be earned per second</span>` }),
            new Milestone(8, function(){ return 1; }, '-', 'master_level', function() { return `Light upgrades no longer takes ${fs.abbCurrency('light_points')}` }),
            new Milestone(9, function(){ return 1; }, '-', 'master_level', function() { return `Unlock autobuyer for light upgrades` })
        ]
    }

    nosave.Autoclickers = {
        'cube_autoclicker' : new Auto(
            function() { return player.upgrades.light_upgrades[2].bought_times.gte(1); }, 
            function(){gameFunctions.damageCube();}, 
            function(){ return player.upgrades.light_upgrades[2].effect.toNumber(); }),
        'prestige_upgrades_nocost' : new Auto(()=>nosave.milestones.master_milestones[3].enough, function(){player.upgrades.prestige_upgrades.forEach(upgr=>upgr.takes_currency = false)}, ()=>getLoopInterval() / 1e3),
        'prestige_upgrades_autobuyer' : new Auto(()=>nosave.milestones.master_milestones[4].enough, function(){player.upgrades.prestige_upgrades.forEach(upgr=>upgr.buy_max())}, ()=>getLoopInterval() / 1e3),
        'prestige_generator' : new Auto(()=>nosave.milestones.master_milestones[5].enough, function(){changeValue('prestige_points', player.prestige_points.plus(get.prestige_points.div(getLoopInterval())))}, ()=>getLoopInterval() / 1e3),
        'light_upgrades_nocost' : new Auto(()=>nosave.milestones.master_milestones[6].enough, function(){player.upgrades.light_upgrades.forEach(upgr=>upgr.takes_currency = false)}, ()=>getLoopInterval() / 1e3),
        'light_upgrades_autobuyer' : new Auto(()=>nosave.milestones.master_milestones[7].enough, function(){player.upgrades.light_upgrades.forEach(upgr=>upgr.buy_max())}, ()=>getLoopInterval() / 1e3),
    };
    nosave.hi = 5;

    nosave.lastLoop = Date.now();
    nosave.lastSave = Date.now();
//}

function changeValue(name, value)
{
    player[name] = value;
    if (name === "prestige_points") { updates.prestigeAmount(); updates.prestigeUpgrades(); }
    if (name === "light_points") { updates.lightAmount(); updates.lightUpgrades(); }
    if (name === 'mini_cubes') { get.updateMiniCubePPEffect(); get.updateMiniCubeLPEffect(); updates.miniCubesInfo(); }
    if (name === 'master_level') { get.updateMasterRequirement(); get.updateMasterMilestonesValues(); updates.masterButtonInfo(); updates.masterAmount(); }
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

            updates.masterButtonInfo();

            get.updateDamage();

            updates.cubeInfo();
        }
    },
    setUpgradesHTML()
    {
        const containers = document.getElementsByClassName('upgrades-container');

        for (let container of containers)
        {
            const upgr_cont = (container.id === "prestige-upgrades-container" ? player.upgrades.prestige_upgrades : player.upgrades.light_upgrades);
            for (let i = 0; i < container.getElementsByTagName('button').length; i+=1)
            {
                const upgrade = container.getElementsByTagName('button')[i];
                upgr_cont[i].upgrade_html.name = upgrade.getElementsByClassName('upgrade-name')[0];
                upgr_cont[i].upgrade_html.info = upgrade.getElementsByClassName('upgrade-info')[0];
                upgr_cont[i].upgrade_html.cost = upgrade.getElementsByClassName('upgrade-cost')[0];
                upgr_cont[i].upgrade_html.button = upgrade;
                upgrade.addEventListener("click", function(event)
                {
                    upgr_cont[i].buy_max();
                })
                upgrade.addEventListener("contextmenu", function(e)
                {
                    upgrade.blur();
                    e.preventDefault();
                    upgr_cont[i].buy();
                })
            }
        }
    },
    setMilestonesHTML()
    {
        const containers = document.getElementsByClassName('milestone-container');

        for (let container of containers)
        {
            const milest_cont = (container.id === "master-milestones-container" ? nosave.milestones.master_milestones : []);
            for (let i = 0; i < container.getElementsByTagName('div').length; i+=1)
            {
                const milestone = container.getElementsByTagName('div')[i];
                milest_cont[i].setHTML('requirement', milestone.getElementsByClassName('milestone-requirement')[0]);
                milest_cont[i].html.info = milestone.getElementsByClassName('milestone-info')[0];
            }
        }
    },
    abbCurrency(currencyName)
    {
        const array = {
            'damage' : 'damage',
            'prestige_points' : 'PP',
            'light_points' : 'LP',
            'mini_cubes' : 'MS'
        }
        return array[currencyName];
    },
    upgradesEffect(currencyName)
    {
        let effect = new Decimal('1e0');
        
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
    },
    milestonesEffect(currencyName)
    {
        let effect = new Decimal('1e0');
        
        for (const cont in nosave.milestones)
        {
            nosave.milestones[cont].forEach(function(milestone)
            {
                if (milestone.enough && milestone.boosts_what === currencyName)
                {
                    effect = effect.times(milestone.effect);
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
            const index = Math.floor((player.stage.toNumber() - 1) / settings.cube_name_postfixes.length);
            this.cube_stat = cubes[index < cubes.length - 1 ? index : cubes.length - 1];

            
            this.cube_total_hp = gameFunctions.getCubeHP(new Decimal('0e0'));
            this.cube_name = gameFunctions.getCubeName(player.stage);
            this.cube_style = gameFunctions.getCubeStyleName(player.stage);
        },
        cube_stat: new Cube(),
        cube_total_hp: new Decimal('0e0'),
        cube_name: "",
        cube_style: "",

        updateDamage()
        {
            this.damage = nosave.damage_multi.times(fs.upgradesEffect('damage'))
                                             .times(fs.milestonesEffect('damage'));
        },
        damage: new Decimal('0e0'),

        updatePrestigePoints()
        {
            this.prestige_points = new Decimal(+player.stage.gte(unlocks.prestige))
                                                                    .times(nosave.prestige_points_multi
                                                                    .times(player.prestige_points_base.pow(player.stage.minus(unlocks.prestige))))
                                                                    .times(get.mc_pp)
                                                                    .times(fs.upgradesEffect('prestige_points'))
                                                                    .times(fs.milestonesEffect('prestige_points'));;
        },
        prestige_points: new Decimal('0e0'),

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
            this.light_points = new Decimal(+player.stage.gte(unlocks.light))
                                                            .times(nosave.light_points_multi)
                                                            .times(get.mc_lp)
                                                            .times(fs.upgradesEffect('light_points'))
                                                            .times(fs.milestonesEffect('light_points'));;
        },
        light_points: new Decimal('0e0'),

        updateLightUpgradesValues()
        {
            player.upgrades.light_upgrades.forEach((upgrade) => 
            {
                upgrade.updateCost();
                upgrade.updateEffect();
            });
        },

        updateMiniCube()
        {
            this.mini_cubes = nosave.mini_cubes_multi
                                                .times(fs.upgradesEffect('mini_cubes'))
                                                .times(fs.milestonesEffect('mini_cubes'));;
        },
        mini_cubes: new Decimal('0e0'),

        updateMiniCubePPEffect()
        {
            const pp = new Decimal('2.75e0');
            this.mc_pp = pp.pow(pp.pow(new Decimal('1e0').plus(player.mini_cubes).log10()).log10());
        },
        mc_pp: new Decimal('1e0'),

        updateMiniCubeLPEffect()
        {
            const lp = new Decimal('2.05e0');
            this.mc_lp = lp.pow(lp.pow(new Decimal('1e0').plus(player.mini_cubes).log10()).log10());
        },
        mc_lp: new Decimal('1e0'),

        updateMasterRequirement()
        {
            this.master_requirement = unlocks.master.plus(Decimal.times(10, player.master_level).times(Decimal.plus(1, player.master_level.gt(0) ? player.master_level.log(2) : 0)));
        },
        master_requirement: new Decimal(0),

        updateMasterMilestonesValues()
        {
            nosave.milestones.master_milestones.forEach((milestone) => 
            {
                milestone.isEnough();
                milestone.updateEffect();
            })
        },

        updateAll()
        {
            this.updateCubeStat()
            this.updateDamage();
            this.updatePrestigePoints();
            this.updatePrestigeUpgradesValues();
            this.updateLightPoints();
            this.updateLightUpgradesValues();
            this.updateMiniCube();
            this.updateMiniCubePPEffect();
            this.updateMiniCubeLPEffect();
            this.updateMasterRequirement();
            this.updateMasterMilestonesValues();
        }
    },
    updates: {  // update HTML
        stage()
        {
            fs.update(elements.stage, `<span class="darker-text">Stage:</span> ${ abb_abs_int(player.stage) }`);
        },
        master()
        {
            fs.update(elements.master, `<span class="master">Master level:</span> ${ abb_abs_int(player.master_level) }`);
        },
        cubeInfo()
        {
            fs.update(elements.cube_info, `<span class="white-text">Rank: </span><span class="cube-text ${ get.cube_style + settings.cube_text_plus_style }">${ get.cube_name }</span><br>
                                           <span class="white-text">HP: ${ abb_abs(player.cube_hp) }/${ abb_abs(get.cube_total_hp) } </span><br>
                                           <span class="damage">Damage:</span> ${ abb(get.damage) }`);
            this.stage();
        },
        prestigeButtonInfo()
        {
            fs.update(elements.prestige_button_text, get.prestige_points.lte(new Decimal('0e0')) ? `Square required: <span class="cube-text ${ gameFunctions.getFullCubeStyleName(unlocks.prestige) }">
                                                                                                                              ${gameFunctions.getCubeName(unlocks.prestige)}</span>`
                                                                    : `You can earn <span class="prestige">${ abb_abs(get.prestige_points) }</span> prestige points`);
            if (get.prestige_points.lte(new Decimal('0e0'))) { elements.prestige_button_text.classList.add('layer-button-text-cannot'); elements.prestige_button.classList.add('button-cannot'); }
            else { elements.prestige_button_text.classList.remove('layer-button-text-cannot'); elements.prestige_button.classList.remove('button-cannot'); }
        },
        prestigeAmount()
        {
            fs.update(elements.prestige_points_amount, `<span class="prestige">Prestige points: </span>${ abb_abs(player.prestige_points) }` + 
                                                        (nosave.Autoclickers.prestige_generator.isWork() ? `<br><span class="darker-text">(+${ abb(get.prestige_points) }/sec)</span>` : ``));
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
            fs.update(elements.light_button_text, get.light_points.lte(new Decimal('0e0')) ? `Square required: <span class="cube-text ${ gameFunctions.getFullCubeStyleName(unlocks.light) }">
                                                                                                                                      ${gameFunctions.getCubeName(unlocks.light)}</span>`
                                                                                           : `You can earn <span class="light">${ abb_abs(get.light_points) }</span> light points`);
            if (get.light_points.lte(new Decimal('0e0'))) { elements.light_button_text.classList.add('layer-button-text-cannot'); elements.light_button.classList.add('button-cannot'); }
            else { elements.light_button_text.classList.remove('layer-button-text-cannot'); elements.light_button.classList.remove('button-cannot'); }
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
        miniCubesInfo()
        {
            fs.update(elements.minicube_info, `<span class="darker-text">Mini squares: </span>${ abb_abs(player.mini_cubes) }<br>
                                               ${ abb_abs(get.mc_pp) }x <span class="prestige">prestige points</span><br>
                                               ${ abb_abs(get.mc_lp) }x <span class="light">light points</span>`);
        },
        masterButtonInfo()
        {
            fs.update(elements.master_button_text, player.stage.lte(get.master_requirement) ? `Square required:
                                                                      ${gameFunctions.getCubeName(get.master_requirement)}`
                                                                     : `You can increase master level`);
            if (player.stage.lte(get.master_requirement)) { elements.master_button_text.classList.add('layer-button-text-cannot'); elements.master_button.classList.add('button-cannot'); }
            else { elements.master_button_text.classList.remove('layer-button-text-cannot'); elements.master_button.classList.remove('button-cannot'); }
        },
        masterAmount()
        {
            fs.update(elements.master_text, `Master level: ${player.master_level}`);
        },
        masterMilestones()
        {
            nosave.milestones.master_milestones.forEach((milestone) =>
            {
                milestone.updateHTML();
            })
        },
        updateAll()
        {
            this.stage();
            this.master();
            this.cubeInfo();
            this.prestigeButtonInfo();
            this.prestigeAmount();
            this.prestigeUpgrades();
            this.lightButtonInfo();
            this.lightAmount();
            this.lightUpgrades();
            this.miniCubesInfo();
            this.masterMilestones();
            this.masterButtonInfo();
            this.masterAmount();
        }
    },
    buys: {
    },
    add_events() {
        elements.cube.addEventListener('click', function()
        {
            gameFunctions.damageCube();
        })
        elements.cube.addEventListener('contextmenu', function(e)
        {
            elements.cube.blur();
            e.preventDefault();
            gameFunctions.damageCube();
        })
        elements.cube.addEventListener('mousedown', ()=>events.isCubeHeld = true); elements.cube.addEventListener('touchstart', ()=>events.isCubeHeld = true);
        document.body.addEventListener('mouseup', ()=>events.isCubeHeld = false); document.body.addEventListener('touchend', ()=>events.isCubeHeld = false);
        document.body.addEventListener('mouseleave', ()=>events.isCubeHeld = false);

        elements.prestige_button.addEventListener('click', function()
        {
            gameFunctions.prestige();
        })
        document.addEventListener('keyup', (k)=>{ if (k.key === hotkeys.prestige) gameFunctions.prestige(); });

        elements.light_button.addEventListener('click', function()
        {
           gameFunctions.light();
        })
        document.addEventListener('keyup', (k)=>{if (k.key === hotkeys.light) gameFunctions.light(); });
        
        
        elements.master_button.addEventListener('click', function()
        {
            gameFunctions.master();
        })
        document.addEventListener('keyup', (k)=>{ if (k.key === hotkeys.master) gameFunctions.master(); })
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
            player.stage = new Decimal('1e0');
            gameFunctions.updateCubePart();
            gameFunctions.spawnCube();
        },
        getCubeSize(stage = player.stage)
        {
            return size = settings.cube_size_start * (1 + stage.log(new Decimal('1e2')).toNumber());
        },
        getCubeHP(stage)
        {
            stage = player.stage.plus(stage);
            let hp = new Decimal(hps[stage.toNumber() < hps.length ? stage.toNumber() - 1 : hps.length - 1]);
            if (stage.gt(hps.length))
            {
                hps_scalings.forEach(function(scaling, index)
                {
                    const els = () => { if (stage.gte(new Decimal(scaling[0])))
                                        {
                                            hp = hp.times(new Decimal(scaling[1]).pow(stage.minus(new Decimal(scaling[0]))));
                                        } 
                                      }
                    if (index < hps_scalings.length - 1)
                    {
                        if (stage.gte(new Decimal(hps_scalings[index + 1][0])))
                        {
                            hp = hp.times(new Decimal(scaling[1]).pow(
                                                new Decimal(hps_scalings[index + 1][0]).minus(new Decimal(scaling[0]))))
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
            const index = Math.floor((stage.toNumber() - 1) / settings.cube_name_postfixes.length),
                  cube_stat = cubes[index < cubes.length - 1 ? index : cubes.length - 1],
                  st = stage.toNumber(), 
                  postfixes = settings.cube_name_postfixes.length;
            return cube_stat.name + ( stage.gt(cubes.length * postfixes) ? ` ${ abb_abs_int(stage.minus(new Decimal((cubes.length - 1) * postfixes))) }`
                                : settings.cube_name_postfixes[ st - Math.floor((st - 1) / postfixes) * postfixes - 1 ] );
        },
        getCubeStyleName(stage)
        {
            const index = Math.floor(stage.minus(1).div(settings.cube_name_postfixes.length).toNumber()),
                  cube_stat = cubes[index < cubes.length - 1 ? index : cubes.length - 1];
            return cube_stat.name.toLowerCase().replace(/ /g, '-');
        },
        getFullCubeStyleName(stage)
        {
            return this.getCubeStyleName(stage) + settings.cube_text_plus_style;
        },
        damageCube()
        {
            player.cube_hp = player.cube_hp.minus(get.damage);
            if (player.cube_hp.lte(new Decimal('0e0')))
            {
                let l10 = 0;
                while (get.damage.gte(gameFunctions.getCubeHP(new Decimal('1e1').pow(l10))))++l10;++l10;
                while (--l10 + 1)
                {
                    while(get.damage.gte(gameFunctions.getCubeHP(new Decimal('1e1').pow(l10))))
                    {
                        player.stage = player.stage.plus(new Decimal('1e1').pow(l10));
                    }
                }
                player.stage = player.stage.plus(1)
                get.updateCubeStat();
                gameFunctions.updatePrestigePart();
                gameFunctions.updateLightPart();
                updates.masterButtonInfo();
                gameFunctions.spawnCube();
            }
            updates.cubeInfo();
        },
        prestige()
        {
            fs.reset(
                1, 
                () => player.stage.gte(unlocks.prestige),
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
                () => player.stage.gte(unlocks.light),
                function()
                {
                    player.isUnlocked.light = true;
                    changeValue('light_points', player.light_points.plus(get.light_points));
                    player.upgrades.prestige_upgrades.forEach(function(upgr, index)
                    {
                       upgr.setBoughtTimes(new Decimal('0e0'));
                    });
                    changeValue('prestige_points', new Decimal('0e0'));
                    
                    gameFunctions.resetCube();
                }
            );
        },
        master()
        {
            fs.reset(
                3, 
                () => player.stage.gte(get.master_requirement),
                function()
                {
                    player.isUnlocked.master = true;
                    changeValue('master_level', player.master_level.plus(1));
                    player.upgrades.prestige_upgrades.forEach(function(upgr)
                    {
                       upgr.setBoughtTimes(new Decimal('0e0'));
                    });
                    player.upgrades.light_upgrades.forEach(function(upgr)
                    {
                       upgr.setBoughtTimes(new Decimal('0e0'));
                    });
                    changeValue('prestige_points', new Decimal('0e0'));
                    changeValue('light_points', new Decimal('0e0'));
                    
                    get.updateMasterMilestonesValues();
                    updates.master();
                    gameFunctions.resetCube();
                }
            );
        },
        miniCube(event, spawnMiniCube)
        {
            changeValue('mini_cubes', player.mini_cubes.plus(get.mini_cubes));
            if (spawnMiniCube)
            {
                const cube = document.createElement('div'),
                      place = elements.minicube_place.getBoundingClientRect(),
                      total_styles = 5;
                let index = get.mini_cubes.plus(1).log(1e3).plus(1).floor();
                    index = get.mini_cubes.gte(new Decimal(1e3).pow(new Decimal(total_styles + 1))) ? total_styles : index.toNumber();
                    

                elements.minicube_place.append(cube);

                cube.classList.add('mini-cube', `mini-cube-${index}`)
                const rect = cube.getBoundingClientRect(), style = getComputedStyle(cube);
                cube.style.left = `${(event.offsetX * 100 - rect.width * 50) / place.width}%`;
                cube.style.top = `${(event.offsetY * 100 - rect.height * 50) / place.height}%`;
                cube.style.opacity = '0';
                setTimeout(function()
                {
                    cube.remove();
                }, (Number(style.transitionDuration.slice(0, -1)) + Number(getComputedStyle(cube).transitionDelay.slice(0, -1))) * 1e3);
            }
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
    for (const auto in nosave.Autoclickers)
    {
        nosave.Autoclickers[auto].do();
    }
    if (Date.now() >= nosave.lastSave + settings.auto_save * 1e3)
    {
        save();
        nosave.lastSave = Date.now();
    }
    if (events.isCubeHeld && player.isUnlocked.light && Date.now() >= times.cubeHold[1] + times.cubeHold[0] * 1e3)
    {
        gameFunctions.damageCube();
        times.cubeHold[1] = Date.now(); 
    }
}

document.addEventListener("DOMContentLoaded", function()
{
    elements = {
        wrapper: document.querySelector('#wrapper'),
        stage: document.querySelector('#stage'),
        master: document.querySelector('#master'),
        cube: document.querySelector('.cube'),
        cube_info: document.querySelector('#cube-info-text'),
        star_container: document.querySelector('#background'),
        prestige_button: document.querySelector('#prestige-button'),
        prestige_button_text: document.querySelector('#prestige-button-text'),
        prestige_points_amount: document.querySelector('#prestige-upgrades-info'),
        prestige_upgrades: document.querySelector('#prestige-upgrades-container').getElementsByTagName('button'),
        light_button: document.querySelector('#light-button'),
        light_button_text: document.querySelector('#light-button-text'),
        light_points_amount: document.querySelector('#light-upgrades-info'),
        minicube_place: document.querySelector('#minicube-place'),
        minicube_info: document.querySelector('#minicube-info'),
        master_button: document.querySelector('#master-button'),
        master_button_text: document.querySelector('#master-button-text'),
        master_text: document.querySelector('#master-milestones-info'),
        master_milestones: document.querySelector('#master-milestones-container').getElementsByTagName('div'),
    };  

    player = getDefaultPlayerValues();
    loadToPlayer();
    


    fs.setUpgradesHTML();
    fs.setMilestonesHTML();

    get.updateAll();
    main_functions.add_events();
    gameFunctions.spawnCube();
    updates.updateAll();

    for (let i = 0; i < settings.star_count; ++i) gameFunctions.spawnStar();

    // place for console logs
    //


    setInterval(mainLoop, getLoopInterval())
});