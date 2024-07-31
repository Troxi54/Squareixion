fs = {
    update(element, text)
    {
        
        if (element.html() != text) element.html(text);
    },
    reset(tier, condition, lambda)
    {
        if (condition())
        {
            lambda();

            //gameFunctions.updatePrestigePart();
            //gameFunctions.updateLightPart();

            //updates.updateAll();
            //updates.updateAll();
            get.updateAll();
            

            gameFunctions.hideAndShowContent();
        }
    },
    setUpgradesHTML()
    {
        const containers_names = {
            "prestige-upgrades-container": ()=>player.upgrades.prestige_upgrades,
            "light-upgrades-container": ()=>player.upgrades.light_upgrades,
            "ruby-upgrades-container": ()=>player.upgrades.ruby_upgrades,
            "giga-upgrades-container": ()=>player.upgrades.giga_upgrades,
            "collapse-upgrades-container": ()=>player.upgrades.collapse_upgrades
        }
        const containers = $('.upgrades-container');

        for (let container of containers)
        {
            const upgr_cont = containers_names[container.id]();
            container = $(container);
            container[0].addEventListener("wheel", function(e) {
                let width = container[0].scrollWidth - container[0].clientWidth, more = false, less = false;
                if (e.deltaY > 0) {
                    if (container[0].scrollLeft === width) more = true;
                    container.animate({scrollLeft: container[0].scrollLeft + 100}, 0);
                }
                else {
                    if (container[0].scrollLeft === 0) less = true;
                    container.animate({scrollLeft: container[0].scrollLeft - 100}, 0);
                }
                if (!(more || less)) e.preventDefault();
            });
            

            for (let i = 0; i < container.children('button').length; i+=1)
            {
                const upgrade = $(container.children('button')[i]);
                
                upgr_cont[i].upgrade_html.name = $(upgrade.children('.upgrade-name')[0]);
                upgr_cont[i].upgrade_html.info = $(upgrade.children('.upgrade-info')[0]);
                upgr_cont[i].upgrade_html.cost = $(upgrade.children('.upgrade-cost')[0]);
                upgr_cont[i].upgrade_html.button = upgrade;
                
                upgrade.off();
                upgrade.on("click", function()
                {
                    upgr_cont[i].buy_max();
                })
                upgrade.on("contextmenu", function(e)
                {
                    if (e.cancelable)
                    {
                        upgrade.blur();
                        e.preventDefault();
                    }
                    
                    upgr_cont[i].buy();
                }) 
            }
        }
    },
    setMilestonesHTML()
    {
        const containers_names = {
            "master-milestones-container": nosave.milestones.master_milestones,
            "collapse-milestones-container": nosave.milestones.collapse_milestones,
        }
        const containers = document.getElementsByClassName('milestone-container');

        for (let container of containers)
        {
            const milest_cont = containers_names[container.id]
            container = $(container);
            for (let i = 0; i < container.children('div').length; i+=1)
            {
                const milestone = $(container.children('div')[i]);
                milest_cont[i].html.div = milestone;
                milest_cont[i].setHTML('requirement', $(milestone.children('.milestone-requirement')[0]));
                milest_cont[i].html.info = $(milestone.children('.milestone-info')[0]);
            }
        }
    },
    abbCurrency(currencyName)
    {
        const array = {
            'damage' : 'damage',
            'prestige_points' : 'PP',
            'light_points' : 'LP',
            'mini_cubes' : 'MS',
            'giant_cube_damage' : 'GSD',
            'ruby' : 'Ruby',
            'giga_squares' : 'GGS',
            'neon_luck' : 'NSL',
            'stars' : 'stars',
            'collapsed_times': 'Collapsed times'
        }
        return array[currencyName];
    },
    upgradesEffect(currencyName)
    {
        let effect = N('1e0');
        
        for (const cont in player.upgrades)
        {
            player.upgrades[cont].forEach(function(upgrade)
            {
                if (upgrade.multiplies_what === currencyName && !upgrade.raises)
                {
                    effect = effect.times(upgrade.effect);
                }
            })
        }
        return effect;
    },
    upgradesEffectPow(currencyName)
    {
        let effect = N('1e0');
        
        for (const cont in player.upgrades)
        {
            player.upgrades[cont].forEach(function(upgrade)
            {
                if (upgrade.multiplies_what === currencyName && upgrade.raises)
                {
                    effect = effect.times(upgrade.effect);
                }
            })
        }
        return effect;
    },
    milestonesEffect(currencyName)
    {
        let effect = N('1e0');
        
        for (const cont in nosave.milestones)
        {
            nosave.milestones[cont].forEach(function(milestone)
            {
                if (milestone.enough && milestone.boosts_what === currencyName)
                {
                    effect = effect.times(milestone.effect);
                }
            })
        }
        return effect;
    },
    animateAppearance(element, animate = true, duration = settings.unlock_content_transition)
    {
        if (!(element.css('opacity') === '1' && element.css('display') !== 'none')) 
        {
            element.css('opacity', '0');
            element.show();
            if (animate) element.animate({'opacity': '1'}, duration);
            else element.css('opacity', '1');
        }
        
    },
    animateDisappearance(element, animate = true, duration = settings.unlock_content_transition)
    {
        element.css('opacity', '1');
        if (animate) element.animate({'opacity': '0'}, duration);
        else element.css('opacity', '0');
        setTimeout(()=>{ element.hide(); }, duration);
    },
    show(element, animate = true)
    {
        fs.animateAppearance(element, animate);
    },
    hide(element)
    {
        element.hide();
    },
    hide_and_show(element, condition, animate = true)
    {
        if (condition)
        {
            if (element.is(':hidden')) fs.show(element, animate);
        }
        else fs.hide(element)
    },
    toggleLocking(locked, unlocked, condition)
    {
        if (condition)
        {
            locked.hide();
            if (unlocked.is(':hidden')) unlocked.show();
        }
        else
        {
            if (locked.is(':hidden')) locked.show();
            unlocked.hide();
        }
    }
};