main_functions.add_events = function()
{
    $(document).on('scroll', function()
    {
       // $(document.body).css({
            //'background-position': window.scrollX + 'px ' + window.scrollY + 'px'
       // })
    })

    elements.music.on('ended', function() {
        const wait = 6e4;
        let date = Date.now(),
            int = setInterval(function() { 
                 if (nosave.play_music) {
                    fs.update(elements.change_music_text, `Music: ${Math.round((date + wait - Date.now()) / 1e3)}s...`);
                }
            }, 1e3);
        nosave.music_interval_is = true;
        setTimeout(function()
        {
            let cond = setInterval(function(){
                if (nosave.play_music) {
                    clearInterval(cond);
                    clearInterval(int);
                    
                    nosave.music_interval_is = false;
                    nosave.music_iterator += 1;
                    if (nosave.music_iterator > music.length - 1)
                    {
                        nosave.music_iterator = 0;
                    }
                    let play = function() {
                        if (!nosave.realm || player.always_play_normal_realm_music)
                        {
                            gameFunctions.playMusic();
                        }
                        else if (nosave.realm === 1) {
                            gameFunctions.song(collapse_realm_music[0]);
                        }
                        else if (nosave.realm === 2) {
                            gameFunctions.song(rebuild_realm_music[0]);
                        }
                    }
                    let waiting;
                    if (!document.hidden || player.outside_music) play();
                    else {
                        fs.update(elements.change_music_text, `Music: Awaiting...`);
                        waiting = setInterval(function(){
                            if (!document.hidden)
                            {
                                play();
                                clearInterval(waiting);
                            }
                        }, 100)
                    }
                    
                }
            }, 100)
            
        }, wait);
    });

    document.addEventListener("visibilitychange", function()
    {
        // stop playing music when page is inactive
        if (nosave.play_music && !player.outside_music)
        {
            if (document.hidden)
            {
                //gameFunctions.stopMusic();
                elements.music[0].pause();
                fs.update(elements.change_music_text, "Music: Awaiting...");
            }
            else {
                if (!nosave.realm) {
                    gameFunctions.playMusic();
                }
                else if (nosave.realm === 1) {
                    if (!player.always_play_normal_realm_music) gameFunctions.song(collapse_realm_music[0]);
                }
                else if (nosave.realm === 2) {
                    if (!player.always_play_normal_realm_music) gameFunctions.song(rebuild_realm_music[0]);
                }
                //elements.music[0].play();
                
                /* let src = !nosave.realm ? normal_realm_music[nosave.music_iterator] : collapse_realm_music[0]; src = src.substring(src.lastIndexOf('/') + 1);
                fs.update(elements.change_music_text, `Music: ${src.split('.')[0]}`); */
            }
        }
        // keep generating currencies when page is inactive
        /* if (!document.hidden)
        {
            gameFunctions.afkGenerators();
        } */
    })

    function change_music()
    {
        nosave.play_music =! nosave.play_music;
        if (nosave.play_music)
        {
            if (!nosave.realm) gameFunctions.playMusic();
            else if (!nosave.always_play_normal_realm_music) {
                if (nosave.realm === 1) {
                    gameFunctions.song(collapse_realm_music[0]);
                } else if (nosave.realm === 2) {
                    gameFunctions.song(rebuild_realm_music[0]);
                }
            }
                 
        } 
        else gameFunctions.stopMusic();
    }
    elements.change_music.on('click', function()
    {
        change_music();
    })

    elements.change_realm_music.on('click', function()
    {
        player.always_play_normal_realm_music =! player.always_play_normal_realm_music;
        fs.update(elements.change_realm_music_text, `Always play normal realm music: ${player.always_play_normal_realm_music ? `ON` : `OFF`}`)
    })

    elements.outside_music.on('click', function()
    {
        player.outside_music =! player.outside_music;
        fs.update(elements.outside_music_text, `Play music outside the page: ${player.outside_music ? `ON` : `OFF`}`)
    })

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
        const save = localStorage.getItem(settings.game_name),
              date = new Date(),
              post_name = date.toLocaleDateString() + ' ' + date.toLocaleTimeString().replace(new RegExp(':', 'g'), '-');
        downloadFile(save, settings.savefile_name + ' ' + post_name + '.txt');
    })

    elements.import_text.on('click', function()
    {
        const text = prompt('Paste your text here. Your current save will be overwritten.');
        if (text)
        {
            player = getDefaultPlayerValues();
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
        const text = prompt('This will delete all of your progress. Type in "CONFIRM" to confirm');
        if (text === 'CONFIRM')
        {
            player = getDefaultPlayerValues()
            //loadToPlayer(btoa(JSON.stringify(getDefaultPlayerValues())));
            save()
            restartGame();
        }
    })

/*     elements.change_star_count.on('click', function()
    {
        const text = prompt(`Type in how many stars you want to see in the background (minimum: ${settings.star_min}, maximum: ${settings.star_max}, default: ${settings.star_count})`),
              number = Number(text);
        if (text !== null && number !== NaN)
        {
            if (number >= settings.star_min && number <= settings.star_max)
            {
                elements.star_context.clearRect(0, 0, elements.star_container[0].clientWidth, elements.star_container[0].clientHeight);
                gameFunctions.spawnStars(number);
            }
        }
    }) */
    elements.hotkeys_toggle.on('click', function() {
        player.hotkeys =! player.hotkeys;
    })

    elements.upgrades_toggle.on('click', function() {
        player.hide_maxed_upgrades =! player.hide_maxed_upgrades;
    })

    elements.fps_changer.on('click', function() {
        const min = 0.1, max = 10000,
              text = prompt(`This will save your game and refresh your page. Type in FPS you want (Minimum is ${min}, Maximum is ${max}, Default is 60)`),
              number = Number(!!text ? text.replace(',', '.') : text);
        if (number && number >= min && number <= max) {
            player.fps = number;
            save();
            window.location.reload();
        }
    })

    elements.background_toggle.on('click', function() {
        player.hide_background =! player.hide_background;
        if (player.hide_background) {
            elements.background.hide();
        } else {
            elements.background.show();
        }
    })

    elements.select_text_toggle.on('click', function() {
        player.select_text =! player.select_text;
        if (player.select_text) {
            elements.root.css('--select-text', 'auto');
        } else {
            elements.root.css('--select-text', '');
        }
    })

    elements.unlocked.on('click', function() {
        elements.unlocked.hide();
        elements.frame.hide();
    })

    elements.discord.on('click', function()
    {
        window.open('https://discord.gg/YT8R2szHXX');
    })

    elements.roblox.on('click', function()
    {
        window.open('https://www.roblox.com/games/12991163528/The-Cub1xion-v0-2-4');
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

    elements.giantcube.on('click contextmenu', function(e)
    {
        if (e.cancelable)
        {
            elements.cube.blur();
            e.preventDefault();
        }
        gameFunctions.damageGiantCube();
    })

    elements.prestige_button.on('click', gameFunctions.prestige);
    elements.light_button.on('click', gameFunctions.light);
    elements.master_button.on('click', gameFunctions.master);
    elements.giga_button.on('click', this.gameFunctions.gigalize);
    elements.neon_button.on('click', function(){gameFunctions.spawnNeonSquare()});
    elements.collapse_button.on('click', this.gameFunctions.collapse);
    elements.galaxy_button.on('click', this.gameFunctions.galaxy);
    elements.black_hole_button.on('click', this.gameFunctions.strangePlace);
    elements.rebuild_button.on('click', gameFunctions.rebuild);
    elements.rebuild_rank_button.on('click', gameFunctions.rebuildRank);
    elements.white_hole_button.on('click', this.gameFunctions.uniquePlace);

    elements.portal.on('click', function(){ gameFunctions.realm(1); })
    elements.portal_2.on('click', function(){ gameFunctions.realm(0); })
    elements.portal_to_realm_3.on('click', function(){ nosave.realm_2_from = nosave.realm; gameFunctions.realm(2); })
    elements.rebuild_portal.on('click', function(){ gameFunctions.realm(nosave.realm_2_from); })

    $(document).on('keyup', function(k)
    {
        if (player.hotkeys) {
            switch (k.code)
            {
                case hotkeys.prestige[0]:
                    gameFunctions.prestige();
                    break;
                case hotkeys.light[0]:
                    gameFunctions.light();
                    break;
                case hotkeys.master[0]:
                    gameFunctions.master();
                    break;
                case hotkeys.giga[0]:
                    gameFunctions.gigalize();
                    break;
                case hotkeys.collapse[0]:
                    gameFunctions.collapse();
                    break;
                case hotkeys.rebuild[0]:
                    gameFunctions.rebuild();
                    break;
            }
        }
    });

    elements.play_without.on('click', function()
    {
        elements.frame.css({'background-color': 'black',
                            'opacity': '0'});
        elements.frame.show();
        elements.frame.animate({'opacity': '1'}, 3 * 1e3,
        function()
        {
            elements.intro.hide();
            elements.main_content.show();
            elements.wrapper.removeClass('wrapper-when-intro');
            elements.frame.animate({'opacity': '0'}, 10 * 1e3, function(){elements.frame.hide()})
            //elements.currencies_place.css('opacity', '0');
            elements.currencies_place.animate({'opacity': '1'}, 1e4);
        });

    })

    elements.play_with.on('click', function()
    {
        elements.frame.css({'background-color': 'black',
                            'opacity': '0'});
        elements.frame.show();
        elements.frame.animate({'opacity': '1'}, 3 * 1e3,
        function()
        {
            elements.intro.hide();
            elements.main_content.show();
            elements.wrapper.removeClass('wrapper-when-intro');

            change_music();
            
            elements.frame.animate({'opacity': '0'}, 10 * 1e3, function(){elements.frame.hide()})
            //elements.currencies_place.css('opacity', '0');
            elements.currencies_place.animate({'opacity': '1'}, 1e4);
        });

    })

    // $(window).resize(function() 
    // {
    //     gameFunctions.starCanvas(); 
    //     //gameFunctions.spawnStars();
    // })
};