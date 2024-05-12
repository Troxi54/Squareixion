function changeValue(name, value)
{
    player[name] = value;
    if (name === "prestige_points") { updates.prestigeAmount(); updates.prestigeUpgrades(); }
    if (name === "light_points") { updates.lightAmount(); updates.lightUpgrades(); }
    if (name === 'mini_cubes') 
    { 
        get.updateMiniCubePPEffect(); get.updatePrestigePoints(); updates.prestigeButtonInfo();
        get.updateMiniCubeLPEffect(); get.updateLightPoints(); updates.lightButtonInfo();
        updates.miniCubesInfo();
     }
    if (name === 'master_level') { get.updateMasterRequirement(); get.updateMasterMilestonesValues(); updates.masterMilestones(); updates.masterButtonInfo(); updates.masterAmount(); }
}

fs = {
    update(element, text)
    {
        element.html(text);
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

            gameFunctions.hideAndShowContent();
        }
    },
    setUpgradesHTML()
    {
        const containers = $('.upgrades-container');

        for (let container of containers)
        {
            const upgr_cont = (container.id === "prestige-upgrades-container" ? player.upgrades.prestige_upgrades : player.upgrades.light_upgrades);
            container = $(container)
            
            for (let i = 0; i < container.children('button').length; i+=1)
            {
                const upgrade = $(container.children('button')[i]);
                
                upgr_cont[i].upgrade_html.name = $(upgrade.children('.upgrade-name')[0]);
                upgr_cont[i].upgrade_html.info = $(upgrade.children('.upgrade-info')[0]);
                upgr_cont[i].upgrade_html.cost = $(upgrade.children('.upgrade-cost')[0]);
                upgr_cont[i].upgrade_html.button = upgrade;
                upgrade.on("click", function()
                {
                    upgr_cont[i].buy_max();
                })
                upgrade.on("contextmenu", function(e)
                {
                    if (e.cancelable)
                    {
                        upgrade.blur();
                        e.preventDefault();
                    }
                         
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
            container = $(container);
            for (let i = 0; i < container.children('div').length; i+=1)
            {
                const milestone = $(container.children('div')[i]);
                milest_cont[i].html.div = milestone;
                milest_cont[i].setHTML('requirement', $(milestone.children('.milestone-requirement')[0]));
                milest_cont[i].html.info = $(milestone.children('.milestone-info')[0]);
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
    },
    animateAppearance(element, animate = true, duration = settings.unlock_content_transition)
    {
        element.css('opacity', '0');
        element.show();
        if (animate) element.animate({'opacity': '1'}, duration);
        else element.css('opacity', '1');
    },
    animateDisappearance(element, animate = true, duration = settings.unlock_content_transition)
    {
        element.css('opacity', '1');
        if (animate) element.animate({'opacity': '0'}, duration);
        else element.css('opacity', '0');
        setTimeout(()=>{ element.hide(); }, duration);
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
        damage: new Decimal('1e0'),

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
            this.master_requirement = unlocks.master.plus(Decimal.times(10, player.master_level).times(Decimal.plus(1, player.master_level.gt(0) ? player.master_level.log(4) : 0)));
        },
        master_requirement: new Decimal(Infinity),

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
            this.updateCubeStat();
            this.updateMasterRequirement();
            this.updateMasterMilestonesValues();
            this.updateMiniCube();
            this.updateMiniCubePPEffect();
            this.updateMiniCubeLPEffect();
            this.updatePrestigeUpgradesValues();
            this.updateLightUpgradesValues();
            this.updatePrestigePoints();
            this.updateLightPoints();
            this.updateDamage();
        }
    },
    updates: {  // update HTML
        version()
        {
            fs.update(elements.version, `<span class="white-text">v${settings.game_version[0]}.${settings.game_version[1]}${settings.game_version[2] ? '.' + settings.game_version[2] : ''}${settings.game_version[3] ? '.' + settings.game_version[3] : ''}</span>`);
        },
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
        prestigeLockedInfo()
        {
            fs.update(elements.prestige_locked_info, `Square required: <span class="cube-text ${ gameFunctions.getFullCubeStyleName(unlocks.prestige) }"> ${gameFunctions.getCubeName(unlocks.prestige)}</span> `);
        },
        prestigeButtonInfo()
        {
            fs.update(elements.prestige_button_text, get.prestige_points.lte(new Decimal('0e0')) ? `Square required: <span class="cube-text ${ gameFunctions.getFullCubeStyleName(unlocks.prestige) }">
                                                                                                                              ${gameFunctions.getCubeName(unlocks.prestige)}</span>`
                                                                    : `You can earn <span class="prestige">${ abb_abs(get.prestige_points) }</span> prestige points`);
            if (get.prestige_points.lte(new Decimal('0e0'))) { elements.prestige_button_text.addClass('layer-button-text-cannot'); elements.prestige_button.addClass('button-cannot'); }
            else { elements.prestige_button_text.removeClass('layer-button-text-cannot'); elements.prestige_button.removeClass('button-cannot'); }
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
        lightLockedInfo()
        {
            fs.update(elements.light_locked_info, `Square required: <span class="cube-text ${ gameFunctions.getFullCubeStyleName(unlocks.light) }"> ${gameFunctions.getCubeName(unlocks.light)}</span> `);
        },
        lightButtonInfo()
        {
            fs.update(elements.light_button_text, get.light_points.lte(new Decimal('0e0')) ? `Square required: <span class="cube-text ${ gameFunctions.getFullCubeStyleName(unlocks.light) }">
                                                                                                                                      ${gameFunctions.getCubeName(unlocks.light)}</span>`
                                                                                           : `You can earn <span class="light">${ abb_abs(get.light_points) }</span> light points`);
            if (get.light_points.lte(new Decimal('0e0'))) { elements.light_button_text.addClass('layer-button-text-cannot'); elements.light_button.addClass('button-cannot'); }
            else { elements.light_button_text.removeClass('layer-button-text-cannot'); elements.light_button.removeClass('button-cannot'); }
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
        minicubesLockedInfo()
        {
            fs.update(elements.minicube_locked_info, `Square required: <span class="cube-text ${ gameFunctions.getFullCubeStyleName(unlocks.mini_cubes) }"> ${gameFunctions.getCubeName(unlocks.mini_cubes)}</span> `);
        },
        miniCubesInfo()
        {
            fs.update(elements.minicube_info, `<span class="darker-text">Mini squares: </span>${ abb_abs(player.mini_cubes) }<br>
                                               ${ abb_abs(get.mc_pp) }x <span class="prestige">prestige points</span><br>
                                               ${ abb_abs(get.mc_lp) }x <span class="light">light points</span>`);
        },
        masterLockedInfo()
        {
            fs.update(elements.master_locked_info, `Square required: <span class="cube-text ${ gameFunctions.getFullCubeStyleName(unlocks.master) }"> ${gameFunctions.getCubeName(unlocks.master)}</span> `);
        },
        masterButtonInfo()
        {
            fs.update(elements.master_button_text, player.stage.lte(get.master_requirement) ? `Square required:
                                                                      ${gameFunctions.getCubeName(get.master_requirement)}`
                                                                     : `You can increase master level`);
            if (player.stage.lte(get.master_requirement)) { elements.master_button_text.addClass('layer-button-text-cannot'); elements.master_button.addClass('button-cannot'); }
            else { elements.master_button_text.removeClass('layer-button-text-cannot'); elements.master_button.removeClass('button-cannot'); }
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
            this.version();
            this.stage();
            this.master();
            this.cubeInfo();
            this.prestigeLockedInfo();
            this.prestigeButtonInfo();
            this.prestigeAmount();
            this.prestigeUpgrades();
            this.lightLockedInfo();
            this.lightButtonInfo();
            this.lightAmount();
            this.lightUpgrades();
            this.minicubesLockedInfo();
            this.miniCubesInfo();
            this.masterLockedInfo();
            this.masterMilestones();
            this.masterButtonInfo();
            this.masterAmount();
        }
    },
    buys: {
    },
    add_events() {
        elements.settings_button.on('click', function()
        {
            if (!nosave.settingsVisible) elements.settings.show();
            else elements.settings.hide();
            nosave.settingsVisible =! nosave.settingsVisible;
        })

        elements.save.on('click', function()
        {
            save();
            nosave.lastSave = Date.now();
        });

        elements.export_text.on('click', function()
        {
            const save = localStorage.getItem(settings.game_name);
            navigator.clipboard.writeText(save);
        })

        elements.export_file.on('click', function()
        {
            const save = localStorage.getItem(settings.game_name);
            downloadFile(save, settings.savefile_name);
        })

        elements.import_text.on('click', function()
        {
            const text = prompt('Paste your text here. Your current save will be overwritten.');
            if (text)
            {
                loadToPlayer(text);
                restartGame();
            }
        })

        elements.import_file.on('click', openFileExplorer);

        elements.reset_cube.on('click', function()
        {
            gameFunctions.resetCube();
        })

        elements.reset.on('click', function()
        {
            const text = prompt('This will delete all of your progress. Type in "Yes" to confirm');
            if (text === 'Yes')
            {
                loadToPlayer(btoa(JSON.stringify(getDefaultPlayerValues())));
                restartGame();
            }
        })

        elements.change_star_count.on('click', function()
        {
            const text = prompt(`Type in how many stars you want to see in the background (minimum: ${settings.star_min}, maximum: ${settings.star_max}, default: ${settings.star_count})`),
                  number = Number(text);
            if (text !== null && number !== NaN)
            {
                if (number >= settings.star_min && number <= settings.star_max)
                {
                    elements.star_context.clearRect(0, 0, elements.star_container[0].clientWidth, elements.star_container[0].clientHeight)
                    gameFunctions.spawnStars(number)
                }
            }
        })

        elements.discord.on('click', function()
        {
            window.open('https://discord.gg/YT8R2szHXX');
        })

        elements.cube.on('click', function()
        {
            gameFunctions.damageCube();
        })
        elements.cube.on('contextmenu', function(e)
        {
            if (e.cancelable)
            {
                elements.cube.blur();
                e.preventDefault();
            }
            gameFunctions.damageCube();
        })
        elements.cube.on('mousedown', function(){ events.isCubeHeld = true; }); elements.cube.on('touchstart', function(){ events.isCubeHeld = true; });
        $(document.body).on('mouseup', function(){ events.isCubeHeld = false; }); $(document.body).on('touchend', function(){ events.isCubeHeld = false; });
        $(document.body).on('mouseleave', function(){ events.isCubeHeld = false; });

        elements.prestige_button.on('click', gameFunctions.prestige);
        elements.light_button.on('click', gameFunctions.light);
        elements.master_button.on('click', gameFunctions.master);

        $(document).on('keyup', function(k)
        {
            switch (k.key)
            {
                case hotkeys.prestige:
                    gameFunctions.prestige();
                    break;
                case hotkeys.light:
                    gameFunctions.light();
                    break;
                case hotkeys.master:
                    gameFunctions.master();
                    break;
            }
        });
    },
    
    gameFunctions: {
        starCanvas()
        {
            elements.star_container[0].width = elements.star_container[0].clientWidth;
            elements.star_container[0].height = elements.star_container[0].clientHeight;
        },
        spawnStar()
        {
            const rand = Math.random() * 255,
                  color = `rgb(${rand}, ${rand}, ${rand}, .5)`,
                  size = rand / 255,
                  left = Math.random() * elements.star_container[0].clientWidth,
                  top = Math.random() * elements.star_container[0].clientHeight;
            elements.star_context.fillStyle = color;
            elements.star_context.strokeStyle = color;
            elements.star_context.fillRect(left, top, size, size);
            elements.star_context.strokeRect(left, top, size, size);
        },
        spawnStars(count)
        {
            for (let i = 0; i < count; i+=1)
            {
                this.spawnStar();
            }
        },
        spawnCube(setHP = true)
        {
            elements.cube.removeClass();
            elements.cube.addClass('cube');
            
            elements.cube.addClass(get.cube_style);
            elements.cube.css('width', this.getCubeSize() + 'px');
            if (setHP) player.cube_hp = get.cube_total_hp;

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
                    const els = function(){ if (stage.gte(new Decimal(scaling[0])))
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
                player.stage = player.stage.plus(1);
                if (player.stage.gte(unlocks.prestige)) player.isUnlocked.prestige_reached = true;
                if (player.isUnlocked.prestige && player.stage.gte(unlocks.light)) player.isUnlocked.light_reached = true;
                if (player.isUnlocked.light && player.stage.gte(unlocks.mini_cubes)) { player.isUnlocked.minicubes = true; updates.prestigeUpgrades(); updates.lightUpgrades(); }
                if (player.isUnlocked.minicubes && player.stage.gte(unlocks.master)) player.isUnlocked.master_reached = true;
                get.updateCubeStat();
                gameFunctions.updatePrestigePart();
                gameFunctions.updateLightPart();
                updates.masterButtonInfo();
                gameFunctions.spawnCube();

                gameFunctions.hideAndShowContent();
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
                    changeValue('mini_cubes', new Decimal('0e0'));
                    
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
                const cube = $('<div></div>'),
                      place = elements.minicube_place[0].getBoundingClientRect(),
                      total_styles = 5;
                let index = get.mini_cubes.plus(1).log(1e3).plus(1).floor();
                    index = get.mini_cubes.gte(new Decimal(1e3).pow(new Decimal(total_styles + 1))) ? total_styles : index.toNumber();
                    

                elements.minicube_place.append(cube);
                

                cube.addClass(`mini-cube mini-cube-${index}`)
                const rect = cube[0].getBoundingClientRect(), style = getComputedStyle(cube[0]);
                cube.css({'left': `${(event.offsetX * 100 - rect.width * 50) / place.width}%`,
                          'top' : `${(event.offsetY * 100 - rect.height * 50) / place.height}%`});
                cube[0].style.opacity = "0";
                setTimeout(function()
                {
                    cube.remove();
                }, (Number(style.transitionDuration.slice(0, -1)) + Number(style.transitionDelay.slice(0, -1))) * 1e3);
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
        },
        hideAndShowContent(animate = true)
        {
            function show(element)
            {
                fs.animateAppearance(element, animate);
            }
            function hide(element)
            {
                element.hide();
            }
            function hide_and_show(element, condition)
            {
                if (condition)
                {
                    if (element.is(':hidden')) show(element);
                }
                else hide(element)
            }
            function toggleLocking(locked, unlocked, condition)
            {
                if (condition)
                {
                    locked.hide();
                    if (unlocked.is(':hidden')) unlocked.show();
                }
                else
                {
                    if (locked.is(':hidden')) locked.show();
                    unlocked.hide();
                }
            }
            toggleLocking(elements.prestige_locked_div, elements.prestige_unlocked_div, player.isUnlocked.prestige_reached);
            hide_and_show(elements.prestige_upgrades_div, player.isUnlocked.prestige);
            hide_and_show(elements.light_div, player.isUnlocked.prestige);
            toggleLocking(elements.light_locked_div, elements.light_unlocked_div, player.isUnlocked.light_reached);
            hide_and_show(elements.light_upgrades_div, player.isUnlocked.light);
            hide_and_show(elements.minicube_div, player.isUnlocked.light);
            toggleLocking(elements.minicube_locked_div, elements.minicube_unlocked_div, player.isUnlocked.minicubes);
            hide_and_show(elements.minicube_info_div, player.isUnlocked.light);
            hide_and_show(elements.minicube_place, player.isUnlocked.minicubes);
            toggleLocking(elements.master_locked_div, elements.master_unlocked_div, player.isUnlocked.master_reached);
            hide_and_show(elements.master, player.isUnlocked.master);
            hide_and_show(elements.master_area, player.isUnlocked.minicubes);
            hide_and_show(elements.master_milestones_div, player.isUnlocked.master);
        },
        hideELements()
        {
            elements.settings.hide();
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

$(document).ready(function()
{
    elements = {
        wrapper: $('#wrapper'),
            version: $('#version'),
            star_container: $('#background'),
            
        stage: $('#stage'),
            master: $('#master'),
        cube: $('.cube'),
            cube_info: $('#cube-info-text'),
        settings_button: $('#settings-button'),
            settings: $('#settings'),
                save: $('#save'),
                export_text: $('#export-via-text'),
                export_file: $('#export-via-file'),
                import_text: $('#import-via-text'),
                import_file: $('#import-via-file'),
                reset_cube: $('#reset-cube'),
                reset: $('#reset'),
                change_star_count: $('#change-star-count'),
                discord: $('#discord'),
        prestige_locked_div: $('#prestige-div-locked'), prestige_locked_info: $('#prestige-locked'),
            prestige_unlocked_div: $('#prestige-div-unlocked'),
            prestige_button: $('#prestige-button'),
                prestige_button_text: $('#prestige-button-text'),
            prestige_upgrades_div: $('#prestige-upgrades-div'),
                prestige_points_amount: $('#prestige-upgrades-info'),
        light_locked_div: $('#light-div-locked'), light_locked_info: $('#light-locked'),
            light_unlocked_div: $('#light-div-unlocked'),
            light_div: $('#light-div'),
            light_button: $('#light-button'),
                light_button_text: $('#light-button-text'),
            light_upgrades_div: $('#light-upgrades-div'),
                light_points_amount: $('#light-upgrades-info'),
        minicube_locked_div: $('#minicube-div-locked'), minicube_locked_info: $('#minicube-locked'),
            minicube_unlocked_div: $('#minicube-div-unlocked'),
            minicube_div: $('#minicube-area'),
            minicube_place: $('#minicube-place'),
            minicube_info_div: $('#minicube-info-div'),
            minicube_info: $('#minicube-info'),
        master_area: $('#master-area'),
            master_locked_div: $('#master-div-locked'), master_locked_info: $('#master-locked'),
            master_unlocked_div: $('#master-div-unlocked'),
            master_div: $('#master-div'),
            master_button: $('#master-button'),
                master_button_text: $('#master-button-text'),
            master_text: $('#master-milestones-info'),
            master_milestones_div: $('#master-milestones-div'),
    };  

    setNosaveValues();
    player = getDefaultPlayerValues();
    loadToPlayer();
    
    fixValues();

    get.updateCubeStat();
    gameFunctions.spawnCube(JSON.stringify(player) === JSON.stringify(getDefaultPlayerValues()));
    get.updateAll();
    main_functions.add_events();
    
    fs.setUpgradesHTML();
    fs.setMilestonesHTML();
    
    gameFunctions.hideELements();
    gameFunctions.hideAndShowContent(false); gameFunctions.hideAndShowContent(false);
    updates.updateAll();

    elements.star_context = elements.star_container[0].getContext('2d');
    gameFunctions.starCanvas();
    gameFunctions.spawnStars(settings.star_count);
    // place for console logs
    //


    setInterval(mainLoop, getLoopInterval())
});