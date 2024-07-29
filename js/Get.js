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
        this.damage = fs.upgradesEffect('damage')
                                         .times(get.n_d)
                                         .times(fs.milestonesEffect('damage'))
                                         .pow(fs.upgradesEffectPow('damage'))
                                         .times(nosave.damage_multi);
    },
    damage: N('1e0'),

    updatePrestigePoints()
    {
        const pre_cap = N(+player.stage.gte(unlocks.prestige))
                                    .times(player.prestige_points_base.pow(player.stage.minus(unlocks.prestige)))
                                    .times(get.mc_pp)
                                    .times(fs.upgradesEffect('prestige_points'))
                                    .times(fs.milestonesEffect('prestige_points'))
                                    .pow(fs.upgradesEffectPow('prestige_points'))
                                    .times(nosave.prestige_points_multi);
        const pre_cap_2 = pre_cap.gte(nosave.prestige_cap[0]) ? nosave.prestige_cap[0].times(pre_cap.div(nosave.prestige_cap[0]).pow(nosave.prestige_cap[1])) : pre_cap;
        const pre_cap_3 = pre_cap_2.gte(nosave.prestige_cap_2[0]) ? nosave.prestige_cap_2[0].times(pre_cap_2.div(nosave.prestige_cap_2[0]).pow(nosave.prestige_cap_2[1])) : pre_cap_2;
        this.prestige_points = pre_cap_3.gte(nosave.prestige_cap_3[0]) ? nosave.prestige_cap_3[0].times(pre_cap_3.div(nosave.prestige_cap_3[0]).pow(nosave.prestige_cap_3[1])) : pre_cap_3;
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
        const pre_cap = N(+player.stage.gte(unlocks.light))
                                                        .times(Decimal.pow(3.5, player.stage.gte(80) ? N(80).minus(45 - 7).max(1).div(7).floor().plus(player.stage.minus(80).max(1).div(multiplier).floor()) : bonus))
                                                        .times(get.mc_lp)
                                                        .times(fs.upgradesEffect('light_points'))
                                                        .times(fs.milestonesEffect('light_points'))
                                                        .pow(fs.upgradesEffectPow('light_points'))
                                                        .times(nosave.light_points_multi);
        const pre_cap_2 = pre_cap.gte(nosave.light_cap[0]) ? nosave.light_cap[0].times(pre_cap.div(nosave.light_cap[0]).pow(nosave.light_cap[1])) : pre_cap;
        const pre_cap_3 = pre_cap_2.gte(nosave.light_cap_2[0]) ? nosave.light_cap_2[0].times(pre_cap_2.div(nosave.light_cap_2[0]).pow(nosave.light_cap_2[1])) : pre_cap_2;
        this.light_points = pre_cap_3.gte(nosave.light_cap_3[0]) ? nosave.light_cap_3[0].times(pre_cap_3.div(nosave.light_cap_3[0]).pow(nosave.light_cap_3[1])) : pre_cap_3;
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
        const pre_cap = fs.upgradesEffect('mini_cubes')
                                            .times(fs.milestonesEffect('mini_cubes'))
                                            .pow(fs.upgradesEffectPow('mini_cubes'))
                                            .times(nosave.mini_cubes_multi);
       const pre_cap_2 = pre_cap.gte(nosave.ms_cap[0]) ? nosave.ms_cap[0].times(pre_cap.div(nosave.ms_cap[0]).pow(nosave.ms_cap[1])) : pre_cap;
       const pre_cap_3 = pre_cap_2.gte(nosave.ms_cap_2[0]) ? nosave.ms_cap_2[0].times(pre_cap_2.div(nosave.ms_cap_2[0]).pow(nosave.ms_cap_2[1])) : pre_cap_2;
       this.mini_cubes = pre_cap_3.gte(nosave.ms_cap_3[0]) ? nosave.ms_cap_3[0].times(pre_cap_3.div(nosave.ms_cap_3[0]).pow(nosave.ms_cap_3[1])) : pre_cap_3;
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

    updateMasterRequirement(master_level = player.master_level)
    {
        return this.master_requirement = unlocks.master.plus(Decimal.times(14, master_level).times(Decimal.plus(1, master_level.gt(0) ? master_level.log(2) : 0))).floor();
    },
    master_requirement: N(1000),

    updateMasterBulk()
    {
        // why is it so hard :(
        //let b = player.stage.minus(unlocks.master).max(0).div(N(14).times(Decimal.plus(1, player.stage.log(2))).floor())
        //console.log(b)
        let bulk = N(0);
        let l10 = 0;
        while (player.stage.gte(get.updateMasterRequirement(N('1e1').pow(l10).minus(1).plus(player.master_level))))++l10;++l10;
        while (--l10 + 1)
        {
            let i = 0;
            while(player.stage.gte(get.updateMasterRequirement(N('1e1').pow(l10).minus(1).plus(bulk).plus(player.master_level))))
            {
                //console.log(bulk)
                bulk = bulk.plus(N('1e1').pow(l10));
                i += 1;
                if (i >= 9) break;
            }
        }
        // that old method :) doesn't work *skull*
        return this.master_bulk = bulk;
    },
    master_bulk: N(0),

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
        this.giant_cube_damage = fs.upgradesEffect('giant_cube_damage')
                                                .times(fs.milestonesEffect('giant_cube_damage'))
                                                .times(get.n_gsd)
                                                .pow(fs.upgradesEffectPow('giant_cube_damage'))
                                                .times(nosave.giant_cube_damage_multi);
    },
    giant_cube_damage: N('1e0'),

    updateRubyGain()
    {
        const pre_cap = Decimal.pow(5, player.giant_cube_stage.minus(1))
                                    .times(fs.upgradesEffect('ruby'))
                                    .times(fs.milestonesEffect('ruby'))
                                    .pow(fs.upgradesEffectPow('ruby'))
                                    .times(nosave.ruby_multi);
        const pre_cap_2 = pre_cap.gte(nosave.ruby_cap[0]) ? nosave.ruby_cap[0].times(pre_cap.div(nosave.ruby_cap[0]).pow(nosave.ruby_cap[1])) : pre_cap;
        const pre_cap_3 = pre_cap_2.gte(nosave.ruby_cap_2[0]) ? nosave.ruby_cap_2[0].times(pre_cap_2.div(nosave.ruby_cap_2[0]).pow(nosave.ruby_cap_2[1])) : pre_cap_2;
        this.ruby_gain = pre_cap_3.gte(nosave.ruby_cap_3[0]) ? nosave.ruby_cap_3[0].times(pre_cap_3.div(nosave.ruby_cap_3[0]).pow(nosave.ruby_cap_3[1])) : pre_cap_3;
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
        const pre_cap = Decimal.pow(player.giant_cube_stage.max(1).times(10).log(10).minus(1), player.giant_cube_stage.minus(unlocks.giga_squares).pow(0.75))  
                                                                    .times(fs.upgradesEffect('giga_square'))
                                                                    .times(fs.milestonesEffect('giga_square'))
                                                                    .pow(fs.upgradesEffectPow('giga_square'))
                                                                    .times(nosave.giga_square_multi)
                                                                    .times(+player.giant_cube_stage.gte(unlocks.giga_squares));
        this.giga_squares = pre_cap.gte(nosave.giga_cap[0]) ? nosave.giga_cap[0].times(pre_cap.div(nosave.giga_cap[0]).pow(nosave.giga_cap[1])) : pre_cap;
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
        this.neon_luck = fs.upgradesEffect('neon_luck')
                                                    .times(fs.milestonesEffect('neon_luck'))
                                                    .pow(fs.upgradesEffectPow('neon_luck'))
                                                    .times(nosave.neon_luck_multi);
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

    updateStarGain()
    {
        this.star_gain = N(+player.stage.gte(unlocks.collapse))
                                        .times(5)
                                        .times(get.g_s)
                                        .times(fs.upgradesEffect('stars'))
                                        .times(fs.milestonesEffect('stars'))
                                        .pow(fs.upgradesEffectPow('stars'))
                                        .times(nosave.stars_multi);
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
        this.galaxies = N(+player.stars.gte(unlocks.galaxy)).times(Decimal.pow(3, div.gt(1) ? div.log(10) : 0));
    },
    galaxies: N('0e0'),

    updateGalaxySEffect()
    {
        this.g_s = Decimal.pow(1.1, player.galaxies.gt(1) ? player.galaxies.log(10) : 0);
    },
    g_s: N('1e0'),

    updateGalaxyPEffect()
    {
        this.g_p = Decimal.pow(1.15, player.galaxies.gt(1) ? player.galaxies.log(10) : 0).times(10).min(500);
    },
    g_p: N('1e0'),

    updateAll()
    {
        this.updatePrestigeUpgradesValues();
        this.updateLightUpgradesValues();
        this.updateRubyUpgradesValues();
        this.updateGigaUpgradesValues();
        this.updateStarUpgradesValues();
        this.updateCubeStat();
        this.updateMasterBulk();
        this.updateMasterRequirement();
        this.updateMasterMilestonesValues();
        this.updateCollapseMilestonesValues();
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
        this.updateStarGain();
        this.updateGalaxiesGain();
        this.updateGcDamage();
        this.updateDamage();
    }
};