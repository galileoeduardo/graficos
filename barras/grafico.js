class Grafico {

    constructor(el) {

        this.img = el

        this.canvas = document.createElement('canvas')
        this.canvas.width = 2200
        this.canvas.height = 1300
        this.ctx = this.canvas.getContext('2d')
        this.ctx.save()
        
        this.colors = {
            _line: '#5a4e26',
            _label: '#5a4e26'
        }
        
        this.getData(this.setData)

    }


    getData = function(callback) {

        var xmlhttp = new XMLHttpRequest();
        var url = "data.json";

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var json = JSON.parse(this.responseText);
                callback(json,json.length,10);
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();

    };

    //callback
    setData = (data,count, guide) => {

        this.data = data
        this.anchorpoint = { _x: 100, _y: 100 }

        let width = 1000
        this.grid = { _x: width / count, _y: 50 }

        this.graphicArea = { 
            _count: count,
            _guide: 10,
            _width: width,
             _height: this.grid._y * guide,
            _x: this.grid._x + 10,
            _y: this.grid._y,
        }
        
        this.canvas.width = this.anchorpoint._x + this.graphicArea._width + (this.grid._x * 2)

        this.ctx.fillStyle = '#ffffff'
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)

        this.draw()
        this.img.src = this.canvas.toDataURL("image/png","best")

    };

    drawGuideGradient() {

        
        const gradient = this.ctx.createLinearGradient(0,this.anchorpoint._y ,0,this.grid._y * this.graphicArea._guide + this.grid._y);
        gradient.addColorStop(0, '#118842')
        gradient.addColorStop(.337, '#118842')
        gradient.addColorStop(.337, '#b09a1f')
        gradient.addColorStop(.67, '#b09a1f')
        gradient.addColorStop(.67, '#7e1a1d')
        gradient.addColorStop(1, '#7e1a1d')

        this.ctx.restore()

        this.ctx.lineWidth = 4
        this.ctx.strokeStyle = gradient
        this.ctx.fillStyle = gradient
        this.ctx.font = '20px arial'

        let ax = this.anchorpoint._x
        let ay = this.anchorpoint._y
        let w = 50

        this.ctx.fillRect(ax - (w / 2), ay, w / 2, this.graphicArea._height + (this.grid._y * 2) )

        this.ctx.beginPath()
        this.ctx.moveTo(ax, ay)


        let stepY = this.grid._y

        for (let i = this.graphicArea._guide; i >= 0; i--) {
            
            this.ctx.lineTo(ax, ay + stepY)
            this.ctx.lineTo(ax + (w / 3), ay + stepY)
            this.ctx.moveTo(ax, ay + stepY)
            
            stepY += this.grid._y
        }

        this.ctx.lineTo(ax, ay + stepY)
        

        this.ctx.stroke()

    }


    drawGuideNumbers() {

        let ax = this.anchorpoint._x
        let ay = this.anchorpoint._y
        let w = 40

        this.ctx.restore()
        this.ctx.fillStyle = '#000000'

        let stepY = this.grid._y;
        
        for (let i = this.graphicArea._guide; i >= 0; i--) {
            
            this.ctx.translate(ax + w, ay + stepY + 6)
            this.ctx.rotate(4.71)
            this.ctx.fillText(i, 0, 0)
            this.ctx.rotate(-4.71)
            this.ctx.translate((ax + w) * -1, (ay + stepY + 6) * -1)

            stepY += this.grid._y

        }

    }


    drawBarStripe() {

        let ax = this.anchorpoint._x
        let ay = this.anchorpoint._y
        
        this.ctx.restore()
        this.ctx.fillStyle = '#f2f2f2'
        
        let bar = { _width: this.graphicArea._width / this.graphicArea._count, _height: this.graphicArea._height }
        
        this.ctx.beginPath()
        
        let stepX = 0;

        for (let i = 0; i < this.graphicArea._count / 2; i++) {
            this.ctx.fillRect(ax + this.graphicArea._x + stepX, ay + this.graphicArea._y -35, bar._width, bar._height + 70)
            stepX += this.grid._x * 2
        }
    
    }


    drawGuideLines() {

        let ax = this.anchorpoint._x
        let ay = this.anchorpoint._y
        
        this.ctx.restore()
       
        let stepY = 0;
        for (let i = this.graphicArea._guide; i >= 0; i--) {

            if (i == 5) { 
                this.ctx.strokeStyle = '#b70000'
                this.ctx.lineWidth = 5
            } else {
                this.ctx.strokeStyle = '#868686'
                this.ctx.lineWidth = 1
            }
            
            this.ctx.beginPath()
            this.ctx.moveTo(ax + this.graphicArea._x, ay + this.graphicArea._y + stepY)
            this.ctx.lineTo(ax + this.graphicArea._x + this.graphicArea._width, ay + this.graphicArea._y + stepY)
            this.ctx.closePath()
            
            this.ctx.stroke()


            stepY += this.grid._y

        }

    }


    drawLines() {

        let ax = this.anchorpoint._x
        let ay = this.anchorpoint._y
        
        this.ctx.restore()

        this.ctx.fillStyle = this.colors._line
        this.ctx.strokeStyle = this.colors._line
        this.ctx.lineWidth = 2
       
        let stepX = (this.grid._x / 2)
        let zeroPosition  = ay + this.graphicArea._height + this.grid._y

        for (let i = 0; i < this.graphicArea._count - 1; i++) {

            //circle
            this.ctx.beginPath()
            this.ctx.arc(ax + this.graphicArea._x + stepX, zeroPosition - (this.grid._y * this.data[i].value), 3, 0, 2 * Math.PI);
            this.ctx.closePath()

            this.ctx.stroke()
            this.ctx.fill()
            
            this.ctx.beginPath()
            this.ctx.moveTo(ax + this.graphicArea._x + stepX, zeroPosition - (this.grid._y * this.data[i].value) )
            stepX += this.grid._x
            this.ctx.lineTo(ax + this.graphicArea._x + stepX, zeroPosition - (this.grid._y * this.data[i+1].value) )
            this.ctx.closePath()

            this.ctx.stroke()

            if (i < this.graphicArea._count - 1 ) {
                //last circle
                this.ctx.beginPath()
                this.ctx.arc(ax + this.graphicArea._x + stepX, zeroPosition - (this.grid._y * this.data[i+1].value), 3, 0, 2 * Math.PI);
                this.ctx.closePath()

                this.ctx.fill()
                this.ctx.stroke()
            }

        }

    }

    drawLabels() {

        let ax = this.anchorpoint._x
        let ay = this.anchorpoint._y
        
        this.ctx.restore()

        this.ctx.fillStyle = this.colors._label
        this.ctx.font = 'bold 18px Arial'
        this.ctx.textAlign = 'end'

        let zeroPositionX  = ax + this.graphicArea._x - (this.grid._x / 2) + 9
        let zeroPositionY  = ay + this.graphicArea._height + this.grid._y + 50
        let stepX = this.grid._x;

        
        for (let i = 0; i < this.graphicArea._count; i++) {
            
            this.ctx.translate(zeroPositionX + stepX, zeroPositionY)
            this.ctx.rotate(4.71)
            
            this.ctx.fillText( this.data[i].label, 0, 0 )
            this.ctx.rotate(-4.71)
            this.ctx.translate((zeroPositionX + stepX) * -1, (zeroPositionY) * -1)

            stepX += this.grid._x

        }

    }


    draw() {

        this.drawGuideGradient()
        this.drawGuideNumbers()
        this.drawBarStripe()
        this.drawGuideLines()
        this.drawLines()
        this.drawLabels()
    
    }

}