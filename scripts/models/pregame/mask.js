class Mask{
  constructor( {
                 mask_color = colors.pink
                ,speed = 1.5
                ,parent
                ,type = 'rect'
                ,init_alpha = 0
               } = {} ) {

    this.color = color(mask_color);
    this.speed = speed;
    this.parent = parent

    this.fadingUp = false;
    this.fadingDown = false;

    this.fadeUpCallBack = null;
    this.fadeDownCallBack = null;

    this.color.setAlpha(init_alpha);

    this.type = type;
}
    display(){
      rectMode(CENTER);
      fill(this.color);

      this.shape();

      if(this.fadingUp){
        this.color.setAlpha( alpha(this.color) + this.speed )
        if( alpha(this.color) >= 0xFF){
          this.color.setAlpha(0xff);
          this.fadingUp = false;
          this.parent.visibles.splice(this.parent.visibles.indexOf(this), 1);
          this.fadeUpCallBack();
        }
      }


      if(this.fadingDown){
          this.color.setAlpha( alpha(this.color) - this.speed )
          if( alpha(this.color) <= 0){
            this.color.setAlpha(0);
            this.fadingDown = false;
            this.parent.visibles.splice(this.parent.visibles.indexOf(this), 1);
            this.fadeDownCallBack();
          }
      }

    }

    fade_up(callback){
      this.fadingUp = true;
      this.color.setAlpha(0);
      if(!this.parent.visibles.includes(this))
        this.parent.visibles.push(this);
      this.fadeUpCallBack = callback;
    }

    fade_down(callback){
      this.fadingDown = true;
      this.color.setAlpha(0xff);
      if(!this.parent.visibles.includes(this))
        this.parent.visibles.push(this)
      this.fadeDownCallBack = callback;
    }

    shape(){

      if(this.type == 'rect')
        rect(CX, CY, W, H);
      if(this.type == 'circle')
        circle(CX, CY, 6*geometry.RADIUS)


    }
}
