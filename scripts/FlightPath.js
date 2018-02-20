class FlightPath {
    constructor(projectile, v0, p0, w, wind) {
        this.projectile = projectile;   // a Sphere object
        this.v0 = v0;                   // velocity vector
        this.p0 = p0;                   // position vector
        this.w = w || 0;                // angular velocity (may make this a vector later on)
        this.wind = wind;               // wind vector
    }
}

FlightPath.prototype.performance = {
    solveT: NaN
};


FlightPath.prototype.results = {
    timeToGround: NaN,
    maxRange: NaN,
    maxHeight: NaN,
};


FlightPath.prototype.data = {
    all: [],  // [t x y z vx vy vz fx fy fz] (10 dimension)
};


FlightPath.prototype.computeWeight = function() {
    let fw = this.projectile.mass * -9.8;

    return new Vector(0, fw, 0);
};


FlightPath.prototype.computeDragMagnitude = function(c, r, v) {
    const rho = 1.225;
    let a = Math.PI * Math.pow(r, 2);

    return (1/2) * c * a * rho * Math.pow(v, 2);
};


FlightPath.prototype.computeDragForce = function(v) {
    let v_rel = v.add(this.wind); // velocity for drag is with respect to the wind, so add the wind vector

    let fd_direction = v_rel.unit().negative(); // drag force opposes motion (creates unit vector)
    let fd_magnitude = this.computeDragMagnitude(this.projectile.dragCoeff, this.projectile.radius, v_rel.length()); // drag force magnitude

    return fd_direction.multiply(fd_magnitude); // create the drag force vector
};


FlightPath.prototype.computeMagnusForce = function(v) {
    let rho = 1.225;
    let omega = new Vector(0, 0, this.w);
    let tmp = Math.pow(Math.PI, 2) * Math.pow(this.projectile.radius, 3) * rho;

    let v_rel = v.add(this.wind); // magnus force needs the velocity relative to the wind, so add the wind vector

    let f1 = omega.cross(v_rel);
    f1.multiply(tmp);

    return f1.multiply(tmp);
};


FlightPath.prototype.computeWindForce = function() {
    return this.computeDragForce(this.wind);
};

FlightPath.prototype.computeNetForce = function(v) {
    let fnet = new Vector(0, 0, 0); // empty vector to store the net force

    let fw = this.computeWeight(); // weight
    let fd = this.computeDragForce(v); // force of drag
    let fm = this.computeMagnusForce(v);

    Vector.add(fw, fd, fnet); // sum the forces
    Vector.add(fm, fnet, fnet);

    return fnet;
};


FlightPath.prototype._velocityUpdate = function(v_0, f_net, _t) {
    let a_net = f_net.divide(this.projectile.mass); // net acceleration (a = f/this.projectile.mass)
    let v_step = a_net.multiply(_t); // velocity for this slice of time (v = a * t)

    return v_0.add(v_step); // add the slice of velocity to the current velocity
};


FlightPath.prototype._positionUpdate = function(x_0, v_0, _t) {
    let x_new = v_0.multiply(_t); // compute the distance travelled in the slice of time (x = v * t)

    return x_0.add(x_new); // add the slice to the current position
};


FlightPath.prototype.solve = function(delta_t, t_max) {
    let v_new = this.v0; // vector to hold the velocity info during simulation
    let p_new = this.p0; // vector for position info

    delta_t = delta_t || 0.001; // use a custom d_t if provided (affects accuracy of simulation)
    t_max = t_max || 5; // use a custom maximum time if provided (affects max length of simulation)

    let t = 0;

    let t0 = performance.now();

    while(t < t_max) {
        // compute the net force (updates the force of drag)
        let f_net = this.computeNetForce(v_new);

        // update the velocity and position
        v_new = this._velocityUpdate(v_new, f_net, delta_t);
        p_new = this._positionUpdate(p_new, v_new, delta_t);

        // save the simulation steps for later analysis [ t x y z vx vy vz fx fy fz ]
        this.data.all.push([t, p_new.x, p_new.y, p_new.z, v_new.x, v_new.y, v_new.z, f_net.x, f_net.y, f_net.z]);

        if(p_new.y <= this.projectile.radius) {
            // object has hit the ground; stop the simulation
            this.results.timeToGround = t;
            this.results.maxRange = p_new.x;

            break;

        } else {
            // object is still falling; increment the time
            t += delta_t;
        }
    }

    // compute and save the amount of time it took to solve
    let t1 = performance.now();
    this.performance.solveT = t1 - t0;
};
