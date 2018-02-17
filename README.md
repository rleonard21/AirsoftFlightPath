## Projectile Flight Path Simulator
#### About
This Javascript based project simulate the flight path of a rotating spherical object as it flies 
through the air. Several external forces in addition to gravity are considered in the simulation. 


#### Code Structure
The simulation code is written in Javascript and is meant to be run on a local server. The webserver
is very rudimentary with minimal CSS. It runs the simulation immediately on page load and the 
numeric results are displayed on the page. A download button allows the user to download a CSV file
with the seven dimensions of the data: `[t z y x vx vy vz]`.
Wolfram Mathematica is used to manually generate the graphics from the downloaded data.


#### Simulation
###### Time Interval
The simulation iteratively calculates the position and velocity of the projectile at intervals
of small slices of time, `delta_t`. The default value is `0.001` seconds; a smaller `delta_t` will 
result is a more accurate result but will also take longer. 

###### Net Force
The net force is calculated at every step, including the force of drag and the force due to the
Magnus Effect of the rotating body. The projectile generally travels farther with these two forces
taken into consideration because both forces have a vertical vector component that oppose gravity,
thus reducing vertical acceleration. 

###### Completion
The simulation completes when the projectile hits the ground (`y` coordinate of position vector
is less than zero). This does not take into account the radius of the projectile because it is 
insignificant for 6mm projectiles. The `solve` function generally takes between 1 and 3 milliseconds 
to complete. 


#### Example Graphic
Below is an example graphic of the simulated flight paths of spheres of differing mass fired at constant velocity. 
![Imgur](https://i.imgur.com/b7NUqEH.jpg)
