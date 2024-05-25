{ pkgs ? import <nixpkgs> {}}:

pkgs.mkShell {
  packages = [ pkgs.typescript pkgs.nodePackages.ts-node ];
}
