function getDefaultPlayerValues()
{
    let Player = {};
    Player.upgrades = {
        prestige_upgrades: [
            new Upgrade(1, 1, '1e0', '4e0', '2e0', 'damage', 'prestige_points'),
            new Upgrade(1, 2, '3e0', '1e1', '4e0', 'damage', 'prestige_points'),
            new Upgrade(1, 3, '5e0', '2.5e1', '8e0', 'damage', 'prestige_points'),
            new Upgrade(1, 4, '5e6', '5e3', '2e0', 'light_points', 'prestige_points', undefined, undefined, ()=>player.isUnlocked.light),
            new Upgrade(1, 5, '1e12', '2.5e4', '2e0', 'mini_cubes', 'prestige_points', undefined, undefined, ()=>player.isUnlocked.minicubes),
        ],
        light_upgrades: [
            new Upgrade(2, 1, '1e0', '2e0', '2.5e1', 'damage', 'light_points'),
            new Upgrade(2, 2, '1e0', '2e0', '5e0', 'prestige_points', 'light_points'),
            new Upgrade(2, 3, '1e0', '3e0', '2e0', function(){ return `<span class="positive">Autoclicker</span> and <span class="positive">${ abb_abs_int(this.effect_scaling) }x</span> its speed <br><span class="darker-text">Currently: ${this.bought_times.lte(0) ? 'no' : numToTime(floor(this.effect.toNumber() * 1e3, 2))}</span> <br><br><span class="size-125">`; }, 'light_points', 10, function(eff){return new Decimal(settings.autoclickers_start).div(eff).times(this.effect_scaling)}),
            new Upgrade(2, 4, '8e1', '4e0', '3e0', 'mini_cubes', 'light_points', undefined, undefined, ()=>player.isUnlocked.minicubes),
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
        prestige_reached: false,
        prestige: false,
        light_reached: false,
        light: false,
        minicubes: false,
        master_reached: false,
        master: false
    };

    return Player;
}

// setting player values, that was not supposed to be saved
function setNosaveValues()
{
    nosave.damage_multi = new Decimal('1e0');
    nosave.prestige_points_multi = new Decimal('1e0');
    nosave.light_points_multi = new Decimal('1e0');
    nosave.mini_cubes_multi = new Decimal('1e0');
    nosave.milestones = {
        master_milestones: [
            new Milestone(1, function(){ return Decimal.pow(5, player.master_level); }, 'prestige_points', 'master_level', function() { return `Multiplies your ${fs.abbCurrency(this.boosts_what)} by ${abb_abs_int(5)} each master level`}, 0, ()=>nosave.milestones.master_milestones),
            new Milestone(2, function(){ return Decimal.pow(2, player.master_level); }, 'light_points', 'master_level', function() { return `Multiplies your ${fs.abbCurrency(this.boosts_what)} by ${abb_abs_int(2)} each master level` }, 1, ()=>nosave.milestones.master_milestones),
            new Milestone(3, function(){ return Decimal.pow('3.5e2', player.master_level); }, 'damage', 'master_level', function() { return `Multiplies your ${fs.abbCurrency(this.boosts_what)} by ${abb_abs_int(350)} each master level` }, 2, ()=>nosave.milestones.master_milestones),
            new Milestone(4, function(){ return Decimal.pow('2.5e1', player.master_level); }, 'mini_cubes', 'master_level', function() { return `Multiplies your ${fs.abbCurrency(this.boosts_what)} by ${abb_abs_int(25)} each master level and prestige upgrades no longer take ${fs.abbCurrency('prestige_points')}` }, 3, ()=>nosave.milestones.master_milestones),
            new Milestone(5, function(){ return new Decimal(25) }, 'light_points', 'master_level', function() { return `Multiplies your ${fs.abbCurrency(this.boosts_what)} by ${abb_abs_int(10)} and unlock Autobuyer for prestige upgrades` }, 4, ()=>nosave.milestones.master_milestones),
            new Milestone(7, function(){ return player.stage.gte(101) ? Decimal.pow(1.5, Decimal.sub(player.stage, 100)) : 1 }, 'prestige_points', 'master_level', function() { return `<span class="size-75">Multiplies your ${fs.abbCurrency(this.boosts_what)} by ${abb_abs(1.5)} per stage after 100 and generates ${abb_abs_int(Decimal.mul(1, 100))}% of prestige points that can be earned per second</span>` }, 5, ()=>nosave.milestones.master_milestones),
            new Milestone(8, function(){ return 1; }, '-', 'master_level', function() { return `Light upgrades no longer takes ${fs.abbCurrency('light_points')}` }, 6, ()=>nosave.milestones.master_milestones),
            new Milestone(9, function(){ return 1; }, '-', 'master_level', function() { return `Unlock autobuyer for light upgrades` }, 7, ()=>nosave.milestones.master_milestones)
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

    nosave.lastLoop = Date.now();
    nosave.lastSave = Date.now();
}