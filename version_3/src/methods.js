function format(str, args=0) {
	if(args != 0) {
		for(var key in args) {
			str = str.replace(`%(${key})`, args[key]);
		};
		return str;
	} else {
		if(str == "ege") { 
			return "ЕГЭ";
		} else { 
			return "ОГЭ";
		};
	}
};

function hashCode(string) {
	return Array.from(string)
	 .reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0);
};

module.exports = {
	format,
	hashCode
};