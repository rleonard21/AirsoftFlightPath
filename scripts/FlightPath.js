class FlightPath {
    constructor(bb, v0, y0, w) {
        this.bb = bb;
        this.v0 = v0;
        this.y0 = y0;
        this.w = w || 0;
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
    timeData: [], // stores the time intervals
    vxData: [], // velocity in x direction
    vyData: [], // velocity in y direction
    xxData: [], // displacement in x direction
    xyData: [],  // displacement in y direction
    xData: []
};

// FlightPath.prototype._toVector = function(a) {
//     return new Victor(a, a);
// };


FlightPath.prototype.computeWeight = function() {
    let fw = this.bb.mass * -9.8;

    return new Vector(0, fw, 0);
};


FlightPath.prototype.computeDragMagnitude = function(c, r, v) {
    const rho = 1.225;
    let a = Math.PI * Math.pow(r, 2);

    return (1/2) * c * a * rho * Math.pow(v, 2);
};


FlightPath.prototype.computeDragForce = function(v) {
    let fd_direction = v.unit().negative(); // drag force opposes motion (creates unit vector)
    let fd_magnitude = this.computeDragMagnitude(this.bb.dragCoeff, this.bb.radius, v.length()); // drag force magnitude

    return fd_direction.multiply(fd_magnitude); // create the drag force vector
};


FlightPath.prototype.computeMagnusForce = function(v) {
    let rho = 1.225;
    let omega = new Vector(0, 0, this.w);
    let tmp = Math.pow(Math.PI, 2) * Math.pow(this.bb.radius, 3) * rho;

    let f1 = omega.cross(v);
    f1.multiply(tmp);

    return f1.multiply(tmp);
};


FlightPath.prototype.computeNetForce = function(v) {
    let fnet = new Vector(0, 0, 0); // empty vector to store the net force

    let fw = this.computeWeight(); // weight
    let fd = this.computeDragForce(v); // force of drag
    let fm = this.computeMagnusForce(v);

    Vector.add(fw, fd, fnet); // sum the forces
    Vector.add(fm, fnet, fnet);

    return fnet
};


FlightPath.prototype._velocityUpdate = function(v_0, f_net, _t) {
    let a_net = f_net.divide(this.bb.mass); // net acceleration (a = f/this.bb.mass)
    let v_step = a_net.multiply(_t); // velocity for this slice of time (v = a * t)

    return v_0.add(v_step); // add the slice of velocity to the current velocity
};


FlightPath.prototype._positionUpdate = function(x_0, v_0, _t) {
    let x_new = v_0.multiply(_t); // compute the distance travelled in the slice of time (x = v * t)

    return x_0.add(x_new); // add the slice to the current position
};


FlightPath.prototype.solve = function(delta_t, t_max) {
    let v_new = new Vector(this.v0, 0, 0); // vector to hold the velocity info during simulation
    let p_new = new Vector(0, this.y0, 0); // vector for position info
    
    delta_t = delta_t || 0.0001; // use a custom d_t if provided (affects accuracy of simulation)
    t_max = t_max || 5; // use a custom maximum time if provided (affects max length of simulation)

    let t = 0;

    let t0 = performance.now();

    while(t < t_max) {
        // compute the net force (updates the force of drag)
        let f_net = this.computeNetForce(v_new);

        // update the velocity and position
        v_new = this._velocityUpdate(v_new, f_net, delta_t);
        p_new = this._positionUpdate(p_new, v_new, delta_t);

        // save the simulation steps for later analysis
        this.data.timeData.push(t);
        this.data.vxData.push(v_new.x);
        this.data.vyData.push(v_new.y);
        this.data.xxData.push(p_new.x);
        this.data.xyData.push(p_new.y);
        this.data.xData.push([p_new.x, p_new.y]);

        if(p_new.y <= 0) {
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