## Projectile Flight Path Simulator
#### About
<<<<<<< HEAD
This Javascript based project simulate the 3D flight path of a rotating spherical object as it flies 
through the air. Several external forces in addition to gravity are considered in the simulation.
Forces, accelerations, velocities, and positions are calculated as 3D vectors.
=======
This Javascript based project simulates the 3D flight path of a rotating spherical object as it flies 
through the air. Several external forces are considered in the simulation to create a more accurate model. Forces, accelerations, velocities, and positions are calculated as 3D vectors.  
>>>>>>> 0e9b7ad3abac283951a8d98a2bd0f07d3fc74188


#### Code Structure
The simulation code is written in Javascript and is meant to be run on a local server. The web server
is very rudimentary with minimal CSS. It runs the simulation immediately on page load and the 
numeric results are displayed on the page. A download button allows the user to download a CSV file
with the 10 dimensions of the data: `[t x y z vx vy vz fx fy fz]`.
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

###### Wind
The effects of wind are taken into consideration only terms of an additional force. Relative wind is not considered in the calculation of the Magnus Effect. 

###### Completion
The simulation completes when the projectile hits the ground (`y` coordinate of position vector
is less than zero). This does not take into account the radius of the projectile because it is 
insignificant for 6mm projectiles. The `solve` function generally takes between 1 and 3 milliseconds 
to complete. 


#### Example Graphics
###### Varying Mass, Constant V0
Below is an example graphic of the simulated flight paths of spheres of differing mass fired at constant velocity. 

![Imgur](https://i.imgur.com/b7NUqEH.jpg)


###### Varying Mass, Constant Wind
Below is an example of the simulated flight paths of spheres with varying wind vectors. Projectiles were launched from 1 meter, had varying masses, and an indentical initial velocity. The velocity of the wind was `[0 0 -5]` in meters per second. Note the lighter mass deviates farther from the centerline since acceleration is inversely proportional to mass. 

![Imgur](https://i.imgur.com/yh0Mn3y.jpg)
