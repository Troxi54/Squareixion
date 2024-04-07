const player = {
    stage: BigNumber('1e0'),
    cube_hp: BigNumber('0e0'),
    prestige_points: BigNumber('0e0'),
    prestige_points_base: BigNumber('2e0'),
};

const nosave = {
    damage_multi: BigNumber('1e1'),
    prestige_points_multi: BigNumber('1e0'),

    lastLoop: Date.now()
}

const fs = {
    update(element, text)
    {
        element.innerHTML = text;
    },
    buy(currency, cost, lambda)
    {
        if (currency.ge(cost))
        {
            lambda();
        }
    },
    reset(tier, condition, lambda)
    {
        if (condition())
        {
            lambda();

            gameFunctions.updateCubePart();
            gameFunctions.updatePrestigePart();
            get.updateDamage();

            gameFunctions.spawnCube();
            updates.prestigeAmount();
        }
    }
}

const main_functions = {
    get: { // Update and get non-variable values
        updateCubeStat()
        {
            const index = Math.floor((player.stage.toNumber() - 1) / setting.cube_name_postfixes.length);
            this.cube_stat = cubes[index];

            this.cube_total_hp = BigNumber(hps[player.stage.toNumber() - 1]);

            this.cube_name = this.cube_stat.name + setting.cube_name_postfixes[ player.stage.minus(
                player.stage.div(BigNumber(setting.cube_name_postfixes.length).plus(BigNumber('1e0'))).floor().times(BigNumber(setting.cube_name_postfixes.length))).toNumber() - 1] // stage - floor(stage / postfixes_count) * postfixes_count

            this.cube_style = this.cube_stat.name.toLowerCase().replace(/ /g, '-');
        },
        cube_stat: new Cube(),
        cube_total_hp: BigNumber('0e0'),
        cube_name: "",
        cube_style: "",

        updateDamage()
        {
            this.damage = nosave.damage_multi;
        },
        damage: BigNumber('0e0'),

        updatePrestigePoints()
        {
            this.prestige_points = player.stage.ge(unlocks.prestige) ? nosave.prestige_points_multi.times(player.prestige_points_base.topow(player.stage.minus(unlocks.prestige)))
                                    : BigNumber('0e0');
        },
        prestige_points: BigNumber('0e0'),

        updateAll()
        {
            this.updateCubeStat()
            this.updateDamage();
            this.updatePrestigePoints();
        }
    },
    updates: {  // update HTML
        cubeInfo()
        {
            fs.update(elements.cube_info, `<span class="white-text">Rank: </span><span class="${ get.cube_style + setting.cube_text_plus_style }">${ get.cube_name }</span><br>
                                           <span class="white-text">HP: ${ abb_abs(player.cube_hp) }/${ abb_abs(get.cube_total_hp) } </span><br>
                                           <span class="damage">Damage:</span> ${ abb(get.damage) }`);
        },
        prestigeButtonInfo()
        {
            fs.update(elements.prestige_button_text, `You can earn <span class="prestige">${ abb_abs(get.prestige_points) }</span> prestige points`);
            if (get.prestige_points.le(BigNumber('0e0'))) { elements.prestige_button_text.classList.add('prestige-button-text-cannot'); }
            else { elements.prestige_button_text.classList.remove('prestige-button-text-cannot'); }
        },
        prestigeAmount()
        {
            fs.update(elements.prestige_points_amount, `<span class="prestige">Prestige points: </span>${ abb_abs(player.prestige_points) }`);
        },
        updateAll()
        {
            this.cubeInfo();
            this.prestigeButtonInfo();
            this.prestigeAmount();
        }
    },
    buys: {
    },
    add_events() {
        elements.cube.addEventListener('click', function()
        {
            player.cube_hp = player.cube_hp.minus(get.damage);
            if (player.cube_hp.le(BigNumber('0e0')))
            {
                player.stage = player.stage.plus(BigNumber('1e0'));
                get.updateCubeStat();
                gameFunctions.updatePrestigePart();
                gameFunctions.spawnCube();
            }
            updates.cubeInfo();
        })
        elements.prestige_button.addEventListener('click', function()
        {
            fs.reset(
                1, 
                () => player.stage.ge(unlocks.prestige),
                function()
                {
                    player.prestige_points = player.prestige_points.plus(get.prestige_points);
                    player.stage = BigNumber('1e0');
                }
            );
        })
    },
    gameFunctions: {
        spawnStar()
        {
            let star = document.createElement('div');
            star.classList.add('star');
            star.style.left = "calc(" + Math.random() * 100 + '% - 1px)';
            star.style.top = "calc(" + Math.random() * 100 + '% - 1px)';
            star.style.backgroundColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, .5)`;
            elements.star_container.append(star);
        },
        spawnCube()
        {
            elements.cube.className = "";
            elements.cube.classList.add('cube');
            
            elements.cube.classList.add(get.cube_style);
            elements.cube.style.width = this.getCubeSize() + 'px';
            player.cube_hp = get.cube_total_hp;

            updates.cubeInfo();
        },
        getCubeSize()
        {
            let size = setting.cube_size_start * (1 + player.stage.log(BigNumber('1e2')).toNumber());
            console.log(size);
            return size;
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
        }
    }
};

const get = main_functions.get;
const updates = main_functions.updates;
const buys = main_functions.buys;
const gameFunctions = main_functions.gameFunctions;

function mainLoop()
{
}

document.addEventListener("DOMContentLoaded", function()
{
    elements = {
        wrapper: document.querySelector('#wrapper'),
        cube: document.querySelector('.cube'),
        cube_info: document.querySelector('#cube-info-text'),
        star_container: document.querySelector('#background'),
        prestige_button: document.querySelector('#prestige-button'),
        prestige_button_text: document.querySelector('#prestige-button-text'),
        prestige_points_amount: document.querySelector('#prestige-upgrades-info')
    };

    get.updateAll();
    main_functions.add_events();
    gameFunctions.spawnCube();
    updates.updateAll();

    for (let i = 0; i < setting.star_count; ++i) gameFunctions.spawnStar();

    // place for console logs

    //


    setInterval(mainLoop, getLoopInterval())
});