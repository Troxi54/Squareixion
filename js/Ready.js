$(document).ready(function()
{
    elements = {
        wrapper: $('#wrapper'),
            intro: $('#intro'),
            intro_version: $('#changelog-title'),
            play_with: $('#play-with'),
            play_without: $('#play-without'),
        main_content: $('#main-content'),
            version: $('#version'),
            background: $('#background'),
            music: $('#music'),
            change_music: $('#change-music'),
            change_music_text: $('#change-music-text'),
            change_realm_music: $('#change-realm-music'),
            change_realm_music_text: $('#change-realm-music-text'),
            outside_music: $('#outside-music'),
            outside_music_text: $('#outside-music-text'),
        frame: $('#frame'),
            frame_text: $('#frame-text'),
        frame_2: $('#frame-2'),
            frame_text_2: $('#frame-text-2'),
        main_realm: $('#main-realm'),
        currencies_place: $('#currencies-place'),
            stage: $('#stage'),
            master: $('#master'),
            collapse: $('#collapse'),
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
                roblox: $('#roblox'),
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
        giantcube_area: $('#giantcube-area'),
            giantcube_info: $('#giantcube-info-text'),
            giantcube: $('.g-cube'),
            ruby_amount: $('#ruby-upgrades-info'),
        giga_area: $('#giga-area'),
            giga_locked_div: $('#giga-div-locked'), giga_locked_info: $('#giga-locked'),
            giga_unlocked_div: $('#giga-div-unlocked'),
            giga_button: $('#giga-button'),
                giga_button_text: $('#giga-button-text'),
            giga_upgrades_div: $('#giga-upgrades-div'),
                giga_points_amount: $('#giga-upgrades-info'),
        neon_area: $('#neon-area'),
            neon_info_div: $('#neon-info-div'),
            neon_info: $('#neon-info'),
            neon_button: $('#neon-spawn'),
                neon_button_text: $('#neon-button-text'),
            neon_square: $('.neon-square'),
        collapse_layer_area: $('#collapse-layer-area'),
            collapse_locked_div: $('#collapse-div-locked'), collapse_locked_info: $('#collapse-locked'),
            collapse_unlocked_div: $('#collapse-div-unlocked'),
            collapse_div: $('#collapse-div'),
            collapse_button: $('#collapse-button'),
                collapse_button_text: $('#collapse-button-text'),
        collapse_realm: $('#collapse-realm'),
            portal: $('#portal'),
            portal_2: $('#portal-2'),
            collapse_upgrades_div: $('#collapse-upgrades-div'),
                stars_amount: $('#collapse-upgrades-info'),
            collapse_text: $('#collapse-milestones-info'),
        galaxy_area: $('#galaxy-area'),
            galaxy_button: $('#galaxy-button'),
            galaxy_button_text: $('#galaxy-button-text'),
            galaxy_amount: $('#galaxy-info'),
    };  

    setNosaveValues();
    player = getDefaultPlayerValues();
    loadToPlayer();
    
   

    fixValues();

    
    
    //player.masters_on_collapse = N(1e4);

    get.updateCubeStat();
    gameFunctions.spawnCube(JSON.stringify(player.cube_hp) === JSON.stringify(getDefaultPlayerValues()));
    get.updateGcHP();
    gameFunctions.spawnGCube( JSON.stringify(player.giant_cube_hp) === JSON.stringify(getDefaultPlayerValues().giant_cube_hp));
    gameFunctions.spawnNeonSquare(true);
    get.updateAll();
    main_functions.add_events();
    
    fs.setUpgradesHTML();
    fs.setMilestonesHTML();
    
    gameFunctions.hideElements();
    gameFunctions.hideAndShowContent(false); gameFunctions.hideAndShowContent(false);
    fs.hide_and_show(elements.main_content, !settings.intro, false);
    fs.hide_and_show(elements.intro, settings.intro, false);
    if (!settings.intro) {
        elements.currencies_place.css('opacity', '1');
        elements.wrapper.removeClass('wrapper-when-intro');
    }
    //updates.updateAll();

    elements.frame.hide();
    gameFunctions.realm(nosave.realm);

    fs.update(elements.change_realm_music_text, `Always play normal realm music: ${player.always_play_normal_realm_music ? `yes` : `no`}`);
    fs.update(elements.outside_music_text, `Play music outside the page: ${player.outside_music ? `yes` : `no`}`)

    normal_realm_music = shuffleArray(normal_realm_music);
    

    //gameFunctions.afkGenerators();
    //elements.star_context = elements.star_container[0].getContext('2d');
    //gameFunctions.starCanvas();
    //gameFunctions.spawnStars(settings.star_count);
    // place for console logs
    //
    setInterval(mainLoop, getLoopInterval())
});