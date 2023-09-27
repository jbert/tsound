DONE - move line + rect drawing over to 0,0 -> 1, 1 coords
    - bottom left origin

- add method to grab new drawcontext as sub-region of parent (but with its own 0,0->1,1 coords))

- have Graph take a drawcontext, which it draws over all of
    - the xlo/xhi are then scaling from (x,y) space to (0,0)->(1,1) space