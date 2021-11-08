# @dab-co/jam-sqlite

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

- Once you are done with changes you need to use ```npm publish``` in order to be able to install it
  via ```npm install```. This will upload the package to the github registry. If this doesn't work, try
  running ```npm login --scope=@github_username --registry=https://npm.pkg.github.com``` first.
  
## Project Structure
- Every table in the database will have corresponding utility file. They will make use of the databaseWrapper class
by aggregating it. By aggregation, we make sure every utility file makes use of the intended database connection.
  
- Preferably DatabaseWrapper class will be instantiated in a header file to make sure that only one connection is opened,
and whenever desired utility file is needed it will be fed into the corresponding class.
  
## Example usage on production:
  
```javascript
// initializeDatabase.js
const DatabaseWrapper = require("@dab-co/jam-sqlite").DatabaseWrapper;
const databaseWrapper = new DatabaseWrapper("database.db");
module.exports = databaseWrapper;
```
  
```javascript
// some file that uses any one of the utils
const databaseWrapper = require("./initializeDatabase.js");
const AccountUtils = require("@dab-co/jam-sqlite").TableUtils.AccountUtils;
const accountUtils = new AccountUtils(databaseWrapper);
// note here databaseWrapper is an instance not a class, hence the connection has already been established
// do stuff ...
```
