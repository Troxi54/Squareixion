class Cube {
    constructor(name, start_at)
    {
        this.name = name;
        this.start_at = start_at;
    }
}

const hps = [
    '1e1', '2.5e1', '7.5e1', '4e2', 
    '1.25e3', '6e3', '3.2e4', '9.6e4',
    '5e5', '2.76e6', '8e6', '3.5e7',
    '1.12e8', '9e8', '4e9', '1.31e10',
    '3.33e10', '1.075e11', '7.25e11', '6e12',
    '2.97e13', '9.99e13', '8.88e14', '7e15'
]

const hps_scalings = [
    [hps.length.toString(), '2e2']
]

const cubes = [
    new Cube("Basic"),
    new Cube("Warrior"),
    new Cube("Assassin"),
    new Cube("Ninja"),
    new Cube("Dark Warrior"),
    new Cube("Light Warrior"),
    new Cube("Dark Defender"),
    new Cube("Light Defender"),
    new Cube("Planet Destroyer"),
    new Cube("Planet Defender"),
    new Cube("Galactic Destroyer"),
    new Cube("Galactic Defender"),
    new Cube("Universe Defender"),
    new Cube("Universe Destroyer"),
    new Cube("Earth god"),
    new Cube("Water god", 72),
    new Cube("Wind god", 100),
    new Cube("Fire god", 168),
    new Cube("Time god", 250),
    new Cube("God of Electricity", 500),
    new Cube("Quadruple Square", N('1e3')),
    new Cube("Hexadecimal Square", N('2.5e3')),
    new Cube("64-Square", N('5e3')),
    new Cube("Agressive Square", N('1e4')),
    new Cube("Peaceful Square", N('5e4')),
    new Cube("Hidden Square", N('1e6')),
    new Cube("Golden Square", N('1e7')),
    new Cube("Amethyst Square", N('1e8')),
    new Cube("Premium Square", N('1e9')),
    new Cube("Basic Cube", N('1e10')),
    new Cube("Square of Defense", N('1e11')),
    new Cube("Square of Offense", N('1e12')),
    new Cube("Neutral Square", N('1e13')),
    new Cube("Collapse Square", N('1e14')),
    new Cube("Rainbow Square", N('1e15')),
    new Cube("Infinite Square", N('1e16')),
]

cubes.forEach(function(cube, indexx){
    cube.start_at = N(!cube.start_at ? indexx * settings.cube_name_postfixes.length : cube.start_at).plus(1);
})