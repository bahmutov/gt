var objects = [];

function Person(name, age, child) {
	this.name = name;
	this.age = age;
	this.child = child;
	this.isChild = function() {
		return !!this.child;
	};
}

Person.prototype.isOlderThan4 = function() {
	return this.age > 4;
};

objects.push(new Person('a', 4, true));
objects.push(new Person('b', 5, true));
objects.push(new Person('c', 10));

module.exports.objects = objects;