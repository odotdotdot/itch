/* A class to manage the waxing and waning of the game board */
class Blossom{
  constructor(){
    this.assignment_index = 12;
    this.not_perm_index = 0;
    var K = .5 * 3**.5;
    this.not_permanent = [
                         [21**.5, 6.5*Math.atan( (.5*3**.5) / 4.5)]
                        ,[6*K,   Math.PI/6]
                        ,[21**.5, 6.5*Math.atan( (.5*3**.5) / 4.5) + Math.PI]
                        ,[6*K, 7*Math.PI/6]
                        ,[21**.5, 4.5*Math.atan( (.5*3**.5) / 4.5) + Math.PI]
                      ]
    this.helics = [
       [0, 0]
      ,[2*K,   Math.PI/6]
      ,[2*K, 3*Math.PI/6]
      ,[2*K, 7*Math.PI/6]
      ,[2*K, 9*Math.PI/6]
      ,[3,  4*Math.PI/3]
      ,[3,    Math.PI/3]
      ,[4*K,   Math.PI/6]
      ,[4*K, 3*Math.PI/6]
      ,[4*K, 7*Math.PI/6]
      ,[4*K, 9*Math.PI/6]
      ,[21**.5, 4.5*Math.atan( (.5*3**.5) / 4.5)]

    ]
  }

  blossom(){
    this.activate_hexes();
    this.copy_active_hexes();
    this.remove_inactive_copies();
  }

  activate_hexes(){
    hexes.forEach( e => { e.isActive = false; });
    utility.byteToList(SERIAL_RECORD).forEach( e => {if(e!=0xff) hexes.find( h => h.serial == e).isActive = true; });
  }

  copy_active_hexes(){

    hexes.forEach( e => {
                    if(e.isActive && !e.isCopy && !e.hasCopy){
                      hexes.push( new Hex({
                        index: this.assignment_index
                        ,x: this.not_permanent[this.not_perm_index][0]
                        ,y: this.not_permanent[this.not_perm_index][1]
                        ,isCopy:true
                        ,isCopyOf:e.serial
                        ,pitchChromatic:e.pitchChromatic
                      }));
                      e.hasCopy = true;
                      this.not_perm_index++;
                      this.not_perm_index %= this.not_permanent.length;
                      this.assignment_index++;
                    }
                });
  }

  remove_inactive_copies(){
    hexes.forEach( (e,index) => {
                    if(e.isCopy && !e.isActive && !hexes.find( h => h.serial == e.isCopyOf).isActive ){
                      hexes[e.isCopyOf].hasCopy = false;
                      hexes.splice(index, 1);
                    }
    });
  }

}
