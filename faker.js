const faker = require('faker/locale/vi');
const fs = require('fs');
// faker.locale = "vi";
const RandExp = require('randexp');
// console.log(faker.regexify("([A-Z]){4}([A-Z]){2}([0-9A-Z]){2}([0-9A-Z]{3})?"));
// supports grouping and piping
// console.log(new RandExp(/random stuff: .+/).gen());
var item = '';
for (var i = 0; i < 10; i++) {
	var phone = faker.phone.phoneNumber('033#######');
	var name = faker.name.lastName() + ' ' + faker.name.firstName();
	item += `{
                  id:${i},
                  phone : '${phone}',
                  name : '${name}',
            },`;
}

fs.writeFile('testFS.js', 'var ar =[' + item + ']', () => {});
