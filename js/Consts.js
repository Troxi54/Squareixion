let elements = {},
    player = {},
    nosave = {},
    fs = {},
    main_functions = {},
    get = {},
    updates = {},
    buys = {},
    gameFunctions = {};

const settings = {
    game_name: "Squareixion",
    game_version: [0, 1, 1, ''],
    save: true,
    auto_save: 10,
    update_time_s: new Decimal('1e0'),
    to_exp: new Decimal('1e30'),
    int_to_float: new Decimal('1e3'),
    star_count: 0,
    cube_text_plus_style: "-text",
    cube_name_postfixes: ['-', '', '+', '++' ],
    cube_size_start: 50,
    autoclickers_start: 16,
    unlock_content_transition: 1000
}
,
unlocks = {
    prestige: new Decimal('4e0'),
    light: new Decimal('3e1'),
    mini_cubes: new Decimal('5e1'),
    master: new Decimal('7.5e1'),
}
,
events = {
    isCubeHeld: false,
}
,
times = {
    cubeHold: [.1, Date.now()]
}
,
hotkeys = {
    prestige: 'p',
    light: 'l'
};