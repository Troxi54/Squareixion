class Cube {
    constructor(name, start_at)
    {
        this.name = name;
        this.start_at = start_at;
    }
}

const hps = [
    '1e1', '2.5e1', '1e2', '2.5e2', 
    '8.5e2', '2.5e3', '7.85e3', '2.75e4',
    '8.95e4', '3.75e5', '1.15e6', '3.75e6',
    '1.15e7', '2.975e7', '8.155e7', '2.85e8',
    '9.05e8', '3e9', '9.995e9', '5.6e10',
    '8.85e11', '1.35e13', '8.65e13', '5.95e14'
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
    new Cube("X-Square", N('5e3')),
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
    new Cube("Anti Square", N('1e25')),
    new Cube("Outline Square", N('1e50')),
    new Cube("Outline Square+", N('1e250')),
    new Cube("The King", N('1e1000')),
    new Cube("The Emperor", N('ee4')),
]

cubes.forEach(function(cube, indexx){
    cube.start_at = N(!cube.start_at ? indexx * settings.cube_name_postfixes.length : cube.start_at).plus(1);
})