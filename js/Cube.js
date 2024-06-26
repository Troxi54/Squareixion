class Cube {
    constructor(name)
    {
        this.name = name;
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
    [hps.length.toString(), '5.65e0'],
    ['3e1', '1.591e1'],
    ['1e2', '7.713e1'],
    ['2.5e2', '1.0639e2'],
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
]