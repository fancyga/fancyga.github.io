/**
 * Created by youfu on 16/10/12.
 */

Raphael.prototype.verLine = function (x, y, new_y) {
    return this.path("M" + x + " " + y + "V" + new_y);
}
Raphael.prototype.horLine = function (x, y, new_x) {
    return this.path("M" + x + " " + y + "H" + new_x);
}
Raphael.prototype.arcLine = function (x, y, mid_x, mid_y, end_x, end_y) {
    return this.path("M" + x + " " + y + "S" + " " + mid_x + " " + mid_y + " " + end_x + " " + end_y)
}

Tab = function (paper, x, y, width, height) {
    this.paper = paper;
    this.x = x;
    this.y = y;

    this.width = (!width) ? 900 : width;
    this.height = (!height) ? 60 : height;
    this.num_strings = 6;
    this.num_bars = 5

    this.tab_spacing = 320

    // Content
    this.font_size = 10
    this.note_spacing = 20
    this.string_spacing = this.height / (this.num_strings - 1);
    this.string = 0
    this.fret = 'X'
    this.duration = 0
    this.grace = undefined

    this.new_bar = 0
    this.bar_internal_offset = 0

    this.total_duration = 0
}

Tab.prototype.draw_six_line = function () {
    for (var i = 0; i < this.num_strings; i++) {
        this.paper.horLine(this.x, this.y + this.string_spacing * i, this.x + this.width)
    }
}

Tab.prototype.draw_bar_line = function() {
    var bar_width = Math.floor(this.width / this.num_bars)
    var spacing = this.height / (this.num_strings - 1);
    for (var i = 0; i 