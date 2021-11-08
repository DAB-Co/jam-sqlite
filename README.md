# @DAB-CO/jam-sqlite

## Installing this module

### Method 1

- Use ```npm --registry=https://npm.pkg.github.com adduser```. After this run ```npm install``` like you normally would.
  If this doesn't work, try the methods below.

### Method 2

- Login via ```npm login --scope=@github_username --registry=https://npm.pkg.github.com```
- And do ```npm install --registry https://npm.pkg.github.com @dab-co/jam-sqlite```
- To permanently add the registry, do ``` npm config set @dab-co:registry https://npm.pkg.github.com```.

## Updating and publishing the package

- Update the version from package.json and run ```npm install``` to update package-lock.json. Follow
  the [semantic versioning guidelines](https://semver.org/).
    - As the website explains it:
      > ### Summary 
      > Given a version number MAJOR.MINOR.PATCH, increment the:
      > - MAJOR version when you make incompatible API changes,
      > - MINOR version when you add functionality in a backwards compatible manner, and
      > - PATCH version when you make backwards compatible bug fixes.
      > 
      > Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR.PATCH format.
      

- Once you are done with changes you need to use ```npm publish``` in order to be able to install it
  via ```npm install```. This will upload the package to the github registry. If this doesn't work, try
  running ```npm login --scope=@github_username --registry=https://npm.pkg.github.com``` first.
