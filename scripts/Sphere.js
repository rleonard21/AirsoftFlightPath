class Sphere {
    constructor(mass, radius, dragCoeff) {
        this.mass = mass;
        this.radius = radius;
        this.dragCoeff = dragCoeff || 0.5 // default 0.5 for a sphere
    }
}