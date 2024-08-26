main_functions.get = { // Update and get currencies that are based on formulas
    updateCubeStat()
    {
        let index = -1;
        cubes.every(function(cube){
            if (player.stage.gte(cube.start_at)) {
                index += 1;
                return true;
            }
            return false;
        })
        this.cube_stat = cubes[index];

        
        this.cube_total_hp = gameFunctions.getCubeHP(N('0e0'));
        this.cube_name = gameFunctions.getCubeName(player.stage);
        this.cube_style = gameFunctions.getCubeStyleName(player.stage);
    },
    cube_stat: new Cube(),
    cube_total_hp: N('0e0'),
    cube_name: "",
    cube_style: "",

    updateDamage()
    {
        this.damage = this.uniquePlace2(fs.upgradesEffect('damage')
                                         .times(get.n_d)
                                         .times(fs.milestonesEffect('damage'))
                                         .pow(fs.upgradesEffectPow('damage'))
                                         .pow(get.bh_effect)
                                         .pow(get.u_d)
                                         .times(nosave.damage_multi));
    },
    damage: N('1e0'),

    updatePrestigePoints()
    {
        this.prestige_points = this.uniquePlace(N(+player.stage.gte(unlocks.prestige))
                                    .times(player.prestige_points_base.pow(player.stage.minus(unlocks.prestige)))
                                    .times(get.mc_pp)
                                    .times(fs.upgradesEffect('prestige_points'))
                                    .times(fs.milestonesEffect('prestige_points'))
                                    .pow(fs.upgradesEffectPow('prestige_points'))
                                    .times(nosave.prestige_points_multi)
                                    .pow(get.bh_effect)
                                    .softcap(nosave.prestige_cap[0], nosave.prestige_cap[1], 'pow')
                                    .softcap(nosave.prestige_cap_2[0], nosave.prestige_cap_2[1], 'pow')
                                    .softcap(nosave.prestige_cap_3[0], nosave.prestige_cap_3[1], 'pow')
                                    .overflow(nosave.prestige_cap_4[0], nosave.prestige_cap_4[1], nosave.prestige_cap_4[2]));
    },
    prestige_points: N('0e0'),

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
        const bonus = player.stage.minus(45 - 7).max(1).div(7).floor(),
              multiplier = N(7).times(player.stage.div(200).plus(1));
        this.light_points = this.uniquePlace(N(+player.stage.gte(unlocks.light))
                                                        .times(Decimal.pow(3.5, player.stage.gte(80) ? N(80).minus(45 - 7).max(1).div(7).floor().plus(player.stage.minus(80).max(1).div(multiplier).floor()) : bonus))
                                                        .times(get.mc_lp)
                                                        .times(fs.upgradesEffect('light_points'))
                                                        .times(fs.milestonesEffect('light_points'))
                                                        .pow(fs.upgradesEffectPow('light_points'))
                                                        .times(nosave.light_points_multi)
                                                        .pow(get.bh_effect)
                                                        .softcap(nosave.light_cap[0], nosave.light_cap[1], 'pow')
                                                        .softcap(nosave.light_cap_2[0], nosave.light_cap_2[1], 'pow')
                                                        .softcap(nosave.light_cap_3[0], nosave.light_cap_3[1], 'pow'));
    },
    light_points: N('0e0'),

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
        this.mini_cubes = this.uniquePlace(fs.upgradesEffect('mini_cubes')
                                            .times(fs.milestonesEffect('mini_cubes'))
                                            .pow(fs.upgradesEffectPow('mini_cubes'))
                                            .times(nosave.mini_cubes_multi)
                                            .pow(get.bh_effect)
                                            .softcap(nosave.ms_cap[0], nosave.ms_cap[1], 'pow')
                                            .softcap(nosave.ms_cap_2[0], nosave.ms_cap_2[1], 'pow')
                                            .softcap(nosave.ms_cap_3[0], nosave.ms_cap_3[1], 'pow'));
    },
    mini_cubes: N('0e0'),

    updateMiniCubePPEffect()
    {
        const pp = N('2.75e0');
        this.mc_pp = pp.pow(pp.pow(N('1e0').plus(player.mini_cubes.max(0)).log10()).log10());
    },
    mc_pp: N('1e0'),

    updateMiniCubeLPEffect()
    {
        const lp = N('2.05e0');
        this.mc_lp = lp.pow(lp.pow(N('1e0').plus(player.mini_cubes.max(0)).log10()).log10());
    },
    mc_lp: N('1e0'),

    updateMasterRequirement(master_level = player.master_level, caps=true)
    {
        let pre_softcap = unlocks.master.plus(Decimal.times(14, master_level).times(Decimal.plus(1, master_level.gt(0) ? master_level.log(2) : 0))).floor();

        //pre_softcap = master_level.gt(nosave.master_cap[0]) ? pre_softcap.softcap(get.updateMasterRequirement(nosave.master_cap[0]), N(1).div(nosave.master_cap[1]), 'pow') : pre_softcap;
        //pre_softcap = master_level.gt(nosave.master_cap_2[0]) ? pre_softcap.softcap(get.updateMasterRequirement(nosave.master_cap_2[0]), N(1).div(nosave.master_cap_2[1]), 'pow') : pre_softcap;


        this.master_requirement = master_level.eq(player.master_level) ? pre_softcap : this.master_requirement;
        return pre_softcap;
    },
    master_requirement: N(1000),

    updateMasterBulk(stage = player.stage)
    {
        //console.log(JSON.parse(JSON.stringify(player)), JSON.parse(JSON.stringify(get)))
        let bulk = N(0);
        const part = stage.minus(unlocks.master).times(Math.log(2));
        bulk = stage.gt(unlocks.master) ? part.dividedBy(7).lambertw().times(14).reciprocate().times(part)
                                    .softcap(nosave.master_cap[0], nosave.master_cap[1], 'pow')
                                    .softcap(nosave.master_cap_2[0], nosave.master_cap_2[1], 'pow')
                                    .minus(player.master_level)
                                    .max(0)
                                                    
                                                    .floor() : 
                                                    stage.eq(unlocks.master) ? N(0) : N(0);
        if (stage.gte(get.master_requirement)) bulk = bulk.plus(1);
        //console.log(bulk.gte(nosave.master_cap[0]))
        if (stage.eq(player.stage)) {
            this.master_bulk = bulk;
            if (nosave.master_average.length > 25) nosave.master_average.shift();
            nosave.master_average.push(bulk);
            let average = N(0);
            nosave.master_average.forEach(v=>{average = average.plus(v)});
            average = average.div(nosave.master_average.length).times(settings.fps);
            this.master_average = average;
        }
        
        return bulk;
    },
    master_bulk: N(0),
    master_average: N(0),

    updateMasterMilestonesValues()
    {
        nosave.milestones.master_milestones.forEach((milestone) => 
        {
            milestone.isEnough();
            milestone.updateEffect();
        })
    },

    gcHP(stage)
    {
        return Decimal.pow(10, stage);
    },
    updateGcHP(stage = player.giant_cube_stage)
    {
        //console.log(stage)
        this.giant_cube_hp = this.gcHP(stage);
    },
    giant_cube_hp: N(0),

    updateGcDamage()
    {
        this.giant_cube_damage = this.uniquePlace(fs.upgradesEffect('giant_cube_damage')
                                                .times(fs.milestonesEffect('giant_cube_damage'))
                                                .times(get.n_gsd)
                                                .pow(fs.upgradesEffectPow('giant_cube_damage'))
                                                .times(nosave.giant_cube_damage_multi)
                                                .pow(get.bh_effect));
    },
    giant_cube_damage: N('1e0'),

    updateRubyGain()
    {
        this.ruby_gain = this.uniquePlace(Decimal.pow(5, player.giant_cube_stage.minus(1))
                                    .times(fs.upgradesEffect('ruby'))
                                    .times(fs.milestonesEffect('ruby'))
                                    .pow(fs.upgradesEffectPow('ruby'))
                                    .times(nosave.ruby_multi)
                                    .pow(get.bh_effect)
                                    .softcap(nosave.ruby_cap[0], nosave.ruby_cap[1], 'pow')
                                    .softcap(nosave.ruby_cap_2[0], nosave.ruby_cap_2[1], 'pow')
                                    .softcap(nosave.ruby_cap_3[0], nosave.ruby_cap_3[1], 'pow'));
    },
    ruby_gain: N('0e0'),

    updateRubyUpgradesValues()
    {
        player.upgrades.ruby_upgrades.forEach((upgrade) => 
        {
            upgrade.updateCost();
            upgrade.updateEffect();
        });
    },

    updateGigaSquareGain()
    {
        this.giga_squares = this.uniquePlace(Decimal.pow(player.giant_cube_stage.gte(unlocks.giga_squares) ? player.giant_cube_stage.log(10) : 1, player.giant_cube_stage.minus(unlocks.giga_squares).max(0).pow(0.75))  
                                                                    .times(fs.upgradesEffect('giga_square'))
                                                                    .times(fs.milestonesEffect('giga_square'))
                                                                    .pow(fs.upgradesEffectPow('giga_square'))
                                                                    .times(nosave.giga_square_multi)
                                                                    .pow(get.bh_effect)
                                                                    .times(+player.giant_cube_stage.gte(unlocks.giga_squares))
                                                                    .softcap(nosave.giga_cap[0], nosave.giga_cap[1], 'pow')
                                                                    .softcap(nosave.giga_cap_2[0], nosave.giga_cap_2[1], 'pow')
                                                                    .softcap(nosave.giga_cap_3[0], nosave.giga_cap_3[1], 'pow'));
    },
    giga_squares: N('0e0'),

    updateGigaUpgradesValues()
    {
        player.upgrades.giga_upgrades.forEach((upgrade) => 
        {
            upgrade.updateCost();
            upgrade.updateEffect();
        });
    },

    updateNeonLuck()
    {
        this.neon_luck = this.uniquePlace(N(3).times(fs.upgradesEffect('neon_luck'))
                                                    .times(fs.milestonesEffect('neon_luck'))
                                                    .pow(fs.upgradesEffectPow('neon_luck'))
                                                    .times(nosave.neon_luck_multi)
                                                    .pow(get.bh_effect));
    },
    neon_luck: N('1e0'),

    updateNeonDEffect()
    {
        this.n_d = Decimal.pow('1e4000', player.neon_tier.times(player.neon_tier.gte(1) ? player.neon_tier.log10().plus(1) : 1));
    },
    n_d: N('1e0'),

    updateNeonGSDEffect()
    {
        this.n_gsd = Decimal.pow('1e40', player.neon_tier.times(player.neon_tier.gte(1) ? player.neon_tier.log10().plus(1) : 1));
    },
    n_gsd: N('1e0'),

    updateCollapsedTimesGain()
    {
        this.ct_g = get.bh_ct.times(nosave.collapsed_times_multi);
    },
    ct_g: N('1e0'),

    updateStarGain()
    {
        this.star_gain = this.uniquePlace(N(+player.stage.gte(unlocks.collapse))
                                        .times(5)
                                        .times(get.g_s)
                                        .times(fs.upgradesEffect('stars'))
                                        .times(fs.milestonesEffect('stars'))
                                        .times(get.bh_s)
                                        .pow(fs.upgradesEffectPow('stars'))
                                        .pow(get.u_s)
                                        .times(nosave.stars_multi)
                                        .softcap(nosave.star_cap[0], nosave.star_cap[1], 'pow')
                                        .softcap(nosave.star_cap_2[0], nosave.star_cap_2[1], 'pow'));
    },
    star_gain: N('0e0'),

    updateStarUpgradesValues()
    {
        player.upgrades.collapse_upgrades.forEach((upgrade) => 
        {
            upgrade.updateCost();
            upgrade.updateEffect();
        });
    },

    updateCollapseMilestonesValues()
    {
        nosave.milestones.collapse_milestones.forEach((milestone) => 
        {
            milestone.isEnough();
            milestone.updateEffect();
        })
    },

    updateGalaxiesGain()
    {
        const div = player.stars.div(unlocks.galaxy);
        this.galaxies = this.uniquePlace(N(+player.stars.gte(unlocks.galaxy)).times(Decimal.pow(10, div.gt(1) ? div.log(10) : 0))
                                                .times(fs.upgradesEffect('galaxies'))
                                                .times(fs.milestonesEffect('galaxies'))
                                                .pow(fs.upgradesEffectPow('galaxies'))
                                                .softcap(nosave.galaxy_cap[0], nosave.galaxy_cap[1], 'pow'));
    },
    galaxies: N('0e0'),

    updateGalaxySEffect()
    {
        this.g_s = Decimal.pow(1.75, player.galaxies.gt(1) ? player.galaxies.log(10) : 0);
    },
    g_s: N('1e0'),

    updateGalaxyPEffect()
    {
        this.g_p = Decimal.pow(1.15, player.galaxies.gt(1) ? player.galaxies.log(10) : 0).times(10).min(500);
    },
    g_p: N('1e0'),

    updateBlackHoleEffect()
    {
        this.bh_effect = nosave.milestones.rebuild_milestones[8].isEnough() || !player.strange_place ? N(1) : N(0.5);
    },
    bh_effect: N('1e0'),

    updateBlackHoleGain()
    {
        this.bh = this.uniquePlace(player.stage.lt('1e9') ? N(0) : Decimal.pow(1.9, player.stage.div('1e9').log(10))
                                                .times(fs.upgradesEffect('black_holes'))
                                                .times(fs.milestonesEffect('black_holes'))
                                                .pow(fs.upgradesEffectPow('black_holes'))
                                                .pow(get.wh_bh)
                                                            .softcap('3e9', 7, 'pow')
                                                            .softcap('4e26', 0.75, 'pow')
                                                            .softcap('1e34', 1.5, 'pow')
                                                            .softcap('1e122', 3, 'pow')
                                                            .softcap('1e130', 0.25, 'pow')
                                                            .softcap(nosave.black_hole_cap[0], nosave.black_hole_cap[1], 'pow')
                                                            .minus(1));
    },
    bh: N('0e0'),

    updateBHCTEffect()
    {
        this.bh_ct = Decimal.pow(110, N(1).plus(player.black_holes.max(0)).log10());
    },
    bh_ct: N('1e0'),

    updateBHSEffect()
    {
        this.bh_s = Decimal.pow(40, N(1).plus(player.black_holes.max(0)).log10());
    },
    bh_s: N('1e0'),

    updateUGGain()
    {
        this.ug_gain = player.stage.gte(unlocks.rebuild) ? Decimal.pow(1.075, player.galaxies.div('e339').max(1).log(10)
                                                                                                .softcap(61, 5, 'mul'))
                                                            .times(fs.upgradesEffect('universe_generators'))
                                                            .times(fs.milestonesEffect('universe_generators'))
                                                            .pow(fs.upgradesEffectPow('universe_generators'))
                                                            .times(nosave.universe_generators_multi) : N(0)
                                                            .softcap(nosave.universe_generator_cap[0], nosave.universe_generator_cap[1], 'pow');

    },
    ug_gain: N('0e0'),

    updateUniverseGain()
    {
        this.universe_gain = player.universe_generators.pow(3)
                                                            .times(fs.upgradesEffect('universes'))
                                                            .times(fs.milestonesEffect('universes'))
                                                            .pow(fs.upgradesEffectPow('universes'))
                                                            .times(nosave.universe_multi);
    },
    universe_gain: N('0e0'),

    updateUDEffect()
    {
        this.u_d = player.universes.max(1).pow(0.3)
                                            .softcap(26.5, 4, 'pow')
                                            .softcap(3500, 4, 'pow')
                                            .softcap('3e15', 0.5, 'pow')
                                            .softcap('1e28', 2, 'pow')
                                            .softcap('1e33', 2, 'pow')
                                            .softcap('1e40', 2, 'pow')
                                            .softcap('1e80', 0.5, 'pow')
                                            .softcap('e1000', 0.4, 'pow');
    },
    u_d: N('1e0'),

    updateUSEffect()
    {
        this.u_s = player.universes.gte('e29') && nosave.milestones.rebuild_milestones[9].isEnough() ? 
                        N(1).plus(player.universes.div('e29').log(10).div(25)).pow(.5)
                                    .softcap(1.25, .3, 'pow')
                                    .softcap(1.5, .7, 'pow')
         : N('1');
    },
    u_s: N('1e0'),

    updateRebuildRankRequirement()
    {
        this.rr_req = N(100).times(Decimal.pow(100, player.rebuild_rank));
    },
    rr_req: N('1e1000'),

    updateRebuildRankBulk()
    {
        this.rr_bulk = player.universes.div(100).log(100).minus(player.rebuild_rank).max(0).plus(1).floor();
    },
    rr_bulk: N('0e0'),

    updateRebuildMilestonesValues()
    {
        nosave.milestones.rebuild_milestones.forEach((milestone) =>
        {
            milestone.isEnough();
            milestone.updateEffect();
        })
    },

    uniquePlace(currency) {
        return player.unique_place ? currency.overflow(1, 0.4, 2) : currency;
    },
    uniquePlace2(currency) {
        return player.unique_place ? currency.overflow(1, 0.62213, 2) : currency;
    },

    updateWhiteHoleGain()
    {
        this.wh = player.stage.lt('1e2') ? N(0) : Decimal.pow(5, player.stage.div(100 / 1.17).log(1.17))
                                                .times(fs.upgradesEffect('white_holes'))
                                                .times(fs.milestonesEffect('white_holes'))
                                                .pow(fs.upgradesEffectPow('white_holes'))
                                                .softcap(20, 1.1, 'pow')
                                                .softcap(50, 1.1, 'pow')
                                                .softcap('2e15', 0.25, 'pow');
    },
    wh: N('0e0'),

    updateWHBHEffect()
    {
        this.wh_bh = Decimal.pow(1.1, N(1).plus(player.white_holes.max(0)).log10())
                                            .softcap(5, 0.5, 'pow');
    },
    wh_bh: N('1e0'),

    updateAll()
    {
        this.updateWhiteHoleGain();
        this.updateWHBHEffect();
        this.updateRebuildRankBulk()
        this.updateRebuildMilestonesValues();
        this.updateCollapseMilestonesValues();
        this.updateMasterMilestonesValues();
        this.updateRebuildRankRequirement();
        this.updateUDEffect();
        this.updateBlackHoleEffect();
        this.updateBlackHoleGain();
        this.updateBHCTEffect();
        this.updateBHSEffect();
        this.updateCollapsedTimesGain();
        this.updatePrestigeUpgradesValues();
        this.updateLightUpgradesValues();
        this.updateRubyUpgradesValues();
        this.updateGigaUpgradesValues();
        this.updateStarUpgradesValues();
        this.updateCubeStat();
        this.updateMasterBulk();
        this.updateMasterRequirement();
        this.updateMiniCube();
        this.updateMiniCubePPEffect();
        this.updateMiniCubeLPEffect();
        this.updateNeonDEffect();
        this.updateNeonGSDEffect();
        this.updatePrestigePoints();
        this.updateLightPoints();
        this.updateGcHP();
        this.updateRubyGain();
        this.updateGigaSquareGain();
        this.updateNeonLuck();
        this.updateGalaxySEffect();
        this.updateGalaxyPEffect();
        this.updateUSEffect();
        this.updateStarGain();
        this.updateGalaxiesGain();
        this.updateUGGain();
        this.updateUniverseGain();
        this.updateGcDamage();
        this.updateDamage();
    }
};