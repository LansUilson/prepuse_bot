
function hashCode(string) {
	return Array.from(string)
	 .reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0);
};

module.exports = {
	hashCode: hashCode
};