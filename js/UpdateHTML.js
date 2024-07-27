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
        fs.update(elements.prestige_button_text, get.prestige_points.lte(N('0e0')) ? `Square required: <span class="cube-text ${ gameFunctions.getFullCubeStyleName(unlocks.prestige) }">
                                                                                                                          ${gameFunctions.getCubeName(unlocks.prestige)}</span>`
                                                                : `You can earn <span class="prestige">${ abb_abs(get.prestige_points) }</span> prestige points`
                                                                        + (get.prestige_points.gte(nosave.prestige_cap_3[0]) ? ` <span class="cap-3">(Hardcapped)</span>` :
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
        fs.update(elements.light_locked_info, `Square required: <span class="cube-text ${ gameFunctions.getFullCubeStyleName(unlocks.light) }"> ${gameFunctions.getCubeName(unlocks.light)}</span> `);
    },
    lightButtonInfo()
    {
        fs.update(elements.light_button_text, get.light_points.lte(N('0e0')) ? `Square required: <span class="cube-text ${ gameFunctions.getFullCubeStyleName(unlocks.light) }">
                                                                                                                                  ${gameFunctions.getCubeName(unlocks.light)}</span>`
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
        fs.update(elements.minicube_locked_info, `Square required: <span class="cube-text ${ gameFunctions.getFullCubeStyleName(unlocks.mini_cubes) }"> ${gameFunctions.getCubeName(unlocks.mini_cubes)}</span> `);
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
        fs.update(elements.master_locked_info, `Square required: <span class="cube-text ${ gameFunctions.getFullCubeStyleName(unlocks.master) }"> ${gameFunctions.getCubeName(unlocks.master)}</span> `);
    },
    masterButtonInfo()
    {
        fs.update(elements.master_button_text, player.stage.lt(get.master_requirement) ? `Square required:
                                                                  ${gameFunctions.getCubeName(get.master_requirement)}`
                                                                 : nosave.milestones.collapse_milestones[0].isEnough() ? `You can increase master level by +${abb_abs_int(get.master_bulk)}` : `You can increase master level`);
        if (player.stage.lte(get.master_requirement)) { elements.master_button_text.addClass('layer-button-text-cannot'); elements.master_button.addClass('button-cannot'); }
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
                                                                (get.giga_squares.gte(nosave.giga_cap[0]) ? ` <span class="cap">(Softcapped)</span>` : ''));
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
        fs.update(elements.collapse_locked_info, `Square required: <span class="cube-text ${ gameFunctions.getFullCubeStyleName(unlocks.collapse) }"> ${gameFunctions.getCubeName(unlocks.collapse)}</span> `);
    },
    collapseButtonInfo()
    {
        fs.update(elements.collapse_button_text, player.stage.lte(unlocks.collapse) ? `Square required:
                                                                  ${gameFunctions.getCubeName(unlocks.collapse)}`
                                                                 : `You can earn <span class="stars">${abb_abs(get.star_gain)}</span> ${get.star_gain.eq(1) ? 'star': 'stars'}`);
        if (player.stage.lte(unlocks.collapse)) { elements.collapse_button_text.addClass('layer-button-text-cannot'); elements.collapse_button.addClass('button-cannot'); }
        else { elements.collapse_button_text.removeClass('layer-button-text-cannot'); elements.collapse_button.removeClass('button-cannot'); }
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
                                                                : `You can transform your stars into <span class="galaxy">${ abb_abs(get.galaxies) }</span> galaxies`);
        if (get.galaxies.lte(N('0e0'))) { elements.galaxy_button_text.addClass('layer-button-text-cannot'); elements.galaxy_button.addClass('button-cannot'); }
        else { elements.galaxy_button_text.removeClass('layer-button-text-cannot'); elements.galaxy_button.removeClass('button-cannot'); }
    },
    galaxyAmount()
    {
        fs.update(elements.galaxy_amount, `<span class="galaxy">Galaxies: </span>${ abb_abs(player.galaxies) }
                                           <br><br><div class="galaxy-line"></div><br>
                                           ${abb(get.g_s, 4, true)}x <span class="stars">stars</span>
                                           <br><span class="stars">Star</span> generator <span class="dark-text">${abb(get.g_p, 3, true)}%</span> of the best
                                           <br><div class="galaxy-line"></div>`);
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