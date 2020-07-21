class Token {
    constructor( {  id = 0
                   ,x = 100
                   ,y = 100
                   ,radius = 1.25 * geometry.RADIUS
                   ,color = colors.yellow
                   ,message = 'bass'
                   ,text_size = utility.setTextSize(fonts.letters, message, 24, this.radius - 2)
    } = {}){
          this.id = id;
          this.x = x;
          this.y = y;
          this.radius = radius;
          this.color = color;
          this.message = message;
          this.text_size = utility.setTextSize(fonts.letters, this.message, 24, this.radius);
          this.serialRecord = null;
        }

          isInside(u, v){
            if(pow(u - this.x,2) + pow(v - this.y,2) < pow(this.radius,2))
              return true
            else
              return false;
            }
          move(u = mouseX, v = mouseY){
              this.x = u;
              this.y = v;
            }
          display(){
              push();
              noStroke();
              fill(this.color);
              circle(this.x, this.y, this.radius);
              if(this.serialRecord == null)
                this.displayMessage();
              pop();
            }
          hexCheck(){
            /*hex check determines whether the voice is on top of a hex and returns that hex's serial number
              if the voice is not on a playable hex, it returns null. it makes more sense for hex_data[] to be a static
              member of the voice class...to do */
              let currentHexPosition = null;
              for(var n = 0; n < hexes.length; n ++){
                var theta = atan(this.y - hexes[n].center.y/this.x - hexes[n].center.x);
              //calculate the magnitude of the vector to the hex side at that angle
                var C = 100*Math.sin(Math.PI/3) / abs(Math.sin( 2*Math.PI/3 - theta ));
              //calculate the magnitude of A
                var P = ( (this.x - hexes[n].center.x)**2 + (this.x - hexes[n].center.x)**2 )**.5;
              //if the point is within the ideal circle and not further away than C, it's inside
                if(pow(this.x-hexes[n].center.x,2) + pow(this.y-hexes[n].center.y,2) < pow(geometry.RADIUS,2) && P<=C){
                  currentHexPosition = hexes[n].serial;
                  break;}
                }
              this.serialRecord = currentHexPosition;
              }
          getSerial(){
            if(this.serialRecord!=null)
              return this.serialRecord;
            else
              return 0xff;
          }
          displayMessage(){
            push();
            fill(colors.pink);
            textSize(this.text_size);
            text(this.message,this.x, this.y);
            pop();
          }
          resize(){
            this.radius = 1.25 * geometry.RADIUS;
            this.text_size = utility.setTextSize(fonts.letters, this.message, 24, this.radius - 2);
            this.x = this.x * W/Xo;
            this.y = this.y * H/Yo;
          }
  }
