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
    game_version: [0, 4, '', ''],
    savefile_name: "Squareixion save",
    fps: 'later...',
    save: true,
    auto_save: 10, // save interval
    //int_to_float: N('1e3'), // starting from this integers are float in abb() function
    //star_count: 500, // how many stars spawn in the background
    //star_min: 0, // minimum of star count
    //star_max: 10000, // maximum of star count
    cube_text_plus_style: "-text", // what adds to the end of square name to get style for text
    cube_name_postfixes: ['-', '', '+', '++' ],
    cube_size_start: 50,
    unlock_content_transition: 1000,
    intro: true
}
,
unlocks = {
    prestige: N('3e0'),
    light: N('2.4e1'),
    mini_cubes: N('4e1'),
    master: N('7.8e1'),
    giga_squares: N('1.25e2'),
    collapse: N('1.05e5'),
    galaxy: N('1e7'),
    rebuild: N('1e100')
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
    prestige: ['Digit1', '1'],
    light: ['Digit2', '2'],
    master: ['Digit3', '3'],
    giga: ['KeyG', 'g'],
    collapse: ['Digit4', '4'],
    rebuild: ['Digit5', '5']
};
let normal_realm_music = [
    "audio/music/Cosmic Dream.mp3",
    "audio/music/Cosmic Symphony.mp3",
    "audio/music/Fun in the Game.mp3",
    "audio/music/Science is Interesting.mp3",
    "audio/music/Space Adventures.mp3",
    "audio/music/Square World.mp3",
    "audio/music/Squareixion's Mystery.mp3",
    "audio/music/Squares.mp3",
    "audio/music/Cubixion.mp3",
    "audio/music/Infinite Growth.mp3",
    "audio/music/Evolution.mp3",
],
collapse_realm_music = [
    "audio/music/Starstruck Love.mp3"
],
rebuild_realm_music = [
    "audio/music/Across Dimensions.mp3"
];