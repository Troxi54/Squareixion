BigNumber.set({
    EXPONENTIAL_AT: 0,
    POW_PRECISION: 9,
});

let elements = {},
    player = {},
    nosave = {},
    fs = {},
    main_functions = {},
    get = {},
    updates = {},
    buys = {},
    gameFunctions = {};

const setting = {
    save: true,
    auto_save: 10,
    update_time_s: BigNumber('1e-0'),
    to_exp: BigNumber('1e30'),
    int_to_float: BigNumber('1e3'),
    star_count: 0,
    cube_text_plus_style: "-text",
    cube_name_postfixes: ['-', '', '+', '++' ],
    cube_size_start: 50,
    autoclickers_start: 16
}
,
unlocks = {
    prestige: BigNumber('4e0'),
    light: BigNumber('3e1')
}
,
events = {
    isCubeHeld: false
};

player.isUnlocked = {
    prestige: false,
    light: false,
}