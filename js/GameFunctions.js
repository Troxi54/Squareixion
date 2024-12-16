main_functions.gameFunctions = {
    /* starCanvas()
    {
        //let temp = elements.star_context.getImageData(0, 0, elements.star_container[0].width, elements.star_container[0].height)
        //elements.star_context.scale(window.innerWidth / elements.star_container[0].width,
        //                            window.innerHeight / elements.star_container[0].height)
        elements.star_container[0].width = window.innerWidth
        elements.star_container[0].height = window.innerHeight;
        //elements.star_context.putImageData(temp, 0, 0);
        
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
    spawnStars(count = nosave.current_stars)
    {
        for (let i = 0; i < count; i+=1)
        {
            this.spawnStar();
        }
        nosave.current_stars = count;
    }, */
    song(src)
    {
        if (nosave.play_music && !nosave.music_interval_is)
        {
            if (elements.music.attr('src') !== src || elements.music[0].paused) {
                let eq = true;
                if (elements.music.attr('src') !== src) { 
                    elements.music.attr('src', src); 
                    eq = false;
                }
                elements.music[0].play();
                (function() // fade in
                {
                    if (!eq) {
                        elements.music[0].volume = 0;
                        elements.music.animate({'volume': '.5'}, 10000)
                    }
                })();
                src = src.substring(src.lastIndexOf('/') + 1);
                fs.update(elements.change_music_text, "Music: " + src.split('.')[0]);
            }
        }
    }, 
    playMusic()
    {
        this.song(normal_realm_music[nosave.music_iterator > normal_realm_music.length - 1 ? normal_realm_music.length - 1 : nosave.music_iterator]);
    },
    stopMusic()
    {
        elements.music[0].pause();
        fs.update(elements.change_music_text, "Music: OFF");
    },
    spawnCube(setHP = true)
    {
        if (!elements.cube.hasClass(get.cube_style)) {
            elements.cube.removeClass();
            elements.cube.addClass('cube');
            
            elements.cube.addClass(get.cube_style);
        }
        
        elements.cube.css('width', this.getCubeSize() + 'px');
        if (setHP) player.cube_hp = get.cube_total_hp;

        //updates.cubeInfo();
    },
    resetCube()
    {
        player.stage = N('1e0');
        gameFunctions.updateCubePart();
        gameFunctions.spawnCube();
    },
    getCubeSize(stage = player.stage)
    {
        //let s = stage.div(1e4).log(10).plus(1).max(1);
        return size =  (stage.log( N('1e2').times( stage.div('1e4').log(10).plus(1).max(1).pow('1.5'))).plus(1).times(settings.cube_size_start))
                            .softcap(300, 2, 'mul')
                            .softcap(305, 2, 'mul')
                            .softcap(310, 4, 'mul')
                            .softcap(315, 0.5, 'pow')
                            .softcap(320, '1e-1', 'pow')
                            .softcap(325, '1e-2', 'pow')
                            .softcap(330, '1e-3', 'pow')
                            .softcap(335, '1e-4', 'pow')
                            .softcap(340, '1e-5', 'pow')
                            .softcap(345, '1e-10', 'pow')
                            .softcap(350, '1e-100', 'pow')
                            .toNumber();
    },
    getCubeHP(stage)
    {
        stage = player.stage.plus(stage);
        let hp = N(hps[stage.toNumber() < hps.length ? stage.toNumber() - 1 : hps.length - 1]);
        if (stage.gt(hps.length))
        {
            hps_scalings.forEach(function(scaling, index)
            {
                const els = function(){ if (stage.gte(N(scaling[0])))
                                        {
                                            hp = hp.times(N(scaling[1]).pow(stage.minus(N(scaling[0]))));
                                        } 
                                      }
                if (index < hps_scalings.length - 1)
                {
                    if (stage.gte(N(hps_scalings[index + 1][0])))
                    {
                        hp = hp.times(N(scaling[1]).pow(
                                            N(hps_scalings[index + 1][0]).minus(N(scaling[0]))))
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
        let index = -1;
        cubes.every(function(cube){
            if (stage.gte(cube.start_at)) {
                index += 1;
                return true;
            }
            return false;
        })
        const cube_stat = cubes[index], stage_cube = stage.minus(cube_stat.start_at);
        if (stage_cube.lt(settings.cube_name_postfixes.length)) {
            return cube_stat.name + (settings.cube_name_postfixes[stage_cube]);
        }
        else if (stage_cube.lt(40)) {
            //console.log(stage_cube)
            return cube_stat.name + ' ' + romanize(Math.floor(stage_cube.toNumber()));
        }
        else return cube_stat.name + ' ' + (stage_cube.lt('e1000') ? abb_abs_int(stage_cube) : '');
    },
    getCubeNameWithStage(stage)
    {
        return gameFunctions.getCubeName(stage) + ` (${abb_abs_int(stage)})`
    },
    getCubeStyleName(stage)
    {
        let index = -1;
        cubes.every(function(cube){
            if (stage.gte(cube.start_at)) {
                index += 1;
                return true;
            }
            return false;
        })
        let result = cubes[index].name.toLowerCase().replace(/ /g, '-').replaceAll('+', '-p');
        return isCharNumber(result[0]) ? '_' + result : result;
    },
    getFullCubeStyleName(stage)
    {
        return this.getCubeStyleName(stage) + settings.cube_text_plus_style;
    },
    damageCube(multi = 1)
    {
        let damage = get.damage.times(multi);
        player.cube_hp = player.cube_hp.minus(damage);
        if (player.cube_hp.lte(N('0e0')))
        {
            let stage = player.stage,
                bulk = N(0);
            if (stage.lt(hps.length))
            {
                for (let i = stage.toNumber(); i < hps.length; i += 1)
                {
                    bulk = N(i - stage.toNumber());
                    if (damage.lt(hps[i]))
                    {
                        break;
                    }
                }
            }
            if (stage.gte(hps.length) || bulk.gte(hps.length - 1 - stage.toNumber()))
            {
                /* let scaling_index = 0;
                hps_scalings.every(function(scaling, index)
                {
                    scaling_index = index;
                    if (stage.lt(scaling[0]))
                    {
                        return false;
                    }
                    
                    return true;

                })
                console.log(scaling_index)
                for (let index = scaling_index; index < hps_scalings.length; index += 1)
                {
                    if (index < hps_scalings.length - 1)
                    {
                        
                        bulk = bulk.plus(
                                    damage.gte(this.getCubeHP(N(hps_scalings[index][0]))) ? 
                                                                N(hps_scalings[index + 1][0]).minus(hps_scalings[index][0])
                                                                : damage.div(this.getCubeHP()).log(hps_scalings[index][1]).ceil());
                        if (damage.lt(this.getCubeHP(N(hps_scalings[index][0])))) break;
                    }
                    else {
                        console.log('yy')
                        bulk = bulk.plus(damage.div(gameFunctions.getCubeHP(bulk)).log(hps_scalings[index][1]).ceil())
                    }   
                } */
                
                bulk = bulk.plus(damage.div(gameFunctions.getCubeHP(bulk)).max(1).log(hps_scalings[0][1]).ceil())
                //console.log(bulk)
            }
            player.stage = player.stage.plus(bulk.plus(1).max(1).floor());
            if (player.stage.gte(unlocks.prestige) && !player.isUnlocked.prestige_reached) {
                player.isUnlocked.prestige_reached = true;
                gameFunctions.unlockedFrame(`You unlocked <span class="prestige">Prestige</span>!`)
            }
            if (player.isUnlocked.prestige && player.stage.gte(unlocks.light) && !player.isUnlocked.light_reached) {
                player.isUnlocked.light_reached = true;
                gameFunctions.unlockedFrame(`You unlocked <span class="light">Light</span>!`)
            }
            if (player.isUnlocked.light && player.stage.gte(unlocks.mini_cubes) && !player.isUnlocked.minicubes) { 
                player.isUnlocked.minicubes = true;
                gameFunctions.unlockedFrame(`You unlocked <span class="darker-text">Mini Squares</span>!`)
            }
            if (player.isUnlocked.minicubes && player.stage.gte(unlocks.master) && !player.isUnlocked.master_reached) {
                player.isUnlocked.master_reached = true;
                gameFunctions.unlockedFrame(`You unlocked <span class="master">Master</span>!`)
            }
            if (player.isUnlocked.neonsquare && player.stage.gte(unlocks.collapse) && !player.isUnlocked.collapse_reached) {
                player.isUnlocked.collapse_reached = true;
                gameFunctions.unlockedFrame(`You unlocked <span class="collapse">Collapse</span>!`)
            }
            get.updateCubeStat();
            gameFunctions.updatePrestigePart();
            gameFunctions.updateLightPart();
            //updates.masterButtonInfo();
            //get.updateCubeHP();
            gameFunctions.spawnCube();

            gameFunctions.hideAndShowContent();
        }
        //updates.cubeInfo();
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
            () => player.stage.gte(unlocks.light) && player.isUnlocked.prestige,
            function()
            {
                player.isUnlocked.light = true;
                changeValue('light_points', player.light_points.plus(get.light_points));
                player.upgrades.prestige_upgrades.forEach(function(upgr, index)
                {
                   upgr.setBoughtTimes(N('0e0'));
                });
                changeValue('prestige_points', N('0e0'));
                
                gameFunctions.resetCube();
            }
        );
    },
    master()
    {
        fs.reset(
            3, 
            () => player.stage.gte(get.master_requirement) && player.isUnlocked.minicubes,
            function()
            {
                player.isUnlocked.master = true;
                if (nosave.bulk_master && nosave.milestones.collapse_milestones[0].isEnough())
                {
                    changeValue('master_level', player.master_level.plus(get.master_bulk));
                }
                else changeValue('master_level', player.master_level.plus(1));
                get.updateMasterRequirement();
                player.upgrades.prestige_upgrades.forEach(function(upgr)
                {
                   upgr.setBoughtTimes(N('0e0'));
                });
                player.upgrades.light_upgrades.forEach(function(upgr, index)
                {
                   if (!((nosave.milestones.master_milestones[11].isEnough() || nosave.milestones.collapse_milestones[0].isEnough() || player.isUnlocked.rebuild) && index === 2)) upgr.setBoughtTimes(N('0e0'));
                });
                changeValue('prestige_points', N('0e0'));
                changeValue('light_points', N('0e0'));
                changeValue('mini_cubes', N('0e0'));
                
                if (nosave.milestones.master_milestones[8].isEnough() && !player.isUnlocked.giantcube)
                {
                    player.isUnlocked.giantcube = true;
                    gameFunctions.unlockedFrame(`You unlocked <span class="gcs">Giant Squares</span>!`)
                }
                if (nosave.milestones.master_milestones[14].isEnough() && !player.isUnlocked.neonsquare)
                {
                    player.isUnlocked.neonsquare = true;
                    gameFunctions.unlockedFrame(`You unlocked <span class="neon-luck">Neon Squares</span>!`)
                }

                /* get.updateMasterMilestonesValues();
                updates.master(); */
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
                  total_styles = 10;
            let index = get.mini_cubes.plus(1).log(1e3).plus(1).floor();
                index = get.mini_cubes.gte(N('ee3')) ? 'tl' : 
                            get.mini_cubes.gte(N(1e3).pow(total_styles).pow('2')) ? 'l' :
                                get.mini_cubes.gte(N(1e3).pow(total_styles)) ? total_styles : index.toNumber();
                

            elements.minicube_place.append(cube);
            

            cube.addClass(`mini-cube mini-cube-${index}`)
            const rect = cube[0].getBoundingClientRect(), style = getComputedStyle(cube[0]);
            cube.css({'left': `${(event.offsetX * 100 - rect.width * 50) / place.width}%`,
                      'top' : `${(event.offsetY * 100 - rect.height * 50) / place.height}%`});
            if (index === 'l') { cube.css('transition-delay', '5s'); }
            else if (index === 'tl') { cube.css('transition-delay', '6s'); }
            cube[0].style.opacity = "0";
            setTimeout(function()
            {
                cube.remove();
            }, (Number(style.transitionDuration.slice(0, -1)) + Number(style.transitionDelay.slice(0, -1))) * 1e3);
        }
    },
    damageGiantCube(multi=1)
    {
        if (nosave.milestones.master_milestones[8].isEnough())
        {
            let damage = get.giant_cube_damage.times(multi);
            player.giant_cube_hp = player.giant_cube_hp.minus(damage);
            if (player.giant_cube_hp.lte(N('0e0')))
            {

                let bulk = damage.max(1).log(10).sub(player.giant_cube_stage).plus(1).max(1).floor();
                //console.log(damage.div(get.giant_cube_hp).toString(), get.giant_cube_hp.toString())
                /* let l10 = 0;
                while (damage.gte(get.gcHP(N('1e1').pow(l10)).plus(player.giant_cube_stage)))++l10;++l10;
                while (--l10 + 1)
                {
                    while(damage.gte(
                        get.gcHP(N('1e1').pow(l10).plus(player.giant_cube_stage))))
                    {
                        //damage = damage.minus(get.gcHP(N('1e1').pow(l10)).plus(player.giant_cube_stage));
                        player.giant_cube_stage = player.giant_cube_stage.plus(N('1e1').pow(l10));
                    }
                } */
                player.giant_cube_stage = player.giant_cube_stage.plus(bulk);
                if (player.giant_cube_stage.gte(unlocks.giga_squares) && !player.isUnlocked.gigacube_reached) {
                    player.isUnlocked.gigacube_reached = true;
                    gameFunctions.unlockedFrame(`You unlocked <span class="giga">Gigalize</span>!`);
                }
                gameFunctions.hideAndShowContent();
                /* get.updateGcDamage();
                
                get.updateRubyGain(); */
                // gameFunctions.updateGigaPart();
                get.updateGcHP();
                this.spawnGCube();
            }
            //updates.giantcubeInfo();
        }
        
    },
    spawnGCube(setHP = true)
    {
        if (setHP) player.giant_cube_hp = get.giant_cube_hp;
        if (player.giant_cube_stage.gte(10))
        {
            let log = player.giant_cube_stage.log(10).floor();
            let stage = player.giant_cube_stage.div(N(10).pow(log)).floor().times(N(10).pow(log));
            let [r, g, b] = [SimpleFastCounter32(MurmurHash3(`giant_cube_color_rand_r${stage.toString()}`)())() * 255, 
                             SimpleFastCounter32(MurmurHash3(`giant_cube_color_rand_g${stage.toString()}`)())() * 255,
                             SimpleFastCounter32(MurmurHash3(`giant_cube_color_rand_b${stage.toString()}`)())() * 255];
            [r, g, b] = [Math.floor(r), Math.floor(g), Math.floor(b)];
            elements.giantcube.css('background-color', `rgb(${r}, ${g}, ${b})`);
        }
        else elements.giantcube.css('background-color', '');
    },
    gigalize()
    {
        if (player.giant_cube_stage.gte(unlocks.giga_squares))
        {
            player.isUnlocked.gigacube = true;
            changeValue('giga_squares', player.giga_squares.plus(get.giga_squares));
            player.giant_cube_stage = N(1);
            player.upgrades.ruby_upgrades.forEach(function(upgr)
            {
                upgr.setBoughtTimes(N('0e0'));
            });
            changeValue('ruby', N(0))
            /* get.updateRubyGain();
            
            get.updateGcDamage(); */
            get.updateGcHP();
            gameFunctions.spawnGCube();
            /* updates.giantcubeInfo();
            get.updateGigaSquareGain();
            updates.gigaButtonInfo(); */
            gameFunctions.hideAndShowContent();
        }
    },
    spawnNeonSquare(first = false)
    { // why are all my variables here named color
        if (first || (player.isUnlocked.neonsquare && nosave.milestones.master_milestones[14].isEnough()))
        {
            let rng = N('1e0').div(Math.random()).times(get.neon_luck),
                should = rng.log(3.5).floor(),
                tier = first ? player.neon_tier : should;
            if (!first) tier = should.gt(player.neon_tier) ? should : player.neon_tier;
            //if (should.gt(player.neon_tier)) tier = should;
            (function() // color part
            {
                let colors = [
                    [[255, 255, 255], N("0e0")],
                    [[255, 0, 0], N("2.5e1")],
                    [[0, 0, 255], N("1e2")],
                    [[0, 255, 0], N("2.5e2")],
                    [[255, 255, 0], N("1e3")],
                    [[138, 71, 0], N("2.5e3")],
                    [[255, 0, 255], N("1e4")],
                    [[71, 71, 71], N("1e5")],
                    [[65, 65, 65], N("1e6")],
                    [[60, 60, 60], N("1e7")],
                    [[55, 55, 55], N("1e8")],
                    [[50, 50, 50], N("1e9")],
                    [[45, 45, 45], N("1e10")],
                    [[40, 40, 40], N("1e100")],
                    [[35, 35, 35], N("1e1000")],
                    [[32.5, 32.5, 32.5], N("ee4")],
                    [[30, 30, 30], N("ee5")],
                    [[29, 29, 29], N("ee6")],
                    [[28, 28, 28], N("ee7")],
                    [[28, 28, 28], N("ee7")],
                    [[27, 27, 27], N("ee9")],
                    [[26, 26, 26], N("ee10")],
                    [[25, 25, 25], N("eee2")],
                    [[24, 24, 24], N("eeee1")],
                    [[23, 23, 23], N("(e^5)1")],
                    [[22, 22, 22], N("(e^6)1")],
                    [[21, 21, 21], N("(e^10)1")],
                    [[20, 20, 20], N("(e^71481)1")],
                ],
                color_index = -1,
                color;
                colors.forEach(function(array)
                {
                    if (tier.gte(array[1]))
                    {
                        color_index++;
                    }
                })
                
                if (color_index < colors.length - 1)
                {
                    let completed = tier.minus(colors[color_index][1]).log(colors[color_index + 1][1]).toNumber();
                    if (!completed) completed = 0;
                    //console.log(completed)
                    colors[color_index][0].forEach(function(col, index)
                    {
                        col -= (col - colors[color_index + 1][0][index]) * completed;
                        colors[color_index][0][index] = col;
                    })
                }
                color = colors[color_index][0];
                elements.neon_square.css({'--color': `${color.join(', ')}`});
            })();
            if (!first)
            {
                //tier = should;
                changeValue('neon_tier', tier);
                nosave.neon_rng = rng;
                player.isUnlocked.hasNSquare = true;
                gameFunctions.hideAndShowContent();
            }
        }
        
    },
    collapse()
    {
        fs.reset(
            4, 
            () => player.stage.gte(unlocks.collapse) && player.isUnlocked.neonsquare,
            function()
            {
                function animation()
                {
                    gameFunctions.stopMusic();
                    elements.collapse_button.css({'pointer-events': 'none'});
                    elements.frame.css({
                        'background-color': 'rgb(0, 13, 189)',
                        'opacity': '0'
                    });
                    elements.frame_text.hide();
                    elements.frame.show();
                    elements.currencies_place.animate({'opacity': '0'}, 1e4);
                    elements.collapse_layer_area.addClass('when-animation');
                    elements.frame.animate({'opacity': '1'}, 10 * 1e3, function()
                    {
                        elements.collapse_layer_area.animate({'opacity': '0'}, 2.5 * 1e3, function()
                        {
                            elements.collapse_layer_area.hide();
                            elements.main_realm.hide();
                            setTimeout(function()
                            {
                                data();

                                elements.frame_text.css('opacity', '0');
                                
                                fs.update(elements.frame_text, `YOU HAVE COLLAPSED!`);
                                elements.frame_text.removeClass();
                                elements.frame_text.addClass('collapse-frame-text');
                                elements.frame_text.show();
                                elements.frame_text.animate({'opacity': '1'}, 20 * 1e3, function()
                                {
                                    gameFunctions.realm(1);
                                    elements.currencies_place.animate({'opacity': '1'}, 1e4)
                                    elements.frame_text.animate({'opacity': '0'}, 10 * 1e3);
                                    elements.frame.animate({'opacity': '0'}, 10 * 1e3, function()
                                    {
                                        elements.frame.hide();
                                        elements.frame.css('opacity', '1');
                                        elements.frame_text.css('opacity', '1');
                                        elements.collapse_layer_area.css('opacity', '1');
                                        elements.collapse_layer_area.show();
                                        elements.collapse_button.css('pointer-events', '');
                                        elements.collapse_layer_area.removeClass('when-animation');
                                        elements.frame[0].removeAttribute('style');
                                        elements.frame_text[0].removeAttribute('style');
                                    });
                                });

                            }, 5 * 1e3)
                        })
                        
                    })
                }
                
                function data()
                {
                    player.isUnlocked.collapse = true;
                    changeValue('stars', player.stars.plus(get.star_gain));
                    changeValue('collapsed_times', player.collapsed_times.plus(get.ct_g));
                    changeValue('masters_on_collapse', player.master_level.lt(player.masters_on_collapse) ? player.master_level : player.masters_on_collapse);
                    changeValue('best_stage_on_collapse', player.stage.gt(player.best_stage_on_collapse) ? player.stage : player.best_stage_on_collapse);
                    changeValue('best_stars_on_collapse', get.star_gain.gt(player.best_stars_on_collapse) ? get.star_gain : player.best_stars_on_collapse);
                    player.upgrades.prestige_upgrades.forEach(function(upgr)
                    {
                        upgr.setBoughtTimes(N('0e0'));
                    });
                    player.upgrades.light_upgrades.forEach(function(upgr, index)
                    {
                        if (index !== 2) upgr.setBoughtTimes(N('0e0'));
                    });
                    player.upgrades.ruby_upgrades.forEach(function(upgr)
                    {
                        upgr.setBoughtTimes(N('0e0'));
                    });
                    player.upgrades.giga_upgrades.forEach(function(upgr)
                    {
                        upgr.setBoughtTimes(N('0e0'));
                    });
                    changeValue('prestige_points', N('0e0'));
                    changeValue('light_points', N('0e0'));
                    changeValue('mini_cubes', N('0e0'));
                    changeValue('master_level', N('0e0'));
                    changeValue('giant_cube_stage', N('1e0'));
                    changeValue('ruby', N('0e0'));
                    changeValue('giga_squares', N('0e0'));
                    changeValue('neon_tier', N('0e0'));
                    gameFunctions.spawnNeonSquare(true);
                    nosave.neon_rng = N(0);
                    
                    if (nosave.milestones.collapse_milestones[4].isEnough() && !player.isUnlocked.galaxy) {
                        player.isUnlocked.galaxy = true;
                        gameFunctions.unlockedFrame(`You unlocked <span class="galaxy">Galaxies</span>!`)
                    }
                    if (nosave.milestones.collapse_milestones[9].isEnough() && !player.isUnlocked.rebuild_reached) {
                        player.isUnlocked.rebuild_reached = true;
                        gameFunctions.unlockedFrame(`You unlocked <span class="rebuild">Rebuild</span>!`)
                    }

                    player.strange_place = false;

                    gameFunctions.resetCube();
                    get.updateGcHP();
                    gameFunctions.spawnGCube();
                }
                if (!player.isUnlocked.collapse) animation();
                else data();
            }
        );
    },
    galaxy()
    {
        if (player.stars.gte(unlocks.galaxy))
        {
            get.updateGalaxiesGain();
            player.isUnlocked.galaxyhave = true;

            player.galaxies = player.galaxies.plus(get.galaxies);
            if (nosave.milestones.collapse_milestones[7].isEnough() && !player.isUnlocked.strangeplace) {
                player.isUnlocked.strangeplace = true;
                gameFunctions.unlockedFrame(`You unlocked <span class="black-holes">The Strange Place</span>!`);
            }
            player.stars = N(0);
            get.updateGalaxiesGain();

            gameFunctions.hideAndShowContent();
        }
    },
    strangePlace()
    { 
      if (!player.strange_place) {
        if (player.stage.gte(unlocks.collapse) && nosave.milestones.collapse_milestones[7].isEnough()) {
          gameFunctions.collapse();
          player.strange_place = true;
        }
      }
      else {
          if (get.bh.gt(player.black_holes)) player.black_holes = get.bh;
          gameFunctions.collapse();
          player.strange_place = false;
          player.isUnlocked.strangeplace_once = true;
      }
    },
    rebuild()
    {
        fs.reset(
            5, 
            () => player.stage.gte(unlocks.rebuild) && player.isUnlocked.rebuild_reached,
            function()
            {
                function animation()
                {
                    gameFunctions.stopMusic();
                    elements.frame.css({
                        'background': 'linear-gradient(-45deg, rgb(0, 185, 99), black 10% 90%, rgb(80, 0, 185))',
                        'opacity': '0'
                    });
                    elements.frame_text.hide();
                    elements.frame.show();
                    elements.currencies_place.animate({'opacity': '0'}, 1e4);
                    elements.frame.animate({'opacity': '1'}, 10 * 1e3, function()
                    {
                        setTimeout(function()
                        {
                            data();

                            elements.frame_text.css('opacity', '0');
                            
                            fs.update(elements.frame_text, `YOU HAVE <span class="rebuild bold italic" style="text-shadow: none;">REBUILT</span>!`);
                            elements.frame_text.removeClass();
                            elements.frame_text.addClass('rebuild-frame-text');
                            elements.frame_text.show();
                            elements.frame_text.animate({'opacity': '1'}, 20 * 1e3, function()
                            {
                                gameFunctions.realm(2);
                                elements.currencies_place.animate({'opacity': '1'}, 1e4)
                                elements.frame_text.animate({'opacity': '0'}, 10 * 1e3);
                                elements.frame.animate({'opacity': '0'}, 10 * 1e3, function()
                                {
                                    elements.frame.hide();
                                    elements.frame[0].removeAttribute('style');
                                    elements.frame_text[0].removeAttribute('style');
                                });
                            });

                        }, 5 * 1e3)
                    })
                }
                
                function data()
                {
                    player.isUnlocked.rebuild = true;
                    
                    changeValue('universe_generators', player.universe_generators.plus(get.ug_gain));

                    nosave.milestones.master_milestones.forEach(m=>m.always_works = false);

                    player.upgrades.prestige_upgrades.forEach(function(upgr)
                    {
                        upgr.setBoughtTimes(N('0e0'));
                    });
                    player.upgrades.light_upgrades.forEach(function(upgr, index)
                    {
                        if (index !== 2) upgr.setBoughtTimes(N('0e0'));
                    });
                    player.upgrades.ruby_upgrades.forEach(function(upgr)
                    {
                        upgr.setBoughtTimes(N('0e0'));
                    });
                    player.upgrades.giga_upgrades.forEach(function(upgr)
                    {
                        upgr.setBoughtTimes(N('0e0'));
                    });
                    player.upgrades.collapse_upgrades.forEach(function(upgr)
                    {
                        upgr.setBoughtTimes(N('0e0'));
                    });
                    changeValue('black_holes', N('0e0'));
                    changeValue('galaxies', nosave.milestones.rebuild_milestones[6].isEnough() ? N('1e1') : N('0e0'));
                    changeValue('stars', N('0e0'));
                    changeValue('collapsed_times', N('0e0'));
                    changeValue('masters_on_collapse', N('1e4'));
                    changeValue('best_stage_on_collapse', N('0e0'));
                    changeValue('best_stars_on_collapse', N('0e0'));
                    changeValue('prestige_points', N('0e0'));
                    changeValue('light_points', N('0e0'));
                    changeValue('mini_cubes', N('0e0'));
                    changeValue('master_level', N('0e0'));
                    changeValue('giant_cube_stage', N('1e0'));
                    changeValue('ruby', N('0e0'));
                    changeValue('giga_squares', N('0e0'));
                    changeValue('neon_tier', N('0e0'));
                    player.strange_place = nosave.milestones.rebuild_milestones[10].isEnough();
                    gameFunctions.spawnNeonSquare(true);
                    nosave.neon_rng = N(0);

                    gameFunctions.resetCube();
                    get.updateGcHP();
                    gameFunctions.spawnGCube();
                }
                if (!player.isUnlocked.rebuild) animation();
                else data();
            }
        );
    },
    rebuildRank()
    {
        if (player.universes.gte(get.rr_req)) {
            player.universes = N(0);
            if (nosave.bulk_rr && nosave.milestones.rebuild_milestones[11].isEnough())
            {
                changeValue('rebuild_rank', player.rebuild_rank.plus(get.rr_bulk));
            }
            else changeValue('rebuild_rank', player.rebuild_rank.plus(1));

            if (nosave.milestones.rebuild_milestones[11].isEnough() && !player.isUnlocked.uniqueplace) {
                player.isUnlocked.uniqueplace = true;
                gameFunctions.unlockedFrame(`You unlocked <span class="white-holes">The Unique Place</span>!`)
            }
        }
    },
    uniquePlace()
    { 
        if (player.isUnlocked.uniqueplace) {
            if (!player.unique_place) {
                gameFunctions.rebuild();
                player.unique_place = true;
            }
            else {
                if (get.wh.gt(player.white_holes)) player.white_holes = get.wh;
                gameFunctions.rebuild();
                player.unique_place = false;
                player.isUnlocked.uniqueplace_once = true;
            }
        }
    },
    afkGenerators()
    {
        for (const auto in nosave.Autoclickers)
        {
            if (auto.includes('generator') && nosave.Autoclickers[auto].isWorking()) {
                nosave.Autoclickers[auto].lambda(Math.max(Date.now() - player.lastLoop, 0) / nosave.Autoclickers[auto].rate())
                nosave.Autoclickers[auto].lastLoop = Date.now();
            }
        }
    },
    unlockedFrame(text)
    {
        fs.update(elements.unlocked_info, text);
        elements.unlocked.show();
        elements.frame.css({
            'background-color': 'rgba(0, 0, 0, .5)',
            opacity: 1
        });
        elements.frame.show();
    },
    updateCubePart()
    {
        get.updateCubeStat();
        //updates.cubeInfo();
    },
    updatePrestigePart()
    {
        get.updatePrestigePoints();
        //updates.prestigeButtonInfo();
    },
    updateLightPart()
    {
        get.updateLightPoints();
        //updates.lightButtonInfo();
    },
    updateGigaPart()
    {
        get.updateGigaSquareGain();
        //updates.gigaButtonInfo();
    },
    hideAndShowContent(animate = true)
    {
        const toggleLocking = fs.toggleLocking,
              hide_and_show = fs.hide_and_show,
              rebuilt = nosave.milestones.rebuild_milestones[9].isEnough();
        toggleLocking(elements.prestige_locked_div, elements.prestige_unlocked_div, player.isUnlocked.prestige_reached);
        hide_and_show(elements.prestige_upgrades_div, player.isUnlocked.prestige, animate);
        hide_and_show(elements.light_area, !rebuilt, animate);
        hide_and_show(elements.light_div, player.isUnlocked.prestige, animate);
        toggleLocking(elements.light_locked_div, elements.light_unlocked_div, player.isUnlocked.light_reached);
        hide_and_show(elements.light_upgrades_div, player.isUnlocked.light, animate);
        hide_and_show(elements.minicube_div, player.isUnlocked.light && !rebuilt, animate);
        toggleLocking(elements.minicube_locked_div, elements.minicube_unlocked_div, player.isUnlocked.minicubes);
        hide_and_show(elements.minicube_info_div, player.isUnlocked.light, animate);
        hide_and_show(elements.minicube_place, player.isUnlocked.minicubes, animate);
        toggleLocking(elements.master_locked_div, elements.master_unlocked_div, player.isUnlocked.master_reached);
        hide_and_show(elements.master, player.isUnlocked.master, animate);
        hide_and_show(elements.master_area, player.isUnlocked.minicubes, animate);
        hide_and_show(elements.master_milestones_div, player.isUnlocked.master, animate);
        hide_and_show(elements.neon_area, player.isUnlocked.neonsquare && !rebuilt, animate);
        hide_and_show(elements.neon_square, player.isUnlocked.hasNSquare, animate);
        hide_and_show(elements.neon_info, player.isUnlocked.hasNSquare, animate);
        hide_and_show(elements.giantcube_area, player.isUnlocked.giantcube && !rebuilt, animate);
        hide_and_show(elements.giga_area, player.isUnlocked.giantcube && !rebuilt, animate);
        toggleLocking(elements.giga_locked_div, elements.giga_unlocked_div, player.isUnlocked.gigacube_reached);
        hide_and_show(elements.giga_upgrades_div, player.isUnlocked.gigacube, animate);
        hide_and_show(elements.collapse_layer_area, player.isUnlocked.neonsquare, animate);
        hide_and_show(elements.portal, player.isUnlocked.collapse, animate);
        toggleLocking(elements.collapse_locked_div, elements.collapse_unlocked_div, player.isUnlocked.collapse_reached);
        hide_and_show(elements.collapse, player.isUnlocked.collapse, animate);
        hide_and_show(elements.galaxy_area, player.isUnlocked.galaxy, animate);
        hide_and_show(elements.galaxy_amount, player.isUnlocked.galaxyhave, animate);
        hide_and_show(elements.change_realm_music, player.isUnlocked.collapse, animate);
        hide_and_show(elements.black_holes_div, player.isUnlocked.strangeplace, animate);
        hide_and_show(elements.rebuild_layer_area, player.isUnlocked.rebuild_reached, animate);
        hide_and_show(elements.portal_to_realm_3, player.isUnlocked.rebuild, animate);
        hide_and_show(elements.rebuild_rank, player.isUnlocked.rebuild, animate);
        hide_and_show(elements.white_holes_div, player.isUnlocked.uniqueplace, animate);
    },
    roundValues()
    {
        for (let prop in player) {
            if (player[prop] instanceof Decimal) {
                player[prop] = player[prop].times(new Decimal('1e12', false)).round().div(new Decimal('1e12', false));
            }
        }
    },
    hideElements()
    {
        elements.settings.hide();
        elements.unlocked.hide();
    },
    realm(what = 0)
    {
        nosave.realm_scrolls[nosave.realm] = [window.scrollX, window.scrollY];
        const realms = [elements.main_realm, elements.collapse_realm, elements.rebuild_realm],
              realm = realms[what];
        elements.main_content.children().hide();
        const scr = nosave.realm_scrolls[what];
        realm.show();
        if (scr) window.scrollTo(scr[0], scr[1]);
        nosave.realm = what;
        elements.background.removeClass();
        if (!what)
        {
            this.playMusic();
        }
        if (what === 1)
        {
            elements.background.addClass('body-collapse-realm');
            if (!player.always_play_normal_realm_music) this.song(collapse_realm_music[0]);
        }
        if (what === 2)
        {
            elements.background.addClass('body-rebuild-realm');
            if (!player.always_play_normal_realm_music) this.song(rebuild_realm_music[0]);
        }
    }
};