class Cube {
    name = ""

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
    [hps.length.toString(), '8.65e0'],
    ['1e2', '1.5675e1'],
]

const cubes = [
    new Cube("Basic"),
    new Cube("Warrior"),
    new Cube("Assassin"),
    new Cube("Ninja"),
    new Cube("Dark Warrior"),
    new Cube("Light Warrior"),
]