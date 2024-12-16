get = main_functions.get;
updates = main_functions.updates;
buys = main_functions.buys;
gameFunctions = main_functions.gameFunctions;

let ms = 0;
let a = [];
function mainLoop() {   
  let ms = Date.now();

  if (!document.hidden) {
    get.updateAll();
    updates.updateAll();
    gameFunctions.roundValues();
    for (const auto in nosave.Autoclickers) {
      nosave.Autoclickers[auto].do();
    }
    if (Date.now() >= nosave.lastSave + settings.auto_save * 1e3) {
      save();
      nosave.lastSave = Date.now();
    }
    if (events.isCubeHeld && player.isUnlocked.light && Date.now() >= times.cubeHold[1] + times.cubeHold[0] * 1e3) {
      gameFunctions.damageCube();
      times.cubeHold[1] = Date.now();
    }
    if (events.isGSHeld && nosave.milestones.master_milestones[9].isEnough() && Date.now() >= times.GSHold[1] + times.GSHold[0] * 1e3) {
      gameFunctions.damageGiantCube();
      times.GSHold[1] = Date.now();
    }

    player.lastLoop = Date.now();
  }
  
  
  /* a.push(Date.now() - ms);
  if (a.length > 25) a.shift();
  let b = 0;
  a.forEach(c=>b+=c);
  b /= a.length;
  console.log(b + 'ms') */
}