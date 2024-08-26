main_functions.updates = {  // update HTML
    version()
    {
        fs.update(elements.version, `<span class="white-text">v${settings.game_version[0]}.${settings.game_version[1]}${settings.game_version[2] ? '.' + settings.game_version[2] : ''}${settings.game_version[3] ? '.' + settings.game_version[3] : ''}</span>`);
    },
    changelogVersion()
    {
        fs.update(elements.intro_version, `Version ${settings.game_version[0]}.${settings.game_version[1]}${settings.game_version[2] ? '.' + settings.game_version[2] : ''}${settings.game_version[3] ? '.' + settings.game_version[3] : ''}`);
    },
    stage()
    {
        fs.update(elements.stage, `<span class="darker-text">Stage:</span> ${ abb_abs_int(player.stage) }`);
    },
    master()
    {
        fs.update(elements.master, `<span class="master">Master level:</span> ${ abb_abs_int(player.master_level) }`);
    },
    collapse()
    {
        fs.update(elements.collapse, `Collapsed <span style="color: white; animation: none ;">${abb_abs_int(player.collapsed_times)}</span> times`);
    },
    rebuildRank()
    {
        fs.update(elements.rebuild_rank, `<span class="rebuild">Rebuild rank:</span> <span class="white-text-important">${abb_abs_int(player.rebuild_rank)}</span>`);
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
        fs.update(elements.prestige_locked_info, `Square required: <span class="cube-text ${ gameFunctions.getFullCubeStyleName(unlocks.prestige) }"> ${gameFunctions.getCubeNameWithStage(unlocks.prestige)}</span> `);
    },
    prestigeButtonInfo()
    {
        fs.update(elements.prestige_button_text, get.prestige_points.lte(N('0e0')) ? `Square required: <span class="cube-text ${ gameFunctions.getFullCubeStyleName(unlocks.prestige) }">
                                                                                                                          ${gameFunctions.getCubeNameWithStage(unlocks.prestige)}</span>`
                                                                : `You can earn <span class="prestige">${ abb_abs(get.prestige_points) }</span> prestige points`
                                                                        + (get.prestige_points.gte(nosave.prestige_cap_4[0]) ? ` <span class="cap-4">(Overflow)</span>` :
                                                                            get.prestige_points.gte(nosave.prestige_cap_3[0]) ? ` <span class="cap-3">(Hardcapped)</span>` :
                                                                                get.prestige_points.gte(nosave.prestige_cap_2[0]) ? ` <span class="cap-2">(Capped)</span>` :
                                                                                    get.prestige_points.gte(nosave.prestige_cap[0]) ? ` <span class="cap">(Softcapped)</span>` : ''));
        if (get.prestige_points.lte(N('0e0'))) { elements.prestige_button_text.addClass('layer-button-text-cannot'); elements.prestige_button.addClass('button-cannot'); }
        else { elements.prestige_button_text.removeClass('layer-button-text-cannot'); elements.prestige_button.removeClass('button-cannot'); }
    },
    prestigeAmount()
    {
        fs.update(elements.prestige_points_amount, `<span class="prestige">Prestige points: </span>${ abb_abs(player.prestige_points) }` + 
                                                    (nosave.Autoclickers.prestige_generator.isWorking() ? `<br><span class="darker-text">(+${ abb(get.prestige_points) }/s)</span>` : ``));
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
        fs.update(elements.light_locked_info, `Square required: <span class="cube-text ${ gameFunctions.getFullCubeStyleName(unlocks.light) }"> ${gameFunctions.getCubeNameWithStage(unlocks.light)}</span> `);
    },
    lightButtonInfo()
    {
        fs.update(elements.light_button_text, get.light_points.lte(N('0e0')) ? `Square required: <span class="cube-text ${ gameFunctions.getFullCubeStyleName(unlocks.light) }">
                                                                                                                                  ${gameFunctions.getCubeNameWithStage(unlocks.light)}</span>`
                                                                                       : `You can earn <span class="light">${ abb_abs(get.light_points) }</span> light points`
                                                                                       + (get.light_points.gte(nosave.light_cap_3[0]) ? `<br><span class="cap-3">(Hardcapped)</span>` :
                                                                                            get.light_points.gte(nosave.light_cap_2[0]) ? ` <span class="cap-2">(Capped)</span>` :
                                                                                             get.light_points.gte(nosave.light_cap[0]) ? ` <span class="cap">(Softcapped)</span>` : ''));
        if (get.light_points.lte(N('0e0'))) { elements.light_button_text.addClass('layer-button-text-cannot'); elements.light_button.addClass('button-cannot'); }
        else { elements.light_button_text.removeClass('layer-button-text-cannot'); elements.light_button.removeClass('button-cannot'); }
    },
    lightAmount()
    {
        fs.update(elements.light_points_amount, `<span class="light">Light points: </span>${ abb_abs(player.light_points) }`
                                        + (nosave.Autoclickers.light_generator.isWorking() ? `<br><span class="darker-text">(+${ abb(get.light_points) }/s)</span>` : ``));
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
        fs.update(elements.minicube_locked_info, `Square required: <span class="cube-text ${ gameFunctions.getFullCubeStyleName(unlocks.mini_cubes) }"> ${gameFunctions.getCubeNameWithStage(unlocks.mini_cubes)}</span> `);
    },
    miniCubesInfo()
    {
        fs.update(elements.minicube_info, `<span class="darker-text">Mini squares: </span>${ abb_abs(player.mini_cubes) }`
                                    + (get.mini_cubes.gte(nosave.ms_cap_3[0]) ? `<br><span class="cap-3">(Hardcapped)</span>` :
                                        get.mini_cubes.gte(nosave.ms_cap_2[0]) ? `<br><span class="cap-2">(Capped)</span>` :
                                            get.mini_cubes.gte(nosave.ms_cap[0]) ? `<br><span class="cap">(Softcapped)</span>` : '') +
                                           `<br>${ abb_abs(get.mc_pp) }x <span class="prestige">prestige points</span><br>
                                           ${ abb_abs(get.mc_lp) }x <span class="light">light points</span>`);
    },
    masterLockedInfo()
    {
        fs.update(elements.master_locked_info, `Square required: <span class="cube-text ${ gameFunctions.getFullCubeStyleName(unlocks.master) }"> ${gameFunctions.getCubeNameWithStage(unlocks.master)}</span> `);
    },
    masterButtonInfo()
    {
        fs.update(elements.master_button_text, ((player.stage.lt(get.master_requirement) || get.master_bulk.lt(1)) && player.master_level.lt(nosave.master_cap[0]) ? `Square required:
                                                                  ${gameFunctions.getCubeNameWithStage(get.master_requirement)}`
                                                                 : nosave.Autoclickers.master_autoclicker.isWorking() ? `+${abb_abs_int(get.master_average)}/s master levels` :
                                                                    nosave.milestones.collapse_milestones[0].isEnough() ? 
                                                                                    `You can increase master level by +${abb_abs_int(get.master_bulk)}` : `You can increase master level`)
                                                                    + (player.master_level.gte(nosave.master_cap_2[0]) ? ` <span class="cap-2">(Capped)</span>` :
                                                                            player.master_level.gte(nosave.master_cap[0]) ? ` <span class="cap">(Softcapped)</span>` : ''));
        if (player.stage.lt(get.master_requirement)) { elements.master_button_text.addClass('layer-button-text-cannot'); elements.master_button.addClass('button-cannot'); }
        else { elements.master_button_text.removeClass('layer-button-text-cannot'); elements.master_button.removeClass('button-cannot'); }
    },
    masterAmount()
    {
        fs.update(elements.master_text, `Master level: ${abb_abs_int(player.master_level)}`);
    },
    masterMilestones()
    {
        nosave.milestones.master_milestones.forEach((milestone) =>
        {
            milestone.updateHTML();
        })
    },
    giantcubeInfo()
    {
        fs.update(elements.giantcube_info, `<span class="gcs">Stage:</span> ${abb_abs_int(player.giant_cube_stage)} <span class="darker-text">|</span><span class="ruby"> ${abb(Decimal.pow(5, player.giant_cube_stage.minus(1)))}x ruby</span><br>
                                            <span class="white-text">HP: ${ abb_abs(player.giant_cube_hp) }/${ abb_abs(get.giant_cube_hp) } </span><br>
                           
                                            <span class="gcd">Damage:</span> ${ abb(get.giant_cube_damage) }`);
    },
    rubyAmount()
    {
        fs.update(elements.ruby_amount, `<span class="ruby">Ruby:</span> ${ abb_abs(player.ruby) }
                                    <br><span class="darker-text">(+${ abb(get.ruby_gain) }/s)</span>` 
                                    + (get.ruby_gain.gte(nosave.ruby_cap_3[0]) ? ` <span class="cap-3">(Hardcapped)</span>` :
                                        get.ruby_gain.gte(nosave.ruby_cap_2[0]) ? ` <span class="cap-2">(Capped)</span>` :
                                            get.ruby_gain.gte(nosave.ruby_cap[0]) ? ` <span class="cap">(Softcapped)</span>` : ''));
    },
    rubyUpgrades()
    {
        player.upgrades.ruby_upgrades.forEach((upgrade) =>
        {
            upgrade.updateHTML();
        })
    },

    gigaLockedInfo()
    {
        fs.update(elements.giga_locked_info, `Giant Square Stage required: <span class="gcs"> ${abb_abs_int(unlocks.giga_squares)}</span> `);
    },
    gigaButtonInfo()
    {
        fs.update(elements.giga_button_text, get.giga_squares.lte(N('0e0')) ? `Giant Square required: <span class="gcs"> ${abb_abs_int(unlocks.giga_squares)}</span>`
                                                                : `You can earn <span class="giga">${ abb_abs(get.giga_squares) }</span> giga squares` +
                                                                (get.giga_squares.gte(nosave.giga_cap_3[0]) ? ` <span class="cap-3">(Hardcapped)</span>` : 
                                                                  get.giga_squares.gte(nosave.giga_cap_2[0]) ? ` <span class="cap-2">(Capped)</span>` : 
                                                                    get.giga_squares.gte(nosave.giga_cap[0]) ? ` <span class="cap">(Softcapped)</span>` : ''));
        if (get.giga_squares.lte(N('0e0'))) { elements.giga_button_text.addClass('layer-button-text-cannot'); elements.giga_button.addClass('button-cannot'); }
        else { elements.giga_button_text.removeClass('layer-button-text-cannot'); elements.giga_button.removeClass('button-cannot'); }
    },
    gigaAmount()
    {
        fs.update(elements.giga_points_amount, `<span class="giga">Giga squares: </span>${ abb_abs(player.giga_squares) }`
                                                    + (nosave.Autoclickers.giga_generator.isWorking() ? `<br><span class="darker-text">(+${ abb_abs(get.giga_squares) }/sec)</span>` : ``)
                                                );
    },
    gigaUpgrades()
    {
        player.upgrades.giga_upgrades.forEach((upgrade) =>
        {
            upgrade.updateHTML();
        })
    },

    neonInfo()
    {
        fs.update(elements.neon_info, `<span class="darker-text">Neon square tier: </span>${ abb_abs_int(player.neon_tier) }<br>
                                        <span class="neon-luck">Luck: </span>${ abb_abs(get.neon_luck) }<br>
                                           ${ abb_abs(get.n_d) }x <span class="damage">damage</span><br>
                                           ${ abb_abs(get.n_gsd) }x <span class="gcs">GSD</span>`);
    },
    neonButtonInfo()
    {
        fs.update(elements.neon_button_text, `Spawn neon square` + (nosave.neon_rng.gt(0) ? ` (${ abb_abs(nosave.neon_rng) })` : ''));
    },

    collapseLockedInfo()
    {
        fs.update(elements.collapse_locked_info, `Square required: <span class="cube-text ${ gameFunctions.getFullCubeStyleName(unlocks.collapse) }"> ${gameFunctions.getCubeNameWithStage(unlocks.collapse)}</span> `);
    },
    collapseButtonInfo()
    {
        fs.update(elements.collapse_button_text, player.stage.lte(unlocks.collapse) ? `Square required:
                                                                  ${gameFunctions.getCubeNameWithStage(unlocks.collapse)}`
                                                                 : `You can earn <span class="stars">${abb_abs(get.star_gain)}</span> ${get.star_gain.eq(1) ? 'star': 'stars'}`
                                                                 + (get.star_gain.gte(nosave.star_cap_2[0]) ? ` <span class="cap-2">(Capped)</span>` :
                                                                        get.star_gain.gte(nosave.star_cap[0]) ? ` <span class="cap">(Softcapped)</span>` : ''));
        if (player.stage.lt(unlocks.collapse)) { elements.collapse_button_text.addClass('layer-button-text-cannot'); elements.collapse_button.addClass('button-cannot'); }
        else { elements.collapse_button_text.removeClass('layer-button-text-cannot'); elements.collapse_button.removeClass('button-cannot'); }
    },

    replaceCollapse()
    {
        if (player.isUnlocked.galaxyhave && elements.collapse_area_second.find(elements.collapse_layer_area).length === 0) {
            elements.collapse_area_second.append(elements.collapse_layer_area);
        }
        else if (!player.isUnlocked.galaxyhave && elements.main_realm.find(elements.collapse_layer_area).length === 0) {
            elements.main_realm.append(elements.collapse_layer_area);
        }
        if (elements.collapse_area.find(elements.collapse_layer_area).length > 0) {
            if (!elements.collapse_layer_area.hasClass('galaxy-unlocked')) elements.collapse_layer_area.addClass('galaxy-unlocked');
        }
        else {
            if (elements.collapse_layer_area.hasClass('galaxy-unlocked')) elements.collapse_layer_area.removeClass('galaxy-unlocked');
        }
    },
    starsAmount()
    {
        fs.update(elements.stars_amount, `<span class="stars">Stars: </span>${ abb_abs(player.stars) }` 
                                                    + (nosave.Autoclickers.star_generator.isWorking() ? `<br><span class="darker-text">(+${ abb_abs(player.best_stars_on_collapse.times(get.g_p.div(100))) }/sec)</span>` : ``));
    },

    starUpgrades()
    {
        player.upgrades.collapse_upgrades.forEach((upgrade) =>
        {
            upgrade.updateHTML();
        })
    },
    collapseAmount()
    {
        fs.update(elements.collapse_text, `You have collapsed ${abb_abs_int(player.collapsed_times)} times`);
    },
    collapseMilestones()
    {
        nosave.milestones.collapse_milestones.forEach((milestone) =>
        {
            milestone.updateHTML();
        })
    },
    galaxyButtonInfo()
    {
        fs.update(elements.galaxy_button_text, get.galaxies.lte(N('0e0')) ? `Stars required: <span class="galaxy"> ${ abb_abs(unlocks.galaxy) }</span>`
                                                                : `You can transform your stars into <span class="galaxy">${ abb_abs(get.galaxies) }</span> galaxies`
                                                                + (get.galaxies.gte(nosave.galaxy_cap[0]) ? ` <span class="cap">(Softcapped)</span>` : ''));
        if (get.galaxies.lte(N('0e0'))) { elements.galaxy_button_text.addClass('layer-button-text-cannot'); elements.galaxy_button.addClass('button-cannot'); }
        else { elements.galaxy_button_text.removeClass('layer-button-text-cannot'); elements.galaxy_button.removeClass('button-cannot'); }
    },
    galaxyAmount()
    {
        fs.update(elements.galaxy_amount, `<span class="galaxy">Galaxies: </span>${ abb_abs(player.galaxies) }` + 
                        (nosave.Autoclickers.galaxy_generator.isWorking() ? `<br><span class="darker-text">(+${abb_abs(get.galaxies.times(player.rebuild_rank.minus(6)))}/sec)</span><br>` : `<br><br>`) +
                                          `<div class="galaxy-line"></div><br>\
                                           ${abb(get.g_s, 4, true)}x <span class="stars">stars</span>\
                                           <br><span class="stars">Star</span> generator <span class="dark-text">${abb(get.g_p, 3, true)}%</span> of the best\
                                           <br><div class="galaxy-line"></div>`);
    },
    hotkeysInfo()
    {
        fs.update(elements.hotkeys_info, `${player.isUnlocked.prestige_reached ? `<span class="size-150">Hotkeys:</span><br><span class="darker-text">Prestige: ${hotkeys.prestige[1]}` : ''}\
                                          ${player.isUnlocked.light_reached ? `<br>Light: ${hotkeys.light[1]}` : ''}\
                                          ${player.isUnlocked.master_reached ? `<br>Master: ${hotkeys.master[1]}` : ''}\
                                          ${player.isUnlocked.gigacube_reached ? `<br>Gigalize: ${hotkeys.giga[1]}` : ''}\
                                          ${player.isUnlocked.collapse_reached ? `<br>Collapse: ${hotkeys.collapse[1]}` : ''}\
                                          ${player.isUnlocked.rebuild_reached ? `<br>Rebuild: ${hotkeys.rebuild[1]}` : ''}</span>`);
    },
    hotkeysToggleInfo()
    {
        fs.update(elements.hotkeys_toggle_info, `Hotkeys: ${player.hotkeys ? 'ON' : 'OFF'}`);
    },
    upgradesToggleInfo()
    {
        fs.update(elements.upgrades_toggle_info, `Hide maxed upgrades: ${player.hide_maxed_upgrades ? 'ON' : 'OFF'}`)
    },
    blackHoleInfo()
    {
        if (player.isUnlocked.strangeplace_once) {
            if (elements.black_hole_info.hasClass('black-holes-dark')) elements.black_hole_info.removeClass('black-holes-dark');
            if (!elements.black_hole_info.hasClass('black-holes')) elements.black_hole_info.addClass('black-holes');
        } else {
            if (elements.black_hole_info.hasClass('black-holes')) elements.black_hole_info.removeClass('black-holes');
            if (!elements.black_hole_info.hasClass('black-holes-dark')) elements.black_hole_info.addClass('black-holes-dark')
        }
        fs.update(elements.black_hole_info, player.isUnlocked.strangeplace_once && player.black_holes.gt(0) ? `<span class="size-125">Black holes: <span class="white-text-important">${abb(player.black_holes, 2, true)}</span>\
                                                                                   <br><span class="white-text-important">${abb_abs(get.bh_s)}x</span> <span class="stars">stars</span>\
                                                                                   <br><span class="white-text-important">${abb_abs(get.bh_ct)}x</span> <span class="collapse-text">collapsed times</span></span>`
                                                : 'Entering the strange place forces collapse.\
                                                All pre-collapse currency gain<sup>0.5</sup>. Leaving the strange place gives you black holes based on your stage.')
    },
    blackHoleButtonInfo()
    {
        fs.update(elements.black_hole_button_text, player.strange_place ? (nosave.Autoclickers.blackhole_generator.isWorking() ? `Setting your black holes to ${abb_abs(get.bh)}` : ( `You ${get.bh.gt(player.black_holes) ? "can" : "can't"} set your black holes to ${abb_abs(get.bh)}`))
                        + (get.bh.gte(nosave.black_hole_cap[0]) ? ` <span class="cap">(Softcapped)</span>` : '') : `Enter the strange place`);
    },
    fpsChangerInfo()
    {
        fs.update(elements.fps_changer_info, `FPS: ${player.fps}`);
    },
    backgroundToggleInfo()
    {
        fs.update(elements.background_toggle_info, `Hide the background (less laggy): ${player.hide_background ? 'ON' : 'OFF'}`);
    },
    selectTextToggleInfo()
    {
        fs.update(elements.select_text_toggle_info, `Select text: ${player.select_text ? 'ON' : 'OFF'}`);
    },
    rebuildButtonInfo()
    {
        fs.update(elements.rebuild_button_text, player.stage.lte(unlocks.rebuild) ? `Square required:
                                                ${gameFunctions.getCubeNameWithStage(unlocks.rebuild)}` : 
                                                `You can earn <span class="rebuild">${abb(get.ug_gain)}</span> universe generators`
                                                + (get.ug_gain.gte(nosave.universe_generator_cap[0]) ? ` <span class="cap">(Softcapped)</span>` : ''));
        if (player.stage.lt(unlocks.rebuild)) { elements.rebuild_button_text.addClass('layer-button-text-cannot'); elements.rebuild_button.addClass('button-cannot'); }
        else { elements.rebuild_button_text.removeClass('layer-button-text-cannot'); elements.rebuild_button.removeClass('button-cannot'); }
    },
    UGInfo()
    {
        fs.update(elements.ug_info, `<span class="rebuild">Universe generators:</span> <span class="white-text">${abb_abs(player.universe_generators)}</span> <span class="dark-text">|</span> <span class="rebuild">${abb_abs(player.universe_generators.pow(3))}x universes</span>`
                                    + (nosave.Autoclickers.ug_generator.isWorking() ? `<br><span class="darker-text">(+${abb_abs(get.ug_gain.div(nosave.Autoclickers.ug_generator2.isWorking() ? (100/3) : 100))}/sec)</span>` : '<br>') +
                                     `<br><span class="rebuild">Universes:</span> <span class="white-text">${abb_abs(player.universes)}</span> <span class="darker-text">(+${abb_abs(get.universe_gain)}/sec)</span><br><br>\
                                     <div class="line"></div><br>\
                                     <span class="white-text size-75">Raises your <span class="damage">damage</span> to the power of <span class="pow">${abb_abs(get.u_d)}</span>` +
                                     (nosave.milestones.rebuild_milestones[9].isEnough() ? `<br><span class="white-text">Raises your <span class="stars">stars</span> to the power of <span class="pow">${abb(get.u_s, 4, true)}</span>` : '')
                                     + `<br><div class="line"></div>`);
    },
    rebuildMilestonesInfo()
    {
        fs.update(elements.rebuild_milestones_info, `<span class="rebuild">Rebuild rank:</span> <span class="white-text">${abb_abs_int(player.rebuild_rank)}</span>`)
    },
    rebuildRankButtonText()
    {
        fs.update(elements.rebuild_rank_button_text, player.universes.gte(get.rr_req) ? (nosave.milestones.rebuild_milestones[11].isEnough() ? `You can increase rebuild rank by +${abb_abs_int(get.rr_bulk)}` : `You can increase rebuild rank`) : `Universes required: <span class="rebuild">${abb_abs(get.rr_req)}</span>`)
        if (player.universes.lt(get.rr_req)) { elements.rebuild_rank_button_text.addClass('layer-button-text-cannot'); elements.rebuild_rank_button.addClass('button-cannot'); }
        else { elements.rebuild_rank_button_text.removeClass('layer-button-text-cannot'); elements.rebuild_rank_button.removeClass('button-cannot'); }
    },
    rebuildMilestones()
    {
        nosave.milestones.rebuild_milestones.forEach((milestone) =>
        {
            milestone.updateHTML();
        })
    },
    rebuildNormalRealm()
    {
        if (nosave.milestones.rebuild_milestones[9].isEnough()) {
            if (!elements.master_area.hasClass('rebuilt')) elements.master_area.addClass('rebuilt');
            if (!elements.portal.hasClass('rebuilt')) elements.portal.addClass('rebuilt');
            if (!elements.rebuild_portal_normal.hasClass('rebuilt')) elements.rebuild_portal_normal.addClass('rebuilt');
            if (!elements.portals.hasClass('rebuilt')) elements.portals.addClass('rebuilt');
            if (elements.portals.find(elements.portal).length === 0) elements.portals.append(elements.portal);
            if (elements.portals.find(elements.rebuild_portal_normal).length === 0) elements.portals.append(elements.rebuild_portal_normal);
        }
        else {
            if (elements.master_area.hasClass('rebuilt')) elements.master_area.removeClass('rebuilt');
            if (elements.portal.hasClass('rebuilt')) elements.portal.removeClass('rebuilt');
            if (elements.rebuild_portal_normal.hasClass('rebuilt')) elements.rebuild_portal_normal.removeClass('rebuilt');
            if (elements.portals.hasClass('rebuilt')) elements.portals.removeClass('rebuilt');
            if (elements.portals.find(elements.portal).length > 0) elements.main_realm.append(elements.portal);
            if (elements.portals.find(elements.rebuild_portal_normal).length > 0) elements.main_realm.append(elements.rebuild_portal_normal);
        }
    },

    whiteHoleInfo()
    {
        fs.update(elements.white_hole_info, player.isUnlocked.uniqueplace_once && player.white_holes.gt(0) ? `<span class="size-125"><span class="white-holes-dark">White holes:</span> <span class="white-text no-gradient">${abb(player.white_holes, 3, true)}</span>\
                                                                                   <br><span class="white-text">Raises your <span class="black-holes">black holes</span> to the power of <span class="pow">${abb(get.wh_bh, 4, true)}</span></span>`
                                                : "<span class='white-holes-dark'>Entering the unique place place forces rebuild. All pre-rebuild currency's overflow starts immediately. Leaving the unique place gives you white holes based on your stage starting at 100.</span>")
    },
    whiteHoleButtonInfo()
    {
        fs.update(elements.white_hole_button_text, player.unique_place ? (`You ${get.wh.gt(player.white_holes) ? "can" : "can't"} set your white holes to ${abb(get.wh, 3, true)}`) : `Enter the unique place`);
    },
    replaceRebuild()
    {
        if (nosave.milestones.rebuild_milestones[11].isEnough() && elements.rebuild_area_main.find(elements.rebuild_layer_area).length === 0) {
            elements.rebuild_area_main.append(elements.rebuild_layer_area);
            if (!elements.rebuild_layer_area.hasClass('moved')) elements.rebuild_layer_area.addClass('moved');
        }
        else if (!nosave.milestones.rebuild_milestones[11].isEnough() && elements.galaxy_area_main.find(elements.rebuild_layer_area).length === 0) {
            elements.galaxy_area_main.append(elements.rebuild_layer_area);
            if (elements.rebuild_layer_area.hasClass('moved')) elements.rebuild_layer_area.removeClass('moved');
        }
    },

    updateAll()
    {
        for (let upd in this)
        {
            if (upd !== "updateAll") this[upd]();
        }
        /* this.version();
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
        this.giantcubeInfo();
        this.rubyAmount();
         this.rubyUpgrades();
        this.gigaLockedInfo();
        this.gigaButtonInfo();
        this.gigaAmount();
         this.gigaUpgrades();
        this.neonInfo();
        this.neonButtonInfo();
        this.collapseButtonInfo();*/
    }
};