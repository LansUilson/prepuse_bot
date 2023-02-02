function format(str, args) {
	for(var key in args) {
		str = str.replace(`%(${key})`, args[key]);
	};
	return str;
};

function hashCode(string) {
	return Array.from(string)
	 .reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0);
};

module.exports = {
	format,
	hashCode
};