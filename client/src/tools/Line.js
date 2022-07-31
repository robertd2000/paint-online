import Tool from './Tool'

export default class Line extends Tool {
  constructor(canvas, socket, id) {
    super(canvas, socket, id)
    this.listen()
  }

  listen() {
    this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
  }

  mouseUpHandler(e) {
    this.mouseDown = false
    this.socket.send(
      JSON.stringify({
        method: 'draw',
        id: this.id,
        figure: {
          type: 'finish',
          color: this.ctx.fillStyle,
          lineWidth: this.ctx.lineWidth,
        },
      })
    )
  }

  mouseDownHandler(e) {
    this.mouseDown = true
    this.ctx.beginPath()
    this.currentX = e.pageX - e.target.offsetLeft
    this.currentY = e.pageY - e.target.offsetTop
    this.ctx.moveTo(this.currentX, this.currentY)
    this.saved = this.canvas.toDataURL()
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      this.socket.send(
        JSON.stringify({
          method: 'draw',
          id: this.id,
          figure: {
            type: 'line',
            x: e.pageX - e.target.offsetLeft,
            y: e.pageY - e.target.offsetTop,
            currentX: this.currentX,
            currentY: this.currentY,
            color: this.ctx.strokeStyle,
            lineWidth: this.ctx.lineWidth,
          },
        })
      )

      this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
    }
  }

  draw(x, y) {
    const img = new Image()
    img.src = this.saved
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
      this.ctx.beginPath()
      this.ctx.moveTo(this.currentX, this.currentY)
      this.ctx.lineTo(x, y)
      this.ctx.stroke()
    }
  }

  static staticDraw(ctx, x, y, currentX, currentY, color, lineWidth) {
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth

    ctx.beginPath()
    ctx.moveTo(currentX, currentY)
    ctx.lineTo(x, y)
    ctx.stroke()
  }
}
