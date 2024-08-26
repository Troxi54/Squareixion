function getDefaultPlayerValues()
{
    let Player = {};
    Player.upgrades = {
        prestige_upgrades: [
            new Upgrade(1,'1e0', '4e0', (LVL)=>Decimal.pow(2, LVL), 'damage', 'prestige_points'),
            new Upgrade(2, '3e0', '1e1', (LVL)=>Decimal.pow(4, LVL), 'damage', 'prestige_points', N('1e30')),
            new Upgrade(3, '5e0', '2.5e1', (LVL)=>Decimal.pow(8, LVL), 'damage', 'prestige_points', N('1e30')),
            new Upgrade(4, '5e7', '5e3', (LVL)=>Decimal.pow(2, LVL), 'light_points', 'prestige_points', N('1e30'), ()=>player.isUnlocked.light),
            new Upgrade(5, '1e14', '4.5e2', (LVL)=>Decimal.pow(2, LVL), 'mini_cubes', 'prestige_points', N('1e30'), ()=>player.isUnlocked.minicubes),
        ],
        light_upgrades: [
            new Upgrade(1, '1e0', '2e0', (LVL)=>Decimal.pow(25, LVL), 'damage', 'light_points', N('1e29')),
            new Upgrade(2, '1e0', '2e0', (LVL)=>Decimal.pow(10, LVL), 'prestige_points', 'light_points', N('1e29')),
            new Upgrade(3, '1e0', '2e0', (LVL)=>N('0.2').div(Decimal.pow(2, LVL)), Array(1), 'light_points', N(20), undefined, undefined,
            function(){ return `<span class="positive">Autoclicker</span> and <span class="positive">${ abb_abs_int(N(2)) }x</span> its speed <br><span class="darker-text italic">Currently: ${this.bought_times.lte(0) ? 'no' : numToTime(+this.effect)}</span> <br><br><span class="size-125">`; }),
            new Upgrade(4, '8e1', '4e0', (LVL)=>Decimal.pow(3, LVL), 'mini_cubes', 'light_points', ...Array(1), ()=>player.isUnlocked.minicubes),
        ],
        ruby_upgrades: [
            new Upgrade(1, '2.5e1', '1.5e0', (LVL)=>Decimal.pow(1.5, LVL), 'giant_cube_damage', 'ruby', ...Array(2), false),
            new Upgrade(2, '1.5e2', '1.75e0', (LVL)=>Decimal.pow('1e3', LVL), 'damage', 'ruby'),
            new Upgrade(3, '4e2', '1.8e0', (LVL)=>Decimal.pow('2.5e3', LVL), 'prestige_points', 'ruby'),
            new Upgrade(4, '1.3e3', '3e0', (LVL)=>Decimal.pow('1e2', LVL), 'light_points', 'ruby'),
            new Upgrade(5, '2e3', '2e0', (LVL)=>Decimal.pow('1e4', LVL), 'mini_cubes', 'ruby'),
        ],
        giga_upgrades: [
            new Upgrade(1, '1e0', '1e1', (LVL)=>Decimal.pow(5, LVL), 'giant_cube_damage', 'giga_squares'),
            new Upgrade(2, '1e0', '1e1', (LVL)=>Decimal.pow(7, LVL), 'ruby', 'giga_squares'),
            new Upgrade(3, '1e75', '1e25', (LVL)=>Decimal.pow(3, LVL), 'neon_luck', 'giga_squares', ...Array(1), ()=>player.isUnlocked.neonsquare),
            new Upgrade(4, '1e500', 'ee3', (LVL)=>Decimal.pow(2, LVL), 'stars', 'giga_squares', N(12), ()=>nosave.milestones.master_milestones[16].enough),
        ],
        collapse_upgrades: [
            new Upgrade(1, '1e0', '2e0', (LVL)=>Decimal.pow(1.1, LVL), 'damage', 'stars', ...Array(2), false, ...Array(1), true),
            new Upgrade(2, '1e0', '2e0', (LVL)=>Decimal.pow(1.075, LVL), 'prestige_points', 'stars', N(25), ...Array(1), false, ...Array(1), true),
            new Upgrade(3, '1e1', '2e0', (LVL)=>Decimal.pow(1.04, LVL), 'light_points', 'stars', N(22), ()=>nosave.milestones.collapse_milestones[1].enough, false, ...Array(1), true),
            new Upgrade(4, '1e1', '2e0', (LVL)=>Decimal.pow(1.15, LVL), 'mini_cubes', 'stars', N(22), ()=>nosave.milestones.collapse_milestones[1].enough, false, ...Array(1), true),
            new Upgrade(5, '1e1', '2e0', (LVL)=>Decimal.pow(1.05, LVL), 'giant_cube_damage', 'stars', N(22), ()=>nosave.milestones.collapse_milestones[2].enough, false, ...Array(1), true),
            new Upgrade(6, '1e1', '2e0', (LVL)=>Decimal.pow(1.05, LVL), 'ruby', 'stars', N(22), ()=>nosave.milestones.collapse_milestones[2].enough, false, ...Array(1), true),
            new Upgrade(7, '1e3', '2e0', (LVL)=>Decimal.pow(1.05, LVL), 'giga_squares', 'stars', N(15), ()=>nosave.milestones.collapse_milestones[3].enough, false, ...Array(1), true),
            new Upgrade(8, '1e3', '2e0', (LVL)=>Decimal.pow(1.05, LVL), 'neon_luck', 'stars', N(15), ()=>nosave.milestones.collapse_milestones[3].enough, false, ...Array(1), true),
        ]
    }
    
    Player.stage = N('1e0');
    Player.cube_hp = N('1e1');
    Player.prestige_points = N('0e0');
    Player.prestige_points_base = N('2e0');
    Player.light_points = N('0e0');
    Player.mini_cubes = N('0e0');
    Player.master_level = N('0e0');
    Player.giant_cube_stage = N('1e0');
    Player.giant_cube_hp = N('0e0');
    Player.ruby = N('0e0');
    Player.giga_squares = N('0e0');
    Player.neon_tier = N('0e0');
    Player.stars = N('0e0');
    Player.collapsed_times = N('0e0');
    Player.masters_on_collapse = N('1e4');
    Player.best_stage_on_collapse = N('0e0');
    Player.best_stars_on_collapse = N('0e0');
    Player.galaxies = N('0e0');
    Player.strange_place = false;
    Player.black_holes = N('0e0');
    Player.universe_generators = N('0e0');
    Player.universes = N('0e0');
    Player.rebuild_rank = N('0e0');
    Player.unique_place = false;
    Player.white_holes = N('0e0');

    Player.isUnlocked = {
        prestige_reached: false,
        prestige: false,
        light_reached: false,
        light: false,
        minicubes: false,
        master_reached: false,
        master: false,
        giantcube: false,
        gigacube_reached: false,
        gigacube: false,
        neonsquare: false,
        hasNSquare: false,
        collapse_reached: false,
        collapse: false,
        galaxy: false,
        galaxyhave: false,
        strangeplace: false,
        strangeplace_once: false,
        rebuild_reached: false,
        rebuild: false,
        uniqueplace: false,
        uniqueplace_once: false,
    };

    Player.always_play_normal_realm_music = false;
    Player.outside_music = false;
    Player.lastLoop = Date.now();
    Player.hotkeys = true;
    Player.hide_maxed_upgrades = false;
    Player.hide_background = false;
    Player.select_text = false;
    Player.fps = 60;

    return Player;
}

function changeValue(name, value)
{
    //console.log('i')
    player[name] = value;
    /*if (name === "prestige_points") { updates.prestigeAmount(); updates.prestigeUpgrades(); }
    else if (name === "light_points") { updates.lightAmount(); updates.lightUpgrades(); }
    else if (name === 'mini_cubes') 
    { 
        get.updateMiniCubePPEffect(); get.updatePrestigePoints(); updates.prestigeButtonInfo();
        get.updateMiniCubeLPEffect(); get.updateLightPoints(); updates.lightButtonInfo();
        updates.miniCubesInfo();
     }
    else if (name === 'master_level') { get.updateMasterRequirement(); get.updateMasterMilestonesValues(); updates.masterMilestones(); updates.masterButtonInfo(); updates.masterAmount(); }
    else if (name === 'ruby') { updates.rubyAmount(); updates.rubyUpgrades(); }
    else if (name === "giga_squares") { updates.gigaAmount(); updates.gigaUpgrades(); }
    else if (name === "neon_tier") 
    {
        get.updateNeonDEffect(); get.updateDamage(); updates.cubeInfo();
        get.updateNeonGSDEffect(); get.updateGcDamage(); updates.giantcubeInfo();
        updates.neonInfo();
    } */
}

// setting player values, that was not supposed to be saved
function setNosaveValues()
{
    nosave.damage_multi = N('1e0');
    nosave.prestige_points_multi = N('1e0');
    nosave.light_points_multi = N('1e0');
    nosave.mini_cubes_multi = N('1e0');
    nosave.giant_cube_damage_multi = N('1e0');
    nosave.ruby_multi = N('1e0');
    nosave.giga_square_multi = N('1e0');
    nosave.neon_luck_multi = N('1e0');
    nosave.neon_rng = N('0e0');
    nosave.stars_multi = N('1e0');
    nosave.collapsed_times_multi = N('1e0');
    nosave.universe_generators_multi = N('1e0');
    nosave.universe_multi = N('1e0');
    nosave.realm = 0;
    nosave.realm_2_from = 0;
    nosave.realm_scrolls = [];
    nosave.prestige_cap = [N('1e400'), N(0.6)];
    nosave.prestige_cap_2 = [N('e50000'), N(0.3)];
    nosave.prestige_cap_3 = [N('e5e7'), N('3e-9')];
    nosave.prestige_cap_4 = [N('ee40'), N(0.25), 1];
    nosave.ms_cap = [N('1e750'), N(0.5)];
    nosave.ms_cap_2 = [N('1e500000'), N(0.25)];
    nosave.ms_cap_3 = [N('e1e11'), N('3e-9')];
    nosave.light_cap = [N('1e1050'), N(0.6)];
    nosave.light_cap_2 = [N('1e300000'), N(0.3)];
    nosave.light_cap_3 = [N('e1e9'), N('3e-9')];
    nosave.ruby_cap = [N('1e305'), N(0.6)];
    nosave.ruby_cap_2 = [N('1e300000'), N(0.4)];
    nosave.ruby_cap_3 = [N('e1e14'), N('3e-9')];
    nosave.giga_cap = [N('1e2000'), N(0.1)];
    nosave.giga_cap_2 = [N('ee12'), N(0.1)];
    nosave.giga_cap_3 = [N('ee20'), N('1e-20')];
    nosave.master_cap = [N('1e35'), N(0.3)];
    nosave.master_cap_2 = [N('1e46'), N(0.3)];
    nosave.star_cap = [N(2).pow(1024), N(0.5)];
    nosave.star_cap_2 = ['e50000', N(0.175)];
    nosave.galaxy_cap = [N('e1000'), N(0.5)];
    nosave.universe_generator_cap = [N('e200'), N(0.4)];
    nosave.black_hole_cap = [N('ee4'), N(0.4)];
    nosave.master_average = [];
    nosave.bulk_master = true;
    nosave.bulk_rr = true;
    nosave.milestones = {
        master_milestones: [
            new Milestone(1, function(){ return Decimal.pow(5, player.master_level).pow(nosave.milestones.master_milestones[13].effect); }, 'prestige_points', 'master_level', function() { return `<span class="size-75">Multiplies your ${fs.abbCurrency(this.boosts_what)} by 5 each master level and prestige upgrades no longer take ${fs.abbCurrency('prestige_points')}</span>`}, 0, ()=>nosave.milestones.master_milestones),
            new Milestone(2, function(){ return Decimal.pow(3, player.master_level).pow(nosave.milestones.master_milestones[13].effect); }, 'light_points', 'master_level', function() { return `<span class="size-75">Multiplies your ${fs.abbCurrency(this.boosts_what)} by 3 each master level and unlocks the autobuyer for prestige upgrades</span>` }, 1, ()=>nosave.milestones.master_milestones),
            new Milestone(3, function(){ return Decimal.pow('3.5e2', player.master_level).pow(nosave.milestones.master_milestones[13].effect); }, 'damage', 'master_level', function() { return `<span class="size-75">Multiplies your ${fs.abbCurrency(this.boosts_what)} by 350 each master level and unlocks the prestige point generator 100%<span>` }, 2, ()=>nosave.milestones.master_milestones),
            new Milestone(4, function(){ return Decimal.pow('1.11e3', player.master_level).pow(nosave.milestones.master_milestones[13].effect); }, 'mini_cubes', 'master_level', function() { return `<span class="size-75">Multiplies your ${fs.abbCurrency(this.boosts_what)} by ${abb_abs_int(1100)} each master level and light upgrades no longer take ${fs.abbCurrency('light_points')}</span>` }, 3, ()=>nosave.milestones.master_milestones),
            new Milestone(5, function(){ return N('1e5') }, 'light_points', 'master_level', function() { return `Multiplies your ${fs.abbCurrency(this.boosts_what)} by ${abb_abs_int('1e5')}` }, 4, ()=>nosave.milestones.master_milestones),
            new Milestone(7, function(){ return player.stage.gte(101) ? Decimal.pow(1.5, Decimal.sub(player.stage, 100)) : 1 }, 'prestige_points', 'master_level', function() { return `Multiplies your ${fs.abbCurrency(this.boosts_what)} by ${abb_abs(1.5)} per stage after 100` }, 5, ()=>nosave.milestones.master_milestones),
            new Milestone(8, function(){ return 1; }, '-', 'master_level', function() { return `Unlocks the autobuyer for light upgrades` }, 6, ()=>nosave.milestones.master_milestones),
            new Milestone(9, function(){ return N('1e125'); }, 'mini_cubes', 'master_level', function() { return `Multiplies your ${fs.abbCurrency(this.boosts_what)} by ${abb_abs_int('1e125')}` }, 7, ()=>nosave.milestones.master_milestones),
            new Milestone(11, function(){ return 1; }, '-', 'master_level', function() { return `Unlocks giant squares` }, 8, ()=>nosave.milestones.master_milestones),
            new Milestone(18, function(){ return Decimal.pow(5, player.master_level.minus(15)); }, 'giant_cube_damage', 'master_level', function() { return `Multiplies your ${fs.abbCurrency(this.boosts_what)} by 5 each master level starting at 16` }, 9, ()=>nosave.milestones.master_milestones),
            new Milestone(36, function(){ return N(1).plus(get.damage.max(1).log(10).div(10)); }, 'giant_cube_damage', 'master_level', function() { return `<span class="size-75">Multiplies your ${fs.abbCurrency(this.boosts_what)} by <div class="frac"><span>log10(damage)</span><span class="symbol">/</span><span class="bottom-m">10</span></div> and unlocks the light point generator 100%</span>` }, 10, ()=>nosave.milestones.master_milestones),
            new Milestone(50, function(){ return 1; }, '-', 'master_level', function() { return `Keep light upgrade 3 on master reset` }, 11, ()=>nosave.milestones.master_milestones),
            new Milestone(100, function(){ return 1; }, '-', 'master_level', function() { return `Unlocks the mini square generator 500%` }, 12, ()=>nosave.milestones.master_milestones),
            new Milestone(130, function(){ return N(10); }, '-', 'master_level', function() { return `Milestone 1, 2, 3, 4 effect<sup>10</sup>` }, 13, ()=>nosave.milestones.master_milestones),
            new Milestone(210, function(){ return 1; }, '-', 'master_level', function() { return `Unlocks neon squares` }, 14, ()=>nosave.milestones.master_milestones),
            new Milestone(function(){return player.master_level.gte('1.725e3') && nosave.milestones.collapse_milestones[0].enough}, function(){ return player.master_level.max(10).log(10).pow(1.25).pow(N(+nosave.milestones.collapse_milestones[5].isEnough()).times(Decimal.plus(1, player.collapsed_times.max(1).log10().times(0.125))).max(1)); }, 'stars', `-`, function() { return `Multiplies your stars by log10(Master level)<sup>1.25</sup>` }, 15, ()=>nosave.milestones.master_milestones, `Master level ${abb_abs_int('1.725e3')}`, ()=>nosave.milestones.collapse_milestones[0].enough),
            new Milestone(2500, function(){ return 1; }, '-', 'master_level', function() { return `Unlocks the new giga square upgrade` }, 16, ()=>nosave.milestones.master_milestones),
            //new Milestone('1e7', function(){ return Decimal.pow(2, Decimal.max(player.master_level.log(10).minus(3), 0)); }, 'stars', 'master_level', function() { return `Milestone 16 effect is better: 2<sup>max(log10(Master level) - 3, 0)</sup>` }, 17, ()=>nosave.milestones.master_milestones),
        ],
        collapse_milestones: [
            new Milestone(1, function(){ return 1; }, '-', 'collapsed_times', function() { return `Permanently keep light upgrade 3, bulk master levels, you can no longer get lower neon tiers and unlocks new master milestones`}, 0, ()=>nosave.milestones.collapse_milestones, `Collapsed once`),
            new Milestone(5, function(){ return 1; }, '-', 'collapsed_times', function() { return `Ruby upgrades no longer take ${fs.abbCurrency('ruby')}, keep master milestone 3 on collapse and unlocks new star upgrades`}, 1, ()=>nosave.milestones.collapse_milestones, `Collapsed 5 times`),
            new Milestone(10, function(){ return 1; }, '-', 'collapsed_times', function() { return `Unlocks the autobuyer for ruby upgrades, keep master milestone 1, 2 on collapse and unlocks new star upgrades`}, 2, ()=>nosave.milestones.collapse_milestones, `Collapsed 10 times`),
            new Milestone(()=>player.masters_on_collapse.lte(0), function(){ return 1; }, '-', 'masters_on_collapse', function() { return `Unlocks the autoclicker for giant squares, automatic nothing-spending master levels, giga upgrades no longer take ${fs.abbCurrency('giga_squares')}, keep master milestone 4, 7 and unlocks new star upgrades`}, 3, ()=>nosave.milestones.collapse_milestones, `Collapsed with 0 master level`),
            new Milestone('6.5e15', function(){ return 1; }, '-', 'best_stage_on_collapse', function() { return `Unlocks the autobuyer for giga upgrades, the giga square generator 100%, the autoclicker for neon squares and unlock <span style="-webkit-text-stroke: 1px rgb(140, 0, 255); color: transparent;">galaxies</span>`}, 4, ()=>nosave.milestones.collapse_milestones, `Collapsed with ${abb_abs_int('6.5e15')} stage`),
            new Milestone('1e2', function(){ return 1; }, '-', 'galaxies', function() { return `Master milestone 16 effect<sup>1 + log10(${fs.abbCurrency('collapsed_times')}) * 0.125</sup>`}, 5, ()=>nosave.milestones.collapse_milestones, `${abb_abs('1e2')} galaxies`),
            new Milestone('6e2', function(){ return Decimal.pow(2, player.stage.log(10).times(0.25)); }, 'stars', 'galaxies', function() { return `Multiplies your stars by 2<sup>1 + log10(stage) * 0.25</sup>`}, 6, ()=>nosave.milestones.collapse_milestones, `${abb_abs('6e2')} galaxies`),
            new Milestone('1.05e4', function(){ return 1; }, '-', 'galaxies', function() { return `Unlocks <span class="black-holes-stroke">The Strange Place</span>`}, 7, ()=>nosave.milestones.collapse_milestones, `${abb_abs('1.05e4')} galaxies`),
            new Milestone('1e22', function(){ return N(100); }, 'stars', 'collapsed_times', function() { return `100x stars`}, 8, ()=>nosave.milestones.collapse_milestones, `Collapsed ${abb_abs('1e22')} times`),
            new Milestone('1e100', function(){ return 1; }, '-', 'best_stage_on_collapse', function() { return `Unlocks <span class="rebuild-stroke">the fifth reset layer</span>`}, 9, ()=>nosave.milestones.collapse_milestones, `Collapsed with ${abb_abs_int('1e100')} stage`)
        ],
        rebuild_milestones: [
            new Milestone(1, function(){ return 1; }, '-', 'rebuild_rank', function() { return `Keep collapse milestone 1 and star upgrades no longer take ${fs.abbCurrency('stars')}`}, 0, ()=>nosave.milestones.rebuild_milestones, `Rebuild rank ${abb_abs_int(1)}`),
            new Milestone(2, function(){ return N(100); }, 'stars', 'rebuild_rank', function() { return `Keep collapse milestone 2 and 100x stars`}, 1, ()=>nosave.milestones.rebuild_milestones, `Rebuild rank ${abb_abs_int(2)}`),
            new Milestone(3, function(){ return Decimal.pow(1.9, player.rebuild_rank); }, 'universes', 'rebuild_rank', function() { return `<span class="size-75">Keep collapse milestone 3, ${abb_abs(1.9)}x universes each rebuild rank and autoupdates best stars on collapse</span>`}, 2, ()=>nosave.milestones.rebuild_milestones, `Rebuild rank ${abb_abs_int(3)}`),
            new Milestone(4, function(){ return 1; }, '-', 'rebuild_rank', function() { return `Keep collapse milestone 4 and unlocks the autobuyer for star upgrades`}, 3, ()=>nosave.milestones.rebuild_milestones, `Rebuild rank ${abb_abs_int(4)}`),
            new Milestone(5, function(){ return 1; }, '-', 'rebuild_rank', function() { return `Keep collapse milestone 5`}, 4, ()=>nosave.milestones.rebuild_milestones, `Rebuild rank ${abb_abs_int(5)}`),
            new Milestone(7, function(){ return 1; }, '-', 'rebuild_rank', function() { return `Unlocks the galaxy generator 100(rebuild rank - 6)%`}, 5, ()=>nosave.milestones.rebuild_milestones, `Rebuild rank ${abb_abs_int(7)}`),
            new Milestone(8, function(){ return 1; }, '-', 'rebuild_rank', function() { return `Keep 10 galaxies on rebuild`}, 6, ()=>nosave.milestones.rebuild_milestones, `Rebuild rank ${abb_abs_int(8)}`),
            new Milestone(9, function(){ return 1; }, '-', 'rebuild_rank', function() { return `Unlocks the collapsed times generator 500%`}, 7, ()=>nosave.milestones.rebuild_milestones, `Rebuild rank ${abb_abs_int(9)}`),
            new Milestone(10, function(){ return 1; }, '-', 'rebuild_rank', function() { return `No longer have nerfs in The Strange Place`}, 8, ()=>nosave.milestones.rebuild_milestones, `Rebuild rank ${abb_abs_int(10)}`),
            new Milestone(15, function(){ return 1; }, '-', 'rebuild_rank', function() { return `<span class="size-75">Revamp the normal realm, unlocks new universe effect and unlocks the black hole generator</span>`}, 9, ()=>nosave.milestones.rebuild_milestones, `Rebuild rank ${abb_abs_int(15)}`),
            new Milestone(16, function(){ return 1; }, '-', 'rebuild_rank', function() { return `Automatically enter The Strange Place on reset`}, 10, ()=>nosave.milestones.rebuild_milestones, `Rebuild rank ${abb_abs_int(16)}`),
            new Milestone(140, function(){ return 1; }, '-', 'rebuild_rank', function() { return `Unlocks <span class="white-holes-stroke">The Unique Place</span>, moves rebuild reset here and bulk rebuild ranks`}, 11, ()=>nosave.milestones.rebuild_milestones, `Rebuild rank ${abb_abs_int(140)}`),
            new Milestone(170, function(){ return 1; }, '-', 'rebuild_rank', function() { return `Unlocks the universe generator generator 1%`}, 12, ()=>nosave.milestones.rebuild_milestones, `Rebuild rank ${abb_abs_int(170)}`),
            new Milestone(320, function(){ return 1; }, '-', 'rebuild_rank', function() { return `The endgame and unlocks the universe generator generator 2%`}, 13, ()=>nosave.milestones.rebuild_milestones, `Rebuild rank ${abb_abs_int(320)}`)
        ]
    }

    nosave.Autoclickers = {
        'unlocksmthfix' : new Auto(()=>true, function(){gameFunctions.hideAndShowContent()}, ()=>1e3),
        'cube_autoclicker' : new Auto(
            function() { return player.upgrades.light_upgrades[2].bought_times.gte(1); },
            function(multi=1){gameFunctions.damageCube(N(multi));}, 
            function(){ return +player.upgrades.light_upgrades[2].effect * 1e3; }),
        'prestige_upgrades_nocost' : new Auto(()=>nosave.milestones.master_milestones[0].enough, function(){player.upgrades.prestige_upgrades.forEach(upgr=>upgr.takes_currency = false)}, ()=>getLoopInterval()),
        'prestige_upgrades_autobuyer' : new Auto(()=>nosave.milestones.master_milestones[1].enough, function(){player.upgrades.prestige_upgrades.forEach(upgr=>upgr.buy_max())}, ()=>getLoopInterval()),
        'prestige_generator' : new Auto(()=>nosave.milestones.master_milestones[2].enough, function(multi=1){changeValue('prestige_points', player.prestige_points.plus(get.prestige_points.div(settings.fps).times(multi)))}, ()=>getLoopInterval()),
        'light_upgrades_nocost' : new Auto(()=>nosave.milestones.master_milestones[3].enough, function(){player.upgrades.light_upgrades.forEach(upgr=>upgr.takes_currency = false)}, ()=>getLoopInterval()),
        'light_upgrades_autobuyer' : new Auto(()=>nosave.milestones.master_milestones[6].enough, function(){player.upgrades.light_upgrades.forEach(upgr=>upgr.buy_max())}, ()=>getLoopInterval()),
        'ruby' : new Auto(()=>(player.isUnlocked.giantcube&&nosave.milestones.master_milestones[8].enough), function(multi=1){changeValue('ruby', player.ruby.plus(get.ruby_gain.div(settings.fps).times(multi) ))}, ()=>getLoopInterval()),
        'light_generator' : new Auto(()=>nosave.milestones.master_milestones[10].enough, function(multi=1){changeValue('light_points', player.light_points.plus(get.light_points.div(settings.fps).times(multi)))}, ()=>getLoopInterval()),
        'mini_cubes_generator' : new Auto(()=>nosave.milestones.master_milestones[12].enough, function(multi=1){changeValue('mini_cubes', player.mini_cubes.plus(get.mini_cubes.div(settings.fps).times(5).times(multi)))}, ()=>getLoopInterval()),
        'ruby_upgrades_nocost' : new Auto(()=>nosave.milestones.collapse_milestones[1].enough, function(){player.upgrades.ruby_upgrades.forEach(upgr=>upgr.takes_currency = false)}, ()=>getLoopInterval()),
        'keep3mm' : new Auto(()=>nosave.milestones.collapse_milestones[1].enough, function(){nosave.milestones.master_milestones[2].always_works = true}, ()=>getLoopInterval()),
        'keep1,2mm' : new Auto(()=>nosave.milestones.collapse_milestones[2].enough, function(){nosave.milestones.master_milestones[0].always_works = true; nosave.milestones.master_milestones[1].always_works = true}, ()=>getLoopInterval()),
        'ruby_upgrades_autobuyer' : new Auto(()=>nosave.milestones.collapse_milestones[2].enough, function(){player.upgrades.ruby_upgrades.forEach(upgr=>upgr.buy_max())}, ()=>getLoopInterval()),
        'gcube_autoclicker' : new Auto(()=>nosave.milestones.collapse_milestones[3].enough, function(multi=1){gameFunctions.damageGiantCube(multi)}, ()=>getLoopInterval()),
        'master_autoclicker' : new Auto(()=>nosave.milestones.collapse_milestones[3].enough, function(){
            if (player.stage.gte(get.master_requirement))
            {
                if (nosave.bulk_master && nosave.milestones.collapse_milestones[0])
                {
                    changeValue('master_level', player.master_level.plus(get.master_bulk));
                }
                else changeValue('master_level', player.master_level.plus(1));
                get.updateMasterRequirement();
                get.updateMasterBulk();
            }}, ()=>getLoopInterval()),
        'giga_upgrades_nocost' : new Auto(()=>nosave.milestones.collapse_milestones[3].enough, function(){player.upgrades.giga_upgrades.forEach(upgr=>upgr.takes_currency = false)}, ()=>getLoopInterval()),
        'keep4,7mm' : new Auto(()=>nosave.milestones.collapse_milestones[3].enough, function(){nosave.milestones.master_milestones[3].always_works = true; nosave.milestones.master_milestones[6].always_works = true}, ()=>getLoopInterval()),
        'giga_upgrades_autobuyer' : new Auto(()=>nosave.milestones.collapse_milestones[4].enough, function(){player.upgrades.giga_upgrades.forEach(upgr=>upgr.buy_max())}, ()=>getLoopInterval()),
        'giga_generator' : new Auto(()=>nosave.milestones.collapse_milestones[4].enough, function(multi=1){if (get.giga_squares.gt(0)) changeValue('giga_squares', player.giga_squares.plus(get.giga_squares.div(settings.fps).times(multi)))}, ()=>getLoopInterval()),
        'ncube_autoclicker' : new Auto(()=>nosave.milestones.collapse_milestones[4].enough, function(){gameFunctions.spawnNeonSquare()}, ()=>getLoopInterval()),
        'star_generator' : new Auto(()=>player.galaxies.gt(0), function(multi=1){changeValue('stars', player.stars.plus(player.best_stars_on_collapse.div(settings.fps).times(get.g_p.div(100)).times(multi)))}, ()=>getLoopInterval()),
        'universe' : new Auto(()=>(player.isUnlocked.rebuild), function(multi=1){changeValue('universes', player.universes.plus(get.universe_gain.div(settings.fps).times(multi) ))}, ()=>getLoopInterval()),
        'keep1cm' : new Auto(()=>nosave.milestones.rebuild_milestones[0].enough, function(){nosave.milestones.collapse_milestones[0].always_works = true}, ()=>getLoopInterval()),
        'star_upgrades_nocost' : new Auto(()=>nosave.milestones.rebuild_milestones[0].enough, function(){player.upgrades.collapse_upgrades.forEach(upgr=>upgr.takes_currency = false)}, ()=>getLoopInterval()),
        'keep2cm' : new Auto(()=>nosave.milestones.rebuild_milestones[1].enough, function(){nosave.milestones.collapse_milestones[1].always_works = true}, ()=>getLoopInterval()),
        'keep3cm' : new Auto(()=>nosave.milestones.rebuild_milestones[2].enough, function(){nosave.milestones.collapse_milestones[2].always_works = true}, ()=>getLoopInterval()),
        'autoupdate_stars' : new Auto(()=>nosave.milestones.rebuild_milestones[2].enough, function(){player.best_stars_on_collapse = get.star_gain.gt(player.best_stars_on_collapse) ? get.star_gain : player.best_stars_on_collapse}, ()=>getLoopInterval()),
        'keep4cm' : new Auto(()=>nosave.milestones.rebuild_milestones[3].enough, function(){nosave.milestones.collapse_milestones[3].always_works = true}, ()=>getLoopInterval()),
        'star_upgrades_autobuyer' : new Auto(()=>nosave.milestones.rebuild_milestones[3].enough, function(){player.upgrades.collapse_upgrades.forEach(upgr=>upgr.buy_max())}, ()=>getLoopInterval()),
        'keep5cm' : new Auto(()=>nosave.milestones.rebuild_milestones[4].enough, function(){nosave.milestones.collapse_milestones[4].always_works = true}, ()=>getLoopInterval()),
        'galaxy_generator' : new Auto(()=>nosave.milestones.rebuild_milestones[5].enough, function(multi=1){if (get.galaxies.gt(0)) changeValue('galaxies', player.galaxies.plus(get.galaxies.div(settings.fps).times(player.rebuild_rank.minus(6)).times(multi)))}, ()=>getLoopInterval()),
        'collapsed_times_generator' : new Auto(()=>nosave.milestones.rebuild_milestones[7].enough, function(multi=1){if (get.ct_g.gt(0)) changeValue('collapsed_times', player.collapsed_times.plus(get.ct_g.div(settings.fps).times(5).times(multi)))}, ()=>getLoopInterval()),
        'blackhole_generator' : new Auto(()=>nosave.milestones.rebuild_milestones[9].enough && player.strange_place, function(){if (get.bh.gt(0)) changeValue('black_holes', player.black_holes.lt(get.bh) ? get.bh : player.black_holes)}, ()=>getLoopInterval()),
        'ug_generator' : new Auto(()=>nosave.milestones.rebuild_milestones[12].enough, function(){if (get.ug_gain.gt(0)) changeValue('universe_generators', player.universe_generators.plus(get.ug_gain.div(settings.fps).div(100)))}, ()=>getLoopInterval()),
        'ug_generator2' : new Auto(()=>nosave.milestones.rebuild_milestones[13].enough, function(){if (get.ug_gain.gt(0)) changeValue('universe_generators', player.universe_generators.plus(get.ug_gain.div(settings.fps).div(100/2)))}, ()=>getLoopInterval()),
    };

    
    nosave.lastSave = Date.now();
    nosave.settingsVisible = false;
    nosave.play_music = false;
    nosave.music_iterator = 0;
    nosave.music_interval_is = false;
}